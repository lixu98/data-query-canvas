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
import { InputListwinCustomPipe } from '../../../programs/demo2/input-listwin/input-listwin-custom.pipe';
import { EnumClientPagingService } from './enum-client-paging.service';

describe('EnumClientPagingService', () => {
  let srv: EnumClientPagingService;
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
        EnumClientPagingService,
        InputListwinCustomPipe
      ]
    }).compileComponents();;


  }));
  beforeEach(() => {
    // 需要有一個fixture
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    srv = TestBed.inject(EnumClientPagingService);
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
  it('性別欄別需可以依列舉值顯示', fakeAsync(() => {
    fixture.detectChanges();
    tick(1000);
    srv.open([]).subscribe(result => {
      expect(result).toEqual(['No_000001']);
    });
    fixture.detectChanges();
    tick(1000);
    const getOrderListReq = httpMocker.expectOne('showcase/demo2/input-listwin/getInputListwinEnumData');
    getOrderListReq.flush(JSON.parse(JSON.stringify(response))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
    fixture.detectChanges();
    tick(1000);
    const trs =  document.querySelectorAll('table tbody tr');
    expect(trs[1].querySelector('td:last-child').textContent).toEqual(' select-modal-enum-gender-male ');
  }));
  it('open開窗後需可返回值', fakeAsync(() => {
    fixture.detectChanges();
    tick(1000);
    srv.open([]).subscribe(result => {
      expect(result).toEqual(['No_000001']);
    });
    fixture.detectChanges();
    tick(1000);
    const getOrderListReq = httpMocker.expectOne('showcase/demo2/input-listwin/getInputListwinEnumData');
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
  it('輸入框需可過濾資料', fakeAsync(()=>{
    fixture.detectChanges();
    tick(1000);
    dataSource = srv.config.dataSource  as ApiServerPagingService;
    const spyGetDataList = spyOn(dataSource, 'getDataList').and.callThrough();
    srv.open([]).subscribe(result => {
    });
    fixture.detectChanges();
    tick(1000);
    const getOrderListReq = httpMocker.expectOne('showcase/demo2/input-listwin/getInputListwinEnumData');
    getOrderListReq.flush(JSON.parse(JSON.stringify(response))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
    fixture.detectChanges();
    tick(1000);
    const searchInput: HTMLInputElement = document.querySelector('nz-input-group input');

    searchInput.value = 'No_000001';
    searchInput.dispatchEvent(new Event('input'));
    searchInput.dispatchEvent(new Event('keyup'));
    fixture.detectChanges();
    tick(1000);
    const trs =  document.querySelectorAll('table tbody tr');
    expect(trs.length).toEqual(2);
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
