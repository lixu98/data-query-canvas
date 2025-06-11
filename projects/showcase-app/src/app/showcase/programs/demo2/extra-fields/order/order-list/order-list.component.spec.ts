/* eslint-disable max-len */
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { NzIconTestModule } from 'ng-zorro-antd/icon/testing';
import { DwActionModule } from '@webdpt/components/action';
import { By } from '@angular/platform-browser';
import { DwActionTestingModule, MockDwActionAuthorizedDirective } from '@webdpt/components/action/testing';
import { ExtraFieldsOrderListComponent } from './order-list.component';
import { ExtraFieldsOrderService } from '../service/order.service';
import { ExtraFieldsOrderModule } from '../order.module';
import { DwCommonRouterTestingModule } from '@webdpt/framework/sharedTest/common-router-test';
import { ExtraFieldsOrderRoutingModule } from '../order-routing.module';
import { APP_DATE_FORMAT, APP_TIME_FORMAT } from '@webdpt/framework/config';
import { ExtraFieldsModule } from '../../extra-fields.module';
import { ExtraFieldsRoutingModule } from '../../extra-fields-routing.module';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ExtraFieldsOrderStatusModel } from '../model';
describe('ExtraFieldsOrderListComponent', () => {
  let component: ExtraFieldsOrderListComponent;
  let fixture: ComponentFixture<ExtraFieldsOrderListComponent>;
  let de: DebugElement;
  let router: Router;
  let spyNavigate: jasmine.Spy;
  let orderService: ExtraFieldsOrderService;
  let httpMocker: HttpTestingController;
  let commonInit: () => void;
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
      { provide: APP_TIME_FORMAT, useValue: 'hh:mm:ss' }
    ],
    declarations: [
      ExtraFieldsOrderListComponent,
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
        // .overrideProvider(ExtraFieldsOrderService, {
        //   useValue: {
        //   }
        // })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(ExtraFieldsOrderListComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      router = fixture.debugElement.injector.get(Router);
      spyNavigate = spyOn(router, 'navigate').and.callThrough();
      orderService = fixture.debugElement.injector.get(ExtraFieldsOrderService);
      httpMocker = TestBed.inject(HttpTestingController);
      commonInit = () => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const getOrderConfigReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderConfig');
        getOrderConfigReq.flush(getOrderConfigResponse);
        const getOrderListReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderList');
        getOrderListReq.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
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
      it('getOrderConfig沒有字段定義,列表資料需不可呈現自定義字段欄位', fakeAsync(() => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const getOrderConfigReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderConfig');
        getOrderConfigReq.flush({ config: null });
        const getOrderListReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderList');
        getOrderListReq.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料

        fixture.detectChanges();
        tick(1000);
        expect(de.queryAll(By.css('table thead tr th')).length).toEqual(4);
      }));
      it('getOrderConfig有字段定義,列表資料需呈現自定義字段欄位', fakeAsync(() => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const getOrderConfigReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderConfig');
        getOrderConfigReq.flush(getOrderConfigResponse);
        const getOrderListReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderList');
        getOrderListReq.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料

        fixture.detectChanges();
        tick(1000);
        expect(de.queryAll(By.css('table thead tr th')).length).toEqual(10);
      }));
      it('search.fields.gender.length>0, genders需設定對應資料', fakeAsync(() => {
        component.search.fields.gender = ['male'];
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const getOrderConfigReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderConfig');
        getOrderConfigReq.flush(getOrderConfigResponse);
        const getOrderListReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderList');
        getOrderListReq.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
        fixture.detectChanges();
        tick(1000);
        expect(component.genders.filter(g => g.value === 'male')[0].checked).toEqual(true);
      }));
      it('ExtraFieldsOrderStatusModel狀態碼列舉初始不給值, 需有預設資料', fakeAsync(() => {
        component.searchStatusOptions = [new ExtraFieldsOrderStatusModel()] ;
        expect(component.searchStatusOptions[0].label).toEqual('有效');
        expect(component.searchStatusOptions[0].value).toEqual('Y');
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const getOrderConfigReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderConfig');
        getOrderConfigReq.flush(getOrderConfigResponse);
        const getOrderListReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderList');
        getOrderListReq.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料

        fixture.detectChanges();
        tick(1000);
        expect(component.searchStatusOptions[0].label).toEqual('有效');
      }));
    });

    it('按下過濾性別,ExFilter及ExSearch需被執行', fakeAsync(() => {
      fixture.detectChanges(); // 觸發ngOnInit
      tick(1000);
      const getOrderConfigReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderConfig');
      getOrderConfigReq.flush(getOrderConfigResponse);
      const getOrderListReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderList');
      getOrderListReq.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料

      const spyExFilter = spyOn(component, 'ExFilter').and.callThrough();
      const spyExSearch = spyOn(component, 'ExSearch').and.callThrough();
      fixture.detectChanges();
      tick(1000);
      expect(component.dataSet.length).toEqual(10);
      component.ExFilter(['male']);
      fixture.detectChanges();
      tick(1000);
      expect(spyExFilter).toHaveBeenCalled();
      expect(spyExSearch).toHaveBeenCalled();
      expect(component.dataSet.length).toEqual(3);
    }));
    it('執行modify需前往編輯頁路由', fakeAsync(() => {
      fixture.detectChanges(); // 觸發ngOnInit
      tick(1000);
      const getOrderConfigReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderConfig');
      getOrderConfigReq.flush(getOrderConfigResponse);
      const getOrderListReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderList');
      getOrderListReq.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
      component.modify('ID1234');
      tick();
      expect(spyNavigate.calls.mostRecent().args[0]).toEqual(['../modify']);
      expect(spyNavigate.calls.mostRecent().args[1].queryParams).toEqual({ orderId: 'ID1234' });
    }));
    it('當執行onPageIndexChange(換頁), onPageSizeChange執行中時,需不執行searchData', fakeAsync(() => {
      const spySearchData = spyOn(component, 'searchData').and.callThrough();
      fixture.detectChanges(); // 觸發ngOnInit
      tick(1000);
      const getOrderConfigReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderConfig');
      getOrderConfigReq.flush(getOrderConfigResponse);
      const getOrderListReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderList');
      getOrderListReq.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
      fixture.detectChanges();
      tick(1000);
      expect(spySearchData).toHaveBeenCalledTimes(1);
      component.onPageSizeChange(); // this.pageSizeChanging = true;
      component.onPageIndexChange();
      fixture.detectChanges();
      tick(1000);
      const getOrderListReq2 = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderList');
      getOrderListReq2.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
      expect(spySearchData).toHaveBeenCalledTimes(2);
      expect(spySearchData.calls.mostRecent().args[0]).toEqual(true);
    }));
    describe('查詢條件', () => {

      it('filterGender執行,需送出性別條件', fakeAsync(() => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const getOrderConfigReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderConfig');
        getOrderConfigReq.flush(getOrderConfigResponse);
        const getOrderListReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderList');
        getOrderListReq.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
        fixture.detectChanges();
        tick(1000);
        component.genders[0].checked = true;
        fixture.detectChanges();
        tick(1000);
        component.filterGender(true);
        const getOrderListReq2 = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderList');
        getOrderListReq2.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
        fixture.detectChanges();
        tick(1000);
        expect(component.search.fields.gender[0]).toEqual('male');
      }));
      it('resetFilterGender執行,需清除性別條件', fakeAsync(() => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const getOrderConfigReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderConfig');
        getOrderConfigReq.flush(getOrderConfigResponse);
        const getOrderListReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderList');
        getOrderListReq.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
        fixture.detectChanges();
        tick(1000);
        component.genders[0].checked = true;
        fixture.detectChanges();
        tick(1000);
        component.resetFilterGender();
        const getOrderListReq2 = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderList');
        getOrderListReq2.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
        fixture.detectChanges();
        tick(1000);
        expect(component.search.fields.gender.length).toEqual(0);
      }));
      it('resetForm需初始查詢條件', fakeAsync(() => {
        const spyGetOrderList = spyOn(orderService, 'getOrderList').and.callThrough();
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const getOrderConfigReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderConfig');
        getOrderConfigReq.flush(getOrderConfigResponse);
        const getOrderListReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderList');
        getOrderListReq.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
        fixture.detectChanges();
        tick(1000);

        const advanceQueryTag = de.queryAll(By.css('form a'))[0].nativeElement;
        advanceQueryTag.click();
        fixture.detectChanges();
        tick(1000);
        const genderCtr = component.searchForm.get('gender');
        genderCtr.setValue(['female']);
        fixture.detectChanges();
        tick(1000);
        component.searchData(); // 第一次查詢

        const getOrderListReq2 = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderList');
        getOrderListReq2.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
        fixture.detectChanges();
        tick(1000);
        expect(spyGetOrderList.calls.mostRecent().args[2].gender).toEqual(['female']);
        component.resetForm();
        component.searchData(); // resetForm後查詢

        const getOrderListReq3 = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderList');
        getOrderListReq3.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(spyGetOrderList.calls.mostRecent().args[2].gender).toEqual([]);
      }));
      it('onPageSizeChange每頁筆數改變, 需重新查詢資料', fakeAsync(() => {
        const spyGetOrderList = spyOn(orderService, 'getOrderList').and.callThrough();
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const getOrderConfigReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderConfig');
        getOrderConfigReq.flush(getOrderConfigResponse);
        const getOrderListReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderList');
        getOrderListReq.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
        fixture.detectChanges();
        tick(1000);
        component.search.pageSize = 3;
        component.onPageSizeChange();
        fixture.detectChanges();
        tick(1000);
        const getOrderListReq2 = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderList');
        getOrderListReq2.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
        expect(spyGetOrderList.calls.mostRecent().args[1]).withContext('入參pageSize').toEqual(3);
      }));
      it('onPageIndexChange當前頁碼改變, 需重新查詢資料', fakeAsync(() => {
        const spyGetOrderList = spyOn(orderService, 'getOrderList').and.callThrough();
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const getOrderConfigReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderConfig');
        getOrderConfigReq.flush(getOrderConfigResponse);
        const getOrderListReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderList');
        getOrderListReq.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
        fixture.detectChanges();
        tick(1000);
        component.search.pageIndex = 3;
        component.onPageIndexChange();
        fixture.detectChanges();
        tick(1000);
        const getOrderListReq2 = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderList');
        getOrderListReq2.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
        expect(spyGetOrderList.calls.mostRecent().args[0]).withContext('入參pageIndex').toEqual(3);
      }));
      it('執行sortBy, 需重新查詢資料', fakeAsync(() => {
        const spyGetOrderList = spyOn(orderService, 'getOrderList').and.callThrough();
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const getOrderConfigReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderConfig');
        getOrderConfigReq.flush(getOrderConfigResponse);
        const getOrderListReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderList');
        getOrderListReq.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
        fixture.detectChanges();
        tick(1000);
        component.sortBy('total', 'desc');
        fixture.detectChanges();
        tick(1000);
        const getOrderListReq2 = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderList');
        getOrderListReq2.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
        expect(spyGetOrderList.calls.mostRecent().args[3]).withContext('sort排序').toEqual([{ sortName: 'total', sortExpression: 'desc' }]);
      }));
      it('執行sortBy, 入參沒有sortExpression,重新查詢資料需不帶入該排序', fakeAsync(() => {
        const spyGetOrderList = spyOn(orderService, 'getOrderList').and.callThrough();
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const getOrderConfigReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderConfig');
        getOrderConfigReq.flush(getOrderConfigResponse);
        const getOrderListReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderList');
        getOrderListReq.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
        fixture.detectChanges();
        tick(1000);
        component.sortBy('total', null);
        fixture.detectChanges();
        tick(1000);
        const getOrderListReq2 = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderList');
        getOrderListReq2.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
        expect(spyGetOrderList.calls.mostRecent().args[3]).withContext('sort排序').toEqual([]);
      }));
    });
  });
  describe('個別條件測試', () => {
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
        .overrideComponent(ExtraFieldsOrderListComponent, {
          set: {
            template: `
            <form dw-form [formGroup]="searchForm">
              <dw-extra-fields
              cols="3"
              labelSpan="8"
              inputSpan="16"
              [group]="searchForm"
              [config]="extraFieldConfig"
              isValidate="true"
              ></dw-extra-fields>
            </form>
            `
          }
        })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(ExtraFieldsOrderListComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      router = fixture.debugElement.injector.get(Router);
      spyNavigate = spyOn(router, 'navigate').and.callThrough();
      orderService = fixture.debugElement.injector.get(ExtraFieldsOrderService);
      httpMocker = TestBed.inject(HttpTestingController);
      commonInit = () => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const getOrderConfigReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderConfig');
        getOrderConfigReq.flush(getOrderConfigResponse);
        const getOrderListReq = httpMocker.expectOne('showcase/demo2/extra-fields-order/getOrderList');
        getOrderListReq.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
        fixture.detectChanges();
        tick(1000);
      };
      // fixture.detectChanges(); // 觸發ngOnInit
    });
    afterEach(() => {
      // After every test, assert that there are no more pending requests.
      httpMocker.verify();
    });

    describe('自定驗證器', () => {
      it('userName需為必填', fakeAsync(() => {
        commonInit();
        const userNameInput = (de.queryAll(By.css('dw-extra-fields input'))[0]).nativeElement;
        userNameInput.value ='';
        userNameInput.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        tick(1000);
        expect(component.searchForm.controls['cust_field'].get('userName').errors).toEqual({required: true});
      }));
      describe('customValidator自定驗證器(同步)', () => {
        it('userName開頭需不為abc', fakeAsync(() => {
          commonInit();
          const userNameInput = (de.queryAll(By.css('dw-extra-fields input'))[0]).nativeElement;
          userNameInput.value = 'efg';
          userNameInput.dispatchEvent(new Event('input'));
          fixture.detectChanges();
          tick(1000);
          expect(component.searchForm.controls['cust_field'].get('userName').errors).toEqual(null);
        }));
        it('userName開頭需不為abc', fakeAsync(() => {
          commonInit();
          const userNameInput = (de.queryAll(By.css('dw-extra-fields input'))[0]).nativeElement;
          userNameInput.value = 'abc';
          userNameInput.dispatchEvent(new Event('input'));
          fixture.detectChanges();
          tick(1000);
          expect(component.searchForm.controls['cust_field'].get('userName').errors).toEqual({customValidator: true});
        }));
      });
      describe('customAsyncValidator自定驗證器(非同步)', () => {
        it('userName開頭需不為bcde', fakeAsync(() => {
          commonInit();
          const userNameInput = (de.queryAll(By.css('dw-extra-fields input'))[0]).nativeElement;
          userNameInput.value ='bcde';
          userNameInput.dispatchEvent(new Event('input'));
          fixture.detectChanges();
          tick(1000);
          expect(component.searchForm.controls['cust_field'].get('userName').errors).toEqual({customAsyncValidator: true});
        }));
      });
    });
  });
});

export const getOrderListResponse = {
  'currentPage': 1,
  'rowCount': 46,
  'pageCount': 5,
  'datas': [
    {
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
      'cust_field': '{\"userName\":\"123566\",\"email\":\"\",\"memo\":\"12345\",\"postalCode\":\"\",\"shippingDate\":\"2021/02/28 15:45:44\",\"deliveryTime\":[]}',
      'genderDesc': '女',
      'statusDesc': '有效'
    },
    {
      'orderId': 'No_000002',
      'status': 'Y',
      'orderDate': '2017/12/23',
      'customerId': 'C01',
      'customerName': '櫃櫃傢俱股份有限公司',
      'orderAddr': '台中市大里區中興路一段1號',
      'total': 334000,
      'salesmanId': '2',
      'salesmanName': '周晓均',
      'gender': 'female',
      'cust_field': null,
      'genderDesc': '女',
      'statusDesc': '有效'
    },
    {
      'orderId': 'No_000003',
      'status': 'Y',
      'orderDate': '2017/12/24',
      'customerId': 'C02',
      'customerName': '國際服飾集團',
      'orderAddr': '桃園市八德區建國路626號',
      'total': 16000,
      'salesmanId': '3',
      'salesmanName': '钱云妤',
      'gender': 'female',
      'cust_field': null,
      'genderDesc': '女',
      'statusDesc': '有效'
    },
    {
      'orderId': 'No_000004',
      'status': 'Y',
      'orderDate': '2017/12/25',
      'customerId': 'C01',
      'customerName': '櫃櫃傢俱股份有限公司',
      'orderAddr': '台中市大里區中興路一段1號',
      'total': 16000,
      'salesmanId': '4',
      'salesmanName': '赵品均',
      'gender': 'female',
      'cust_field': null,
      'genderDesc': '女',
      'statusDesc': '有效'
    },
    {
      'orderId': 'No_000005',
      'status': 'Y',
      'orderDate': '2017/12/25',
      'customerId': 'C03',
      'customerName': '急速貨運有限公司',
      'orderAddr': '台北市內湖區民政里瑞光路七段8巷168號',
      'total': 130000,
      'salesmanId': '5',
      'salesmanName': '钱品冲',
      'gender': 'male',
      'cust_field': null,
      'genderDesc': '男',
      'statusDesc': '有效'
    },
    {
      'orderId': 'No_000006',
      'status': 'N',
      'orderDate': '2017/12/25',
      'customerId': 'C02',
      'customerName': '國際服飾集團',
      'orderAddr': '桃園市八德區建國路626號',
      'total': 10000,
      'salesmanId': '6',
      'salesmanName': '钱晓冲',
      'gender': 'male',
      'cust_field': null,
      'genderDesc': '男',
      'statusDesc': '無效'
    },
    {
      'orderId': 'No_000007',
      'status': 'Y',
      'orderDate': '2017/12/26',
      'customerId': 'C02',
      'customerName': '國際服飾集團',
      'orderAddr': '桃園市八德區建國路626號',
      'total': 10000,
      'salesmanId': '7',
      'salesmanName': '周品均',
      'gender': 'male',
      'cust_field': null,
      'genderDesc': '男',
      'statusDesc': '有效'
    },
    {
      'orderId': 'No_000008',
      'status': 'N',
      'orderDate': '2017/12/27',
      'customerId': 'C02',
      'customerName': '國際服飾集團',
      'orderAddr': '桃園市八德區建國路626號',
      'total': 10000,
      'salesmanId': '8',
      'salesmanName': '周云妤',
      'gender': 'female',
      'cust_field': null,
      'genderDesc': '女',
      'statusDesc': '無效'
    },
    {
      'orderId': 'No_000009',
      'status': 'N',
      'orderDate': '2017/12/28',
      'customerId': 'C02',
      'customerName': '國際服飾集團',
      'orderAddr': '桃園市八德區建國路626號',
      'total': 22000,
      'salesmanId': '9',
      'salesmanName': '钱品柔',
      'gender': 'female',
      'cust_field': null,
      'genderDesc': '女',
      'statusDesc': '無效'
    },
    {
      'orderId': 'No_000010',
      'status': 'N',
      'orderDate': '2017/12/29',
      'customerId': 'C03',
      'customerName': '急速貨運有限公司',
      'orderAddr': '台北市內湖區民政里瑞光路七段8巷168號',
      'total': 22000,
      'salesmanId': '10',
      'salesmanName': '周晓妤',
      'gender': 'female',
      'cust_field': null,
      'genderDesc': '女',
      'statusDesc': '無效'
    }
  ]
};
export const getOrderConfigResponse = {
  'config': [
    {
      'field_id': 'userName',
      'config_id': 13,
      'field_config': '{\"placeholder\":\"用戶帳號\",\"validator\":{\"required\":null,\"customValidator\":{},\"customAsyncValidator\":{},\"minLength\":3}}',
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
