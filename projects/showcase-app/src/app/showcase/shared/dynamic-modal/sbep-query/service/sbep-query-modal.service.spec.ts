import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, inject, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DwQueryInfo } from '@webdpt/framework/document/model/query';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { delay } from 'rxjs/operators';
import { SbepQueryWinComponent } from '../sbep-query-win/sbep-query-win.component';
import { SbepQueryModule } from '../sbep-query.module';
import { SbepQueryModalService } from './sbep-query-modal.service';
export const dataSource: any = {
  getDataList: (pageNumber: number, pageSize: number, queryInfo: DwQueryInfo): Observable<any> => {
    return of(getDynamicListwinData).pipe((delay(100))); // 延遲返回數據, ag-grid才會展開
  }
};
@Component({
  template: `
       <div>TestComponent</div>
      `
})
export class TestComponent {
  config: any = {
    dataSource: dataSource
  };
  selected: any[] = [];
  dataSource: any = {
    getDataList: (pageNumber: number, pageSize: number, queryInfo: DwQueryInfo): Observable<any> => {
      return of(getDynamicListwinData).pipe((delay(100))); // 延遲返回數據
    }
  };
  constructor(public sbepQueryModalService: SbepQueryModalService) {
  };
  open(): void {
    this.sbepQueryModalService.open(this.config, []).subscribe(res => {
      this.selected = res;
    });
  }
}
describe('SbepQueryModalService', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let de: DebugElement; let srv: SbepQueryModalService;
  const commonConfig = {
    imports: [
      NoopAnimationsModule,
      SbepQueryModule,
      TranslateTestingModule,
    ],
    declarations: [TestComponent],
    providers: [
      SbepQueryModalService
    ]
  };
  describe('共用條件測試', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule(commonConfig)
        .overrideComponent(SbepQueryWinComponent, {
          set: {
            template: `SbepQueryWinComponent`
          }
        }).compileComponents();
    }));
    beforeEach(() => {
      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      srv = TestBed.inject(SbepQueryModalService);
      fixture.detectChanges();
    });
    it('should be created', () => {
      expect(component).toBeTruthy();
    });
    describe('open', () => {
      it('需開窗', fakeAsync(() => {
        component.config = {
          dataSource: dataSource,
          title: 'mockTitle',
          width: '500px',
          okText: 'OK',
          cancelText: 'CANCEL',
          others: undefined, // 測試代碼判斷式
          multiSelect: undefined
        };
        fixture.detectChanges();
        component.open();
        fixture.detectChanges();
        tick(1000);
        expect(document.querySelector('nz-modal-container')).toBeTruthy();
      }));
      it('按下confirm, 需關窗', fakeAsync(() => {
        component.open();
        fixture.detectChanges();
        tick(1000);
        const confirmBT = document.querySelector('.ant-modal-footer button:nth-child(2)');
        (confirmBT as HTMLButtonElement).click();
        fixture.detectChanges();
        tick(1000);
        expect(document.querySelector('nz-modal-container')).not.toBeTruthy();
      }));
      it('按下cancel, 需關窗', fakeAsync(() => {
        component.open();
        fixture.detectChanges();
        tick(1000);
        const cancelBT = document.querySelector('.ant-modal-footer button:nth-child(1)');
        (cancelBT as HTMLButtonElement).click();
        fixture.detectChanges();
        tick(1000);
        expect(document.querySelector('nz-modal-container')).not.toBeTruthy();
      }));
    });
    describe('_analyzeConfig', () => {
      it('屬性為undefined值, 屬性需刪除',()=>{
        (srv as any)._analyzeConfig({
          dataSource: dataSource,
          title: 'mockTitle',
          width: '500px',
          okText: 'OK',
          cancelText: 'CANCEL',
          others: undefined, // 測試代碼判斷式
          multiSelect: undefined
        });
        expect((srv as any)._modalConfig.hasOwnProperty('others')).toBeFalse();
      });
    });
    describe('_getModalConfig', () => {
      it('設定有值, 才會加入設定值',()=>{
        const result = (srv as any)._getModalConfig({
          dataSource: null,
          title: null,
          width: null,
          okText: null,
          cancelText: null,
          others: null,
          multiSelect: null
        });
        expect(result).toEqual({});
      });
    });
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
