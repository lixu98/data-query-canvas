import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { APP_DATE_FORMAT } from '@webdpt/framework/config';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { Demo2OrderRepository } from '../../repository';
import { DwCustomTableDisplayDistributionDwCustomTableDisplayStatusModel, DwCustomTableDisplaySearchConditionModel } from '../model';

import { DwCustomTableDisplayService } from './dw-custom-table-display.service';

describe('DwCustomTableDisplayService', () => {
  let srv: DwCustomTableDisplayService;
  const commonConfig = {
    providers: [
      // DwCustomTableDisplayDistributionDwCustomTableDisplayStatusModel,
      DwCustomTableDisplaySearchConditionModel,
      DwCustomTableDisplayService,
      { provide: APP_DATE_FORMAT, useValue: 'yyyy/MM/dd' },
      {
        provide: Demo2OrderRepository, useValue: {
          getOrderList: (
            pageIndex: number,
            pageSize: number,
            searchParam: any,
            sortSet: any[]): Observable<any> => {
            return of({
              'currentPage': 1,
              'rowCount': 46,
              'pageCount': 5,
              'datas': [
                {
                  'orderId': 'No_000044',
                  'status': 'Y',
                  'orderDate': '2018/01/25',
                  'customerId': 'C03',
                  'customerName': '急速貨運有限公司',
                  'orderAddr': '台北市內湖區民政里瑞光路七段8巷168號',
                  'total': 3790,
                  'salesmanId': '29',
                  'salesmanName': '钱国柔',
                  'gender': 'female',
                  'genderDesc': '女',
                  'statusDesc': '有效'
                },
                {
                  'orderId': 'No_000030',
                  'status': 'Y',
                  'orderDate': '2018/01/11',
                  'customerId': 'C03',
                  'customerName': '急速貨運有限公司',
                  'orderAddr': '台北市內湖區民政里瑞光路七段8巷168號',
                  'total': 22000,
                  'salesmanId': '30',
                  'salesmanName': '钱国妤',
                  'gender': 'female',
                  'genderDesc': '女',
                  'statusDesc': '有效'
                }
              ]
            });
          },
          getOrderDetail: ({ orderId: string }): Observable<any> => {
            return of({
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
                'gender': 'female'
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
                }
              ]
            });
          },
          modifyOrder: () => of({
            description: '修改成功',
            status: true
          }),
          getDateFormat: (): string => 'yyyy/MM/dd',
          orderDetailMaxSeq: (): number => 99
        }
      }
    ]
  };
  describe('一般測試', () => {
    beforeEach(() => {
      TestBed.configureTestingModule(commonConfig);
      srv = TestBed.inject(DwCustomTableDisplayService);
    });

    it('should be created', () => {
      expect(srv).toBeTruthy();
    });
    it('getDateFormat, 需取回APP_DATE_FORMAT值', () => {
      expect(srv.getDateFormat()).toEqual('yyyy/MM/dd');
    });
    it('getDwCustomTableDisplayList,需取得列表資料', fakeAsync(() => {
      srv.getDwCustomTableDisplayList(1, 5, null, []).subscribe(result => {
        expect(result.datas.length).toEqual(2);
      });
      tick();
    }));
    it('getDwCustomTableDisplayDetail,需取得明細資料', fakeAsync(() => {
      srv.getDwCustomTableDisplayDetail('orderId123').subscribe(result => {
        expect(result.hasOwnProperty('master')).toBeTrue();
        expect(result.hasOwnProperty('detail')).toBeTrue();
      });
      tick();
    }));
    it('modifyDwCustomTableDisplay,需變更資料', fakeAsync(() => {
      srv.modifyDwCustomTableDisplay({
        'orderId': 'No_000001',
        'status': 'Y',
        'orderDate': new Date(),
        'customerId': 'C01',
        'customerName': '櫃櫃傢俱股份有限公司',
        'orderAddr': '台中市大里區中興路一段1號',
        'total': 3903000,
        'salesmanId': '1',
        'salesmanName': '孙品品',
        'gender': 'female'
      }, [{
        'seq': 1,
        'distributionStatus': '1',
        'productCode': 'Product000001',
        'productName': '高級訂製歐式鄉村風格酒櫃',
        'price': 230000,
        'quantity': 3,
        'subtotal': 690000,
        'distributionStatusDesc': '未出貨'
      }]).subscribe(result => {
        expect(result.status).toBeTrue();
      });
      tick();
    }));
    it('orderDetailMaxSeq, 需取得FormArray陣列資料中seq最大值', () => {
      const formGroups: FormGroup[] = [];
      for (let i = 0; i < 10; i++) {
        formGroups.push(new FormGroup({
          'name': new FormControl('name' + i),
          'seq': new FormControl(i)
        }));
      }
      const formArr: FormArray = new FormArray(formGroups);
      const maxseq = srv.orderDetailMaxSeq(formArr);
      expect(maxseq).toEqual(9);
    });
  });
  describe('個別條件測試', () => {
    describe('getDwCustomTableDisplayList', () => {
      it('沒有datas, 直接返回demo2DwCustomTableDisplayRepository.getOrderList資料', fakeAsync(() => {
        TestBed.configureTestingModule(commonConfig)
          .overrideProvider(Demo2OrderRepository, {
            useValue: {
              getOrderList: (
                pageIndex: number,
                pageSize: number,
                searchParam: any,
                sortSet: any[]): Observable<any> => {
                return of({
                  'currentPage': 1,
                  'rowCount': 46,
                  'pageCount': 5,
                });
              },
            }
          });
        srv = TestBed.inject(DwCustomTableDisplayService);
        srv.getDwCustomTableDisplayList(1, 5, null, []).subscribe(result => {
          expect(result).toEqual({currentPage: 1, rowCount: 46, pageCount: 5});
        });
        tick();
      }));
      it('datas裏有gender屬性, 比對後自動添加genderDesc屬性', fakeAsync(() => {
        TestBed.configureTestingModule(commonConfig)
          .overrideProvider(Demo2OrderRepository, {
            useValue: {
              getOrderList: (
                pageIndex: number,
                pageSize: number,
                searchParam: any,
                sortSet: any[]): Observable<any> => {
                return of({
                  'currentPage': 1,
                  'rowCount': 46,
                  'pageCount': 5,
                  'datas':[
                    {
                      'orderId': 'No_000044',
                      'status': 'Y',
                      'orderDate': '2018/01/25',
                      'customerId': 'C03',
                      'customerName': '急速貨運有限公司',
                      'orderAddr': '台北市內湖區民政里瑞光路七段8巷168號',
                      'total': 3790,
                      'salesmanId': '29',
                      'salesmanName': '钱国柔',
                      'gender': 'female',
                      // 'genderDesc': '女',
                      'statusDesc': '有效'
                    }
                  ]
                });
              },
            }
          });
        srv = TestBed.inject(DwCustomTableDisplayService);
        srv.getDwCustomTableDisplayList(1, 5, null, []).subscribe(result => {
          expect(result.datas[0].genderDesc).toEqual('女');
        });
        tick();
      }));
      it('datas裏沒有gender屬性, 不會自動添加genderDesc屬性', fakeAsync(() => {
        TestBed.configureTestingModule(commonConfig)
          .overrideProvider(Demo2OrderRepository, {
            useValue: {
              getOrderList: (
                pageIndex: number,
                pageSize: number,
                searchParam: any,
                sortSet: any[]): Observable<any> => {
                return of({
                  'currentPage': 1,
                  'rowCount': 46,
                  'pageCount': 5,
                  'datas':[
                    {
                      'orderId': 'No_000044',
                      'status': 'Y',
                      'orderDate': '2018/01/25',
                      'customerId': 'C03',
                      'customerName': '急速貨運有限公司',
                      'orderAddr': '台北市內湖區民政里瑞光路七段8巷168號',
                      'total': 3790,
                      'salesmanId': '29',
                      'salesmanName': '钱国柔',
                      // 'gender': 'female',
                      // 'genderDesc': '女',
                      'statusDesc': '有效'
                    }
                  ]
                });
              },
            }
          });
        srv = TestBed.inject(DwCustomTableDisplayService);
        srv.getDwCustomTableDisplayList(1, 5, null, []).subscribe(result => {
          expect(result.datas[0].hasOwnProperty('genderDesc')).toBeFalse();
        });
        tick();
      }));
      it('datas裏有status屬性, 比對後自動添加statusDesc屬性', fakeAsync(() => {
        TestBed.configureTestingModule(commonConfig)
          .overrideProvider(Demo2OrderRepository, {
            useValue: {
              getOrderList: (
                pageIndex: number,
                pageSize: number,
                searchParam: any,
                sortSet: any[]): Observable<any> => {
                return of({
                  'currentPage': 1,
                  'rowCount': 46,
                  'pageCount': 5,
                  'datas':[
                    {
                      'orderId': 'No_000044',
                      'status': 'Y',
                      'orderDate': '2018/01/25',
                      'customerId': 'C03',
                      'customerName': '急速貨運有限公司',
                      'orderAddr': '台北市內湖區民政里瑞光路七段8巷168號',
                      'total': 3790,
                      'salesmanId': '29',
                      'salesmanName': '钱国柔',
                      'gender': 'female',
                      'genderDesc': '女',
                      // 'statusDesc': '有效'
                    }
                  ]
                });
              },
            }
          });
        srv = TestBed.inject(DwCustomTableDisplayService);
        srv.getDwCustomTableDisplayList(1, 5, null, []).subscribe(result => {
          expect(result.datas[0].statusDesc).toEqual('有效');
        });
        tick();
      }));
      it('datas裏沒有status屬性, 不會自動添加statusDesc屬性', fakeAsync(() => {
        TestBed.configureTestingModule(commonConfig)
          .overrideProvider(Demo2OrderRepository, {
            useValue: {
              getOrderList: (
                pageIndex: number,
                pageSize: number,
                searchParam: any,
                sortSet: any[]): Observable<any> => {
                return of({
                  'currentPage': 1,
                  'rowCount': 46,
                  'pageCount': 5,
                  'datas':[
                    {
                      'orderId': 'No_000044',
                      // 'status': 'Y',
                      'orderDate': '2018/01/25',
                      'customerId': 'C03',
                      'customerName': '急速貨運有限公司',
                      'orderAddr': '台北市內湖區民政里瑞光路七段8巷168號',
                      'total': 3790,
                      'salesmanId': '29',
                      'salesmanName': '钱国柔',
                      'gender': 'female',
                      'genderDesc': '女',
                      // 'statusDesc': '有效'
                    }
                  ]
                });
              },
            }
          });
        srv = TestBed.inject(DwCustomTableDisplayService);
        srv.getDwCustomTableDisplayList(1, 5, null, []).subscribe(result => {
          expect(result.datas[0].hasOwnProperty('statusDesc')).toBeFalse();
        });
        tick();
      }));
      it('DwCustomTableDisplayDistributionDwCustomTableDisplayStatusModel',()=>{
        // 覆蓋率掃一下
        const enumtest = new DwCustomTableDisplayDistributionDwCustomTableDisplayStatusModel(null, null);
        expect(enumtest.key).toEqual('');
        expect(enumtest.lable).toEqual('');
      });
    });
  });

});
