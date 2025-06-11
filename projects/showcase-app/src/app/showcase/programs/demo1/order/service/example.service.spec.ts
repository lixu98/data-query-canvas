/* eslint-disable max-len */
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { APP_DATE_FORMAT } from '@webdpt/framework/config';
import { Observable, of } from 'rxjs';
import { Demo1OrderRepository, IGetOrderListParam } from '../../repository';
import { OrderSearchConditionModel } from '../model/search-condition.model';
import { OrderService } from './order.service';
import {} from 'jasmine'; // 加這或tsconfig, types:[jasmine] 二擇一

describe('OrderService', () => {
  let service: OrderService;
  let demo1OrderRepository: Demo1OrderRepository;

  describe('getOrderList', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          OrderService,
          OrderSearchConditionModel,
          {
            provide: Demo1OrderRepository, useValue: {
              getOrderList: (params: IGetOrderListParam): Observable<any> => {
                return of({ ...getOrderListResponse });
              }
            }
          },
          { provide: APP_DATE_FORMAT, useValue: 'yyyy/MM/dd' }]
      });
      service = TestBed.inject(OrderService);
      demo1OrderRepository = TestBed.inject(Demo1OrderRepository);
    });
    describe('回傳資料有datas屬性', () => {
      it('gender有對應OrderGenderModel值, 回傳資料需加genderDesc屬性', fakeAsync(() => {
        service.getOrderList(1, 10, null, []).subscribe(res => {
          expect(res.datas[0].genderDesc).toEqual('女');
        });
        tick();
      }));
      it('status有對應OrderStatusModel值, 回傳資料需加statusDesc屬性', fakeAsync(() => {
        service.getOrderList(1, 10, null, []).subscribe(res => {
          expect(res.datas[0].statusDesc).toEqual('有效');
        });
        tick();
      }));
      it('沒有status屬性, 回傳需不加上statusDesc屬性', fakeAsync(() => {
        spyOn(demo1OrderRepository, 'getOrderList').and.returnValue(of({
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
        }));
        service.getOrderList(1, 10, null, []).subscribe(res => {
          expect(res.datas[0].statusDesc).toEqual(undefined);
        });
        tick();
      }));
      it('沒有gender屬性, 回傳需不加上genderDesc屬性', fakeAsync(() => {
        spyOn(demo1OrderRepository, 'getOrderList').and.returnValue(of({
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
        }));
        service.getOrderList(1, 10, null, []).subscribe(res => {
          expect(res.datas[0].genderDesc).toEqual(undefined);
        });
        tick();
      }));
    });
    it('回傳資料沒有datas屬性 需直接回傳資料', fakeAsync(() => {
      spyOn(demo1OrderRepository, 'getOrderList').and.returnValue(of({}));
      service.getOrderList(1, 10, null, []).subscribe(res => {
        expect(res).toEqual({});
      });
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
