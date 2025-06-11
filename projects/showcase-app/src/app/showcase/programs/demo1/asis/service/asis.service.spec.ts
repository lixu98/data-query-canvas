import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { APP_DATE_FORMAT, APP_TIME_FORMAT } from '@webdpt/framework/config';
import { Demo1RepositoryModule } from '../../repository';
import { AsisModule } from '../asis.module';

import { AsisService } from './asis.service';

describe('AsisService', () => {
  let httpMocker: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        AsisModule,
        Demo1RepositoryModule
      ],
      providers: [
        AsisService,
        { provide: APP_DATE_FORMAT, useValue: 'yyyy/MM/dd' },
        { provide: APP_TIME_FORMAT, useValue: 'hh:mm:ss' }
      ]
    });
    httpMocker = TestBed.inject(HttpTestingController);
  });

  it('should be created', inject([AsisService], (service: AsisService) => {
    expect(service).toBeTruthy();
  }));
  describe('getAsisList', () => {
    it('資料裏沒有datas屬性, 需不跑datas.forEach', fakeAsync(inject([AsisService], (service: AsisService) => {
      service.getAsisList(1, 10, null, null).subscribe(result => {
        expect(result.hasOwnProperty('datas')).toBeFalse();
      });
      tick(1000);
      const getAsisListReq = httpMocker.expectOne('showcase/demo1/getAsisList');
      getAsisListReq.flush({
        'currentPage': 1,
        'rowCount': 2,
        'pageCount': 2,
      });
      tick(1000);
    })));
    it('資料裏沒有status屬性, 需不產生statusDesc', fakeAsync(inject([AsisService], (service: AsisService) => {
      service.getAsisList(1, 10, null, null).subscribe(result => {
        expect(result.datas[0].hasOwnProperty('statusDesc')).toBeFalse();
      });
      tick(1000);
      const getAsisListReq = httpMocker.expectOne('showcase/demo1/getAsisList');
      getAsisListReq.flush(JSON.parse(JSON.stringify(getAsisListResponse)));
      tick(1000);
    })));
    it('資料裏有status屬性, 需產生statusDesc', fakeAsync(inject([AsisService], (service: AsisService) => {
      service.getAsisList(1, 10, null, null).subscribe(result => {
        expect(result.datas[1].hasOwnProperty('statusDesc')).toBeTrue();
      });
      tick(1000);
      const getAsisListReq = httpMocker.expectOne('showcase/demo1/getAsisList');
      getAsisListReq.flush(JSON.parse(JSON.stringify(getAsisListResponse)));
      tick(1000);
    })));
  });

});
export const getAsisListResponse = {
  'currentPage': 1,
  'rowCount': 2,
  'pageCount': 2,
  'datas': [
    {
      'asisId': 'No_000001',
      'asisName': '標準資產負債分析',
      'note': '這是備註這是備註這是備註',
      'asisDate': '2017/12/23',
    },
    {
      'asisId': 'No_000002',
      'asisName': '標準資產負債分析',
      'note': '這是備註這是備註這是備註',
      'asisDate': '2017/12/23',
      'status': 'Y',
    }
  ]
};
