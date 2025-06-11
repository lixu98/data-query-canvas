import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class Demo1EmployeeRepository {
  constructor(private http: HttpClient) { }

  /**
   * 取得員工清單
   *
   * @param params
   * @returns {Observable<any>}
   * @memberof Demo1EmployeeRepository
   */
  getEmployees(): Observable<any> {
    return this.http.post('showcase/demo1/getEmployee', {});
  }

}


