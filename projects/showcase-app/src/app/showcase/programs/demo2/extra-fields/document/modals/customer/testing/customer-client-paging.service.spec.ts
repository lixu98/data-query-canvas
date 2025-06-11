import { TemplateRef } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DwSelectModalService } from '@webdpt/components/modals/select';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { ExtraFieldsCustomerClientPagingService } from '../customer-client-paging.service';

describe('ExtraFieldsCustomerClientPagingService', () => {
  let srv: ExtraFieldsCustomerClientPagingService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ExtraFieldsCustomerClientPagingService,
        {
          provide: DwSelectModalService, useValue: {
            open: (config: any, selected: Array<any>, tagTemplate?: TemplateRef<any>,
              selectedCountTemplate?: TemplateRef<any>): Observable<any> => of(['c03'])
          }
        }
      ]
    }).compileComponents();
    srv = TestBed.inject(ExtraFieldsCustomerClientPagingService);
  });
  it('should be created', () => {
    expect(srv).toBeTruthy();
  });
  it('當執行open(開窗), 需返回selectModalService.open的訂閱, subscribe後返回開窗取的值', fakeAsync(() => {
    const spyModalOpen = spyOn(TestBed.inject(DwSelectModalService), 'open').and.callThrough();
    srv.open([]).subscribe(val=>{
      expect(val).toEqual(['c03']);
    });
    tick();
    expect(spyModalOpen).toHaveBeenCalled();
  }));
});
