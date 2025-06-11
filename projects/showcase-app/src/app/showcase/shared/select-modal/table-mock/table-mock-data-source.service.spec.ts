import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TableMockDataSourceService } from './table-mock-data-source.service';

describe('TableMockDataSourceService', () => {
  let srv: TableMockDataSourceService;
  let httpClient: HttpClient;
  let httpMocker: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ]
    });
    httpClient = TestBed.inject(HttpClient);
    httpMocker = TestBed.inject(HttpTestingController);
    srv = new TableMockDataSourceService(httpClient, 'showcase/demo2/input-listwin/getInputListwinEnumData');
  });

  it('should be created', () => {
    expect(srv).toBeTruthy();
  });
  it('getDataList, 需返回資料', fakeAsync(()=>{
    srv.getDataList(2, 10).subscribe(result=>{
      expect(result.currentPage).toEqual(2);
    });
    const getDataListReq = httpMocker.expectOne('showcase/demo2/input-listwin/getInputListwinEnumData');
    getDataListReq.flush(response);
    tick(1000);
    httpMocker.verify();
  }));

});

export const response = {
  'rowCount': 46,
  'pageCount': 5,
  'pageSize': 3,
  'currentPage': 1,
  'message': null,
  'success': true,
  'data': {
    'demo_order': [{
      'address': '',
      'customerid': 'c02',
      'employeeid': '',
      'employeename': '',
      'gender': '',
      'orderdate': '2020/06/24 00:00:00',
      'orderid': '1592984190403',
      'status': 'C',
      'totalcount': 33.00
    }, {
      'address': null,
      'customerid': 'c02',
      'employeeid': null,
      'employeename': null,
      'gender': null,
      'orderdate': '2020/07/21 00:00:00',
      'orderid': '1595318465798',
      'status': 'C',
      'totalcount': 0.00
    }, {
      'address': null,
      'customerid': 'c03',
      'employeeid': null,
      'employeename': null,
      'gender': null,
      'orderdate': '2020/08/05 00:00:00',
      'orderid': '1596595664554',
      'status': 'D',
      'totalcount': 160.00
    }
    ]
  }
};
