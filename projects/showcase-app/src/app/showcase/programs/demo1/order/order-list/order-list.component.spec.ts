/* eslint-disable max-len */
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { NzIconTestModule } from 'ng-zorro-antd/icon/testing';
import { DwActionModule } from '@webdpt/components/action';
import { DwActionTestingModule, MockDwActionAuthorizedDirective } from '@webdpt/components/action/testing';
import { OrderListComponent } from './order-list.component';
import { DwCommonRouterTestingModule } from '@webdpt/framework/sharedTest/common-router-test';
import { OrderRoutingModule } from '../order-routing.module';
import { APP_DATE_FORMAT, APP_TIME_FORMAT } from '@webdpt/framework/config';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OrderStatusModel } from '../model';
import { OrderService } from '../service/order.service';
import { OrderModule } from '../order.module';
import { Demo1RepositoryModule } from '../../repository';
import { By } from '@angular/platform-browser';

describe('OrderListComponent', () => {
  let component: OrderListComponent;
  let fixture: ComponentFixture<OrderListComponent>;
  let de: DebugElement;
  let router: Router;
  let spyNavigate: jasmine.Spy;
  let orderService: OrderService;
  let httpMocker: HttpTestingController;
  let commonInit: () => void;
  const commonConfig = {
    imports: [
      HttpClientTestingModule,
      OrderModule,
      Demo1RepositoryModule,
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
      OrderListComponent,
    ]
  };
  describe('共用條件測試', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule(commonConfig)
        .overrideModule(OrderRoutingModule, { // 單元測試,只專注於當前component,故將原路由設置清空, 改用RouterTestingModule.withRoutes(routes)的配置
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
        // .overrideProvider(OrderService, {
        //   useValue: {
        //   }
        // })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(OrderListComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      router = fixture.debugElement.injector.get(Router);
      spyNavigate = spyOn(router, 'navigate').and.callThrough();
      orderService = fixture.debugElement.injector.get(OrderService);
      httpMocker = TestBed.inject(HttpTestingController);
      commonInit = () => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);

        const getOrderListReq = httpMocker.expectOne('showcase/demo1/getOrderList');
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
      it('畫面呈現資料筆數需與pageSize相同', fakeAsync(() => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);

        const getOrderListReq = httpMocker.expectOne('showcase/demo1/getOrderList');
        getOrderListReq.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料

        fixture.detectChanges();
        tick(1000);
        expect(de.queryAll(By.css('table tbody tr')).length).toEqual(component.search.pageSize);
      }));

      it('search.fields.gender.length>0, genders需設定對應資料', fakeAsync(() => {
        component.search.fields.gender = ['male'];
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);

        const getOrderListReq = httpMocker.expectOne('showcase/demo1/getOrderList');
        getOrderListReq.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
        fixture.detectChanges();
        tick(1000);
        expect(component.genders.filter(g => g.value === 'male')[0].checked).toEqual(true);
      }));
      it('OrderStatusModel狀態碼列舉初始不給值, 需有預設資料', fakeAsync(() => {
        component.searchStatusOptions = [new OrderStatusModel()];
        expect(component.searchStatusOptions[0].label).toEqual('有效');
        expect(component.searchStatusOptions[0].value).toEqual('Y');
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);


        const getOrderListReq = httpMocker.expectOne('showcase/demo1/getOrderList');
        getOrderListReq.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料

        fixture.detectChanges();
        tick(1000);
        expect(component.searchStatusOptions[0].label).toEqual('有效');
      }));
    });

    it('按下過濾性別,ExFilter及ExSearch需被執行', fakeAsync(() => {
      fixture.detectChanges(); // 觸發ngOnInit
      tick(1000);

      const getOrderListReq = httpMocker.expectOne('showcase/demo1/getOrderList');
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

      const getOrderListReq = httpMocker.expectOne('showcase/demo1/getOrderList');
      getOrderListReq.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
      component.modify('ID1234');
      tick();
      expect(spyNavigate.calls.mostRecent().args[0]).toEqual(['../dw-order-modify']);
      expect(spyNavigate.calls.mostRecent().args[1].queryParams).toEqual({ orderId: 'ID1234' });
    }));
    it('當執行onPageIndexChange(換頁), onPageSizeChange執行中時,需不執行searchData', fakeAsync(() => {
      const spySearchData = spyOn(component, 'searchData').and.callThrough();
      fixture.detectChanges(); // 觸發ngOnInit
      tick(1000);

      const getOrderListReq = httpMocker.expectOne('showcase/demo1/getOrderList');
      getOrderListReq.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
      fixture.detectChanges();
      tick(1000);
      expect(spySearchData).toHaveBeenCalledTimes(1);
      component.onPageSizeChange(); // this.pageSizeChanging = true;
      component.onPageIndexChange();
      fixture.detectChanges();
      tick(1000);
      const getOrderListReq2 = httpMocker.expectOne('showcase/demo1/getOrderList');
      getOrderListReq2.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
      expect(spySearchData).toHaveBeenCalledTimes(2);
      expect(spySearchData.calls.mostRecent().args[0]).toEqual(true);
    }));
    describe('查詢條件', () => {

      it('filterGender執行,需送出性別條件', fakeAsync(() => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);

        const getOrderListReq = httpMocker.expectOne('showcase/demo1/getOrderList');
        getOrderListReq.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
        fixture.detectChanges();
        tick(1000);
        component.genders[0].checked = true;
        fixture.detectChanges();
        tick(1000);
        component.filterGender(true);
        const getOrderListReq2 = httpMocker.expectOne('showcase/demo1/getOrderList');
        getOrderListReq2.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
        fixture.detectChanges();
        tick(1000);
        expect(component.search.fields.gender[0]).toEqual('male');
      }));
      it('resetFilterGender執行,需清除性別條件', fakeAsync(() => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);


        const getOrderListReq = httpMocker.expectOne('showcase/demo1/getOrderList');
        getOrderListReq.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
        fixture.detectChanges();
        tick(1000);
        component.genders[0].checked = true;
        fixture.detectChanges();
        tick(1000);
        component.resetFilterGender();
        const getOrderListReq2 = httpMocker.expectOne('showcase/demo1/getOrderList');
        getOrderListReq2.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
        fixture.detectChanges();
        tick(1000);
        expect(component.search.fields.gender.length).toEqual(0);
      }));
      it('resetForm需初始查詢條件', fakeAsync(() => {
        const spyGetOrderList = spyOn(orderService, 'getOrderList').and.callThrough();
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);


        const getOrderListReq = httpMocker.expectOne('showcase/demo1/getOrderList');
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

        const getOrderListReq2 = httpMocker.expectOne('showcase/demo1/getOrderList');
        getOrderListReq2.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
        fixture.detectChanges();
        tick(1000);
        expect(spyGetOrderList.calls.mostRecent().args[2].gender).toEqual(['female']);
        component.resetForm();
        component.searchData(); // resetForm後查詢

        const getOrderListReq3 = httpMocker.expectOne('showcase/demo1/getOrderList');
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


        const getOrderListReq = httpMocker.expectOne('showcase/demo1/getOrderList');
        getOrderListReq.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
        fixture.detectChanges();
        tick(1000);
        component.search.pageSize = 3;
        component.onPageSizeChange();
        fixture.detectChanges();
        tick(1000);
        const getOrderListReq2 = httpMocker.expectOne('showcase/demo1/getOrderList');
        getOrderListReq2.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
        expect(spyGetOrderList.calls.mostRecent().args[1]).withContext('入參pageSize').toEqual(3);
      }));
      it('onPageIndexChange當前頁碼改變, 需重新查詢資料', fakeAsync(() => {
        const spyGetOrderList = spyOn(orderService, 'getOrderList').and.callThrough();
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);


        const getOrderListReq = httpMocker.expectOne('showcase/demo1/getOrderList');
        getOrderListReq.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
        fixture.detectChanges();
        tick(1000);
        component.search.pageIndex = 3;
        component.onPageIndexChange();
        fixture.detectChanges();
        tick(1000);
        const getOrderListReq2 = httpMocker.expectOne('showcase/demo1/getOrderList');
        getOrderListReq2.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
        expect(spyGetOrderList.calls.mostRecent().args[0]).withContext('入參pageIndex').toEqual(3);
      }));
      it('執行sortBy, 需重新查詢資料', fakeAsync(() => {
        const spyGetOrderList = spyOn(orderService, 'getOrderList').and.callThrough();
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);


        const getOrderListReq = httpMocker.expectOne('showcase/demo1/getOrderList');
        getOrderListReq.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
        fixture.detectChanges();
        tick(1000);
        component.sortBy('total', 'desc');
        fixture.detectChanges();
        tick(1000);
        const getOrderListReq2 = httpMocker.expectOne('showcase/demo1/getOrderList');
        getOrderListReq2.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
        expect(spyGetOrderList.calls.mostRecent().args[3]).withContext('sort排序').toEqual([{ sortName: 'total', sortExpression: 'desc' }]);
      }));
      it('執行sortBy, 入參沒有sortExpression,重新查詢資料需不帶入該排序', fakeAsync(() => {
        const spyGetOrderList = spyOn(orderService, 'getOrderList').and.callThrough();
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);


        const getOrderListReq = httpMocker.expectOne('showcase/demo1/getOrderList');
        getOrderListReq.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
        fixture.detectChanges();
        tick(1000);
        component.sortBy('total', null);
        fixture.detectChanges();
        tick(1000);
        const getOrderListReq2 = httpMocker.expectOne('showcase/demo1/getOrderList');
        getOrderListReq2.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
        expect(spyGetOrderList.calls.mostRecent().args[3]).withContext('sort排序').toEqual([]);
      }));
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

