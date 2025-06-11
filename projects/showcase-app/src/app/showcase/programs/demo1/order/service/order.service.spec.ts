/* eslint-disable max-len */
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OrderService } from './order.service';
import { OrderDistributionOrderStatusModel, OrderGenderModel, OrderSearchConditionModel, OrderStatusModel } from '../model';
import { Demo1OrderRepository } from '../../repository';
import { APP_DATE_FORMAT } from '@webdpt/framework/config';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { of } from 'rxjs';
describe('OrderService', () => {
  let httpMocker: HttpTestingController;
  let mockHttpClient: HttpClient;
  let srv: OrderService;
  let demo1OrderRepository: Demo1OrderRepository;
  const _configureTestingModule = {
    imports: [
      CommonModule,
      HttpClientTestingModule
    ],
    declarations: [
    ],
    providers: [
      HttpClient,
      OrderService,
      OrderSearchConditionModel,
      Demo1OrderRepository,
      // OrderGenderModel,
      { provide: APP_DATE_FORMAT, useValue: 'yyyy/MM/dd' }
    ]
  };

  beforeEach(async () => {
    // spyOn(OrderGenderModel, 'getList').and.returnValue(
    //   of([new OrderGenderModel('male', '男', false),
    //     new OrderGenderModel('female', '女性', false)]));
    TestBed.configureTestingModule(_configureTestingModule)
      .compileComponents().then(() => {
        httpMocker = TestBed.inject(HttpTestingController);
        srv = TestBed.inject(OrderService);
        demo1OrderRepository = TestBed.inject(Demo1OrderRepository);
      });
  });
  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpMocker.verify();
  });
  it('getDateFormat', () => {
    expect(srv.getDateFormat()).toEqual('yyyy/MM/dd');
  });
  describe('getOrderList', () => {
    it('返回資料沒有datas屬性,需不處理直接返回資料', fakeAsync(() => {
      spyOn(demo1OrderRepository, 'getOrderList').and.returnValue(of({ data: [] }));
      srv.getOrderList(1, 10, null, []).subscribe(res => {
        expect(res).toEqual({ data: [] });
      });
      tick(1000);
    }));
    describe('返回資料沒有datas屬性', () => {
      describe('gender值', () => {
        it('屬性不存在,需不處理genderDesc', fakeAsync(() => {
          spyOn(demo1OrderRepository, 'getOrderList').and.returnValue(of({ datas: [
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
              'cust_field': '{\"userName\":\"123566\",\"email\":\"\",\"memo\":\"12345\",\"postalCode\":\"\",\"shippingDate\":\"2021/02/28 15:45:44\",\"deliveryTime\":[]}',
              'statusDesc': '有效'
            }
          ] }));
          srv.getOrderList(1, 10, null, []).subscribe(res => {
            expect(res.datas[0].hasOwnProperty('genderDesc')).toBeFalse();
          });
          tick();
        }));
        it('需轉換為genderDesc性別描述', fakeAsync(() => {
          spyOn(OrderGenderModel, 'getList').and.returnValue(
            of([new OrderGenderModel('female', '女性', false)]));
          tick();
          srv.getOrderList(1, 10, null, []).subscribe(res => {
            expect(res.datas.length).toEqual(10);
            expect(res.datas[0].gender).toEqual('female');
            expect(res.datas[0].genderDesc).toEqual('女性');
          });
          const getOrderListReq = httpMocker.expectOne('showcase/demo1/getOrderList');
          getOrderListReq.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
          tick(1000);
        }));
        it('對應不到OrderGenderModel.getList性別列舉值, 需不改變genderDesc屬性', fakeAsync(() => {
          spyOn(OrderGenderModel, 'getList').and.returnValue(of([]));
          tick();
          srv.getOrderList(1, 10, null, []).subscribe(res => {
            expect(res.datas.length).toEqual(10);
            expect(res.datas[0].gender).toEqual('female');
            expect(res.datas[0].genderDesc).toEqual('女');
          });
          const getOrderListReq = httpMocker.expectOne('showcase/demo1/getOrderList');
          getOrderListReq.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
          tick(1000);
        }));
      });

      describe('status值', () => {
        it('屬性不存在,需不處理statusDesc', fakeAsync(() => {
          spyOn(demo1OrderRepository, 'getOrderList').and.returnValue(of({ datas: [
            {
              'orderId': 'No_000001',
              'orderDate': '2017/12/22',
              'customerId': 'C01',
              'customerName': '櫃櫃傢俱股份有限公司',
              'orderAddr': '台中市大里區中興路一段1號',
              'total': 3903000,
              'salesmanId': '1',
              'salesmanName': '孙品品',
              'cust_field': '{\"userName\":\"123566\",\"email\":\"\",\"memo\":\"12345\",\"postalCode\":\"\",\"shippingDate\":\"2021/02/28 15:45:44\",\"deliveryTime\":[]}',
            }
          ] }));
          srv.getOrderList(1, 10, null, []).subscribe(res => {
            expect(res.datas[0].hasOwnProperty('statusDesc')).toBeFalse();
          });
          tick();
        }));
        it('需轉換為statusDesc狀態描述', fakeAsync(() => {
          spyOn(OrderStatusModel, 'getList').and.returnValue(
            of([new OrderStatusModel('Y', '成功')]));
          tick();
          srv.getOrderList(1, 10, null, []).subscribe(res => {
            expect(res.datas.length).toEqual(10);
            expect(res.datas[0].status).toEqual('Y');
            expect(res.datas[0].statusDesc).toEqual('成功');
          });
          const getOrderListReq = httpMocker.expectOne('showcase/demo1/getOrderList');
          getOrderListReq.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
          tick(1000);
        }));
        it('對應不到OrderStatusModel.status狀態列舉值, 需不改變statusDesc屬性', fakeAsync(() => {
          spyOn(OrderStatusModel, 'getList').and.returnValue(of([]));
          tick();
          srv.getOrderList(1, 10, null, []).subscribe(res => {
            expect(res.datas.length).toEqual(10);
            expect(res.datas[0].status).toEqual('Y');
            expect(res.datas[0].statusDesc).toEqual('有效');
          });
          const getOrderListReq = httpMocker.expectOne('showcase/demo1/getOrderList');
          getOrderListReq.flush(JSON.parse(JSON.stringify(getOrderListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
          tick(1000);
        }));
      });
    });

  });
  describe('getOrderDetail', () => {
    describe('detail', ()=>{
      it('筆數大於0, 需處理配送狀態描述', fakeAsync(() => {
        spyOn(OrderDistributionOrderStatusModel, 'getList').and.returnValue(of([new OrderDistributionOrderStatusModel('1', 'waring未出貨')]));
        tick();
        srv.getOrderDetail('mockId').subscribe(res => {
          expect(res.detail[0].distributionStatusDesc).toEqual('waring未出貨');
        });
        const getOrderListReq = httpMocker.expectOne('showcase/demo1/getOrderDetail');
        getOrderListReq.flush(JSON.parse(JSON.stringify(getOrderDetailResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
        tick(1000);
      }));
      it('筆數等於0, 需不處理配送狀態描述', fakeAsync(() => {
        spyOn(demo1OrderRepository, 'getOrderDetail').and.returnValue(of({ detail: [] }));
        spyOn(OrderDistributionOrderStatusModel, 'getList').and.returnValue(of([new OrderDistributionOrderStatusModel('1', 'waring未出貨')]));
        tick();
        srv.getOrderDetail('mockId').subscribe(res => {
          expect(res.detail.length).toEqual(0);
        });
        tick(1000);
      }));
    });

  });
  describe('modifyOrder', () => {
    it('orderDate instanceof Date為fasle, 需不處理', fakeAsync(() => {
      const spyModifyOrder = spyOn(demo1OrderRepository, 'modifyOrder').and.callThrough();
      tick();
      // getOrderDetailResponse.master.orderDate = new Date(getOrderDetailResponse.master.orderDate);
      srv.modifyOrder({'orderDate': '2017/12/222'} as any, getOrderDetailResponse.detail).subscribe(res => {
        expect(res.status).toBeTrue();
      });
      const modifyReq = httpMocker.expectOne('showcase/demo1/modifyOrder');
      modifyReq.flush({ status: true, description: '修改成功' });
      tick(1000);
      expect(spyModifyOrder.calls.mostRecent().args[0].master).toEqual({'orderDate': '2017/12/222'});
    }));
    it('orderDate instanceof Date為true, 需轉為dwDateFormat格式', fakeAsync(() => {
      const spyModifyOrder = spyOn(demo1OrderRepository, 'modifyOrder').and.callThrough();
      tick();
      srv.modifyOrder({'orderDate': new Date('2023-03-25')} as any, getOrderDetailResponse.detail).subscribe(res => {
        expect(res.status).toBeTrue();
      });
      const modifyReq = httpMocker.expectOne('showcase/demo1/modifyOrder');
      modifyReq.flush({ status: true, description: '修改成功' });
      tick(1000);
      expect(spyModifyOrder.calls.mostRecent().args[0].master).toEqual({'orderDate': '2023/03/25'});
    }));
  });
  describe('orderDetailMaxSeq', () => {
    it('需取得FormArray裏seq最大的數', () => {
      const formArr = new FormArray([]);
      for (const ele of getOrderDetailResponse.detail) {
        const fg = new FormBuilder().group({});
        for (const [key, value] of Object.entries(ele)) {
          fg.addControl(key, new FormControl(value));
        }
        formArr.push(fg);
      }
      expect(srv.orderDetailMaxSeq(formArr)).toEqual(6);
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

