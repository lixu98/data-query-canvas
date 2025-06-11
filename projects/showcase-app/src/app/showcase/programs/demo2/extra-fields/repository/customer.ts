import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';


@Injectable()
export class ExtraFieldsCustomerRepository {
  constructor(private http: HttpClient) { }

  /**
   * 取得客戶清單
   *
   * @returns {Observable<any>}
   * @memberof ExtraFieldsCustomerRepository
   */
  getCustomers(): Observable<any> {
    return this.http.post('showcase/demo1/getCustomers', {});
  }

}


