import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TemplateRef } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DwSelectModalService } from '@webdpt/components/modals/select';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { Observable, of } from 'rxjs';
import { InputListwinCustomPipe } from '../../../programs/demo2/input-listwin/input-listwin-custom.pipe';
import { MockDataClientPagingService } from './mock-data-client-paging.service';

describe('MockDataClientPagingService', () => {
  let srv: MockDataClientPagingService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateTestingModule
      ],
      providers: [
        InputListwinCustomPipe,
        {
          provide: DwSelectModalService, useValue: {
            open: (config: any, selected: Array<any>,
              tagTemplate?: TemplateRef<any>, selectedCountTemplate?: TemplateRef<any>): Observable<any> => of([{orderId: 'mockOrderId'}])
          }
        },
        MockDataClientPagingService
      ]
    });
    srv = TestBed.inject(MockDataClientPagingService);
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

