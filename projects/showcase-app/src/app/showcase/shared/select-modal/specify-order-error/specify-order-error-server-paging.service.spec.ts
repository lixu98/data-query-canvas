import { TemplateRef } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DwSelectModalService } from '@webdpt/components/modals/select';
import { DwDapHttpClient } from '@webdpt/framework/dap';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { DwMessageServiceTest } from '@webdpt/framework/sharedTest/common-test-service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, of, throwError } from 'rxjs';
import { SpecifyOrderErrorServerPagingService } from './specify-order-error-server-paging.service';

describe('SpecifyOrderErrorServerPagingService', () => {
  let srv: SpecifyOrderErrorServerPagingService;
  let dwMessageService: NzMessageService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateTestingModule],
      providers: [
        { provide: NzMessageService, useValue: DwMessageServiceTest },
        {
          provide: DwDapHttpClient, useValue: {
            post: (): Observable<any> => of({}),
            get: (): Observable<any> => of({})
          }
        },
        {
          provide: DwSelectModalService, useValue: {
            open: (config: any, selected: Array<any>,
              tagTemplate?: TemplateRef<any>, selectedCountTemplate?: TemplateRef<any>): Observable<any> =>
              throwError({ error: 'bad Request' })
          }
        },
        SpecifyOrderErrorServerPagingService
      ]
    });
    srv = TestBed.inject(SpecifyOrderErrorServerPagingService);
    dwMessageService = TestBed.inject(NzMessageService);
  });

  it('should be created', () => {
    expect(srv).toBeTruthy();
  });

  it('open開窗後, 返回錯誤,需執行dwMessage.error', fakeAsync(() => {
    const spyError = spyOn(dwMessageService, 'error').and.callThrough();
    srv.open([]).subscribe(result => {
      // expect(result).toEqual([{ orderId: 'mockOrderId' }]);
    }, error => {
      expect(error).toEqual({ error: 'bad Request' });
    });
    tick(10000);
    expect(spyError).toHaveBeenCalled();
  }));
  it('tableCustomTag', () => {
    const customTag = srv.config.tableCustomTag({ customerid: 'mockCustomerid', orderid: 'mockOrderid' });
    expect(customTag).toEqual('(mockCustomerid) - mockOrderid');
  });
});

