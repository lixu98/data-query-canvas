/* eslint-disable max-len */
import { TemplateRef } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DwActionTestingModule } from '@webdpt/components/action/testing';
import { IDwSelectModalCustomizeConfig } from '@webdpt/components/modals/select';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { NzIconTestModule } from 'ng-zorro-antd/icon/testing';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, Subject } from 'rxjs';
import { DemoOrderServerPagingService } from '../../../shared/select-modal/demo-order/demo-order-server-paging.service';
import { EnumClientPagingService } from '../../../shared/select-modal/enum/enum-client-paging.service';
import { MockDataClientPagingService } from '../../../shared/select-modal/mock-data/mock-data-client-paging.service';
import { SpecifyMockClientPagingService } from '../../../shared/select-modal/specify-mock/specify-mock-client-paging.service';
import { SpecifyOrderErrorServerPagingService } from '../../../shared/select-modal/specify-order-error/specify-order-error-server-paging.service';
import { SpecifyOrderServerPagingService } from '../../../shared/select-modal/specify-order/specify-order-server-paging.service';
import { TableMockClientPagingService } from '../../../shared/select-modal/table-mock/table-mock-client-paging.service';

import { InputListwinComponent } from './input-listwin.component';
import { InputListwinModule } from './input-listwin.module';

describe('InputListwinComponent', () => {
  let component: InputListwinComponent;
  let fixture: ComponentFixture<InputListwinComponent>;
  let dwMessage: NzMessageService;
  let spyError: jasmine.Spy;
  let mockOpen1: Subject<any>;
  let mockOpen2: Subject<any>;
  let mockOpen3: Subject<any>;
  let mockOpen4: Subject<any>;
  let mockOpen5: Subject<any>;
  let mockOpen6: Subject<any>;
  let mockOpen7: Subject<any>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        NzIconTestModule,
        DwActionTestingModule,
        TranslateTestingModule,
        InputListwinModule
      ],
      providers: [
        {
          provide: DemoOrderServerPagingService, useValue: {
            open: (selected: Array<any>): Observable<any> => {
              mockOpen1 =  new Subject();
              return mockOpen1.asObservable();
              // return of(['1592984190403', '1595318465798']);
            }
          }
        },
        {
          provide: MockDataClientPagingService, useValue: {
            open: (selected: Array<any>): Observable<any> => {
              mockOpen2 =  new Subject();
              return mockOpen2.asObservable();
              // return of(['No_000001']);
            }
          }
        },
        {
          provide: EnumClientPagingService, useValue: {
            open: (selected: Array<any>): Observable<any> => {
              mockOpen3 =  new Subject();
              return mockOpen3.asObservable();
              // return of(['No_000001', 'No_000002' ]);
            }
          }
        },
        {
          provide: SpecifyOrderServerPagingService, useValue: {
            open: (selected: Array<any>, config?: Partial<IDwSelectModalCustomizeConfig>, tagTemplate?: TemplateRef<any>,
              selectedCountTemplate?: TemplateRef<any>): Observable<any> => {
              mockOpen4 =  new Subject();
              return mockOpen4.asObservable();
              // return of([ { 'customerid': 'c03', 'orderdate': '2020/08/05 00:00:00', 'orderid': '1596595664554' },
              //   { 'customerid': 'c02', 'orderdate': '2020/09/09 00:00:00', 'orderid': '1599617415344' }]);
            }
          }
        },
        {
          provide: SpecifyMockClientPagingService, useValue: {
            open: (selected: Array<any>): Observable<any> => {
              mockOpen5 =  new Subject();
              return mockOpen5.asObservable();
              // return of([{ 'orderId': 'No_000002', 'orderDate': '2023/05/13', 'status': 0, 'customerId': 'C02' }]);
            }
          }
        },
        {
          provide: SpecifyOrderErrorServerPagingService, useValue: {
            open: (selected: Array<any>, config?: Partial<IDwSelectModalCustomizeConfig>,
              tagTemplate?: TemplateRef<any>): Observable<any> => {
              mockOpen6 =  new Subject();
              return mockOpen6.asObservable();
              // return throwError({ error: 'request error' });
            }
          }
        },
        {
          provide: TableMockClientPagingService, useValue: {
            open: (selected: Array<any>): Observable<any> => {
              mockOpen7 =  new Subject();
              return mockOpen7.asObservable();
              // return of([{ 'orderId': 'No_000002', 'orderDate': '2023/06/15', 'customerId': 'C03' },
              //   { 'orderId': 'No_000001', 'orderDate': '2023/07/03', 'customerId': 'C02' }]);
            }
          }
        }
      ],
      declarations: [InputListwinComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputListwinComponent);
    component = fixture.componentInstance;
    dwMessage = TestBed.inject(NzMessageService);
    spyError = spyOn(dwMessage, 'error').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('openDemoOrderWin', () => {
    it('開窗成功, 需返回選取數據', fakeAsync(() => {
      component.openDemoOrderWin(new MouseEvent('mousedown'));
      mockOpen1.next(['1592984190403', '1595318465798']);
      fixture.detectChanges();
      tick(1000);
      expect(component.demoOrder).toEqual(['1592984190403', '1595318465798']);
    }));
    it('開窗失敗, 需顯示錯誤訊息', fakeAsync(() => {
      component.openDemoOrderWin(new MouseEvent('mousedown'));
      mockOpen1.error({ error: 'bad request' });
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      expect(spyError).toHaveBeenCalledTimes(1);
    }));
  });
  describe('openMockDataWin', () => {
    it('開窗成功, 需返回選取數據', fakeAsync(() => {
      component.openMockDataWin(new MouseEvent('mousedown'));
      mockOpen2.next(['No_000001']);
      fixture.detectChanges();
      tick(1000);
      expect(component.mockData).toEqual(['No_000001']);
    }));
    it('開窗失敗, 需顯示錯誤訊息', fakeAsync(() => {
      component.openMockDataWin(new MouseEvent('mousedown'));
      mockOpen2.error({ error: 'bad request' });
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      expect(spyError).toHaveBeenCalledTimes(1);
    }));
  });
  describe('openEnumDataWin', () => {
    it('開窗成功, 需返回選取數據', fakeAsync(() => {
      component.openEnumDataWin(new MouseEvent('mousedown'));
      mockOpen3.next(['No_000001', 'No_000002']);
      fixture.detectChanges();
      tick(1000);
      expect(component.enumData).toEqual(['No_000001', 'No_000002']);
    }));
    it('開窗失敗, 需顯示錯誤訊息', fakeAsync(() => {
      component.openEnumDataWin(new MouseEvent('mousedown'));
      mockOpen3.error({ error: 'bad request' });
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      expect(spyError).toHaveBeenCalledTimes(1);
    }));
  });
  describe('openSpecifyOrderWin', () => {
    it('開窗成功, 需返回選取數據', fakeAsync(() => {
      component.openSpecifyOrderWin(new MouseEvent('mousedown'));
      mockOpen4.next([{ 'customerid': 'c03', 'orderdate': '2020/08/05 00:00:00', 'orderid': '1596595664554' },{ 'customerid': 'c02', 'orderdate': '2020/09/09 00:00:00', 'orderid': '1599617415344' }]);
      fixture.detectChanges();
      tick(1000);
      expect(component.specifyOrder).toEqual([{ 'customerid': 'c03', 'orderdate': '2020/08/05 00:00:00', 'orderid': '1596595664554' },{ 'customerid': 'c02', 'orderdate': '2020/09/09 00:00:00', 'orderid': '1599617415344' }]);
    }));
    it('開窗失敗, 需顯示錯誤訊息', fakeAsync(() => {
      component.openSpecifyOrderWin(new MouseEvent('mousedown'));
      mockOpen4.error({ error: 'bad request' });
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      expect(spyError).toHaveBeenCalledTimes(1);
    }));
  });
  describe('openSpecifyMockWin', () => {
    it('開窗成功, 需返回選取數據', fakeAsync(() => {
      component.openSpecifyMockWin(new MouseEvent('mousedown'));
      mockOpen5.next([{ 'orderId': 'No_000002', 'orderDate': '2023/05/13', 'status': 0, 'customerId': 'C02' }]);
      fixture.detectChanges();
      tick(1000);
      expect(component.specifyMock).toEqual([{ 'orderId': 'No_000002', 'orderDate': '2023/05/13', 'status': 0, 'customerId': 'C02' }]);
    }));
    it('開窗失敗, 需顯示錯誤訊息', fakeAsync(() => {
      component.openSpecifyMockWin(new MouseEvent('mousedown'));
      mockOpen5.error({ error: 'bad request' });
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      expect(spyError).toHaveBeenCalledTimes(1);
    }));
  });
  describe('openSpecifyOrderWinFn', () => {
    it('開窗成功, 需返回選取數據', fakeAsync(() => {
      component.openSpecifyOrderWinFn(new MouseEvent('mousedown'));
      mockOpen4.next([{ 'customerid': 'c03', 'orderdate': '2020/08/05 00:00:00', 'orderid': '1596595664554' },{ 'customerid': 'c02', 'orderdate': '2020/09/09 00:00:00', 'orderid': '1599617415344' }]);
      fixture.detectChanges();
      tick(1000);
      expect(component.specifyOrderFn).toEqual([{ 'customerid': 'c03', 'orderdate': '2020/08/05 00:00:00', 'orderid': '1596595664554' },{ 'customerid': 'c02', 'orderdate': '2020/09/09 00:00:00', 'orderid': '1599617415344' }]);
    }));
    it('開窗失敗, 需顯示錯誤訊息', fakeAsync(() => {
      component.openSpecifyOrderWinFn(new MouseEvent('mousedown'));
      mockOpen4.error({ error: 'bad request' });
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      expect(spyError).toHaveBeenCalledTimes(1);
    }));
  });
  describe('openSpecifyOrderWinError', () => {
    it('開窗成功, 需返回選取數據', fakeAsync(() => {
      component.openSpecifyOrderWinError(new MouseEvent('mousedown'));
      mockOpen6.next([{ 'customerid': 'c03', 'orderdate': '2020/08/05 00:00:00', 'orderid': '1596595664554' },{ 'customerid': 'c02', 'orderdate': '2020/09/09 00:00:00', 'orderid': '1599617415344' }]);
      fixture.detectChanges();
      tick(1000);
      expect(component.specifyOrderErr).toEqual([{ 'customerid': 'c03', 'orderdate': '2020/08/05 00:00:00', 'orderid': '1596595664554' },{ 'customerid': 'c02', 'orderdate': '2020/09/09 00:00:00', 'orderid': '1599617415344' }]);
    }));
    it('開窗失敗, 需顯示錯誤訊息', fakeAsync(() => {
      component.openSpecifyOrderWinError(new MouseEvent('mousedown'));
      mockOpen6.error({ error: 'bad request' });
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      expect(component.specifyOrderErrMsg).toEqual({ error: 'bad request' });
    }));
  });
  describe('openTableMockWin', () => {
    it('開窗成功, 需返回選取數據', fakeAsync(() => {
      component.openTableMockWin(new MouseEvent('mousedown'));
      mockOpen7.next([{ 'orderId': 'No_000002', 'orderDate': '2023/06/15', 'customerId': 'C03' },{ 'orderId': 'No_000001', 'orderDate': '2023/07/03', 'customerId': 'C02' }]);
      fixture.detectChanges();
      tick(1000);
      expect(component.tableMock).toEqual([{ 'orderId': 'No_000002', 'orderDate': '2023/06/15', 'customerId': 'C03' },{ 'orderId': 'No_000001', 'orderDate': '2023/07/03', 'customerId': 'C02' }]);
    }));
    it('開窗失敗, 需顯示錯誤訊息', fakeAsync(() => {
      component.openTableMockWin(new MouseEvent('mousedown'));
      mockOpen7.error({ error: 'bad request' });
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      expect(spyError).toHaveBeenCalledTimes(1);
    }));
  });
});
