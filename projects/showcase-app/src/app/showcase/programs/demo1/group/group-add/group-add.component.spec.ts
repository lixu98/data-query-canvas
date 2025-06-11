/* eslint-disable max-len */
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { NzIconTestModule } from 'ng-zorro-antd/icon/testing';
import { DwActionModule } from '@webdpt/components/action';
import { DwActionTestingModule, MockDwActionAuthorizedDirective } from '@webdpt/components/action/testing';
import { DwCommonRouterTestingModule } from '@webdpt/framework/sharedTest/common-router-test';
import { APP_DATE_FORMAT, APP_TIME_FORMAT, DW_USING_TAB } from '@webdpt/framework/config';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Demo1RepositoryModule } from '../../repository';
import { By } from '@angular/platform-browser';
import { GroupModule } from '../group.module';
import { GroupService } from '../service/group.service';
import { GroupRoutingModule } from '../group-routing.module';
import { DwTabRoutingService } from '@webdpt/framework/routing-tabset';
// import { DwDivMaskModule } from '@webdpt/components/load-mask';
import { ReactiveFormsModule } from '@angular/forms';
import { GroupAddComponent } from './group-add.component';
import zh from '@angular/common/locales/zh';
import { registerLocaleData } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
registerLocaleData(zh);
describe('GroupAddComponent', () => {
  let component: GroupAddComponent;
  let fixture: ComponentFixture<GroupAddComponent>;
  let de: DebugElement;
  let router: Router;
  let spyNavigate: jasmine.Spy;
  let groupService: GroupService;
  let httpMocker: HttpTestingController;
  let commonSaveGroupViewReq: () => void;
  let spyClose: jasmine.Spy;
  let tabRoutingService: DwTabRoutingService;
  let dwMessage: NzMessageService;
  let spyAddGroup: jasmine.Spy;
  let spyNavigateToOpenerOrCreate: jasmine.Spy;

  let setDefaultData: () => void;
  const commonConfig = {
    imports: [
      HttpClientTestingModule,
      GroupModule,
      Demo1RepositoryModule,
      NoopAnimationsModule,
      NzIconTestModule,
      DwCommonRouterTestingModule,  // 所有路由都導到這裏設定
      DwActionTestingModule,
      TranslateTestingModule,
      ReactiveFormsModule,
    ],
    providers: [
      { provide: DW_USING_TAB, useValue: true },
      { provide: APP_DATE_FORMAT, useValue: 'yyyy/MM/dd' },
      { provide: APP_TIME_FORMAT, useValue: 'hh:mm:ss' },
      {
        provide: DwTabRoutingService, useValue: {
          close: () => { },
          navigateOrCreate: (commands: any[], extras?: NavigationExtras, tabId?: string, title?: string) => { },
          navigateToOpenerOrCreate: (commands: any[], extras?: NavigationExtras, tabId?: string, title?: string) => { }
        }
      }
    ],
    declarations: [
      GroupAddComponent,
    ]
  };

  describe('共用條件測試', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule(commonConfig)
        .overrideModule(GroupRoutingModule, { // 單元測試,只專注於當前component,故將原路由設置清空, 改用RouterTestingModule.withRoutes(routes)的配置
          set: {
            imports: [],
            exports: []
          }
        })
        // .overrideModule(DwDivMaskModule, {
        //   set: {
        //     imports: [],
        //     declarations: [MockDwDivMaskComponent],
        //     exports: [MockDwDivMaskComponent]
        //   }
        // })
        .overrideModule(DwActionModule, {
          set: {
            imports: [],
            declarations: [MockDwActionAuthorizedDirective],
            exports: [MockDwActionAuthorizedDirective]
          }
        })
        // .overrideProvider(GroupService, {
        //   useValue: {
        //   }
        // })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(GroupAddComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      router = fixture.debugElement.injector.get(Router);
      spyNavigate = spyOn(router, 'navigate').and.callThrough();
      groupService = fixture.debugElement.injector.get(GroupService);
      spyAddGroup = spyOn(groupService, 'addGroup').and.callThrough();
      tabRoutingService = fixture.debugElement.injector.get(DwTabRoutingService);
      spyNavigateToOpenerOrCreate = spyOn(tabRoutingService, 'navigateToOpenerOrCreate').and.callThrough();
      spyClose = spyOn(tabRoutingService, 'close').and.callThrough();
      httpMocker = TestBed.inject(HttpTestingController);
      dwMessage = TestBed.inject(NzMessageService);

      commonSaveGroupViewReq = () => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const saveGroupViewReq = httpMocker.expectOne('showcase/demo1/addGroup');
        saveGroupViewReq.flush({
          status: true,
          description: '新增成功'
        });
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
      };

      setDefaultData = () => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        component.validateForm.controls['masterGroupId'].setValue('mockId123');
        component.validateForm.controls['masterGroupName'].setValue('mockName123');
        component.validateForm.updateValueAndValidity();
        const defaultDetail = {
          seq: 1,
          companyId: 'mockId1',
          companyName: 'mockName1',
          currencyId: 'CNY',
          currencyName: '',
          startDate: '',
          endDate: '',
          status: '',
        };
        component.addDetail(defaultDetail); // 新增單身明細用
        fixture.detectChanges();
        tick(1000);
      };
      // fixture.detectChanges(); // 觸發ngOnInit
    });
    afterEach(() => {
      // After every test, assert that there are no more pending requests.
      httpMocker.verify();
    });
    it('should create', () => {
      expect(component).toBeTruthy();
    });
    it('明細資料,需透過showLabel, 顯示外顯值', fakeAsync(() => {
      const spyShowLabel = spyOn(component, 'showLabel').and.callThrough();
      setDefaultData();
      expect(spyShowLabel.calls.mostRecent().args).toEqual(['CNY', 'currencyOptions']);
    }));
    describe('按下保存(save),', () => {
      it('groupService.addGroup需被執行', fakeAsync(() => {
        setDefaultData();
        const saveBT = de.query(By.css('.dw-f-bottom-btn-bar button')).nativeElement;
        saveBT.click();
        commonSaveGroupViewReq();
        expect(spyAddGroup).toHaveBeenCalled();
      }));
      it('onBeforeSaveGroup執行時,masterCurrencyId值需轉換currencyName', fakeAsync(() => {
        setDefaultData();
        component.validateForm.get('masterCurrencyId').setValue('CNY');
        component.validateForm.get('masterCurrencyId').updateValueAndValidity();
        const saveBT = de.query(By.css('.dw-f-bottom-btn-bar button')).nativeElement;
        saveBT.click();
        commonSaveGroupViewReq();
        expect(spyAddGroup.calls.mostRecent().args[0].currencyName).toEqual('人民幣');
        expect(spyAddGroup).toHaveBeenCalled();
      }));
      it('保存成功, 沒有訊息描述, 需不執行dwMessage.success', fakeAsync(() => {
        const spyAddToRoute = spyOn(dwMessage, 'success').and.callThrough();
        setDefaultData();
        const saveBT = de.query(By.css('.dw-f-bottom-btn-bar button')).nativeElement;
        saveBT.click();
        const saveGroupViewReq = httpMocker.expectOne('showcase/demo1/addGroup');
        saveGroupViewReq.flush({
          status: true,
          description: null
        });
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(spyAddToRoute).not.toHaveBeenCalled();
      }));
      it('保存失敗, 需顯示錯誤訊息', fakeAsync(() => {
        const spyError = spyOn(dwMessage, 'error').and.callThrough();
        setDefaultData();
        const saveBT = de.query(By.css('.dw-f-bottom-btn-bar button')).nativeElement;
        saveBT.click();
        const saveGroupViewReq = httpMocker.expectOne('showcase/demo1/addGroup');
        saveGroupViewReq.flush({
          status: false,
          description: '新增失敗'
        });
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(spyError).toHaveBeenCalled();
      }));
      it('保存失敗, 沒有錯誤描述(description),需不顯示錯誤訊息', fakeAsync(() => {
        const spyError = spyOn(dwMessage, 'error').and.callThrough();
        setDefaultData();
        const saveBT = de.query(By.css('.dw-f-bottom-btn-bar button')).nativeElement;
        saveBT.click();
        const saveGroupViewReq = httpMocker.expectOne('showcase/demo1/addGroup');
        saveGroupViewReq.flush({
          status: false,
          description: null
        });
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(spyError).not.toHaveBeenCalled();
      }));
    });
    describe('新增單身', () => {
      it('按下新增(detailAdd), 需開窗', fakeAsync(() => {
        setDefaultData();
        const addBT = de.queryAll(By.css('i[nztype="plus"]'))[0].nativeElement;
        addBT.click();
        fixture.detectChanges();
        tick(1000);
        expect(document.querySelectorAll('.cdk-overlay-container input').length).toEqual(6);
      }));
      it('彈窗新增完畢,按下確定, 需新增單身資料', fakeAsync(() => {
        setDefaultData();
        const addBT = de.queryAll(By.css('i[nztype="plus"]'))[0].nativeElement;
        addBT.click(); // 彈窗
        fixture.detectChanges();
        tick(1000);
        document.querySelectorAll('.cdk-overlay-container input').forEach((input: HTMLInputElement, idx) => {
          input.value = (idx + 1).toString();
          input.dispatchEvent(new Event('input'));
          fixture.detectChanges();
          tick(1000);
        });
        // 由於無法操縱到GroupDetailEditComponent的formcontrol, 所以沒加入值
        fixture.detectChanges();
        tick(1000);
        const confirmBT = document.querySelectorAll('.cdk-overlay-container .customize-footer button')[0] as HTMLButtonElement;
        confirmBT.click();
        fixture.detectChanges();
        tick(1000);
        // commonSaveGroupViewReq();
        expect(component.detail.length).toEqual(2);
      }));
      it('彈窗新增,按下取消, 需不新增單身資料', fakeAsync(() => {
        setDefaultData();
        const addBT = de.queryAll(By.css('i[nztype="plus"]'))[0].nativeElement;
        addBT.click(); // 彈窗
        fixture.detectChanges();
        tick(1000);
        document.querySelectorAll('.cdk-overlay-container input').forEach((input: HTMLInputElement, idx) => {
          input.value = (idx + 1).toString();
          input.dispatchEvent(new Event('input'));
          fixture.detectChanges();
          tick(1000);
        });
        // 由於無法操縱到GroupDetailEditComponent的formcontrol, 所以沒加入值
        fixture.detectChanges();
        tick(1000);
        const cancelBT = document.querySelectorAll('.cdk-overlay-container .customize-footer button')[1] as HTMLButtonElement;
        cancelBT.click();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(component.detail.length).toEqual(1);
      }));
    });
    describe('刪除單身detailDelete', () => {
      it('需彈窗確認', fakeAsync(() => {
        setDefaultData();
        const delTag = de.query(By.css('nz-table tr:nth-child(1) td:last-child a:last-child')).nativeElement;
        delTag.click();
        fixture.detectChanges();
        tick(1000);
        expect(document.querySelectorAll('.cdk-overlay-container')).toBeTruthy();
      }));
      it('需彈窗確認, 按下確認, 需刪除單身及相關單身明細', fakeAsync(() => {
        setDefaultData();
        fixture.detectChanges();
        tick(1000);
        expect(component.detail.length).toEqual(1);
        const delTag = de.query(By.css('nz-table tr:nth-child(1) td:last-child a:last-child')).nativeElement;
        delTag.click();
        fixture.detectChanges();
        tick(1000);
        const confirmBT = document.querySelector('.cdk-overlay-container button:nth-child(2)');
        (confirmBT as HTMLButtonElement).click();
        expect(component.detail.length).toEqual(0);
      }));
    });
    describe('修改單身(detailModify)', () => {
      it('按下修改, 需彈窗', fakeAsync(() => {
        setDefaultData();
        const editTag = de.query(By.css('nz-table tr:nth-child(1) td:last-child a:nth-child(1)')).nativeElement;
        editTag.click();
        fixture.detectChanges();
        tick(1000);
        expect(document.querySelectorAll('.cdk-overlay-container input').length).toEqual(6);
      }));
      it('按下確認, 需修改單身', fakeAsync(() => {
        setDefaultData();
        const editTag = de.query(By.css('nz-table tr:nth-child(1) td:last-child a:nth-child(1)')).nativeElement;
        editTag.click();
        fixture.detectChanges();
        tick(1000);
        const confirmBT = document.querySelector('.cdk-overlay-container .customize-footer button:nth-child(1)');
        (confirmBT as HTMLButtonElement).click();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
      }));
      it('按下取消, 需不修改', fakeAsync(() => {
        setDefaultData();
        const editTag = de.query(By.css('nz-table tr:nth-child(1) td:last-child a:nth-child(1)')).nativeElement;
        editTag.click();
        fixture.detectChanges();
        tick(1000);
        const confirmBT = document.querySelector('.cdk-overlay-container .customize-footer button:nth-child(2)');
        (confirmBT as HTMLButtonElement).click();
        fixture.detectChanges();
        tick(1000);
      }));
    });



    it('回列表goList, 需關閉當下頁籤', fakeAsync(() => {
      setDefaultData();
      const backTag = de.query(By.css('button:nth-child(2)')).nativeElement;
      backTag.click();
      fixture.detectChanges();
      tick(1000);
      expect(spyNavigateToOpenerOrCreate).toHaveBeenCalled();
    }));
    it('masterSourceId值改變, master.sourceId', fakeAsync(() => {
      setDefaultData();
      component.validateForm.get('masterSourceId').setValue('mockSourceId123');
      component.validateForm.get('masterSourceId').updateValueAndValidity();
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);

      expect(component.master.sourceId).toEqual('mockSourceId123');
    }));
    it('currencyId值改變, master.currencyId值需改變', fakeAsync(() => {
      setDefaultData();
      const selectTag = de.queryAll(By.css('nz-select'))[0].nativeElement;
      selectTag.click();
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      const selectItem = document.querySelector('nz-option-item:nth-child(2)');
      (selectItem as HTMLElement).click();
      fixture.detectChanges();
      tick(1000);
      expect(component.master.currencyId).toEqual('NTD');
    }));
    it('exchangeWay值改變, master.exchangeWay值需改變', fakeAsync(() => {
      setDefaultData();
      const selectTag = de.queryAll(By.css('nz-select'))[1].nativeElement;
      selectTag.click();
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      const selectItem = document.querySelector('nz-option-item:nth-child(2)');
      (selectItem as HTMLElement).click();
      fixture.detectChanges();
      tick(1000);
      expect(component.master.exchangeWay).toEqual('custom');
    }));
    it('exchangeClass值改變, master.exchangeClass值需改變', fakeAsync(() => {
      setDefaultData();
      const selectTag = de.queryAll(By.css('nz-select'))[2].nativeElement;
      selectTag.click();
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      const selectItem = document.querySelector('nz-option-item:nth-child(2)');
      (selectItem as HTMLElement).click();
      fixture.detectChanges();
      tick(1000);
      expect(component.master.exchangeClass).toEqual('2');
    }));
    it('exchangeSource值改變, master.exchangeSource值需改變', fakeAsync(() => {
      setDefaultData();
      const selectTag = de.queryAll(By.css('nz-select'))[3].nativeElement;
      selectTag.click();
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      const selectItem = document.querySelector('nz-option-item:nth-child(2)');
      (selectItem as HTMLElement).click();
      fixture.detectChanges();
      tick(1000);
      expect(component.master.exchangeSource).toEqual('2');
    }));
    it('status值改變, master.status值需改變', fakeAsync(() => {
      setDefaultData();
      const selectTag = de.queryAll(By.css('nz-select'))[4].nativeElement;
      selectTag.click();
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      const selectItem = document.querySelector('nz-option-item:nth-child(2)');
      (selectItem as HTMLElement).click();
      fixture.detectChanges();
      tick(1000);
      expect(component.master.status).toEqual('N');
    }));
  });

});


