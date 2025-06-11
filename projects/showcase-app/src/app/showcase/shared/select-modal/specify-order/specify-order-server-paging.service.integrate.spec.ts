/* eslint-disable max-len */
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Component, DebugElement, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DwSelectModalModule } from '@webdpt/components/modals/select';
import { DwDapHttpClient } from '@webdpt/framework/dap';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { DwMessageServiceTest } from '@webdpt/framework/sharedTest/common-test-service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { SpecifyOrderServerPagingService } from './specify-order-server-paging.service';

describe('SpecifyOrderServerPagingService', () => {
  let srv: SpecifyOrderServerPagingService;
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
        SpecifyOrderServerPagingService
      ]
    }).compileComponents();;


  }));
  beforeEach(() => {
    // 需要有一個fixture
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    srv = TestBed.inject(SpecifyOrderServerPagingService);
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
      expect(result).toEqual([{ customerid: 'c02', orderdate: '2020/06/24 00:00:00', orderid: '1592984190403' }]);
    });
    fixture.detectChanges();
    tick(1000);
    const getOrderListReq = httpMocker.expectOne('restful/service/DEMO_DAP_CURRENT/DemoOrder/List?queryInfo=%7B%22pageSize%22:10,%22pageNumber%22:1,%22orderfields%22:%5B%5D,%22condition%22:%7B%22joinOperator%22:%22AND%22,%22items%22:%5B%7B%22joinOperator%22:%22AND%22,%22items%22:%5B%7B%22name%22:%22customerid%22,%22operator%22:%22LIKE%22,%22value%22:%22c0%25%22%7D%5D%7D%5D%7D%7D');
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
  }));
  it('需可設定自定義格式', fakeAsync(() => {
    fixture.detectChanges();
    tick(1000);
    const _config = {
      tableTagColor: 'purple', // Tag標籤顏色.
    };
    srv.open([], _config, component.tagTemplate, component.selectedCountTemplate).subscribe(result => {
      expect(result).toEqual([{ customerid: 'c02', orderdate: '2020/06/24 00:00:00', orderid: '1592984190403' }]);
    });
    fixture.detectChanges();
    tick(1000);
    const getOrderListReq = httpMocker.expectOne('restful/service/DEMO_DAP_CURRENT/DemoOrder/List?queryInfo=%7B%22pageSize%22:10,%22pageNumber%22:1,%22orderfields%22:%5B%5D,%22condition%22:%7B%22joinOperator%22:%22AND%22,%22items%22:%5B%7B%22joinOperator%22:%22AND%22,%22items%22:%5B%7B%22name%22:%22customerid%22,%22operator%22:%22LIKE%22,%22value%22:%22c0%25%22%7D%5D%7D%5D%7D%7D');
    getOrderListReq.flush(JSON.parse(JSON.stringify(response))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
    fixture.detectChanges();
    tick(1000);
    const checkboxs = document.querySelectorAll('input[type="checkbox"]');
    // 勾選
    (checkboxs[1] as HTMLInputElement).click();
    fixture.detectChanges();
    tick(1000);
    expect(document.querySelector('.dw-f-pop-selected-count').textContent).toEqual('您已選中筆數: 1 筆(自定義樣版)');
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
  <!-- 後端分頁(多選) - 設定回傳欄位 - 自定義 Tag 格式(ng-template) -->
    <ng-template #tagTemplate let-rowInfo="$implicit" let-config="config">
      ({{rowInfo[config.idField]}}){{rowInfo[config.nameField]}}-{{rowInfo['customerid']}}
    </ng-template>
  <!-- (多選) -  自定義 選中筆數 格式(ng-template) -->
    <ng-template #selectedCountTemplate let-count="$implicit" let-config="config">
      <span style="color:'#1890FF'">您已選中筆數: {{count}} 筆(自定義樣版)</span>
    </ng-template>
    <div>..........</div>
  `
})
class TestComponent {
  @ViewChild('tagTemplate', { static: true }) tagTemplate: TemplateRef<any>; // 自定義 Tag 格式(ng-template)
  @ViewChild('selectedCountTemplate') selectedCountTemplate: TemplateRef<any>; // 自定義 選中筆數 格式(ng-template)
  // constructor(public dwModalService: DwModalService) {}
}
