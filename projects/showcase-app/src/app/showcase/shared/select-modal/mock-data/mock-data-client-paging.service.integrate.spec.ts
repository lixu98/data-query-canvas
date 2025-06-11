/* eslint-disable max-len */
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DwSelectModalModule } from '@webdpt/components/modals/select';
import { DwDapHttpClient } from '@webdpt/framework/dap';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { DwMessageServiceTest } from '@webdpt/framework/sharedTest/common-test-service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { InputListwinCustomPipe } from '../../../programs/demo2/input-listwin/input-listwin-custom.pipe';
import { MockDataClientPagingService } from './mock-data-client-paging.service';

describe('MockDataClientPagingService', () => {
  let srv: MockDataClientPagingService;
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
        MockDataClientPagingService,
        InputListwinCustomPipe
      ]
    }).compileComponents();;


  }));
  beforeEach(() => {
    // 需要有一個fixture
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    srv = TestBed.inject(MockDataClientPagingService);
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
      expect(result).toEqual(['No_000002']);
    });
    fixture.detectChanges();
    tick(1000);
    const getOrderListReq = httpMocker.expectOne('showcase/demo2/input-listwin/getInputListwinData');
    getOrderListReq.flush(JSON.parse(JSON.stringify(response))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
    fixture.detectChanges();
    tick(1000);
    const radios = document.querySelectorAll('input[type="radio"]');

    // 勾選
    (radios[1] as HTMLInputElement).click();
    fixture.detectChanges();
    tick(1000);
    (document.querySelector('button[ng-reflect-nz-type="primary"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    tick(1000);
  }));

});

export const response = [
  {
    'orderId': 'No_000001',
    'orderDate': '2023/05/11',
    'status': 1,
    'customerId': 'C02',
    'customerName': 'htc',
    'orderAddr': {
      'city': '基隆市',
      'address': '大里區中興路一段1號'
    },
    'total': 4215,
    'salesmanName': {
      '0': 'hanks',
      '1': 'william'
    },
    'gender': 'male',
    '_transform': {
      'orderId': 'no_000001',
      'orderDate': 'THURSDAY, MAY 11, 2023',
      'status': 'true',
      'customerId': 'C02',
      'customerName': 'Htc',
      'orderAddr': '{\n  "CITY": "基隆市",\n  "ADDRESS": "大里區中興路一段1號"\n}',
      'total': 'CN¥4,215.00',
      'salesmanName': {
        '0': 'hanks',
        '1': 'william'
      },
      'gender': '男'
    },
    'dwChecked': false
  },
  {
    'orderId': 'No_000002',
    'orderDate': '2023/06/14',
    'status': 0,
    'customerId': 'C03',
    'customerName': 'asustek computer inc.',
    'orderAddr': {
      'city': '新北市',
      'address': '大里區中興路一段1號'
    },
    'total': 3584,
    'salesmanName': {
      '0': 'miller',
      '1': 'adora'
    },
    'gender': 'female',
    '_transform': {
      'orderId': 'no_000002',
      'orderDate': 'WEDNESDAY, JUNE 14, 2023',
      'status': 'false',
      'customerId': 'C03',
      'customerName': 'Asustek Computer Inc.',
      'orderAddr': '{\n  "CITY": "新北市",\n  "ADDRESS": "大里區中興路一段1號"\n}',
      'total': 'CN¥3,584.00',
      'salesmanName': {
        '0': 'miller',
        '1': 'adora'
      },
      'gender': '女'
    },
    'dwChecked': false
  }
];

@Component({
  template: `
    <div>..........</div>
  `
})
class TestComponent {
  // constructor(public dwModalService: DwModalService) {}
}
