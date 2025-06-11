import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IGetOrderDetailParam, IGetOrderListParam } from './demo2-order-repository-interface';

@Injectable()
export class Demo2EmployeeRepository {
  constructor(private http: HttpClient) { }

  /**
   * 取得員工清單
   *
   * @param params
   * @returns {Observable<any>}
   * @memberof Demo2EmployeeRepository
   */
  getEmployees(): Observable<any> {
    return this.http.post('showcase/demo1/getEmployee', {});
  }

}


