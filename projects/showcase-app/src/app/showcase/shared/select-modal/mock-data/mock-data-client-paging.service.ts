import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { DwSelectModalService, IDwSelectModalCustomizeConfig } from '@webdpt/components/modals/select';
import { MockDataDataSourceService } from './mock-data-data-source.service';


@Injectable()
export class MockDataClientPagingService {
  public config: IDwSelectModalCustomizeConfig;

  constructor(
    private selectModalService: DwSelectModalService,
    private http: HttpClient
  ) {
    this.http = http;
    this.config = {
      modalTitle: 'select-modal-mock-data-modalTitle',
      tableMultiSelect: false,
      tablePageSize: 10, // 每頁展示多少數據
      tableIdField: 'orderId',
      tableNameField: 'orderDate',
      tableColDefs: [
        {title: 'select-modal-mock-data-orderId', field: 'orderId'},
        {title: 'select-modal-mock-data-orderDate', field: 'orderDate'},
        {title: 'select-modal-mock-data-status', field: 'status'},
        {title: 'select-modal-mock-data-customerId', field: 'customerId'},
        {title: 'select-modal-mock-data-customerName', field: 'customerName'},
        {title: 'select-modal-mock-data-orderAddr', field: 'orderAddr', dataPipe: 'json|uppercase'},
        {title: 'select-modal-mock-data-total', field: 'total'},
        {title: 'select-modal-mock-data-salesmanName', field: 'salesmanName', width: '12%', dataPipe: 'keyvalue'},
        {title: 'select-modal-mock-data-gender', field: 'gender', width: '12%'}
      ],
      tableScroll: { x: '1100px' },
      dataSource: new MockDataDataSourceService(this.http, 'showcase/demo2/input-listwin/getInputListwinData')
    };

  }

  public open(selected: Array<any>): Observable<any> {
    return this.selectModalService.open(this.config, selected);
  }

}
