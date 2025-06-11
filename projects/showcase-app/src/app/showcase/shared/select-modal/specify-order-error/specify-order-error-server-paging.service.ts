import { Injectable, TemplateRef } from '@angular/core';

import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';

import { DwDapHttpClient } from '@webdpt/framework/dap';
import {
  DwSelectModalService,
  IDwSelectModalCustomizeConfig,
  ApiServerPagingService
} from '@webdpt/components/modals/select';


@Injectable()
export class SpecifyOrderErrorServerPagingService {
  public config: IDwSelectModalCustomizeConfig;

  constructor(
    private selectModalService: DwSelectModalService,
    private http: DwDapHttpClient,
    private dwMessage: NzMessageService,
    private translateService: TranslateService
  ) {
    this.http = http;
    this.config = {
      modalTitle: 'select-modal-demo-order-modalTitle',
      tableMultiSelect: true,
      tablePageSize: 10, // 每頁展示多少數據
      tableIdField: 'orderid',
      tableNameField: 'orderdate',
      tableColDefs: [
        {title: 'select-modal-demo-order-orderId', field: 'orderid'},
        {title: 'select-modal-demo-order-orderDate', field: 'orderdate'},
        {title: 'select-modal-demo-order-status', field: 'status'},
        {title: 'select-modal-demo-order-customerId', field: 'customerid'},
        {title: 'select-modal-demo-order-orderAddr', field: 'address'},
        {title: 'select-modal-demo-order-total', field: 'totalcount'}
      ],
      tableTagColor: 'green', // Tag標籤顏色.
      tableCustomTag: (rowInfo: any): string | null => {  // 顯示Tag標籤內容的回調函式.
        return '(' + rowInfo.customerid + ') - ' + rowInfo.orderid;
      },
      dataSource: new ApiServerPagingService(
        this.http as any,
        'restful/service/DEMO_DAP_CURRENT/DemoOrder/List1', // 錯誤的 URL
        'demo_order',
        ['orderid', 'orderdate', 'employeeid', 'customerid']
      ),
      returnFields: ['orderid', 'orderdate', 'customerid']
    };
  }

  public open(selected: Array<any>, config?: Partial<IDwSelectModalCustomizeConfig>, tagTemplate?: TemplateRef<any>): Observable<any> {
    const _config = {...this.config, ...config};
    // 如果要傳遞錯誤給作業, 把 pipe() 移除
    return this.selectModalService.open(_config, selected, tagTemplate).pipe(
      catchError((error: any): any => { // 使用 any 為了之後可以接收 DwSelectModalComponent 傳遞其他的錯誤
        // service 攔截並顯示錯誤訊息
        const errorCode = this.translateService.instant('dw-input-listwin-errorCode');
        const errorMessage = this.translateService.instant('dw-input-listwin-errorMessage');
        this.dwMessage.error(
          errorCode + ':' + error.error.errorCode +
          errorMessage + ':' + error.error.errorMessage);
        // // 不傳遞錯誤
        // return of([]);
        // 傳遞錯誤到作業
        return throwError(error);
      }));
  }

}
