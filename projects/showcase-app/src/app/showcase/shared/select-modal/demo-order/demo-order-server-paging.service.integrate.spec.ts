/* eslint-disable max-len */
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApiServerPagingService, DwSelectModalModule } from '@webdpt/components/modals/select';
import { DwDapHttpClient } from '@webdpt/framework/dap';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { DwMessageServiceTest } from '@webdpt/framework/sharedTest/common-test-service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { DemoOrderServerPagingService } from './demo-order-server-paging.service';

describe('DemoOrderServerPagingService', () => {
  let srv: DemoOrderServerPagingService;
  let httpMocker: HttpTestingController;
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let de: DebugElement;
  let dataSource: any;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        DwSelectModalModule,
        NzModalModule,
        BrowserAnimationsModule,
        TranslateTestingModule,
      ],
      providers: [
        {
          provide: DwDapHttpClient, useClass: HttpClient
        },
        { provide: NzMessageService, useValue: DwMessageServiceTest},
        // {
        //   provide: DwSelectModalService, useValue: {
        //     open: (config: any, selected: Array<any>,
        //       tagTemplate?: TemplateRef<any>, selectedCountTemplate?: TemplateRef<any>): Observable<any> => of([{orderId: 'mockOrderId'}])
        //   }
        // },
        DemoOrderServerPagingService
      ]
    }).compileComponents();;


  }));
  beforeEach(() => {
    // 需要有一個fixture
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    srv = TestBed.inject(DemoOrderServerPagingService);
    httpMocker = TestBed.inject(HttpTestingController);
    // fixture.detectChanges();
  });
  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpMocker.verify();
  });
  it('should be created', () => {
    expect(srv).toBeTruthy();
  });
  it('open開窗後需可返回值', fakeAsync(() => {
    fixture.detectChanges();
    tick(1000);
    srv.open([]).subscribe(result => {
      expect(result).toEqual(['1592984190403']);
    });
    fixture.detectChanges();
    tick(1000);
    const getOrderListReq = httpMocker.expectOne('restful/service/DEMO_DAP_CURRENT/DemoOrder/List?queryInfo=%7B%22pageSize%22:50,%22pageNumber%22:1,%22orderfields%22:%5B%5D,%22condition%22:%7B%22joinOperator%22:%22AND%22,%22items%22:%5B%7B%22joinOperator%22:%22AND%22,%22items%22:%5B%7B%22joinOperator%22:%22OR%22,%22items%22:%5B%7B%22name%22:%22customerid%22,%22operator%22:%22EQUAL%22,%22value%22:%22c02%22%7D,%7B%22name%22:%22customerid%22,%22operator%22:%22EQUAL%22,%22value%22:%22c03%22%7D%5D%7D%5D%7D%5D%7D%7D');
    getOrderListReq.flush(JSON.parse(JSON.stringify(response))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
    fixture.detectChanges();
    tick(1000);
    const checkboxs = document.querySelectorAll('input[type="checkbox"]');
    // 勾選
    (checkboxs[1] as HTMLInputElement).click();
    fixture.detectChanges();
    tick(1000);
    (document.querySelector('button[ng-reflect-nz-type="primary"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    tick(1000);
    expect(getOrderListReq.request.params.get('queryInfo')).withContext('查詢的字段').toContain('customerid');
    expect(getOrderListReq.request.params.get('queryInfo')).withContext('查詢的值').toContain('c02');
    expect(getOrderListReq.request.params.get('queryInfo')).withContext('查詢的值').toContain('c03');
  }));
  it('輸入框需可過濾資料', fakeAsync(()=>{
    fixture.detectChanges();
    tick(1000);
    dataSource = srv.config.dataSource  as ApiServerPagingService;
    const spyGetDataList = spyOn(dataSource, 'getDataList').and.callThrough();
    srv.open([]).subscribe(result => {
      expect(result).toEqual(['1592984190403']);
    });
    fixture.detectChanges();
    tick(1000);
    const getOrderListReq = httpMocker.expectOne('restful/service/DEMO_DAP_CURRENT/DemoOrder/List?queryInfo=%7B%22pageSize%22:50,%22pageNumber%22:1,%22orderfields%22:%5B%5D,%22condition%22:%7B%22joinOperator%22:%22AND%22,%22items%22:%5B%7B%22joinOperator%22:%22AND%22,%22items%22:%5B%7B%22joinOperator%22:%22OR%22,%22items%22:%5B%7B%22name%22:%22customerid%22,%22operator%22:%22EQUAL%22,%22value%22:%22c02%22%7D,%7B%22name%22:%22customerid%22,%22operator%22:%22EQUAL%22,%22value%22:%22c03%22%7D%5D%7D%5D%7D%5D%7D%7D');
    getOrderListReq.flush(JSON.parse(JSON.stringify(response))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
    fixture.detectChanges();
    tick(1000);
    const searchInput: HTMLInputElement = document.querySelector('nz-input-group input');

    searchInput.value = '1592984190403';
    searchInput.dispatchEvent(new Event('input'));
    searchInput.dispatchEvent(new Event('keyup'));
    fixture.detectChanges();
    tick(1000);
    const getOrderListReq2 = httpMocker.expectOne('restful/service/DEMO_DAP_CURRENT/DemoOrder/List?queryInfo=%7B%22pageSize%22:50,%22pageNumber%22:1,%22orderfields%22:%5B%5D,%22condition%22:%7B%22joinOperator%22:%22AND%22,%22items%22:%5B%7B%22joinOperator%22:%22AND%22,%22items%22:%5B%7B%22joinOperator%22:%22OR%22,%22items%22:%5B%7B%22name%22:%22customerid%22,%22operator%22:%22EQUAL%22,%22value%22:%22c02%22%7D,%7B%22name%22:%22customerid%22,%22operator%22:%22EQUAL%22,%22value%22:%22c03%22%7D%5D%7D,%7B%22joinOperator%22:%22OR%22,%22items%22:%5B%7B%22name%22:%22orderid%22,%22operator%22:%22LIKE%22,%22value%22:%22%251592984190403%25%22%7D,%7B%22name%22:%22orderdate%22,%22operator%22:%22LIKE%22,%22value%22:%22%251592984190403%25%22%7D,%7B%22name%22:%22employeeid%22,%22operator%22:%22LIKE%22,%22value%22:%22%251592984190403%25%22%7D,%7B%22name%22:%22customerid%22,%22operator%22:%22LIKE%22,%22value%22:%22%251592984190403%25%22%7D%5D%7D%5D%7D%5D%7D%7D');
    getOrderListReq2.flush(JSON.parse(JSON.stringify(response))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
    fixture.detectChanges();
    tick(1000);
    expect(getOrderListReq2.request.params.get('queryInfo')).withContext('過濾的值').toContain('%1592984190403%');
    expect(getOrderListReq2.request.params.get('queryInfo')).withContext('過濾的字段').toContain('orderid');
    expect(getOrderListReq2.request.params.get('queryInfo')).withContext('過濾的字段').toContain('orderdate');
    expect(getOrderListReq2.request.params.get('queryInfo')).withContext('過濾的字段').toContain('employeeid');
    expect(getOrderListReq2.request.params.get('queryInfo')).withContext('過濾的字段').toContain('customerid');
    expect(spyGetDataList).toHaveBeenCalledTimes(2);
  }));
});

export const response = {
  'rowCount': 46,
  'pageCount': 5,
  'pageSize': 3,
  'currentPage': 1,
  'message': null,
  'success': true,
  'data': {
    'demo_order': [{
      'address': '',
      'customerid': 'c02',
      'employeeid': '',
      'employeename': '',
      'gender': '',
      'orderdate': '2020/06/24 00:00:00',
      'orderid': '1592984190403',
      'status': 'C',
      'totalcount': 33.00
    }, {
      'address': null,
      'customerid': 'c02',
      'employeeid': null,
      'employeename': null,
      'gender': null,
      'orderdate': '2020/07/21 00:00:00',
      'orderid': '1595318465798',
      'status': 'C',
      'totalcount': 0.00
    }, {
      'address': null,
      'customerid': 'c03',
      'employeeid': null,
      'employeename': null,
      'gender': null,
      'orderdate': '2020/08/05 00:00:00',
      'orderid': '1596595664554',
      'status': 'D',
      'totalcount': 160.00
    }
    ]
  }
};

@Component({
  template: `
    <div>..........</div>
  `
})
class TestComponent {
  // constructor(public dwModalService: DwModalService) {}
}
