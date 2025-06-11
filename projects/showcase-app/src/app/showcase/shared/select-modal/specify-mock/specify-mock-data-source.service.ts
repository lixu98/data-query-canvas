import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ISelectModalDataSourceResponse, DwClientPagingDataSource } from '@webdpt/components/modals/select';
import { DwQueryInfo, DwQueryCondition } from '@webdpt/framework/document';


// @Injectable() // Can't resolve all parameters ([object Object], ?). This will become an error in Angular v6.x.
export class SpecifyMockDataSourceService extends DwClientPagingDataSource {
  private _url: string;
  private _http: HttpClient;
  private _result: ISelectModalDataSourceResponse;

  constructor(http: HttpClient, url: string) {
    super();
    this._http = http;
    this._url = url;
  }


  /**
   * 向 MockData 取得清單.
   *
   * param {number} pageNumber: 當前頁碼.
   * param {number} pageSize: 每頁展示多少數據.
   *
   */
  public getDataList(pageNumber: number, pageSize: number): Observable<any> {
    // 需要加固定的條件時, 使用以下3行, 並在 post() 裡增加 this.queryInfo.getRawValue()
    this.queryInfo = new DwQueryInfo();
    this.queryInfo.condition = new DwQueryCondition();
    this.setInitCondition();

    return this._http.post(this._url, this.queryInfo.getRawValue()).pipe(
      // 需要前端分頁在搜尋時，可以搜尋枚舉對應後的值, 使用以下map()代碼片段
      map((ret: any) => {
        this.result = ret;
        this.converData();
        return this.result;
      }),
      map((ret: any) => {
        this._result = {
          currentPage: pageNumber,
          datas: Object.assign([], ret),
          pageCount: Math.ceil(ret.length / pageSize),
          pageSize: pageSize,
          rowCount: ret.length
        };
        return this._result;
      }));
  }

}
