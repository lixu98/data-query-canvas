import { fakeAsync, tick } from '@angular/core/testing';
import { CustomerDataSourceService } from '../customer-data-source.service';

describe('CustomerDataSourceService', ()=>{
  let srv: CustomerDataSourceService;
  beforeEach(()=>{
    srv = new CustomerDataSourceService();
  });
  it('should be created', ()=>{
    expect(srv).toBeTruthy();
  });
  it('getDataList需返回開窗所需的資料格式', fakeAsync(()=>{
    srv.getDataList(1, 20).subscribe(result=>{
      expect(result.currentPage).toEqual(1);
      expect(result.pageSize).toEqual(20);
      expect(Array.isArray(result.datas)).toBeTrue();
    });
    tick();
  }));
});
