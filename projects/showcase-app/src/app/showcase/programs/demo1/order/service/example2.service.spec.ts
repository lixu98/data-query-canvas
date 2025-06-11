/* eslint-disable max-len */
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OrderService } from './order.service';
import { OrderGenderModel, OrderSearchConditionModel, OrderStatusModel } from '../model';
import { Demo1OrderRepository } from '../../repository';
import { APP_DATE_FORMAT } from '@webdpt/framework/config';
import { of } from 'rxjs';
describe('OrderService', () => {
  let httpMocker: HttpTestingController;
  let service: OrderService;
  let demo1OrderRepository: Demo1OrderRepository;

  describe('getOrderList', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule
        ],
        providers: [
          OrderService,
          OrderSearchConditionModel,
          Demo1OrderRepository,
          HttpClient,
          { provide: APP_DATE_FORMAT, useValue: 'yyyy/MM/dd' }]
      });
      httpMocker = TestBed.inject(HttpTestingController);
      service = TestBed.inject(OrderService);
      demo1OrderRepository = TestBed.inject(Demo1OrderRepository);
    });
    afterEach(() => {
      // After every test, assert that there are no more pending requests.
      httpMocker.verify();
    });
    describe('回傳資料有datas屬性', () => {
      it('gender有對應OrderGenderModel值, 回傳資料需加genderDesc屬性', fakeAsync(() => {
        service.getOrderList(1, 10, null, []).subscribe(res => {
          expect(res.datas[0].genderDesc).toEqual('女');
        });
        tick();
        const getOrderListReq = httpMocker.expectOne('showcase/demo1/getOrderList');
        getOrderListReq.flush({...getOrderListResponse});
        tick();
      }));
      it('status有對應OrderStatusModel值, 回傳資料需加statusDesc屬性', fakeAsync(() => {
        service.getOrderList(1, 10, null, []).subscribe(res => {
          expect(res.datas[0].statusDesc).toEqual('有效');
        });
        tick();
        const getOrderListReq = httpMocker.expectOne('showcase/demo1/getOrderList');
        getOrderListReq.flush({...getOrderListResponse});
        tick();
      }));
      it('沒有status屬性, 回傳需不加上statusDesc屬性', fakeAsync(() => {
        service.getOrderList(1, 10, null, []).subscribe(res => {
          expect(res.datas[0].statusDesc).toEqual(undefined);
        });
        tick();
        const getOrderListReq = httpMocker.expectOne('showcase/demo1/getOrderList');
        getOrderListReq.flush({
          'datas': [
            {
              'orderId': 'No_000001',
              // 'status': 'Y',
              'orderDate': '2017/12/22',
              'customerId': 'C01',
              'customerName': '櫃櫃傢俱股份有限公司',
              'orderAddr': '台中市大里區中興路一段1號',
              'total': 3903000,
              'salesmanId': '1',
              'salesmanName': '孙品品',
              'gender': 'female'
            }
          ]
        });
        tick();
      }));
      it('沒有gender屬性, 回傳需不加上genderDesc屬性', fakeAsync(() => {
        service.getOrderList(1, 10, null, []).subscribe(res => {
          expect(res.datas[0].genderDesc).toEqual(undefined);
        });
        tick();
        const getOrderListReq = httpMocker.expectOne('showcase/demo1/getOrderList');
        getOrderListReq.flush({
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
              // 'gender': 'female'
            }
          ]
        });
        tick();
      }));
    });
    it('回傳資料沒有datas屬性 需直接回傳資料', fakeAsync(() => {
      service.getOrderList(1, 10, null, []).subscribe(res => {
        expect(res).toEqual({});
      });
      tick();
      const getOrderListReq = httpMocker.expectOne('showcase/demo1/getOrderList');
      getOrderListReq.flush({});
      tick();
    }));
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
      'gender': 'female'
    }
  ]
};
