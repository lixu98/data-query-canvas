/* eslint-disable max-len */
import { Component, DebugElement, Input } from '@angular/core';
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
// import { GroupService } from '../service/group.service';
import { GroupRoutingModule } from '../group-routing.module';
import { DwTabRoutingService } from '@webdpt/framework/routing-tabset';
import { GroupViewComponent } from './group-view.component';
// import { DwDivMaskModule } from '@webdpt/components/load-mask';
import { ReactiveFormsModule } from '@angular/forms';
import { StatusModel } from '../model';
import { NzMessageService } from 'ng-zorro-antd/message';
import zh from '@angular/common/locales/zh';
import { registerLocaleData } from '@angular/common';
registerLocaleData(zh);
describe('GroupViewComponent', () => {
  let component: GroupViewComponent;
  let fixture: ComponentFixture<GroupViewComponent>;
  let de: DebugElement;
  let router: Router;
  // let groupService: GroupService;
  let httpMocker: HttpTestingController;
  let commonGetGroupViewReq: () => void;
  let commonSaveGroupViewReq: () => void;
  let commonDeleteMasterReq: () => void;
  let spyNavigateToOpenerOrCreate: jasmine.Spy;
  let spyNavigateOrCreate: jasmine.Spy;
  let tabRoutingService: DwTabRoutingService;
  let dwMessage: NzMessageService;
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
          navigateOrCreate: (commands: any[], extras?: NavigationExtras, tabId?: string, title?: string) => {},
          navigateToOpenerOrCreate: (commands: any[], extras?: NavigationExtras, tabId?: string, title?: string) => {}
        }
      }
    ],
    declarations: [
      GroupViewComponent,
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
      fixture = TestBed.createComponent(GroupViewComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      router = fixture.debugElement.injector.get(Router);
      // groupService = fixture.debugElement.injector.get(GroupService);
      tabRoutingService = fixture.debugElement.injector.get(DwTabRoutingService);
      spyNavigateToOpenerOrCreate = spyOn(tabRoutingService, 'navigateToOpenerOrCreate').and.callThrough();
      spyNavigateOrCreate = spyOn(tabRoutingService, 'navigateOrCreate').and.callThrough();
      httpMocker = TestBed.inject(HttpTestingController);
      dwMessage = TestBed.inject(NzMessageService);
      commonGetGroupViewReq = () => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const getGroupViewReq = httpMocker.expectOne('showcase/demo1/getGroupDetail');
        getGroupViewReq.flush(JSON.parse(JSON.stringify(getGroupViewResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
        fixture.detectChanges();
        tick(1000);
      };
      commonSaveGroupViewReq = () => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const saveGroupViewReq = httpMocker.expectOne('showcase/demo1/modifyGroup');
        saveGroupViewReq.flush({
          status: true,
          description: '編輯成功'
        });
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
      };
      commonDeleteMasterReq = () => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const deleteReq = httpMocker.expectOne('showcase/demo1/deleteGroupList');
        deleteReq.flush({
          status: true,
          description: '刪除成功'
        });
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
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
    describe('ngOnInit', () => {
      it('讀取資料成功, master, detail屬性需有值', fakeAsync(() => {
        commonGetGroupViewReq();
        expect(component.master.groupId).toEqual('No_000001');
        expect(component.detail.length).toBeGreaterThan(0);
      }));
      // it('讀取資料失敗, 需彈窗顯示"查詢資料錯誤",且返回上一層', fakeAsync(() => {
      //   const spyError = spyOn(dwMessage, 'error').and.callThrough();
      //   fixture.detectChanges(); // 觸發ngOnInit
      //   tick(1000);
      //   const getGroupViewReq = httpMocker.expectOne('showcase/demo1/getGroupDetail');
      //   getGroupViewReq.flush({ message: 'bad request' }, { status: 400, statusText: 'Bad Request' });
      //   fixture.detectChanges();
      //   tick(1000);
      //   fixture.detectChanges();
      //   tick(1000);
      //   fixture.detectChanges();
      //   tick(1000);
      //   expect(spyError.calls.mostRecent().args[0]).toEqual('查詢資料錯誤');
      // }));
    });
    it('編輯單頭(masterModify), isView需為false', fakeAsync(() => {
      commonGetGroupViewReq();
      const modifyTag = de.query(By.css('.master-title a')).nativeElement;
      modifyTag.click();
      fixture.detectChanges();
      tick(1000);
      expect(component.isView).toBeFalse();
    }));
    it('編輯單頭(masterModify), 按下取消,isView需為true', fakeAsync(() => {
      commonGetGroupViewReq();
      const modifyTag = de.query(By.css('.master-title a')).nativeElement;
      modifyTag.click();
      fixture.detectChanges();
      tick(1000);
      const cancelBT = de.queryAll(By.css('form button'))[0].nativeElement;
      cancelBT.click();
      expect(component.isView).toBeTrue();
    }));
    it('編輯單頭(masterModify),按下保存(save)後, isView需為true', fakeAsync(() => {
      commonGetGroupViewReq();
      const modifyTag = de.query(By.css('.master-title a')).nativeElement;
      modifyTag.click();
      fixture.detectChanges();
      tick(1000);
      expect(component.isView).toBeFalse();
      const saveBT = de.queryAll(By.css('form button'))[1].nativeElement;
      saveBT.click();
      commonSaveGroupViewReq(); // 儲存
      expect(component.isView).toBeTrue();
    }));
    it('編輯單頭(masterModify),按下保存(save)後, status為true, 但!description, 需不顯示成功訊息', fakeAsync(() => {
      const spySuccess = spyOn(dwMessage, 'success').and.callThrough();
      commonGetGroupViewReq();
      const modifyTag = de.query(By.css('.master-title a')).nativeElement;
      modifyTag.click();
      fixture.detectChanges();
      tick(1000);
      expect(component.isView).toBeFalse();
      const saveBT = de.queryAll(By.css('form button'))[1].nativeElement;
      saveBT.click();
      const saveGroupViewReq = httpMocker.expectOne('showcase/demo1/modifyGroup');
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
      expect(component.isView).toBeFalse();
      expect(spySuccess).not.toHaveBeenCalled();
    }));
    it('編輯單頭(masterModify),按下保存(save)後, 失敗需顯示錯誤訊息', fakeAsync(() => {
      const spyError = spyOn(dwMessage, 'error').and.callThrough();
      commonGetGroupViewReq();
      const modifyTag = de.query(By.css('.master-title a')).nativeElement;
      modifyTag.click();
      fixture.detectChanges();
      tick(1000);
      expect(component.isView).toBeFalse();
      const saveBT = de.queryAll(By.css('form button'))[1].nativeElement;
      saveBT.click();
      const saveGroupViewReq = httpMocker.expectOne('showcase/demo1/modifyGroup');
      saveGroupViewReq.flush({
        status: false,
        description: '編輯失敗'
      });
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      expect(component.isView).toBeFalse();
      expect(spyError).toHaveBeenCalled();
    }));
    it('編輯單頭(masterModify),按下保存(save)後, 失敗, 但!description, 需不顯示錯誤訊息', fakeAsync(() => {
      const spyError = spyOn(dwMessage, 'error').and.callThrough();
      commonGetGroupViewReq();
      const modifyTag = de.query(By.css('.master-title a')).nativeElement;
      modifyTag.click();
      fixture.detectChanges();
      tick(1000);
      expect(component.isView).toBeFalse();
      const saveBT = de.queryAll(By.css('form button'))[1].nativeElement;
      saveBT.click();
      const saveGroupViewReq = httpMocker.expectOne('showcase/demo1/modifyGroup');
      saveGroupViewReq.flush({
        status: false,
        description: ''
      });
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      expect(component.isView).toBeFalse();
      expect(spyError).not.toHaveBeenCalled();
    }));
    describe('刪除單身detailDelete', () => {
      it('需彈窗確認', fakeAsync(() => {
        commonGetGroupViewReq();
        const delTag = de.query(By.css('nz-table tr:nth-child(1) td:last-child a:last-child')).nativeElement;
        delTag.click();
        fixture.detectChanges();
        tick(1000);
        expect(document.querySelectorAll('.cdk-overlay-container')).toBeTruthy();
      }));
      it('需彈窗確認, 按下確認, 需刪除單身', fakeAsync(() => {
        commonGetGroupViewReq();
        expect(component.detail.length).toEqual(2);
        const delTag = de.query(By.css('nz-table tr:nth-child(1) td:last-child a:last-child')).nativeElement;
        delTag.click();
        fixture.detectChanges();
        tick(1000);
        const confirmBT = document.querySelector('.cdk-overlay-container button:nth-child(2)');
        (confirmBT as HTMLButtonElement) .click();
        commonSaveGroupViewReq();
        expect(component.detail.length).toEqual(1);
      }));

    });
    describe('修改單身(detailModify)', () => {
      it('按下修改, 需彈窗', fakeAsync(() => {
        commonGetGroupViewReq();
        const editTag = de.query(By.css('nz-table tr:nth-child(1) td:last-child a:nth-child(1)')).nativeElement;
        editTag.click();
        fixture.detectChanges();
        tick(1000);
        expect(document.querySelectorAll('.cdk-overlay-container input').length).toEqual(6);
      }));
      it('按下確認, 需儲存', fakeAsync(() => {
        commonGetGroupViewReq();
        const editTag = de.query(By.css('nz-table tr:nth-child(1) td:last-child a:nth-child(1)')).nativeElement;
        editTag.click();
        fixture.detectChanges();
        tick(1000);
        const confirmBT = document.querySelector('.cdk-overlay-container .customize-footer button:nth-child(1)');
        (confirmBT as HTMLButtonElement) .click();
        commonSaveGroupViewReq();
      }));
      it('按下取消, 需不儲存', fakeAsync(() => {
        commonGetGroupViewReq();
        const editTag = de.query(By.css('nz-table tr:nth-child(1) td:last-child a:nth-child(1)')).nativeElement;
        editTag.click();
        fixture.detectChanges();
        tick(1000);
        const confirmBT = document.querySelector('.cdk-overlay-container .customize-footer button:nth-child(2)');
        (confirmBT as HTMLButtonElement) .click();
        fixture.detectChanges();
        tick(1000);
      }));
    });

    describe('新增單身(detailAdd)', () => {
      it('按下新增, 需彈窗', fakeAsync(() => {
        commonGetGroupViewReq();
        const addBT = de.queryAll(By.css('i[nztype="plus"]'))[0].nativeElement;
        addBT.click();
        fixture.detectChanges();
        tick(1000);
        expect(document.querySelectorAll('.cdk-overlay-container input').length).toEqual(6);
      }));
      it('彈窗新增,按下取消, 需不新增單身資料', fakeAsync(() => {
        commonGetGroupViewReq();
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
        expect(component.detail.length).toEqual(2);
      }));
      it('彈窗新增完畢,按下確定, 需新增單身資料', fakeAsync(() => {
        commonGetGroupViewReq();
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
        commonSaveGroupViewReq();
        expect(component.detail.length).toEqual(3);
      }));
    });
    describe('刪除整筆(deleteMaster)', () => {
      it('刪除成功, 需返回上一層路由', fakeAsync(() => {
        commonGetGroupViewReq();
        const delTag = de.query(By.css('i[nztype="delete"]:nth-child(1)')).nativeElement;
        delTag.click();
        fixture.detectChanges();
        tick(1000);
        commonDeleteMasterReq();
        expect(spyNavigateOrCreate).toHaveBeenCalled();
      }));
      it('刪除成功,沒有訊息描述, 需success訊息', fakeAsync(() => {
        const spySuccess = spyOn(dwMessage, 'success').and.callThrough();
        commonGetGroupViewReq();
        const delTag = de.query(By.css('i[nztype="delete"]:nth-child(1)')).nativeElement;
        delTag.click();
        fixture.detectChanges();
        tick(1000);
        const deleteReq = httpMocker.expectOne('showcase/demo1/deleteGroupList');
        deleteReq.flush({
          status: true,
          description: null
        });
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(spySuccess).not.toHaveBeenCalled();
      }));
      it('刪除失敗,需顯示錯誤訊息', fakeAsync(() => {
        const spyError = spyOn(dwMessage, 'error').and.callThrough();
        commonGetGroupViewReq();
        const delTag = de.query(By.css('i[nztype="delete"]:nth-child(1)')).nativeElement;
        delTag.click();
        fixture.detectChanges();
        tick(1000);
        const deleteReq = httpMocker.expectOne('showcase/demo1/deleteGroupList');
        deleteReq.flush({
          status: false,
          description: '刪除失敗'
        });
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(spyError).toHaveBeenCalled();
      }));
      it('刪除失敗,沒有描述,需不顯示錯誤訊息', fakeAsync(() => {
        const spyError = spyOn(dwMessage, 'error').and.callThrough();
        commonGetGroupViewReq();
        const delTag = de.query(By.css('i[nztype="delete"]:nth-child(1)')).nativeElement;
        delTag.click();
        fixture.detectChanges();
        tick(1000);
        const deleteReq = httpMocker.expectOne('showcase/demo1/deleteGroupList');
        deleteReq.flush({
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
    it('回列表goList, 需返回上一層路由', fakeAsync(() => {
      commonGetGroupViewReq();
      const backTag = de.query(By.css('i[nztype="arrow-left"]:nth-child(1)')).nativeElement;
      backTag.click();
      fixture.detectChanges();
      tick(1000);
      expect(spyNavigateToOpenerOrCreate).toHaveBeenCalled();
    }));
    it('StatusModel', ()=>{
      const statusModel =  new StatusModel();
      expect(statusModel.value).toEqual('Y');
      expect(statusModel.label).toEqual('有效');
    });
  });

});
export const getGroupViewResponse = {
  'master': {
    'groupId': 'No_000001',
    'groupName': '欣欣',
    'currencyId': 'CNY',
    'currencyName': '人民幣',
    'sourceId': '123',
    'exchangeWay': 'auto',
    'exchangeSource': '1',
    'exchangeClass': '1',
    'status': 'Y',
    'groupDate': '2017/12/23'
  },
  'detail': [
    {
      'seq': 1,
      'companyId': '1111',
      'companyName': '鼎新電腦',
      'currencyId': 'NTD',
      'currencyName': '新台幣',
      'status': 'N',
      'startDate': '2017/10/31',
      'endDate': '2017/12/31'
    },
    {
      'seq': 2,
      'companyId': '2222',
      'companyName': '鼎新電腦2',
      'currencyId': 'NTD',
      'currencyName': '新台幣',
      'status': 'Y',
      'startDate': '2016/10/31',
      'endDate': '2016/12/31'
    }
  ]
};

