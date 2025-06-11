/* eslint-disable max-len */
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { NzIconTestModule } from 'ng-zorro-antd/icon/testing';
import { BehaviorSubject, of, Subscription, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { By } from '@angular/platform-browser';
import { DwActionTestingModule } from '@webdpt/components/action/testing';
import { DwCommonRouterTestingModule } from '@webdpt/framework/sharedTest/common-router-test';
import { ExtraFieldsDocumentOrderRoutingModule } from '../order-routing.module';
import { ExtraFieldsDocumentOrderModule } from '../order.module';
import { DwDocument, DwReadService, DwUpdateService } from '@webdpt/framework/document';
import { APP_DATE_FORMAT, APP_TIME_FORMAT, DW_USING_TAB } from '@webdpt/framework/config';
import { ExtraFieldsModule } from '../../extra-fields.module';
import { ExtraFieldsRoutingModule } from '../../extra-fields-routing.module';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DwDocumentTestingModule } from '@webdpt/framework/document/testing';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { ExtraFieldsCustomerClientPagingService } from '../modals/customer/customer-client-paging.service';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { DwTabRoutingService } from '@webdpt/framework/routing-tabset';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ExtraFieldsDocumentOrderDetailComponent } from './order-detail.component';
registerLocaleData(zh);

export class DwTabRoutingServiceStub {
  tabRouterChanged$: BehaviorSubject<any> = new BehaviorSubject({
    'componentType': ExtraFieldsDocumentOrderDetailComponent,
    'currentId': '1665454704062120',
    'previousId': '1665466574402212',
    'currentRouterLink': '/dw-demo2/extra-fields/document/detail',
    'tabChanged': false
  });
  get tabRouterChanged(): Observable<any> {
    return this.tabRouterChanged$.asObservable().pipe(
      filter(obsData => obsData !== null), // 不廣播初始值
      distinctUntilChanged() // 有改變時才廣播
    );
  }
}
describe('ExtraFieldsDocumentOrderDetailComponent', () => {
  let component: ExtraFieldsDocumentOrderDetailComponent;
  let fixture: ComponentFixture<ExtraFieldsDocumentOrderDetailComponent>;
  let de: DebugElement;
  let router: Router;
  let spyNavigate: jasmine.Spy;
  let dwModalService: NzModalService;

  const commonImports = [
    HttpClientTestingModule,
    ExtraFieldsDocumentOrderModule,
    ExtraFieldsModule,
    NoopAnimationsModule,
    NzIconTestModule,
    DwCommonRouterTestingModule,
    DwActionTestingModule,
    TranslateTestingModule,
    DwDocumentTestingModule
  ];
  const commonProviders = [
    { provide: APP_DATE_FORMAT, useValue: 'yyyy/MM/dd' },
    { provide: APP_TIME_FORMAT, useValue: 'hh:mm:ss' },
    {
      provide: ActivatedRoute, useValue: {
        snapshot: new ActivatedRouteSnapshot(), // this.router.navigate(['../'], { relativeTo: this.route }); // 相對路徑導頁
        queryParamMap: of({ // this.route.queryParamMap.subscribe
          get: (key: string): any => {
            return `${key}-get`;
          }
        })
      }
    },
    { provide: APP_DATE_FORMAT, useValue: 'yyyy/MM/dd' },
    { provide: DW_USING_TAB, useValue: true },
    {
      provide: ExtraFieldsCustomerClientPagingService, useValue: {
        open: (selected: Array<any>): Observable<any> => of(['c03'])
      }
    },
    {
      provide: DwTabRoutingService, useValue: {
        tabRouterChanged: of({
          'componentType': ExtraFieldsDocumentOrderDetailComponent,
          'currentId': '1665454704062120',
          'previousId': '1665466574402212',
          'currentRouterLink': '/dw-demo2/extra-fields/document/detail',
          'tabChanged': true
        })

      }
    }
  ];
  const commonConfig = {
    imports: [
      ...commonImports
    ],
    providers: [
      ...commonProviders
    ],
    declarations: [
      ExtraFieldsDocumentOrderDetailComponent
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
        .overrideProvider(DwReadService, {
          useValue: commonReadService
        })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(ExtraFieldsDocumentOrderDetailComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      router = fixture.debugElement.injector.get(Router);
      spyNavigate = spyOn(router, 'navigate').and.callThrough();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
    describe('initData', () => {
      it('$custFieldsConfig有字段定義,需呈現自定義字段欄位', fakeAsync(() => {
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(de.queryAll(By.css('dw-extra-fields label')).length).toEqual(6);
      }));
    });
    it('按下修改(modify), 需跳轉路由(修改頁)', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000);
      component.modify();
      tick(1000);
      expect(spyNavigate.calls.mostRecent().args[0]).withContext('跳轉路由(修改頁)').toEqual(['../modify']);
    }));
    it('按下返回(list), 需跳轉路由(列表頁)', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000);
      component.list();
      tick(1000);
      expect(spyNavigate.calls.mostRecent().args[0]).withContext('跳轉路由(列表頁)').toEqual(['../']);
    }));
  });
  describe('個別條件測試', () => {
    describe('doc.read錯誤', () => {
      it('返回訊息有errorMessage,, 需執行dwModalService.error', fakeAsync(() => {
        // ininData在constructor觸發,spy的寫法要改如下......
        const spyInitDataTriggerByConstructor = spyOn(ExtraFieldsDocumentOrderDetailComponent.prototype, 'initData').and.callThrough();
        const mockDwModalService = jasmine.createSpyObj('NzModalService', ['error']);
        // ...................................................
        TestBed.configureTestingModule(commonConfig)
          .overrideModule(ExtraFieldsDocumentOrderRoutingModule, {
            set: {
              imports: [],
              exports: []
            }
          })
          .overrideProvider(DwReadService, {
            useValue: {
              read: (url: string, oid: any): Observable<any> =>
                throwError({
                  error: { errorMessage: 'bad request' }
                })
            }
          })
          .overrideProvider(NzModalService, {
            useValue: mockDwModalService
          })
          .compileComponents().then(() => {
            fixture = TestBed.createComponent(ExtraFieldsDocumentOrderDetailComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            const dwModalServiceSpy = de.injector.get(NzModalService) as jasmine.SpyObj<NzModalService>;
            dwModalServiceSpy.error.and.callFake((options) => null); // fake,不跳出視窗
            expect(spyInitDataTriggerByConstructor).toHaveBeenCalled();
            expect(dwModalServiceSpy.error).toHaveBeenCalled();
            // console.log(dwModalServiceSpy.error.calls.mostRecent().args[0]);
            fixture.detectChanges();

            tick();
          });
      }));
      it('返回訊息沒有errorMessage,, 需不處理', fakeAsync(() => {
        const spyInitDataTriggerByConstructor = spyOn(ExtraFieldsDocumentOrderDetailComponent.prototype, 'initData').and.callThrough();
        const mockDwModalService = jasmine.createSpyObj('NzModalService', ['error']);
        TestBed.configureTestingModule(commonConfig)
          .overrideModule(ExtraFieldsDocumentOrderRoutingModule, {
            set: {
              imports: [],
              exports: []
            }
          })
          .overrideProvider(DwReadService, {
            useValue: {
              read: (url: string, oid: any): Observable<any> =>
                throwError({
                  error: { message: 'bad request' } // 不是errorMessage屬性
                })
            }
          })
          .overrideProvider(NzModalService, {
            useValue: mockDwModalService
          })
          .compileComponents().then(() => {
            fixture = TestBed.createComponent(ExtraFieldsDocumentOrderDetailComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            const dwModalServiceSpy = de.injector.get(NzModalService) as jasmine.SpyObj<NzModalService>;
            dwModalServiceSpy.error.and.callFake((options) => null); // fake,不跳出視窗
            expect(spyInitDataTriggerByConstructor).toHaveBeenCalled();
            expect(dwModalServiceSpy.error).not.toHaveBeenCalled();
            fixture.detectChanges();

            tick();
          });
      }));
    });
    describe('頁籤模式下', () => {
      it('相同的orderId,來回切換list頁及modify頁,需觸發initData重取modify頁資料', fakeAsync(() => {
        const dwTabRoutingServiceStub = new DwTabRoutingServiceStub();
        TestBed.configureTestingModule(commonConfig)
          .overrideModule(ExtraFieldsDocumentOrderRoutingModule, {
            set: {
              imports: [],
              exports: []
            }
          })
          .overrideProvider(DwReadService, {
            useValue: commonReadService
          })
          .overrideProvider(DwTabRoutingService, {
            useValue: dwTabRoutingServiceStub
          })

          .compileComponents().then(() => {
            fixture = TestBed.createComponent(ExtraFieldsDocumentOrderDetailComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            dwModalService = de.injector.get(NzModalService);
            const spyInitData = spyOn(component, 'initData').and.callFake(() => { }); // 假執行
            fixture.detectChanges();
            tick(1000);
            expect((component as any).parametersChanged).toEqual(false);
            dwTabRoutingServiceStub.tabRouterChanged$.next({
              'componentType': ExtraFieldsDocumentOrderDetailComponent,
              'currentId': '1665454704062120',
              'previousId': '1665466574402212',
              'currentRouterLink': '/dw-demo2/extra-fields/document/detail',
              'tabChanged': false // 不變換頁籤
            });
            tick();
            fixture.detectChanges();
            expect(spyInitData).toHaveBeenCalled();
          });
      }));
    });
    describe('非頁籤模式下', () => {
      it('需不訂閱dwTabRoutingService.tabRouterChanged', fakeAsync(() => {
        TestBed.configureTestingModule(commonConfig)
          .overrideModule(ExtraFieldsDocumentOrderRoutingModule, {
            set: {
              imports: [],
              exports: []
            }
          })
          .overrideProvider(DwReadService, {
            useValue: commonReadService
          })
          .overrideProvider(DW_USING_TAB, { useValue: false }) // 非頁籤模式

          .compileComponents().then(() => {
            fixture = TestBed.createComponent(ExtraFieldsDocumentOrderDetailComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;

            const spySubscrAdd = spyOn(((component as any).tabInfoSubscription as Subscription), 'add').and.callThrough();
            fixture.detectChanges();
            tick(1000);
            expect(spySubscrAdd).not.toHaveBeenCalled();
          });
      }));
    });
  });
});


export const commonReadService = {
  read: (url: string, oid: any): Observable<any> => of({
    'data': {
      '$custFieldsConfig': {
        'demo_order': [
          {
            'config_id': 1,
            'table_name': 'demo_order',
            'field_id': 'userName',
            'field_label': '用戶帳號',
            'field_type': 'INPUTALPHANUMERIC',
            'field_config': '{"placeholder":"用戶帳號","validator":{"required":null,"minLength":3}}',
            'tenantsid': 28205582758464
          },
          {
            'config_id': 2,
            'table_name': 'demo_order',
            'field_id': 'email',
            'field_label': '電子郵箱',
            'field_type': 'INPUT',
            'field_config': '{"placeholder":"電子郵箱","validator":{"email":null,"minLength":3}}',
            'tenantsid': 28205582758464
          },
          {
            'config_id': 3,
            'table_name': 'demo_order',
            'field_id': 'memo',
            'field_label': '備註',
            'field_type': 'TEXTAREA',
            'field_config': '{"placeholder":"備註"}',
            'tenantsid': 28205582758464
          },
          {
            'config_id': 4,
            'table_name': 'demo_order',
            'field_id': 'postalCode',
            'field_label': '郵遞區號',
            'field_type': 'INPUTNUMBER',
            'field_config': '{"placeholder":"郵遞區號"}',
            'tenantsid': 28205582758464
          },
          {
            'config_id': 5,
            'table_name': 'demo_order',
            'field_id': 'shippingDate',
            'field_label': '出貨日期',
            'field_type': 'DATEPICKER',
            'field_config': '{"placeholder":"出貨日期"}',
            'tenantsid': 28205582758464
          },
          {
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
          'orderid': '1592984190403',
          'status': 'C',
          'orderdate': new Date('2022/06/08 00:00:00'),
          'customerid': 'c02',
          'employeeid': '',
          'totalcount': 33,
          'address': '',
          'gender': '',
          'employeename': '',
          'cust_field': '{"userName":"1414","email":"","memo":null,"postalCode":null,"shippingDate":"2023/03/28 10:36:51","deliveryTime":null}',
          '$info': {
            'child': {
              'demo_orderdetail': {
                'maxSeq': 3,
                'seqName': 'seq'
              }
            }
          },
          'customername': 'Michel Lee',
          'child': {
            'demo_orderdetail': [
              {
                'orderid': '1592984190403',
                'seq': 1,
                'productid': '1',
                'price': 7,
                'quantity': 4,
                'count': 28,
                'deliverystatus': '1'
              },
              {
                'orderid': '1592984190403',
                'seq': 2,
                'productid': '2',
                'price': 2,
                'quantity': 1,
                'count': 2,
                'deliverystatus': '1'
              },
              {
                'orderid': '1592984190403',
                'seq': 3,
                'productid': '3',
                'price': 3,
                'quantity': 1,
                'count': 3,
                'deliverystatus': '1'
              }
            ]
          }
        }
      ],
      'demo_orderdetail': []
    }
  })
};
