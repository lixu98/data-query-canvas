import { Injectable, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import { DwDapHttpClient } from '@webdpt/framework/dap';
import {
  DwSelectModalService,
  IDwSelectModalCustomizeConfig,
  ApiServerPagingService,
  IDwSelectModalTableDataEnum
} from '@webdpt/components/modals/select';
import { DwQueryConditionInfo, DwQueryConditionOperator } from '@webdpt/framework/document';



@Injectable()
export class SpecifyOrderServerPagingService {
  public config: IDwSelectModalCustomizeConfig;

  constructor(
    private selectModalService: DwSelectModalService,
    private http: DwDapHttpClient,
    private translateService: TranslateService,
  ) {
    // 枚舉值的字段
    const statusEnum: IDwSelectModalTableDataEnum = {
      'C': this.translateService.instant('select-modal-demo-order-status-valid'),
      'D': this.translateService.instant('select-modal-demo-order-status-invalid')
    };

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
        {title: 'select-modal-demo-order-status', field: 'status', dataPipe: 'i18nSelect', dataEnum: statusEnum},
        {title: 'select-modal-demo-order-customerId', field: 'customerid'},
        {title: 'select-modal-demo-order-orderAddr', field: 'address'},
        {title: 'select-modal-demo-order-total', field: 'totalcount'}
      ],
      tableSelectedCountColor: 'red', // 選中筆數顏色.
      tableShowSelectedCount: true, // 顯示選中筆數.
      tableTagColor: 'green', // Tag標籤顏色.
      tableCustomTag: (rowInfo: any): string | null => {  // 顯示Tag標籤內容的回調函式.
        return '(' + rowInfo.customerid + ') - ' + rowInfo.orderid;
      },
      dataSource: new ApiServerPagingService(
        this.http as any,
        'restful/service/DEMO_DAP_CURRENT/DemoOrder/List',
        'demo_order',
        ['orderid', 'orderdate', 'employeeid', 'customerid']
      ),
      returnFields: ['orderid', 'orderdate', 'customerid'],
      initParams: [ // 使用 [DwQueryConditionInfo] 的數組
        new DwQueryConditionInfo('customerid', 'c0%', DwQueryConditionOperator.LIKE),
      ],
    };
  }

  public open(selected: Array<any>, config?: Partial<IDwSelectModalCustomizeConfig>, tagTemplate?: TemplateRef<any>,
    selectedCountTemplate?: TemplateRef<any>): Observable<any> {
    const _config = {...this.config, ...config};
    return this.selectModalService.open(_config, selected, tagTemplate, selectedCountTemplate);
  }

}
