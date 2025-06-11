import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IGetOrderListParam } from './demo2-order-repository-interface';

@Injectable()
export class Demo2CustomerRepository {
  constructor(private http: HttpClient) { }

  /**
   * 取得客戶清單
   *
   * @returns {Observable<any>}
   * @memberof Demo2CustomerRepository
   */
  getCustomers(): Observable<any> {
    return this.http.post('showcase/demo1/getCustomers', {});
  }

}


