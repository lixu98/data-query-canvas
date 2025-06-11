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
import { AsisModule } from '../asis.module';
import { AsisService } from '../service/asis.service';
import { AsisRoutingModule } from '../asis-routing.module';
import { DwTabRoutingService } from '@webdpt/framework/routing-tabset';
// import { DwDivMaskModule } from '@webdpt/components/load-mask';
import { DwRoutingMessageService } from '@webdpt/components/routing-message';
import { ReactiveFormsModule } from '@angular/forms';
import { AsisAddComponent } from './asis-add.component';
import { DetailsChildInfoModel } from '../model';

describe('AsisAddComponent', () => {
  let component: AsisAddComponent;
  let fixture: ComponentFixture<AsisAddComponent>;
  let de: DebugElement;
  let router: Router;
  let spyNavigate: jasmine.Spy;
  let asisService: AsisService;
  let httpMocker: HttpTestingController;
  let commonSaveAsisViewReq: () => void;
  let spyClose: jasmine.Spy;
  let tabRoutingService: DwTabRoutingService;
  let dwMessage: DwRoutingMessageService;
  let spyAddAsis: jasmine.Spy;
  let setDefaultData: () => void;
  const commonConfig = {
    imports: [
      HttpClientTestingModule,
      AsisModule,
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
      AsisAddComponent,
    ]
  };

  describe('共用條件測試', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule(commonConfig)
        .overrideModule(AsisRoutingModule, { // 單元測試,只專注於當前component,故將原路由設置清空, 改用RouterTestingModule.withRoutes(routes)的配置
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
        // .overrideProvider(AsisService, {
        //   useValue: {
        //   }
        // })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(AsisAddComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      router = fixture.debugElement.injector.get(Router);
      spyNavigate = spyOn(router, 'navigate').and.callThrough();
      asisService = fixture.debugElement.injector.get(AsisService);
      spyAddAsis = spyOn(asisService, 'addAsis').and.callThrough();
      tabRoutingService = fixture.debugElement.injector.get(DwTabRoutingService);
      spyClose = spyOn(tabRoutingService, 'close').and.callThrough();
      httpMocker = TestBed.inject(HttpTestingController);
      dwMessage = TestBed.inject(DwRoutingMessageService);

      commonSaveAsisViewReq = () => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const saveAsisViewReq = httpMocker.expectOne('showcase/demo1/addAsis');
        saveAsisViewReq.flush({
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
        component.validateForm.controls['masterAsisId'].setValue('mockId123');
        component.validateForm.controls['masterAsisName'].setValue('mockName123');
        component.validateForm.updateValueAndValidity();
        const defaultDetail = {
          seq: 1,
          itemId: 'mockId1',
          itemName: 'mockName1',
          upperId1: 'mockUpperId1',
          upperName1: 'mockUpperName1',
          upperId2: 'mockUpperId2',
          upperName2: 'mockUpperName2',
          status: '',
          selected: false
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

    describe('按下保存(save),', () => {
      it('asisService.addAsis需被執行', fakeAsync(() => {
        setDefaultData();
        const saveBT = de.query(By.css('.dw-f-bottom-btn-bar button')).nativeElement;
        saveBT.click();
        commonSaveAsisViewReq();
        expect(spyAddAsis).toHaveBeenCalled();
      }));
      it('保存成功, 沒有訊息描述, 需不執行dwMessage.addToRoute', fakeAsync(() => {
        const spyAddToRoute = spyOn(dwMessage, 'addToRoute').and.callThrough();
        setDefaultData();
        const saveBT = de.query(By.css('.dw-f-bottom-btn-bar button')).nativeElement;
        saveBT.click();
        const saveAsisViewReq = httpMocker.expectOne('showcase/demo1/addAsis');
        saveAsisViewReq.flush({
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
        const saveAsisViewReq = httpMocker.expectOne('showcase/demo1/addAsis');
        saveAsisViewReq.flush({
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
        const saveAsisViewReq = httpMocker.expectOne('showcase/demo1/addAsis');
        saveAsisViewReq.flush({
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
        // 由於無法操縱到AsisDetailEditComponent的formcontrol, 所以沒加入值
        fixture.detectChanges();
        tick(1000);
        const confirmBT = document.querySelectorAll('.cdk-overlay-container .customize-footer button')[0] as HTMLButtonElement;
        confirmBT.click();
        fixture.detectChanges();
        tick(1000);
        // commonSaveAsisViewReq();
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
        // 由於無法操縱到AsisDetailEditComponent的formcontrol, 所以沒加入值
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
        const delTag = de.query(By.css('nz-table:nth-child(1) i[nztype="delete"]')).nativeElement;
        delTag.click();
        fixture.detectChanges();
        tick(1000);
        expect(document.querySelectorAll('.cdk-overlay-container')).toBeTruthy();
      }));
      it('需彈窗確認, 按下確認, 需刪除單身及相關單身明細', fakeAsync(() => {
        setDefaultData();
        component.addChild({
          seq: 1,
          biId: 'mockbiId',
          biName: 'mockbiName',
          status: 'Y',
        });
        fixture.detectChanges();
        tick(1000);
        expect(component.detail.length).toEqual(1);
        expect(component.detailChildList.length).toEqual(1);
        const delTag = de.query(By.css('nz-table:nth-child(1) i[nztype="delete"]')).nativeElement;
        delTag.click();
        fixture.detectChanges();
        tick(1000);
        const confirmBT = document.querySelector('.cdk-overlay-container button:nth-child(2)');
        (confirmBT as HTMLButtonElement).click();
        expect(component.detail.length).toEqual(0);
        expect(component.detailChildList.length).toEqual(0);
      }));
      it('detailChildren沒有對應單身的資料, 需不刪除,', fakeAsync(() => {
        setDefaultData();
        expect(component.detailChildren.length).toEqual(0);
        const delTag = de.query(By.css('nz-table:nth-child(1) i[nztype="delete"]')).nativeElement;
        delTag.click();
        fixture.detectChanges();
        tick(1000);
        const confirmBT = document.querySelector('.cdk-overlay-container button:nth-child(2)');
        (confirmBT as HTMLButtonElement).click();
        expect(component.detailChildren.length).toEqual(0);
      }));
    });
    describe('修改單身(detailModify)', () => {
      it('按下修改, 需彈窗', fakeAsync(() => {
        setDefaultData();
        const editTag = de.query(By.css('nz-table:nth-child(1) i[nztype="edit"]')).nativeElement;
        editTag.click();
        fixture.detectChanges();
        tick(1000);
        expect(document.querySelectorAll('.cdk-overlay-container input').length).toEqual(6);
      }));
      it('按下確認, 需修改單身', fakeAsync(() => {
        setDefaultData();
        const editTag = de.query(By.css('nz-table:nth-child(1) i[nztype="edit"]')).nativeElement;
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
        const editTag = de.query(By.css('nz-table:nth-child(1) i[nztype="edit"]')).nativeElement;
        editTag.click();
        fixture.detectChanges();
        tick(1000);
        const confirmBT = document.querySelector('.cdk-overlay-container .customize-footer button:nth-child(2)');
        (confirmBT as HTMLButtonElement).click();
        fixture.detectChanges();
        tick(1000);
      }));
    });
    describe('新增單身明細(detailChildAdd)', () => {
      it('按下新增, 需彈窗', fakeAsync(() => {
        setDefaultData();
        const addBT = de.queryAll(By.css('i[nztype="plus"]'))[1].nativeElement;
        addBT.click();
        fixture.detectChanges();
        tick(1000);
        expect(document.querySelectorAll('.cdk-overlay-container input').length).toEqual(4);
      }));
      it('彈窗新增,按下取消, 需不新增單身明細資料', fakeAsync(() => {
        setDefaultData();
        const addBT = de.queryAll(By.css('i[nztype="plus"]'))[1].nativeElement;
        addBT.click(); // 彈窗
        fixture.detectChanges();
        tick(1000);
        document.querySelectorAll('.cdk-overlay-container input').forEach((input: HTMLInputElement, idx) => {
          input.value = (idx + 1).toString();
          input.dispatchEvent(new Event('input'));
          fixture.detectChanges();
          tick(1000);
        });
        // 由於無法操縱到AsisDetailEditComponent的formcontrol, 所以沒加入值
        fixture.detectChanges();
        tick(1000);
        const cancelBT = document.querySelectorAll('.cdk-overlay-container .customize-footer button')[1] as HTMLButtonElement;
        cancelBT.click();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(component.detailChildList.length).toEqual(0);
      }));
      it('彈窗新增完畢,按下確定, 需新增單身明細資料', fakeAsync(() => {
        setDefaultData();
        const addBT = de.queryAll(By.css('i[nztype="plus"]'))[1].nativeElement;
        addBT.click(); // 彈窗
        fixture.detectChanges();
        tick(1000);
        document.querySelectorAll('.cdk-overlay-container input').forEach((input: HTMLInputElement, idx) => {
          input.value = (idx + 1).toString();
          input.dispatchEvent(new Event('input'));
          fixture.detectChanges();
          tick(1000);
        });
        // 由於無法操縱到AsisDetailEditComponent的formcontrol, 所以沒加入值
        fixture.detectChanges();
        tick(1000);
        const confirmBT = document.querySelectorAll('.cdk-overlay-container .customize-footer button')[0] as HTMLButtonElement;
        confirmBT.click();
        fixture.detectChanges();
        tick(1000);
        expect(component.detailChildList.length).toEqual(1);
      }));
      it('彈窗新增完畢,按下確定, 如果已有detailChildList資料, 需新增單身明細資料', fakeAsync(() => {
        setDefaultData();
        component.addChild(new DetailsChildInfoModel({
          seq: '1',
          biId: 'mockBiId1',
          biName: 'mockBiName1',
          status: 'Y'
        }));
        fixture.detectChanges();
        tick(1000);
        expect(component.detailChildList.length).toEqual(1);
        const addBT = de.queryAll(By.css('i[nztype="plus"]'))[1].nativeElement;
        addBT.click(); // 彈窗
        fixture.detectChanges();
        tick(1000);
        document.querySelectorAll('.cdk-overlay-container input').forEach((input: HTMLInputElement, idx) => {
          input.value = (idx + 1).toString();
          input.dispatchEvent(new Event('input'));
          fixture.detectChanges();
          tick(1000);
        });
        // 由於無法操縱到AsisDetailEditComponent的formcontrol, 所以沒加入值
        fixture.detectChanges();
        tick(1000);
        const confirmBT = document.querySelectorAll('.cdk-overlay-container .customize-footer button')[0] as HTMLButtonElement;
        confirmBT.click();
        fixture.detectChanges();
        tick(1000);
        expect(component.detailChildList.length).toEqual(2);
      }));
    });
    describe('刪除單身明細detailChildDelete', () => {
      it('需彈窗確認', fakeAsync(() => {
        setDefaultData();
        component.addChild({
          seq: 1,
          biId: 'mockbiId',
          biName: 'mockbiName',
          status: 'Y',
        });
        fixture.detectChanges();
        tick(1000);
        const delTag = de.queryAll(By.css('i[nztype="delete"]'))[1].nativeElement;
        delTag.click();
        fixture.detectChanges();
        tick(1000);
        expect(document.querySelectorAll('.cdk-overlay-container')).toBeTruthy();
      }));
      it('需彈窗確認, 按下確認, 需刪除單身明細', fakeAsync(() => {
        setDefaultData();
        component.addChild({
          seq: 1,
          biId: 'mockbiId',
          biName: 'mockbiName',
          status: 'Y',
        });
        fixture.detectChanges();
        tick(1000);
        expect(component.detailChildList.length).toEqual(1);
        const delTag = de.queryAll(By.css('i[nztype="delete"]'))[1].nativeElement;
        delTag.click();
        fixture.detectChanges();
        tick(1000);
        const confirmBT = document.querySelector('.cdk-overlay-container button:nth-child(2)');
        (confirmBT as HTMLButtonElement).click();
        expect(component.detailChildList.length).toEqual(0);
      }));

    });
    describe('修改單身明細(detailChildModify)', () => {
      it('按下修改, 需彈窗', fakeAsync(() => {
        setDefaultData();
        component.addChild({
          seq: 1,
          biId: 'mockbiId',
          biName: 'mockbiName',
          status: 'Y',
        });
        fixture.detectChanges();
        tick(1000);
        const editTag = de.queryAll(By.css('i[nztype="edit"]'))[1].nativeElement;
        editTag.click();
        fixture.detectChanges();
        tick(1000);
        expect(document.querySelectorAll('.cdk-overlay-container input').length).toEqual(4);
      }));
      it('按下確認, 需修改', fakeAsync(() => {
        setDefaultData();
        component.addChild({
          seq: 1,
          biId: 'mockbiId',
          biName: 'mockbiName',
          status: 'Y',
        });
        fixture.detectChanges();
        tick(1000);
        const editTag = de.queryAll(By.css('i[nztype="edit"]'))[1].nativeElement;
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
        component.addChild({
          seq: 1,
          biId: 'mockbiId',
          biName: 'mockbiName',
          status: 'Y',
        });
        fixture.detectChanges();
        tick(1000);
        const editTag = de.queryAll(By.css('i[nztype="edit"]'))[1].nativeElement;
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
      expect(spyClose).toHaveBeenCalled();
    }));
    it('status值改變, master.status值需改變', fakeAsync(() => {
      setDefaultData();
      const selectTag = de.query(By.css('nz-select')).nativeElement;
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
  describe('個別條件測試', () => {
    describe('非頁籤狀態下', () => {
      beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule(commonConfig)
          .overrideModule(AsisRoutingModule, { // 單元測試,只專注於當前component,故將原路由設置清空, 改用RouterTestingModule.withRoutes(routes)的配置
            set: {
              imports: [],
              exports: []
            }
          })
          .overrideModule(DwActionModule, {
            set: {
              imports: [],
              declarations: [MockDwActionAuthorizedDirective],
              exports: [MockDwActionAuthorizedDirective]
            }
          })
          .overrideProvider(DW_USING_TAB, { // 改為不使用頁籤
            useValue: false
          })
          .compileComponents();
      }));

      beforeEach(() => {
        fixture = TestBed.createComponent(AsisAddComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        router = fixture.debugElement.injector.get(Router);
        spyNavigate = spyOn(router, 'navigate').and.callThrough();
        asisService = fixture.debugElement.injector.get(AsisService);
        tabRoutingService = fixture.debugElement.injector.get(DwTabRoutingService);
        httpMocker = TestBed.inject(HttpTestingController);
        dwMessage = TestBed.inject(DwRoutingMessageService);
        commonSaveAsisViewReq = () => {
          fixture.detectChanges(); // 觸發ngOnInit
          tick(1000);
          const saveAsisViewReq = httpMocker.expectOne('showcase/demo1/addAsis');
          saveAsisViewReq.flush({
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
          component.validateForm.controls['masterAsisId'].setValue('mockId123');
          component.validateForm.controls['masterAsisName'].setValue('mockName123');
          component.validateForm.updateValueAndValidity();
          const defaultDetail = {
            seq: 1,
            itemId: 'mockId1',
            itemName: 'mockName1',
            upperId1: 'mockUpperId1',
            upperName1: 'mockUpperName1',
            upperId2: 'mockUpperId2',
            upperName2: 'mockUpperName2',
            status: '',
            selected: false
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

      it('回列表goList, 需返回上一層路由', fakeAsync(() => {
        setDefaultData();
        const backTag = de.query(By.css('button:nth-child(2)')).nativeElement;
        backTag.click();
        fixture.detectChanges();
        tick(1000);
        expect(spyNavigate).toHaveBeenCalled();
      }));
      it('下保存(save),保存成功需返回上一層路由', fakeAsync(() => {
        setDefaultData();
        const saveBT = de.query(By.css('.dw-f-bottom-btn-bar button')).nativeElement;
        saveBT.click();
        commonSaveAsisViewReq();
        expect(spyNavigate).toHaveBeenCalled();
      }));

    });
  });
});


