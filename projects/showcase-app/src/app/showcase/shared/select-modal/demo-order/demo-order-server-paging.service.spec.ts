import { TemplateRef } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DwSelectModalService } from '@webdpt/components/modals/select';
import { DwDapHttpClient } from '@webdpt/framework/dap';
import { Observable, of } from 'rxjs';
import { DemoOrderServerPagingService } from './demo-order-server-paging.service';

describe('DemoOrderServerPagingService', () => {
  let srv: DemoOrderServerPagingService;
  beforeEach(() => {
    TestBed.configureTestingModule({
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
        DemoOrderServerPagingService
      ]
    });
    srv = TestBed.inject(DemoOrderServerPagingService);
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

});

