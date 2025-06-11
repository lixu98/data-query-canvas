/* eslint-disable max-len */
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { DwQueryCondition, DwQueryConditionInfo, DwQueryConditionOperator } from '@webdpt/framework/document';
import { of } from 'rxjs';
import { SbepQueryInfo } from '../model/sbep-query';
import { SbepQueryServerPagingService } from './sbep-query-server-paging.service';

describe('SbepQueryServerPagingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        HttpClient
      ]
    });
  });

  it('should be created', inject([HttpClient], (httpClient: HttpClient) => {
    expect(new SbepQueryServerPagingService(httpClient, 'showcase/demo1/dynamic-listwin/getDynamicListwinData', 'mockWindowId')).toBeTruthy();
  }));
  describe('getDataList', ()=>{
    it('需返回資料', inject([HttpClient], fakeAsync((httpClient: HttpClient) => {
      const srv = new SbepQueryServerPagingService(httpClient, 'showcase/demo1/dynamic-listwin/getDynamicListwinData', 'mockWindowId');
      const spyList = spyOn((srv as any)._listService, 'list').and.returnValue(of(getDynamicListwinData));
      const searchCondition = new DwQueryCondition();
      const sbepQueryInfo = new SbepQueryInfo();
      const conditions = new DwQueryCondition(DwQueryConditionOperator.AND);
      conditions.addCondition({name: 'name', value: 'nameKey', operator: DwQueryConditionOperator.EQUAL});
      conditions.addCondition({name: 'id', value: 'idKey', operator: DwQueryConditionOperator.EQUAL});
      searchCondition.addCondition(conditions);
      sbepQueryInfo.setCondition(searchCondition);
      sbepQueryInfo.addConditionField(new DwQueryConditionInfo('orderid', '123456', 'EQUAL'));
      console.log(sbepQueryInfo);
      srv.getDataList(1, 10, sbepQueryInfo).subscribe(res=>{
        expect(res.data.rows.length).toEqual(10);
      });
      tick(1000);
    })));
    it('資料沒有fileds屬性, 需不用_setPickList', inject([HttpClient], fakeAsync((httpClient: HttpClient) => {
      const srv = new SbepQueryServerPagingService(httpClient, 'showcase/demo1/dynamic-listwin/getDynamicListwinData', 'mockWindowId');
      const spyList = spyOn((srv as any)._listService, 'list').and.returnValue(of({
        'pageCount': 3,
        'pageSize': 10,
        'currentPage': 1,
        'rowCount': 21,
        'data': {
          'rows': [
            {
              'DOC_RTK': '来源2',
              'BALANCE_AMT_TC': 12.63,
              'EMP_ACCOUNTS_OBJECT_ID': 'c585efad-7cfd-467c-8c1d-551d445d13380',
              'OBJECT_TRANSDOC_NO': '00277E01-20180529000',
              'OBJECT_TRANSDOC_NAME': '0027员工借款单0',
              'PAYMENT_DATE': '2018/10/24 14:05:02'
            },
            {
              'DOC_RTK': '来源1',
              'BALANCE_AMT_TC': 13.63,
              'EMP_ACCOUNTS_OBJECT_ID': 'c585efad-7cfd-467c-8c1d-551d445d13381',
              'OBJECT_TRANSDOC_NO': '00277E01-20180529001',
              'OBJECT_TRANSDOC_NAME': '0027员工借款单1',
              'PAYMENT_DATE': '2018/10/24 14:05:02'
            },
            {
              'DOC_RTK': '来源2',
              'BALANCE_AMT_TC': 14.63,
              'EMP_ACCOUNTS_OBJECT_ID': 'c585efad-7cfd-467c-8c1d-551d445d13382',
              'OBJECT_TRANSDOC_NO': '00277E01-20180529002',
              'OBJECT_TRANSDOC_NAME': '0027员工借款单2',
              'PAYMENT_DATE': '2018/10/24 14:05:02'
            },
            {
              'DOC_RTK': '来源1',
              'BALANCE_AMT_TC': 15.63,
              'EMP_ACCOUNTS_OBJECT_ID': 'c585efad-7cfd-467c-8c1d-551d445d13383',
              'OBJECT_TRANSDOC_NO': '00277E01-20180529003',
              'OBJECT_TRANSDOC_NAME': '0027员工借款单3',
              'PAYMENT_DATE': '2018/10/24 14:05:02'
            },
            {
              'DOC_RTK': '来源2',
              'BALANCE_AMT_TC': 16.630000000000003,
              'EMP_ACCOUNTS_OBJECT_ID': 'c585efad-7cfd-467c-8c1d-551d445d13384',
              'OBJECT_TRANSDOC_NO': '00277E01-20180529004',
              'OBJECT_TRANSDOC_NAME': '0027员工借款单4',
              'PAYMENT_DATE': '2018/10/24 14:05:02'
            },
            {
              'DOC_RTK': '来源1',
              'BALANCE_AMT_TC': 17.630000000000003,
              'EMP_ACCOUNTS_OBJECT_ID': 'c585efad-7cfd-467c-8c1d-551d445d13385',
              'OBJECT_TRANSDOC_NO': '00277E01-20180529005',
              'OBJECT_TRANSDOC_NAME': '0027员工借款单5',
              'PAYMENT_DATE': '2018/10/24 14:05:02'
            },
            {
              'DOC_RTK': '来源2',
              'BALANCE_AMT_TC': 18.630000000000003,
              'EMP_ACCOUNTS_OBJECT_ID': 'c585efad-7cfd-467c-8c1d-551d445d13386',
              'OBJECT_TRANSDOC_NO': '00277E01-20180529006',
              'OBJECT_TRANSDOC_NAME': '0027员工借款单6',
              'PAYMENT_DATE': '2018/10/24 14:05:02'
            },
            {
              'DOC_RTK': '来源1',
              'BALANCE_AMT_TC': 19.630000000000003,
              'EMP_ACCOUNTS_OBJECT_ID': 'c585efad-7cfd-467c-8c1d-551d445d13387',
              'OBJECT_TRANSDOC_NO': '00277E01-20180529007',
              'OBJECT_TRANSDOC_NAME': '0027员工借款单7',
              'PAYMENT_DATE': '2018/10/24 14:05:02'
            },
            {
              'DOC_RTK': '来源2',
              'BALANCE_AMT_TC': 20.630000000000003,
              'EMP_ACCOUNTS_OBJECT_ID': 'c585efad-7cfd-467c-8c1d-551d445d13388',
              'OBJECT_TRANSDOC_NO': '00277E01-20180529008',
              'OBJECT_TRANSDOC_NAME': '0027员工借款单8',
              'PAYMENT_DATE': '2018/10/24 14:05:02'
            },
            {
              'DOC_RTK': '来源1',
              'BALANCE_AMT_TC': 21.630000000000003,
              'EMP_ACCOUNTS_OBJECT_ID': 'c585efad-7cfd-467c-8c1d-551d445d13389',
              'OBJECT_TRANSDOC_NO': '00277E01-20180529009',
              'OBJECT_TRANSDOC_NAME': '0027员工借款单9',
              'PAYMENT_DATE': '2018/10/24 14:05:02'
            }
          ]}
      }));
      srv.getDataList(1, 10, new SbepQueryInfo()).subscribe(res=>{
        expect(res.data.rows.length).toEqual(10);
      });
      tick(1000);
    })));
  });
});
export const getDynamicListwinData = {
  'pageCount': 3,
  'pageSize': 10,
  'currentPage': 1,
  'rowCount': 21,
  'data': {
    'rows': [
      {
        'DOC_RTK': '02',
        'BALANCE_AMT_TC': 12.63,
        'EMP_ACCOUNTS_OBJECT_ID': 'c585efad-7cfd-467c-8c1d-551d445d13380',
        'OBJECT_TRANSDOC_NO': '00277E01-20180529000',
        'OBJECT_TRANSDOC_NAME': '0027员工借款单0',
        'PAYMENT_DATE': '2018/10/24 14:05:02'
      },
      {
        'DOC_RTK': '01',
        'BALANCE_AMT_TC': 13.63,
        'EMP_ACCOUNTS_OBJECT_ID': 'c585efad-7cfd-467c-8c1d-551d445d13381',
        'OBJECT_TRANSDOC_NO': '00277E01-20180529001',
        'OBJECT_TRANSDOC_NAME': '0027员工借款单1',
        'PAYMENT_DATE': '2018/10/24 14:05:02'
      },
      {
        'DOC_RTK': '来源2',
        'BALANCE_AMT_TC': 14.63,
        'EMP_ACCOUNTS_OBJECT_ID': 'c585efad-7cfd-467c-8c1d-551d445d13382',
        'OBJECT_TRANSDOC_NO': '00277E01-20180529002',
        'OBJECT_TRANSDOC_NAME': '0027员工借款单2',
        'PAYMENT_DATE': '2018/10/24 14:05:02'
      },
      {
        'DOC_RTK': '来源1',
        'BALANCE_AMT_TC': 15.63,
        'EMP_ACCOUNTS_OBJECT_ID': 'c585efad-7cfd-467c-8c1d-551d445d13383',
        'OBJECT_TRANSDOC_NO': '00277E01-20180529003',
        'OBJECT_TRANSDOC_NAME': '0027员工借款单3',
        'PAYMENT_DATE': '2018/10/24 14:05:02'
      },
      {
        'DOC_RTK': '来源2',
        'BALANCE_AMT_TC': 16.630000000000003,
        'EMP_ACCOUNTS_OBJECT_ID': 'c585efad-7cfd-467c-8c1d-551d445d13384',
        'OBJECT_TRANSDOC_NO': '00277E01-20180529004',
        'OBJECT_TRANSDOC_NAME': '0027员工借款单4',
        'PAYMENT_DATE': '2018/10/24 14:05:02'
      },
      {
        'DOC_RTK': '来源1',
        'BALANCE_AMT_TC': 17.630000000000003,
        'EMP_ACCOUNTS_OBJECT_ID': 'c585efad-7cfd-467c-8c1d-551d445d13385',
        'OBJECT_TRANSDOC_NO': '00277E01-20180529005',
        'OBJECT_TRANSDOC_NAME': '0027员工借款单5',
        'PAYMENT_DATE': '2018/10/24 14:05:02'
      },
      {
        'DOC_RTK': '来源2',
        'BALANCE_AMT_TC': 18.630000000000003,
        'EMP_ACCOUNTS_OBJECT_ID': 'c585efad-7cfd-467c-8c1d-551d445d13386',
        'OBJECT_TRANSDOC_NO': '00277E01-20180529006',
        'OBJECT_TRANSDOC_NAME': '0027员工借款单6',
        'PAYMENT_DATE': '2018/10/24 14:05:02'
      },
      {
        'DOC_RTK': '来源1',
        'BALANCE_AMT_TC': 19.630000000000003,
        'EMP_ACCOUNTS_OBJECT_ID': 'c585efad-7cfd-467c-8c1d-551d445d13387',
        'OBJECT_TRANSDOC_NO': '00277E01-20180529007',
        'OBJECT_TRANSDOC_NAME': '0027员工借款单7',
        'PAYMENT_DATE': '2018/10/24 14:05:02'
      },
      {
        'DOC_RTK': '来源2',
        'BALANCE_AMT_TC': 20.630000000000003,
        'EMP_ACCOUNTS_OBJECT_ID': 'c585efad-7cfd-467c-8c1d-551d445d13388',
        'OBJECT_TRANSDOC_NO': '00277E01-20180529008',
        'OBJECT_TRANSDOC_NAME': '0027员工借款单8',
        'PAYMENT_DATE': '2018/10/24 14:05:02'
      },
      {
        'DOC_RTK': '来源1',
        'BALANCE_AMT_TC': 21.630000000000003,
        'EMP_ACCOUNTS_OBJECT_ID': 'c585efad-7cfd-467c-8c1d-551d445d13389',
        'OBJECT_TRANSDOC_NO': '00277E01-20180529009',
        'OBJECT_TRANSDOC_NAME': '0027员工借款单9',
        'PAYMENT_DATE': '2018/10/24 14:05:02'
      }
    ],
    'picklists': [
      {
        'name': 'DocSource04',
        'child': {
          'items': [
            {
              'sequence': 1,
              'id': '01',
              'display_name': '来源1'
            },
            {
              'sequence': 2,
              'id': '02',
              'display_name': '来源2'
            }
          ]
        }
      },
      {
        'name': 'DocSource05',
        'child': {
          'items': [
            {
              'sequence': 1,
              'id': 'S01',
              'display_name': '来源S01'
            },
            {
              'sequence': 2,
              'id': 'S02',
              'display_name': '来源S02'
            }
          ]
        }
      }
    ],
    'fields': [
      {
        'visible': false,
        'picklist': null,
        'width': 150,
        'caption': '主键',
        'type': 'Guid',
        'field_name': 'EMP_ACCOUNTS_OBJECT_ID'
      },
      {
        'visible': true,
        'picklist': null,
        'width': 150,
        'caption': '借款单名称',
        'type': 'String',
        'field_name': 'OBJECT_TRANSDOC_NAME'
      },
      {
        'visible': true,
        'picklist': null,
        'width': 150,
        'caption': '借款单单号',
        'type': 'String',
        'field_name': 'OBJECT_TRANSDOC_NO'
      },
      {
        'visible': true,
        'picklist': null,
        'width': 150,
        'caption': '预计还款日',
        'type': 'Date',
        'field_name': 'PAYMENT_DATE'
      },
      {
        'visible': true,
        'picklist': null,
        'width': 150,
        'caption': '余额原币',
        'type': 'Decimal',
        'field_name': 'BALANCE_AMT_TC'
      },
      {
        'visible': true,
        'picklist': 'DocSource04',
        'width': 150,
        'caption': '单据来源',
        'type': 'Integer',
        'field_name': 'DOC_RTK'
      }
    ],
    'keyInfo': [
      {
        'value_field': 'EMP_ACCOUNTS_OBJECT_ID',
        'display_field': 'OBJECT_TRANSDOC_NAME'
      }
    ]
  }
};
