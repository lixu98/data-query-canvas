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
import { AsisModule } from '../asis.module';
// import { AsisService } from '../service/asis.service';
import { AsisRoutingModule } from '../asis-routing.module';
import { DwTabRoutingService } from '@webdpt/framework/routing-tabset';
import { AsisViewComponent } from './asis-view.component';
// import { DwDivMaskModule } from '@webdpt/components/load-mask';
import { DwRoutingMessageService } from '@webdpt/components/routing-message';
import { ReactiveFormsModule } from '@angular/forms';
import { DetailsChildInfoModel, StatusModel } from '../model';

describe('AsisViewComponent', () => {
  let component: AsisViewComponent;
  let fixture: ComponentFixture<AsisViewComponent>;
  let de: DebugElement;
  let router: Router;
  let spyNavigate: jasmine.Spy;
  // let asisService: AsisService;
  let httpMocker: HttpTestingController;
  let commonGetAsisViewReq: () => void;
  let commonSaveAsisViewReq: () => void;
  let commonDeleteMasterReq: () => void;
  let spyNavigateToOpenerOrCreate: jasmine.Spy;
  let tabRoutingService: DwTabRoutingService;
  let dwMessage: DwRoutingMessageService;
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
          navigateOrCreate: (commands: any[], extras?: NavigationExtras, tabId?: string, title?: string) => {},
          navigateToOpenerOrCreate: (commands: any[], extras?: NavigationExtras, tabId?: string, title?: string) => {}
        }
      }
    ],
    declarations: [
      AsisViewComponent,
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
      fixture = TestBed.createComponent(AsisViewComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      router = fixture.debugElement.injector.get(Router);
      spyNavigate = spyOn(router, 'navigate').and.callThrough();
      // asisService = fixture.debugElement.injector.get(AsisService);
      tabRoutingService = fixture.debugElement.injector.get(DwTabRoutingService);
      spyNavigateToOpenerOrCreate = spyOn(tabRoutingService, 'navigateToOpenerOrCreate').and.callThrough();
      httpMocker = TestBed.inject(HttpTestingController);
      dwMessage = TestBed.inject(DwRoutingMessageService);
      commonGetAsisViewReq = () => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const getAsisViewReq = httpMocker.expectOne('showcase/demo1/getAsisDetail');
        getAsisViewReq.flush(JSON.parse(JSON.stringify(getAsisViewResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
        fixture.detectChanges();
        tick(1000);
      };
      commonSaveAsisViewReq = () => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const saveAsisViewReq = httpMocker.expectOne('showcase/demo1/modifyAsis');
        saveAsisViewReq.flush({
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
        const deleteReq = httpMocker.expectOne('showcase/demo1/deleteAsisList');
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
      it('讀取資料成功, master, detail, detailChildren 屬性需有值', fakeAsync(() => {
        commonGetAsisViewReq();
        expect(component.master.asisId).toEqual('No_000001');
        expect(component.detail.length).toBeGreaterThan(0);
        expect(component.detailChildren.length).toBeGreaterThan(0);
      }));
      it('讀取資料成功, detail沒有筆數, 需不再筆對detailChildren資料', fakeAsync(() => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const getAsisViewReq = httpMocker.expectOne('showcase/demo1/getAsisDetail');
        getAsisViewReq.flush({
          'master': {
            'asisId': 'No_000001',
            'asisName': '標準資產負債分析',
            'note': '這是備註這是備註這是備註',
            'status': 'Y',
            'asisDate': '2017/12/23'
          },
          'detail': [],
          'detailChildren': []
        }); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
        fixture.detectChanges();
        tick(1000);
        expect(component.master.asisId).toEqual('No_000001');
        expect(component.detail.length).toEqual(0);
        expect(component.detailChildren.length).toEqual(0);
      }));
      it('讀取資料成功, detail沒有筆對到detailChildren資料, detailChildList需為空[]', fakeAsync(() => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const getAsisViewReq = httpMocker.expectOne('showcase/demo1/getAsisDetail');
        getAsisViewReq.flush({
          'master': {
            'asisId': 'No_000001',
            'asisName': '標準資產負債分析',
            'note': '這是備註這是備註這是備註',
            'status': 'Y',
            'asisDate': '2017/12/23'
          },
          'detail': [{
            'seq': 1,
            'itemId': 'A100',
            'itemName': '流動資產-現金及約當現金單身',
            'upperId1': 'AB00',
            'upperName1': '資產',
            'upperId2': 'A000',
            'upperName2': '流動資產',
            'status': 'N'
          }],
          'detailChildren': []
        }); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
        fixture.detectChanges();
        tick(1000);
        expect(component.master.asisId).toEqual('No_000001');
        expect(component.detail.length).toEqual(1);
        expect(component.detailChildList.length).toEqual(0);
      }));
      it('讀取資料失敗, 需彈窗顯示"查詢資料錯誤",且返回上一層', fakeAsync(() => {
        const spyError = spyOn(dwMessage, 'error').and.callThrough();
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const getAsisViewReq = httpMocker.expectOne('showcase/demo1/getAsisDetail');
        getAsisViewReq.flush({ message: 'bad request' }, { status: 400, statusText: 'Bad Request' });
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(spyError.calls.mostRecent().args[0]).toEqual('查詢資料錯誤');
        expect(spyNavigate.calls.mostRecent().args[0]).toEqual(['../']);
      }));
    });
    it('編輯單頭(masterModify), isView需為false', fakeAsync(() => {
      commonGetAsisViewReq();
      const modifyTag = de.query(By.css('.master-title a')).nativeElement;
      modifyTag.click();
      fixture.detectChanges();
      tick(1000);
      expect(component.isView).toBeFalse();
    }));
    it('編輯單頭(masterModify), 按下取消,isView需為true', fakeAsync(() => {
      commonGetAsisViewReq();
      const modifyTag = de.query(By.css('.master-title a')).nativeElement;
      modifyTag.click();
      fixture.detectChanges();
      tick(1000);
      const cancelBT = de.queryAll(By.css('form button'))[0].nativeElement;
      cancelBT.click();
      expect(component.isView).toBeTrue();
    }));
    it('編輯單頭(masterModify),按下保存(save)後, isView需為true', fakeAsync(() => {
      commonGetAsisViewReq();
      const modifyTag = de.query(By.css('.master-title a')).nativeElement;
      modifyTag.click();
      fixture.detectChanges();
      tick(1000);
      expect(component.isView).toBeFalse();
      const saveBT = de.queryAll(By.css('form button'))[1].nativeElement;
      saveBT.click();
      commonSaveAsisViewReq(); // 儲存
      expect(component.isView).toBeTrue();
    }));
    it('編輯單頭(masterModify),按下保存(save)後, 失敗需顯示錯誤訊息', fakeAsync(() => {
      const spyError = spyOn(dwMessage, 'error').and.callThrough();
      commonGetAsisViewReq();
      const modifyTag = de.query(By.css('.master-title a')).nativeElement;
      modifyTag.click();
      fixture.detectChanges();
      tick(1000);
      expect(component.isView).toBeFalse();
      const saveBT = de.queryAll(By.css('form button'))[1].nativeElement;
      saveBT.click();
      const saveAsisViewReq = httpMocker.expectOne('showcase/demo1/modifyAsis');
      saveAsisViewReq.flush({
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
    describe('刪除單身detailDelete', () => {
      it('需彈窗確認', fakeAsync(() => {
        commonGetAsisViewReq();
        const delTag = de.query(By.css('nz-table:nth-child(1) i[nztype="delete"]')).nativeElement;
        delTag.click();
        fixture.detectChanges();
        tick(1000);
        expect(document.querySelectorAll('.cdk-overlay-container')).toBeTruthy();
      }));
      it('需彈窗確認, 按下確認, 需刪除單身', fakeAsync(() => {
        commonGetAsisViewReq();
        expect(component.detail.length).toEqual(2);
        const delTag = de.query(By.css('nz-table:nth-child(1) i[nztype="delete"]')).nativeElement;
        delTag.click();
        fixture.detectChanges();
        tick(1000);
        const confirmBT = document.querySelector('.cdk-overlay-container button:nth-child(2)');
        (confirmBT as HTMLButtonElement) .click();
        commonSaveAsisViewReq();
        expect(component.detail.length).toEqual(1);
      }));
      it('detailChildren沒有單身的資料, 需不刪除,', fakeAsync(() => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const getAsisViewReq = httpMocker.expectOne('showcase/demo1/getAsisDetail');
        getAsisViewReq.flush({
          'master': {
            'asisId': 'No_000001',
            'asisName': '標準資產負債分析',
            'note': '這是備註這是備註這是備註',
            'status': 'Y',
            'asisDate': '2017/12/23'
          },
          'detail': [
            {
              'seq': 1,
              'itemId': 'A100',
              'itemName': '流動資產-現金及約當現金單身',
              'upperId1': 'AB00',
              'upperName1': '資產',
              'upperId2': 'A000',
              'upperName2': '流動資產',
              'status': 'N'
            }
          ],
          'detailChildren': [
            {
              'itemId': 'A110',
              'detail': [
                {
                  'seq': 11,
                  'biId': '1001',
                  'biName': '流動資產AA-現金及約當現金細目',
                  'status': 'N'
                },
                {
                  'seq': 22,
                  'biId': '1002',
                  'biName': '流動資產AA-現金及約當現金細目2',
                  'status': 'Y'
                }
              ]
            }
          ]
        });
        fixture.detectChanges();
        tick(1000);
        expect(component.detailChildren.length).toEqual(1);
        const delTag = de.query(By.css('nz-table:nth-child(1) i[nztype="delete"]')).nativeElement;
        delTag.click();
        fixture.detectChanges();
        tick(1000);
        const confirmBT = document.querySelector('.cdk-overlay-container button:nth-child(2)');
        (confirmBT as HTMLButtonElement) .click();
        commonSaveAsisViewReq();
        expect(component.detailChildren.length).toEqual(1);
      }));
    });
    describe('修改單身(detailModify)', () => {
      it('按下修改, 需彈窗', fakeAsync(() => {
        commonGetAsisViewReq();
        const editTag = de.query(By.css('nz-table:nth-child(1) i[nztype="edit"]')).nativeElement;
        editTag.click();
        fixture.detectChanges();
        tick(1000);
        expect(document.querySelectorAll('.cdk-overlay-container input').length).toEqual(6);
      }));
      it('按下確認, 需儲存', fakeAsync(() => {
        commonGetAsisViewReq();
        const editTag = de.query(By.css('nz-table:nth-child(1) i[nztype="edit"]')).nativeElement;
        editTag.click();
        fixture.detectChanges();
        tick(1000);
        const confirmBT = document.querySelector('.cdk-overlay-container .customize-footer button:nth-child(1)');
        (confirmBT as HTMLButtonElement) .click();
        commonSaveAsisViewReq();
      }));
      it('按下取消, 需不儲存', fakeAsync(() => {
        commonGetAsisViewReq();
        const editTag = de.query(By.css('nz-table:nth-child(1) i[nztype="edit"]')).nativeElement;
        editTag.click();
        fixture.detectChanges();
        tick(1000);
        const confirmBT = document.querySelector('.cdk-overlay-container .customize-footer button:nth-child(2)');
        (confirmBT as HTMLButtonElement) .click();
        fixture.detectChanges();
        tick(1000);
      }));
    });
    describe('刪除單身明細detailChildDelete', () => {
      it('需彈窗確認', fakeAsync(() => {
        commonGetAsisViewReq();
        const delTag = de.queryAll(By.css('i[nztype="delete"]'))[4].nativeElement;
        delTag.click();
        fixture.detectChanges();
        tick(1000);
        expect(document.querySelectorAll('.cdk-overlay-container')).toBeTruthy();
      }));
      it('需彈窗確認, 按下確認, 需刪除單身明細', fakeAsync(() => {
        commonGetAsisViewReq();
        expect(component.detailChildList.length).toEqual(2);
        const delTag = de.queryAll(By.css('i[nztype="delete"]'))[4].nativeElement;
        delTag.click();
        fixture.detectChanges();
        tick(1000);
        const confirmBT = document.querySelector('.cdk-overlay-container button:nth-child(2)');
        (confirmBT as HTMLButtonElement) .click();
        commonSaveAsisViewReq();
        expect(component.detailChildList.length).toEqual(1);
      }));

    });
    describe('修改單身明細(detailChildModify)', () => {
      it('按下修改, 需彈窗', fakeAsync(() => {
        commonGetAsisViewReq();
        const editTag = de.queryAll(By.css('i[nztype="edit"]'))[3].nativeElement;
        editTag.click();
        fixture.detectChanges();
        tick(1000);
        expect(document.querySelectorAll('.cdk-overlay-container input').length).toEqual(4);
      }));
      it('按下確認, 需儲存', fakeAsync(() => {
        commonGetAsisViewReq();
        const editTag = de.queryAll(By.css('i[nztype="edit"]'))[3].nativeElement;
        editTag.click();
        fixture.detectChanges();
        tick(1000);
        const confirmBT = document.querySelector('.cdk-overlay-container .customize-footer button:nth-child(1)');
        (confirmBT as HTMLButtonElement) .click();
        commonSaveAsisViewReq();
      }));
      it('按下取消, 需不儲存', fakeAsync(() => {
        commonGetAsisViewReq();
        const editTag = de.queryAll(By.css('i[nztype="edit"]'))[3].nativeElement;
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
        commonGetAsisViewReq();
        const addBT = de.queryAll(By.css('i[nztype="plus"]'))[0].nativeElement;
        addBT.click();
        fixture.detectChanges();
        tick(1000);
        expect(document.querySelectorAll('.cdk-overlay-container input').length).toEqual(6);
      }));
      it('彈窗新增,按下取消, 需不新增單身資料', fakeAsync(() => {
        commonGetAsisViewReq();
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
        expect(component.detail.length).toEqual(2);
      }));
      it('彈窗新增完畢,按下確定, 需新增單身資料', fakeAsync(() => {
        commonGetAsisViewReq();
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
        commonSaveAsisViewReq();
        expect(component.detail.length).toEqual(3);
      }));
    });
    describe('新增單身明細(detailChildAdd)', () => {
      it('按下新增, 需彈窗', fakeAsync(() => {
        commonGetAsisViewReq();
        const addBT = de.queryAll(By.css('i[nztype="plus"]'))[1].nativeElement;
        addBT.click();
        fixture.detectChanges();
        tick(1000);
        expect(document.querySelectorAll('.cdk-overlay-container input').length).toEqual(4);
      }));
      it('彈窗新增,按下取消, 需不新增單身資料', fakeAsync(() => {
        commonGetAsisViewReq();
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
        expect(component.detailChildList.length).toEqual(2);
      }));
      it('彈窗新增完畢,按下確定, 需新增單身資料', fakeAsync(() => {
        commonGetAsisViewReq();
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
        commonSaveAsisViewReq();
        expect(component.detailChildList.length).toEqual(3);
      }));
    });
    describe('刪除整筆(deleteMaster)', () => {
      it('刪除成功, 需返回上一層路由', fakeAsync(() => {
        commonGetAsisViewReq();
        const delTag = de.query(By.css('i[nztype="delete"]:nth-child(1)')).nativeElement;
        delTag.click();
        fixture.detectChanges();
        tick(1000);
        commonDeleteMasterReq();
        expect(spyNavigateToOpenerOrCreate).toHaveBeenCalled();
      }));
      it('刪除成功,沒有訊息描述, 需不加入addToRoute路由訊息', fakeAsync(() => {
        const spyAddToRoute = spyOn(dwMessage, 'addToRoute').and.callThrough();
        commonGetAsisViewReq();
        const delTag = de.query(By.css('i[nztype="delete"]:nth-child(1)')).nativeElement;
        delTag.click();
        fixture.detectChanges();
        tick(1000);
        const deleteReq = httpMocker.expectOne('showcase/demo1/deleteAsisList');
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
        expect(spyAddToRoute).not.toHaveBeenCalled();
      }));
      it('刪除失敗,需顯示錯誤訊息', fakeAsync(() => {
        const spyError = spyOn(dwMessage, 'error').and.callThrough();
        commonGetAsisViewReq();
        const delTag = de.query(By.css('i[nztype="delete"]:nth-child(1)')).nativeElement;
        delTag.click();
        fixture.detectChanges();
        tick(1000);
        const deleteReq = httpMocker.expectOne('showcase/demo1/deleteAsisList');
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
        commonGetAsisViewReq();
        const delTag = de.query(By.css('i[nztype="delete"]:nth-child(1)')).nativeElement;
        delTag.click();
        fixture.detectChanges();
        tick(1000);
        const deleteReq = httpMocker.expectOne('showcase/demo1/deleteAsisList');
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
      commonGetAsisViewReq();
      const backTag = de.query(By.css('i[nztype="arrow-left"]:nth-child(1)')).nativeElement;
      backTag.click();
      fixture.detectChanges();
      tick(1000);
      expect(spyNavigateToOpenerOrCreate).toHaveBeenCalled();
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
        fixture = TestBed.createComponent(AsisViewComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        router = fixture.debugElement.injector.get(Router);
        spyNavigate = spyOn(router, 'navigate').and.callThrough();
        tabRoutingService = fixture.debugElement.injector.get(DwTabRoutingService);
        spyNavigateToOpenerOrCreate = spyOn(tabRoutingService, 'navigateToOpenerOrCreate').and.callThrough();
        httpMocker = TestBed.inject(HttpTestingController);
        dwMessage = TestBed.inject(DwRoutingMessageService);
        commonGetAsisViewReq = () => {
          fixture.detectChanges(); // 觸發ngOnInit
          tick(1000);
          const getAsisViewReq = httpMocker.expectOne('showcase/demo1/getAsisDetail');
          getAsisViewReq.flush(JSON.parse(JSON.stringify(getAsisViewResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
          fixture.detectChanges();
          tick(1000);
        };
        commonSaveAsisViewReq = () => {
          fixture.detectChanges(); // 觸發ngOnInit
          tick(1000);
          const saveAsisViewReq = httpMocker.expectOne('showcase/demo1/modifyAsis');
          saveAsisViewReq.flush({
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
          const deleteReq = httpMocker.expectOne('showcase/demo1/deleteAsisList');
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
      it('刪除整筆(deleteMaster), 刪除成功, 需返回上一層路由', fakeAsync(() => {
        commonGetAsisViewReq();
        const delTag = de.query(By.css('i[nztype="delete"]:nth-child(1)')).nativeElement;
        delTag.click();
        fixture.detectChanges();
        tick(1000);
        commonDeleteMasterReq();
        expect(spyNavigate).toHaveBeenCalled();
      }));
      it('回列表goList, 需返回上一層路由', fakeAsync(() => {
        commonGetAsisViewReq();
        const backTag = de.query(By.css('i[nztype="arrow-left"]:nth-child(1)')).nativeElement;
        backTag.click();
        fixture.detectChanges();
        tick(1000);
        expect(spyNavigate).toHaveBeenCalled();
      }));
      it('DetailsChildInfoModel', ()=>{
        expect(DetailsChildInfoModel.parseToArray(getAsisViewResponse.detailChildren[0].detail)[0] instanceof DetailsChildInfoModel).toBeTrue();
      });
      it('StatusModel', ()=>{
        const statusModel =  new StatusModel();
        expect(statusModel.value).toEqual('Y');
        expect(statusModel.label).toEqual('有效');
      });
    });
  });
});
export const getAsisViewResponse = {
  'master': {
    'asisId': 'No_000001',
    'asisName': '標準資產負債分析',
    'note': '這是備註這是備註這是備註',
    'status': 'Y',
    'asisDate': '2017/12/23'
  },
  'detail': [
    {
      'seq': 1,
      'itemId': 'A100',
      'itemName': '流動資產-現金及約當現金單身',
      'upperId1': 'AB00',
      'upperName1': '資產',
      'upperId2': 'A000',
      'upperName2': '流動資產',
      'status': 'N'
    },
    {
      'seq': 2,
      'itemId': 'A110',
      'itemName': '流動資產-金融資產單身',
      'upperId1': 'AB00',
      'upperName1': '資產',
      'upperId2': 'A000',
      'upperName2': '流動資產',
      'status': 'Y'
    }
  ],
  'detailChildren': [
    {
      'itemId': 'A100',
      'detail': [
        {
          'seq': 1,
          'biId': '100',
          'biName': '流動資產A-現金及約當現金細目',
          'status': 'N'
        },
        {
          'seq': 2,
          'biId': '102',
          'biName': '流動資產A-現金及約當現金細目2',
          'status': 'Y'
        }
      ]
    },
    {
      'itemId': 'A110',
      'detail': [
        {
          'seq': 11,
          'biId': '1001',
          'biName': '流動資產AA-現金及約當現金細目',
          'status': 'N'
        },
        {
          'seq': 22,
          'biId': '1002',
          'biName': '流動資產AA-現金及約當現金細目2',
          'status': 'Y'
        }
      ]
    }
  ]
};
@Component({
  selector: 'dw-div-mask',
  template: `<div>MockDwDivMaskComponent<div>`
})
export class MockDwDivMaskComponent {
  @Input()
  targetDiv: HTMLElement;
  @Input()
  maskTriggers: HTMLElement[];
  @Input()
  showMask: boolean;
  @Input()
  customStyle: { [key: string]: string; };
  adjustMask(delayTime: number): void {
    console.log(delayTime);
  }
}
