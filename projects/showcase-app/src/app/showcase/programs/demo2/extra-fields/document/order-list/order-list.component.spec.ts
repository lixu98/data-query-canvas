/* eslint-disable max-len */
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { NzIconTestModule } from 'ng-zorro-antd/icon/testing';
import { of, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { By } from '@angular/platform-browser';
import { DwActionTestingModule } from '@webdpt/components/action/testing';
import { DwCommonRouterTestingModule } from '@webdpt/framework/sharedTest/common-router-test';
import { ExtraFieldsDocumentOrderListComponent } from './order-list.component';
import { ExtraFieldsDocumentOrderRoutingModule } from '../order-routing.module';
import { ExtraFieldsDocumentOrderModule } from '../order.module';
import { DwListService } from '@webdpt/framework/document';
import { APP_DATE_FORMAT, APP_TIME_FORMAT } from '@webdpt/framework/config';
import { ExtraFieldsModule } from '../../extra-fields.module';
import { ExtraFieldsRoutingModule } from '../../extra-fields-routing.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DwDocumentTestingModule } from '@webdpt/framework/document/testing';
import { FormGroup } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
registerLocaleData(zh);
describe('ExtraFieldsDocumentOrderListComponent', () => {
  let component: ExtraFieldsDocumentOrderListComponent;
  let fixture: ComponentFixture<ExtraFieldsDocumentOrderListComponent>;
  let de: DebugElement;
  let router: Router;
  let spyNavigate: jasmine.Spy;
  const commonConfig = {
    imports: [
      HttpClientTestingModule,
      ExtraFieldsDocumentOrderModule,
      ExtraFieldsModule,
      NoopAnimationsModule,
      NzIconTestModule,
      DwCommonRouterTestingModule,
      DwActionTestingModule,
      TranslateTestingModule,
      DwDocumentTestingModule
    ],
    providers: [
      { provide: APP_DATE_FORMAT, useValue: 'yyyy/MM/dd' },
      { provide: APP_TIME_FORMAT, useValue: 'hh:mm:ss' }
    ],
    declarations: [
      ExtraFieldsDocumentOrderListComponent
    ]
  };
  describe('共用條件測試', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule(commonConfig)
        .overrideModule(ExtraFieldsDocumentOrderRoutingModule, { // 單元測試,只專注於當前component,故將原路由設置清空, 改用RouterTestingModule.withRoutes(routes)的配置
          set: {
            imports: [],
            exports: []
          }
        })
        .overrideModule(ExtraFieldsRoutingModule, { // 單元測試,只專注於當前component,故將原路由設置清空, 改用RouterTestingModule.withRoutes(routes)的配置
          set: {
            imports: [],
            exports: []
          }
        })
        .overrideProvider(DwListService, {
          useValue: {
            list: (url: string, queryInfo: any): Observable<any> => {
              return of(mockList);
            }
          }
        })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(ExtraFieldsDocumentOrderListComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      router = fixture.debugElement.injector.get(Router);
      spyNavigate = spyOn(router, 'navigate').and.callThrough();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('onInit', () => {
      it('getOrderConfig有字段定義,列表資料需呈現自定義字段欄位', fakeAsync(() => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        fixture.detectChanges();
        tick(1000);

        expect(de.queryAll(By.css('table thead tr th')).length).toEqual(11);
      }));
    });
    describe('searchData', () => {
      it('送出查詢有cust_field自定義字段欄位, 需送出查詢', fakeAsync(() => {
        const spyList = spyOn(component.doc, 'list').and.callThrough();

        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(component.searchForm.controls['cust_field']).toBeTruthy();
        (component.searchForm.controls['cust_field'] as FormGroup).controls['userName'].setValue('bruce');
        component.searchForm.updateValueAndValidity();
        component.searchData();
        fixture.detectChanges();
        tick(1000);
        expect((spyList.calls.mostRecent().args[0] as any).condition.items[0].items[0].name).toEqual('cust_field$.userName');
      }));
      it('送出查詢有cust_field自定義字段欄位為array, 送出查詢需為arry', fakeAsync(() => {
        const spyList = spyOn(component.doc, 'list').and.callThrough();

        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(component.searchForm.controls['cust_field']).toBeTruthy();
        (component.searchForm.controls['cust_field'] as FormGroup).controls['deliveryTime'].setValue(['2', '3']);
        component.searchForm.updateValueAndValidity();
        component.searchData();
        fixture.detectChanges();
        tick(1000);
        expect((spyList.calls.mostRecent().args[0] as any).condition.items[0].items[0].values).toEqual(['2', '3']);
        expect(spyList).toHaveBeenCalledTimes(2);
      }));
      it('送出查詢有cust_field自定義字段欄位為array,但無值, 需不送出查詢', fakeAsync(() => {
        const spyList = spyOn(component.doc, 'list').and.callThrough();

        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(spyList).toHaveBeenCalledTimes(1);
        expect(component.searchForm.controls['cust_field']).toBeTruthy();
        (component.searchForm.controls['cust_field'] as FormGroup).controls['deliveryTime'].setValue([]);
        component.searchForm.updateValueAndValidity();
        component.searchData();
        fixture.detectChanges();
        tick(1000);
        expect(spyList).toHaveBeenCalledTimes(2);
        expect((spyList.calls.mostRecent().args[0] as any).condition.items.length).toEqual(0);
      }));
      it('送出查詢有cust_field自定義字段欄位為日期, 需送出查詢', fakeAsync(() => {
        const spyList = spyOn(component.doc, 'list').and.callThrough();

        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(spyList).toHaveBeenCalledTimes(1);
        expect(component.searchForm.controls['cust_field']).toBeTruthy();
        (component.searchForm.controls['cust_field'] as FormGroup).controls['shippingDate'].setValue(new Date('2023-03-29'));
        component.searchForm.updateValueAndValidity();
        component.searchData();
        fixture.detectChanges();
        tick(1000);
        expect(spyList).toHaveBeenCalledTimes(2);
        expect((spyList.calls.mostRecent().args[0] as any).condition.items[0].items[0].value).toEqual('%2023/03/29%');
      }));
      it('送出查詢欄位為array,但無值, 需不送出查詢', fakeAsync(() => {
        const spyList = spyOn(component.doc, 'list').and.callThrough();

        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(spyList).toHaveBeenCalledTimes(1);
        expect(component.searchForm.controls['status']).toBeTruthy();
        component.searchForm.controls['status'].setValue([]);
        component.searchForm.updateValueAndValidity();
        component.searchData();
        fixture.detectChanges();
        tick(1000);
        expect(spyList).toHaveBeenCalledTimes(2);
        expect((spyList.calls.mostRecent().args[0] as any).condition.items.length).toEqual(0);
      }));
      it('送出查詢欄位值為array, 送出查詢需為arry', fakeAsync(() => {
        const spyList = spyOn(component.doc, 'list').and.callThrough();

        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(component.searchForm.controls['status']).toBeTruthy();
        component.searchForm.controls['status'].setValue(['C', 'D']);
        component.searchForm.updateValueAndValidity();
        component.searchData();
        fixture.detectChanges();
        tick(1000);
        expect((spyList.calls.mostRecent().args[0] as any).condition.items[0].items[0].values).toEqual(['C', 'D']);
        expect((spyList.calls.mostRecent().args[0] as any).condition.items[0].items[0].operator).toEqual('IN');
        expect(spyList).toHaveBeenCalledTimes(2);
      }));
      it('送出查詢欄位值為非array, 送出查詢operator需為EQUAL', fakeAsync(() => {
        const spyList = spyOn(component.doc, 'list').and.callThrough();

        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(component.searchForm.controls['orderid']).toBeTruthy();
        component.searchForm.controls['orderid'].setValue('mockId1234');
        component.searchForm.updateValueAndValidity();
        component.searchData();
        fixture.detectChanges();
        tick(1000);
        expect((spyList.calls.mostRecent().args[0] as any).condition.items[0].items[0].operator).toEqual('EQUAL');
        expect(spyList).toHaveBeenCalledTimes(2);
      }));
    });
    it('resetForm需初始查詢條件', fakeAsync(() => {
      const spyList = spyOn(component.doc, 'list').and.callThrough();
      fixture.detectChanges(); // 觸發ngOnInit
      tick(1000);
      fixture.detectChanges();
      tick(1000);

      const advanceQueryTag = de.queryAll(By.css('form a'))[0].nativeElement;
      advanceQueryTag.click();
      fixture.detectChanges();
      tick(1000);
      const orderidCtr = component.searchForm.controls['orderid'];
      orderidCtr.setValue('orderid123');
      fixture.detectChanges();
      tick(1000);
      component.searchData(); // 第一次查詢
      fixture.detectChanges();
      tick(1000);
      expect((spyList.calls.mostRecent().args[0] as any).condition.items[0].items[0].value).toEqual('orderid123');

      component.resetForm();
      component.searchData(); // resetForm後查詢
      fixture.detectChanges();
      tick(1000);
      expect((spyList.calls.mostRecent().args[0] as any).condition.items.length).toEqual(0);
    }));
    it('執行modify需前往編輯頁路由', fakeAsync(() => {
      fixture.detectChanges(); // 觸發ngOnInit
      tick(1000);
      fixture.detectChanges();
      tick(1000);

      component.modify('ID1234');
      tick();
      expect(spyNavigate.calls.mostRecent().args[0]).toEqual(['../modify']);
      expect(spyNavigate.calls.mostRecent().args[1].queryParams).toEqual({ orderId: 'ID1234' });
    }));
    it('執行detail需前往明細頁路由', fakeAsync(() => {
      fixture.detectChanges(); // 觸發ngOnInit
      tick(1000);
      fixture.detectChanges();
      tick(1000);

      component.detail('ID1234');
      tick();
      expect(spyNavigate.calls.mostRecent().args[0]).toEqual(['../detail']);
      expect(spyNavigate.calls.mostRecent().args[1].queryParams).toEqual({ orderId: 'ID1234' });
    }));
    it('執行create需前往創建頁路由', fakeAsync(() => {
      fixture.detectChanges(); // 觸發ngOnInit
      tick(1000);
      fixture.detectChanges();
      tick(1000);

      component.create();
      tick();
      expect(spyNavigate.calls.mostRecent().args[0]).toEqual(['../create']);
    }));
    it('onPageSizeChange每頁筆數改變, 需重新查詢資料', fakeAsync(() => {
      const spyList = spyOn(component.doc, 'list').and.callThrough();
      fixture.detectChanges(); // 觸發ngOnInit
      tick(1000);

      fixture.detectChanges();
      tick(1000);
      component.queryInfo.pageSize = 3;
      component.onPageSizeChange();
      fixture.detectChanges();
      tick(1000);
      expect((spyList.calls.mostRecent().args[0] as any).pageSize).withContext('入參pageSize').toEqual(3);
    }));
    it('onPageIndexChange當前頁碼改變, 需重新查詢資料', fakeAsync(() => {
      const spyList = spyOn(component.doc, 'list').and.callThrough();
      fixture.detectChanges(); // 觸發ngOnInit
      tick(1000);

      fixture.detectChanges();
      tick(1000);
      component.queryInfo.pageNumber = 3;
      component.onPageIndexChange();
      fixture.detectChanges();
      tick(1000);
      expect((spyList.calls.mostRecent().args[0] as any).pageNumber).withContext('入參pageNumber').toEqual(3);
    }));
    it('當執行delete, 需送出要刪除的資料', fakeAsync(() => {
      const spyDelete = spyOn(component.doc, 'delete').and.callThrough();
      fixture.detectChanges(); // 觸發ngOnInit
      tick(1000); // 讓第一次searchData異步完成異步完成
      component.delete(0);
      fixture.detectChanges();
      tick(1000);
      expect(spyDelete.calls.mostRecent().args[0][0]).toEqual({
        'address': '台中市大里區',
        'customerid': 'c03',
        'employeeid': 'c02',
        'employeename': '',
        'gender': '',
        'orderdate': '2022/06/08 00:00:00',
        'orderid': '1591175815775',
        'status': 'C',
        'totalcount': 140,
        '$state': 'd'
      });
    }));
  });
  describe('個別條件測試', () => {
    it('this.doc.list請求錯誤, 需開窗顯示錯誤訊息', fakeAsync(() => {
      TestBed.configureTestingModule(commonConfig)
        .overrideProvider(DwListService, {
          useValue: {
            list: (url: string, queryInfo: any): Observable<any> => {
              return throwError({error: { errorMessage : 'errorMessage'}}); // 請求錯誤
            }
          }
        })
        .compileComponents().then(()=>{
          fixture = TestBed.createComponent(ExtraFieldsDocumentOrderListComponent);
          component = fixture.componentInstance;
          de = fixture.debugElement;
          const spyModalError = spyOn((component as any).dwModalService, 'error').and.callFake(()=>{});
          fixture.detectChanges(); // 觸發ngOnInit
          tick(1000);
          fixture.detectChanges();
          tick(1000);
          expect(spyModalError).toHaveBeenCalled();
          expect(spyModalError.calls.mostRecent().args[0]).toEqual({ nzContent: 'errorMessage' });
        });
    }));
  });
});

export const mockList = {
  'rowCount': 55,
  'pageCount': 3,
  'pageSize': 20,
  'currentPage': 1,
  'message': null,
  'success': true,
  'data': {
    '$custFieldsConfig': {
      'demo_order': [{
        'config_id': 1,
        'table_name': 'demo_order',
        'field_id': 'userName',
        'field_label': '用戶帳號',
        'field_type': 'INPUTALPHANUMERIC',
        'field_config': '{"placeholder":"用戶帳號","validator":{"required":null,"minLength":3}}',
        'tenantsid': 28205582758464
      }, {
        'config_id': 2,
        'table_name': 'demo_order',
        'field_id': 'email',
        'field_label': '電子郵箱',
        'field_type': 'INPUT',
        'field_config': '{"placeholder":"電子郵箱","validator":{"email":null,"minLength":3}}',
        'tenantsid': 28205582758464
      }, {
        'config_id': 3,
        'table_name': 'demo_order',
        'field_id': 'memo',
        'field_label': '備註',
        'field_type': 'TEXTAREA',
        'field_config': '{"placeholder":"備註"}',
        'tenantsid': 28205582758464
      }, {
        'config_id': 4,
        'table_name': 'demo_order',
        'field_id': 'postalCode',
        'field_label': '郵遞區號',
        'field_type': 'INPUTNUMBER',
        'field_config': '{"placeholder":"郵遞區號"}',
        'tenantsid': 28205582758464
      }, {
        'config_id': 5,
        'table_name': 'demo_order',
        'field_id': 'shippingDate',
        'field_label': '出貨日期',
        'field_type': 'DATEPICKER',
        'field_config': '{"placeholder":"出貨日期"}',
        'tenantsid': 28205582758464
      }, {
        'config_id': 6,
        'table_name': 'demo_order',
        'field_id': 'deliveryTime',
        'field_label': '希望到貨時段',
        'field_type': 'SELECT',
        'field_config': '{"placeholder":"希望到貨時段","multiple":true,"options":[{"label":"早上","value":"1"},{"label":"下午","value":"2"},{"label":"晚上","value":"3"}]}',
        'tenantsid': 28205582758464
      }
      ]
    },
    'demo_order': [
      {
        'address': '台中市大里區',
        'customerid': 'c03',
        'employeeid': 'c02',
        'employeename': '',
        'gender': '',
        'orderdate': '2022/06/08 00:00:00',
        'orderid': '1591175815775',
        'status': 'C',
        'totalcount': 140
      },
      {
        'address': '台北市內湖區民政里瑞光路七段8巷168號',
        'customerid': 'c02',
        'employeeid': '',
        'employeename': '',
        'gender': '',
        'orderdate': '2020/06/12 00:00:00',
        'orderid': '1591953187400',
        'status': 'C',
        'totalcount': 3
      },
    ]
  }
};
