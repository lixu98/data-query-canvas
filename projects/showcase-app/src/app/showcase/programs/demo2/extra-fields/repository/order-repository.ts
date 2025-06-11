import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IGetExtraFieldsOrderDetailParam, IGetExtraFieldsOrderListParam } from './order-repository-interface';


@Injectable()
export class ExtraFieldsOrderRepository {
  constructor(private http: HttpClient) { }

  /**
   * 取訂單列表
   *
   * @param params
   * @returns {Observable<any>}
   * @memberof ExtraFieldsOrderRepository
   */
  getOrderList(params: IGetExtraFieldsOrderListParam): Observable<any> {
    return this.http.post('showcase/demo2/extra-fields-order/getOrderList', params).pipe(
      map((response) => {
        response['datas'].map((row) => {
          if (row.cust_field) {
            row.cust_field = JSON.parse(row.cust_field);
          }
          return row;
        });
        return response;
      })
    );
  }

  /**
   * 取訂單明細
   *
   * @param params
   * @returns {Observable<any>}
   * @memberof ExtraFieldsOrderRepository
   */
  getOrderDetail(params: IGetExtraFieldsOrderDetailParam): Observable<any> {
    return this.http.post('showcase/demo2/extra-fields-order/getOrderDetail', params);

    // return this.http.post('showcase/demo1/getOrderDetail', params).pipe( // 模擬delay
    //   delay(2000)
    // );
  }

  /**
   * 訂單修改
   *
   * @param params
   * @returns {Observable<any>}
   * @memberof ExtraFieldsOrderRepository
   */
  modifyOrder(params: any): Observable<any> {
    return this.http.post('showcase/demo2/extra-fields-order/modifyOrder', params);
  }

  /**
   * 取自定義欄位配置
   *
   * @param params
   * @returns {Observable<any>}
   * @memberof ExtraFieldsOrderRepository
   */
  getOrderConfig(): Observable<any> {
    return this.http.post('showcase/demo2/extra-fields-order/getOrderConfig', {});
  }

}


