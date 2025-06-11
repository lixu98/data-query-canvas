/* eslint-disable max-len */
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { NzIconTestModule } from 'ng-zorro-antd/icon/testing';
import { DwActionModule } from '@webdpt/components/action';
import { By } from '@angular/platform-browser';
import { DwActionTestingModule, MockDwActionAuthorizedDirective } from '@webdpt/components/action/testing';
import { ExtraFieldsOrderService } from '../service/order.service';
import { ExtraFieldsOrderModule } from '../order.module';
import { DwCommonRouterTestingModule } from '@webdpt/framework/sharedTest/common-router-test';
import { ExtraFieldsOrderRoutingModule } from '../order-routing.module';
import { APP_DATE_FORMAT, APP_TIME_FORMAT, DW_USING_TAB } from '@webdpt/framework/config';
import { ExtraFieldsModule } from '../../extra-fields.module';
import { ExtraFieldsRoutingModule } from '../../extra-fields-routing.module';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ExtraFieldsOrderModifyComponent } from './order-modify.component';
import { BehaviorSubject, of } from 'rxjs';
import { DwTabRoutingService } from '@webdpt/framework/routing-tabset';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { DwRoutingMessageService } from '@webdpt/components/routing-message';
registerLocaleData(zh);
describe('ExtraFieldsOrderModifyComponent', () => {
  let component: ExtraFieldsOrderModifyComponent;
  let fixture: ComponentFixture<ExtraFieldsOrderModifyComponent>;
  let de: DebugElement;
  let router: Router;
  let dwModalService: NzModalService;
  let spyNavigate: jasmine.Spy;
  let dwTabRoutingService: DwTabRoutingService;
  let orderService: ExtraFieldsOrderService;
  let httpMocker: HttpTestingController;
  let mockInitData: () => void;
  const mockTabChange$ = new BehaviorSubject({
    'componentType': ExtraFieldsOrderModifyComponent,
    'currentId': '1665454704062120',
    'previousId': '1665466574402212',
    'currentRouterLink': '/dw-demo2/extra-fields/order/modify',
    'tabChanged': false
  });
  const commonConfig = {
    imports: [
      HttpClientTestingModule,
      ExtraFieldsOrderModule,
      ExtraFieldsModule,
      NoopAnimationsModule,
      NzIconTestModule,
      DwCommonRouterTestingModule,  // 所有路由都導到這裏設定
      DwActionTestingModule,
      TranslateTestingModule,
    ],
    providers: [
      { provide: APP_DATE_FORMAT, useValue: 'yyyy/MM/dd' },
      { provide: APP_TIME_FORMAT, useValue: 'HH:mm:ss' },
      {
        provide: ActivatedRoute, useValue: {
          // data: of({}),
          snapshot: new ActivatedRouteSnapshot(), // this.router.navigate(['../'], { relativeTo: this.route }); // 相對路徑導頁
          queryParamMap: of({ // this.route.queryParamMap.subscribe
            get: (key: string): any => {
              return `${key}-get`;
            }
          })
        }
      },
      { provide: DW_USING_TAB, useValue: true },
      {
        provide: DwTabRoutingService, useValue: {
          tabRouterChanged: mockTabChange$.asObservable()
        }
      }
    ],
    declarations: [
      ExtraFieldsOrderModifyComponent
    ]
  };
  describe('共用條件測試', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule(commonConfig)
        .overrideModule(ExtraFieldsOrderRoutingModule, { // 單元測試,只專注於當前component,故將原路由設置清空, 改用RouterTestingModule.withRoutes(routes)的配置
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
        .overrideModule(DwActionModule, {
          set: {
            imports: [],
            declarations: [MockDwActionAuthorizedDirective],
            exports: [MockDwActionAuthorizedDirective]
          }
        })
        .overrideProvider(NzModalService, {
          useValue: {
            create: (option: any) => {
              const detailEditForm = new FormBuilder().group({});
              detailEditForm.addControl('productCode', new FormControl('productCode1234'));
              detailEditForm.addControl('productName', new FormControl('productName'));
              detailEditForm.addControl('price', new FormControl(10));
              detailEditForm.addControl('quantity', new FormControl(1));

              option.nzOnOk({ detailEditForm: detailEditForm }); // 手動觸發
              option.nzOnCancel(); // 手動觸發
            }
          }
        })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(ExtraFieldsOrderModifyComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      router = fixture.debugElement.injector.get(Router);
      spyNavigate = spyOn(router, 'navigate').and.callThrough();
      orderService = fixture.debugElement.injector.get(ExtraFieldsOrderService);
      httpMocker = TestBed.inject(HttpTestingController);
      dwModalService = de.injector.get(NzModalService);
      dwTabRoutingService = de.injector.get(DwTabRoutingService);

      mockInitData = () => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const getOrderConfigReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderConfig');
        getOrderConfigReq.flush(getOrderConfigResponse);
        const getOrderListReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderDetail');
        getOrderListReq.flush(JSON.parse(JSON.stringify(getOrderDetailResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
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
    describe('onInit', () => {
      it('getOrderConfig沒有字段定義,單頭需不可呈現自定義字段欄位', fakeAsync(() => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const getOrderConfigReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderConfig');
        getOrderConfigReq.flush({ config: null });
        const getOrderListReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderDetail');
        getOrderListReq.flush(JSON.parse(JSON.stringify(getOrderDetailResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料

        fixture.detectChanges();
        tick(1000);
        expect(de.queryAll(By.css('dw-extra-fields input')).length).toEqual(0);
      }));
      it('getOrderConfig有字段定義,單頭需可呈現自定義字段欄位', fakeAsync(() => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const getOrderConfigReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderConfig');
        getOrderConfigReq.flush(getOrderConfigResponse);
        const getOrderListReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderDetail');
        getOrderListReq.flush(JSON.parse(JSON.stringify(getOrderDetailResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料

        fixture.detectChanges();
        tick(1000);
        expect(de.queryAll(By.css('dw-extra-fields input')).length).toEqual(5);
      }));
    });

    it('getFormControl需取得formControl', fakeAsync(() => {
      mockInitData();
      expect(component.getFormControl('formDetail') instanceof FormArray).toBeTrue();
    }));
    it('detailDelete需刪除訂單明細', fakeAsync(() => {
      mockInitData();
      expect(component.formDetail.controls.length).toEqual(6);
      component.detailDelete(0);
      fixture.detectChanges();
      tick(1000);
      expect(component.formDetail.controls.length).toEqual(5);
    }));
    it('detailModify, 需變更明細資料', fakeAsync(() => {
      mockInitData();
      component.detailModify(0);
      fixture.detectChanges();
      tick(1000);
      expect(component.getFormDetailValue(0, 'productCode')).toEqual('productCode1234');
    }));
    it('detailAdd, 需新增明細資料', fakeAsync(() => {
      mockInitData();
      component.detailAdd();
      fixture.detectChanges();
      tick(1000);
      expect(component.
        getFormDetailValue((component.getFormControl('formDetail') as FormArray).length - 1, 'productCode')).toEqual('productCode1234');
    }));
    it('cancel, 需回上一層路由', fakeAsync(() => {
      mockInitData();
      component.cancel();
      fixture.detectChanges();
      tick(1000);
      expect(spyNavigate.calls.mostRecent().args[0]).withContext('回到上層路由').toEqual(['../']);
    }));
    describe('save', () => {
      it('onBeforeSaveDwCustomTableDisplay需被執行', fakeAsync(() => {
        const spyOnBeforeSaveDwCustomTableDisplay = spyOn(component, 'onBeforeSaveOrder').and.callThrough();
        mockInitData();
        component.save();
        const modifyReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/modifyOrder');
        modifyReq.flush({ status: 'ok' });
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(spyOnBeforeSaveDwCustomTableDisplay).toHaveBeenCalled();
      }));
      it('onAfterSaveDwCustomTableDisplay需被執行', fakeAsync(() => {
        const spyOnAfterSaveDwCustomTableDisplay = spyOn(component, 'onAfterSaveOrder').and.callThrough();
        mockInitData();
        component.save();
        const modifyReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/modifyOrder');
        modifyReq.flush({ status: true });
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(spyOnAfterSaveDwCustomTableDisplay).toHaveBeenCalled();
      }));
      it('modify成功, 需顯示訊息', fakeAsync(() => {
        const dwMessage = de.injector.get(DwRoutingMessageService);
        const spyAdddToRoute = spyOn(dwMessage, 'addToRoute').and.callThrough();
        mockInitData();
        component.save();
        const modifyReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/modifyOrder');
        modifyReq.flush({ status: true, description: '修改成功' });
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(spyAdddToRoute.calls.mostRecent().args[0]).toEqual('修改成功');
      }));
      it('modify失敗, 需顯示訊息', fakeAsync(() => {
        const dwMessage = de.injector.get(DwRoutingMessageService);
        const spySuccess = spyOn(dwMessage, 'success').and.callThrough();
        mockInitData();
        component.save();
        const modifyReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/modifyOrder');
        modifyReq.flush({ status: false, description: '修改失敗' });
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(spySuccess.calls.mostRecent().args[0]).toEqual('修改失敗');
      }));
      it('modify失敗, !description屬性需不顯示訊息', fakeAsync(() => {
        const dwMessage = de.injector.get(DwRoutingMessageService);
        const spySuccess = spyOn(dwMessage, 'success').and.callThrough();
        mockInitData();
        component.save();
        const modifyReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/modifyOrder');
        modifyReq.flush({ status: false, description: '' });
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(spySuccess).not.toHaveBeenCalled();
      }));
    });
    describe('tabInfoSubscription', () => {
      it('頁籤模式下,同頁籤(tabChanged為false,表示ExtraFieldsOrderModifyComponent未銷毀再次進入),需initDetail讀取資料', fakeAsync(() => {
        const spyInitDetail = spyOn(component as any, 'initDetail').and.callThrough();
        mockInitData();
        expect(spyInitDetail).toHaveBeenCalledTimes(1);
        mockTabChange$.next({
          'componentType': ExtraFieldsOrderModifyComponent,
          'currentId': '1665454704062120',
          'previousId': '1665466574402212',
          'currentRouterLink': '/dw-demo2/extra-fields/order/modify',
          'tabChanged': false
        });
        const getOrderListReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderDetail');
        getOrderListReq.flush(JSON.parse(JSON.stringify(getOrderDetailResponse)));
        expect(spyInitDetail).toHaveBeenCalledTimes(2);
      }));
      it('onDestroy, 需取消訂閱', fakeAsync(() => {
        const spyUnsubscribe = spyOn((component as any).tabInfoSubscription, 'unsubscribe').and.callThrough();
        mockInitData();
        fixture.destroy(); // 執行ngOnDestroy
        expect(spyUnsubscribe).toHaveBeenCalled();
      }));
    });
  });
  describe('個別條件測試', () => {
    it('非頁籤, 需不訂閱tabRouterChanged', fakeAsync(() => {
      TestBed.configureTestingModule(commonConfig)
        .overrideModule(ExtraFieldsOrderRoutingModule, { // 單元測試,只專注於當前component,故將原路由設置清空, 改用RouterTestingModule.withRoutes(routes)的配置
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
        .overrideModule(DwActionModule, {
          set: {
            imports: [],
            declarations: [MockDwActionAuthorizedDirective],
            exports: [MockDwActionAuthorizedDirective]
          }
        })
        .overrideProvider(DW_USING_TAB, { useValue: false }) // 不使用頁籤
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(ExtraFieldsOrderModifyComponent);
          httpMocker = TestBed.inject(HttpTestingController);
          component = fixture.componentInstance;
          de = fixture.debugElement;

          fixture.detectChanges(); // 觸發ngOnInit
          tick(1000);
          const getOrderConfigReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderConfig');
          getOrderConfigReq.flush(getOrderConfigResponse);
          const getOrderListReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderDetail');
          getOrderListReq.flush(JSON.parse(JSON.stringify(getOrderDetailResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
          fixture.detectChanges();
          tick(1000);

          expect(((component as any).tabInfoSubscription)._subscriptions).toEqual(null);
          // // 以下為了onDestroy的覆蓋率
          (component as any).tabInfoSubscription = null;
          fixture.detectChanges();
          fixture.destroy();
        });
    }));
    // it('modify失敗, 需顯示訊息', fakeAsync(() => {
    //   TestBed.configureTestingModule(commonConfig)
    //     .overrideModule(ExtraFieldsOrderRoutingModule, { // 單元測試,只專注於當前component,故將原路由設置清空, 改用RouterTestingModule.withRoutes(routes)的配置
    //       set: {
    //         imports: [],
    //         exports: []
    //       }
    //     })
    //     .overrideModule(ExtraFieldsRoutingModule, { // 單元測試,只專注於當前component,故將原路由設置清空, 改用RouterTestingModule.withRoutes(routes)的配置
    //       set: {
    //         imports: [],
    //         exports: []
    //       }
    //     })
    //     .overrideModule(DwActionModule, {
    //       set: {
    //         imports: [],
    //         declarations: [MockDwActionAuthorizedDirective],
    //         exports: [MockDwActionAuthorizedDirective]
    //       }
    //     })
    //     .overrideProvider(DwCustomTableDisplayService, {
    //       useValue: {
    //         getDwCustomTableDisplayDetail: (
    //           pageIndex: number,
    //           pageSize: number,
    //           searchParam: any,
    //           sortSet: any[]): Observable<any> => {
    //           return of({
    //             'master': {
    //               'orderId': 'No_000001',
    //               'status': 'Y',
    //               'orderDate': '2017/12/22',
    //               'customerId': 'C01',
    //               'customerName': '櫃櫃傢俱股份有限公司',
    //               'orderAddr': '台中市大里區中興路一段1號',
    //               'total': 3903000,
    //               'salesmanId': '1',
    //               'salesmanName': '孙品品',
    //               'gender': 'female'
    //             },
    //             'detail': [
    //               {
    //                 'seq': 1,
    //                 'distributionStatus': '1',
    //                 'productCode': 'Product000001',
    //                 'productName': '高級訂製歐式鄉村風格酒櫃',
    //                 'price': 230000,
    //                 'quantity': 3,
    //                 'subtotal': 690000,
    //                 'distributionStatusDesc': '未出貨'
    //               }
    //             ]
    //           });
    //         },
    //         modifyDwCustomTableDisplay: () => of({
    //           description: '修改失敗',
    //           status: false
    //         }),
    //         getDateFormat: (): string => 'yyyy/MM/dd',
    //         orderDetailMaxSeq: (): number => 99
    //       }
    //     })
    //     .compileComponents()
    //     .then(() => {
    //       fixture = TestBed.createComponent(ExtraFieldsOrderModifyComponent);
    //       component = fixture.componentInstance;
    //       de = fixture.debugElement;
    //       const dwMessage = de.injector.get(DwRoutingMessageService);
    //       const spyOnAfterSaveDwCustomTableDisplay = spyOn(component, 'onAfterSaveDwCustomTableDisplay').and.callThrough();
    //       const spySuccess = spyOn(dwMessage, 'success').and.callThrough();
    //       fixture.detectChanges();
    //       tick(1000);
    //       component.save();
    //       fixture.detectChanges();
    //       tick(1000);
    //       fixture.detectChanges();
    //       tick(1000);
    //       fixture.detectChanges();
    //       tick(1000);
    //       expect(spyOnAfterSaveDwCustomTableDisplay).toHaveBeenCalled();
    //       expect(spySuccess.calls.mostRecent().args[0]).toEqual('修改失敗');
    //     });
    // }));
  });
});

export const getOrderDetailResponse = {
  'master': {
    'orderId': 'No_000001',
    'status': 'Y',
    'orderDate': '2017/12/22',
    'customerId': 'C01',
    'customerName': '櫃櫃傢俱股份有限公司',
    'orderAddr': '台中市大里區中興路一段1號',
    'total': 3903000,
    'salesmanId': '1',
    'salesmanName': '孙品品',
    'gender': 'female',
    'cust_field': '{"userName":"123566","email":"bruce@gmial.com","memo":"12345","postalCode":"","shippingDate":"2021/02/28 15:45:44","deliveryTime":[]}'
  },
  'detail': [
    {
      'seq': 1,
      'distributionStatus': '1',
      'productCode': 'Product000001',
      'productName': '高級訂製歐式鄉村風格酒櫃',
      'price': 230000,
      'quantity': 3,
      'subtotal': 690000,
      'distributionStatusDesc': '未出貨'
    },
    {
      'seq': 2,
      'distributionStatus': '1',
      'productCode': 'Product000002',
      'productName': '內崁式櫥櫃',
      'price': 45000,
      'quantity': 45,
      'subtotal': 2025000,
      'distributionStatusDesc': '未出貨'
    },
    {
      'seq': 3,
      'distributionStatus': '2',
      'productCode': 'Product000003',
      'productName': '皇家實木鏡面鑲鑽五層十門衣櫃組',
      'price': 1000000,
      'quantity': 1,
      'subtotal': 1000000,
      'distributionStatusDesc': '已出貨'
    },
    {
      'seq': 4,
      'distributionStatus': '4',
      'productCode': 'Product000004',
      'productName': '牛皮沙發',
      'price': 88000,
      'quantity': 2,
      'subtotal': 176000,
      'distributionStatusDesc': '已退貨'
    },
    {
      'seq': 5,
      'distributionStatus': 'B',
      'productCode': 'Product000005',
      'productName': '活動曬衣架',
      'price': 7000,
      'quantity': 1,
      'subtotal': 7000,
      'distributionStatusDesc': '已出已換'
    },
    {
      'seq': 6,
      'distributionStatus': '1',
      'productCode': 'Product000006',
      'productName': '轉盤圓形餐桌',
      'price': 5000,
      'quantity': 1,
      'subtotal': 5000,
      'distributionStatusDesc': '未出貨'
    }
  ]
};
export const getOrderConfigResponse = {
  'config': [
    {
      'field_id': 'userName',
      'config_id': 13,
      'field_config': '{"placeholder":"用戶帳號","validator":{"required":null,"customValidator":{},"customAsyncValidator":{},"minLength":3}}',
      'tenantsid': 28205582758464,
      'field_label': '用戶帳號',
      'table_name': 'demo_order',
      'field_type': 'INPUTALPHANUMERIC'
    },
    {
      'field_id': 'email',
      'config_id': 14,
      'field_config': '{"placeholder":"電子郵箱","validator":{"email":null,"minLength":3}}',
      'tenantsid': 28205582758464,
      'field_label': '電子郵箱',
      'table_name': 'demo_order',
      'field_type': 'INPUT'
    },
    {
      'field_id': 'memo',
      'config_id': 15,
      'field_config': '{"placeholder":"備註"}',
      'tenantsid': 28205582758464,
      'field_label': '備註',
      'table_name': 'demo_order',
      'field_type': 'TEXTAREA'
    },
    {
      'field_id': 'postalCode',
      'config_id': 16,
      'field_config': '{"placeholder":"郵遞區號"}',
      'tenantsid': 28205582758464,
      'field_label': '郵遞區號',
      'table_name': 'demo_order',
      'field_type': 'INPUTNUMBER'
    },
    {
      'field_id': 'shippingDate',
      'config_id': 18,
      'field_config': '{"placeholder":"出貨日期"}',
      'tenantsid': 28205582758464,
      'field_label': '出貨日期',
      'table_name': 'demo_order',
      'field_type': 'DATEPICKER'
    },
    {
      'field_id': 'deliveryTime',
      'config_id': 19,
      'field_config': '{"placeholder":"希望到貨時段","multiple":true,"options":[{"label":"早上","value":"1"},{"label":"下午","value":"2"},{"label":"晚上","value":"3"}]}',
      'tenantsid': 28205582758464,
      'field_label': '希望到貨時段',
      'table_name': 'demo_order',
      'field_type': 'SELECT'
    }
  ]
};
