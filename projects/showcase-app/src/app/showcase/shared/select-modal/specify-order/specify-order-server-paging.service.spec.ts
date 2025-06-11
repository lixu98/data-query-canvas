import { TemplateRef } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DwSelectModalService } from '@webdpt/components/modals/select';
import { DwDapHttpClient } from '@webdpt/framework/dap';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { Observable, of } from 'rxjs';
import { SpecifyOrderServerPagingService } from './specify-order-server-paging.service';

describe('SpecifyOrderServerPagingService', () => {
  let srv: SpecifyOrderServerPagingService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ TranslateTestingModule ],
      providers: [
        {
          provide: DwDapHttpClient, useValue: {
            post: (): Observable<any> => of({}),
            get: (): Observable<any> => of({})
          }
        },
        {
          provide: DwSelectModalService, useValue: {
            open: (config: any, selected: Array<any>,
              tagTemplate?: TemplateRef<any>, selectedCountTemplate?: TemplateRef<any>): Observable<any> => of([{orderId: 'mockOrderId'}])
          }
        },
        SpecifyOrderServerPagingService
      ]
    });
    srv = TestBed.inject(SpecifyOrderServerPagingService);
  });

  it('should be created', () => {
    expect(srv).toBeTruthy();
  });
  it('open開窗後需可返回值', fakeAsync(() => {
    srv.open([]).subscribe(result => {
      expect(result).toEqual([{orderId: 'mockOrderId'}]);
    });
    tick(10000);
  }));
  it('tableCustomTag', () => {
    const customTag = srv.config.tableCustomTag({ customerid: 'mockCustomerid', orderid: 'mockOrderid' });
    expect(customTag).toEqual('(mockCustomerid) - mockOrderid');
  });
});

