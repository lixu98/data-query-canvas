import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import { DwSelectModalService, IDwSelectModalCustomizeConfig, IDwSelectModalTableDataEnum } from '@webdpt/components/modals/select';
import { TableMockDataSourceService } from './table-mock-data-source.service';


@Injectable()
export class TableMockClientPagingService {
  public config: IDwSelectModalCustomizeConfig;

  constructor(
    private selectModalService: DwSelectModalService,
    private http: HttpClient,
    private translateService: TranslateService
  ) {
    // 枚舉值的字段
    const statusEnum: IDwSelectModalTableDataEnum = {
      0: 'false',
      1: 'true'
    };

    // 枚舉值的字段
    const genderEnum: IDwSelectModalTableDataEnum = {
      'female': this.translateService.instant('select-modal-enum-gender-female'),
      'male': this.translateService.instant('select-modal-enum-gender-male')
    };

    this.http = http;
    this.config = {
      modalTitle: 'select-modal-mock-data-modalTitle',
      tableMultiSelect: true,
      tablePageSize: 10, // 每頁展示多少數據
      tableIdField: 'orderId',
      tableNameField: 'orderDate',
      tableColDefs: [
        {title: 'select-modal-mock-data-orderId', field: 'orderId'},
        {title: 'select-modal-mock-data-orderDate', field: 'orderDate'},
        {title: 'select-modal-mock-data-status', field: 'status', dataPipe: 'i18nSelect', dataEnum: statusEnum},
        {title: 'select-modal-mock-data-customerId', field: 'customerId'},
        {title: 'select-modal-mock-data-customerName', field: 'customerName'},
        {title: 'select-modal-mock-data-orderAddr', field: 'orderAddr', dataPipe: 'json|uppercase'},
        {title: 'select-modal-mock-data-total', field: 'total', dataPipe: 'currency:CNY:symbol:4.2-2'},
        {title: 'select-modal-mock-data-salesmanName', field: 'salesmanName', width: '12%', dataPipe: 'keyvalue'},
        {title: 'select-modal-mock-data-gender', field: 'gender', width: '12%', dataPipe: 'i18nSelect', dataEnum: genderEnum}
      ],
      // 建議指定 dwScroll.x 為大於表格寬度的固定值或百分比，且非固定列寬度之和不要超過 dwScroll.x。
      // 橫向或縱向支援滾動，也可用於指定滾動區域的寬高度：{ x: "300px", y: "300px" }
      tableScroll: { x: '1100px', y: '300px' },
      dataSource: new TableMockDataSourceService(this.http, 'showcase/demo2/input-listwin/getInputListwinData'),
      returnFields: ['orderId', 'orderDate', 'customerId']
    };

  }

  public open(selected: Array<any>): Observable<any> {
    return this.selectModalService.open(this.config, selected);
  }

}
