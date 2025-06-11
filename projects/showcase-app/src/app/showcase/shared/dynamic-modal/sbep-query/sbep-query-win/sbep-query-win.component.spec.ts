import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DwQueryInfo } from '@webdpt/framework/document';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SbepQueryModule } from '../sbep-query.module';
import { SbepQueryWinComponent } from './sbep-query-win.component';
registerLocaleData(zh);
@Component({
  template: `
  <app-sbep-query-win
   [gridDefs]="gridDefs"
   [selected]="selected"
   [dataSource]="dataSource"
   ></app-sbep-query-win>
      `
})
export class TestComponent {
  @ViewChild(SbepQueryWinComponent) sbepQueryInputComponent: SbepQueryWinComponent;
  selected: any[] = [];
  dataSource: any = {
    getDataList: (pageNumber: number, pageSize: number, queryInfo: DwQueryInfo): Observable<any> => {
      return of(getDynamicListwinData).pipe((delay(100))); // 延遲返回數據
    }
  };
  gridDefs: any = {
    multiSelect: true, // 多選或單選.
  };

}
describe('SbepQueryWinComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let de: DebugElement;
  let originalTimeout: number;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        SbepQueryModule,
        TranslateTestingModule,
        ReactiveFormsModule
      ],
      declarations: [SbepQueryWinComponent, TestComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
    // fixture.detectChanges();
  });
  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('需建立ag-grid表單', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(de.query(By.css('ag-grid-angular'))).toBeTruthy();
        fixture.detectChanges();
      });
    });
  }));
  it('有預選值, 需選取值', waitForAsync(() => {
    component.selected = [
      { id: 'c585efad-7cfd-467c-8c1d-551d445d13382', name: '0027员工借款单2' },
      { id: 'c585efad-7cfd-467c-8c1d-551d445d13383', name: '0027员工借款单3' }
    ];
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(document.querySelectorAll('.ag-center-cols-clipper div.ag-row-selected').length).toEqual(2);
          fixture.detectChanges();
        });
      });
    });
  }));
  describe('getSelectedValue', () => {
    it('開窗取值需返回選取資料', waitForAsync(() => {
      // component.selected = [
      //   { id: 'c585efad-7cfd-467c-8c1d-551d445d13382', name: '0027员工借款单2' },
      //   { id: 'c585efad-7cfd-467c-8c1d-551d445d13383', name: '0027员工借款单3' }
      // ];
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const row1 = document.querySelector(('.ag-center-cols-container div:nth-child(1)'));
        (row1 as HTMLDivElement).click();

        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(component.sbepQueryInputComponent.getSelectedValue().length).toEqual(1);
        });
      });
    }));
    it('開窗取值, 有預選資料,需一同返回選取資料', waitForAsync(() => {
      component.selected = [
        { id: 'c585efad-7cfd-467c-8c1d-551d445d13382', name: '0027员工借款单2' },
        { id: 'c585efad-7cfd-467c-8c1d-551d445d13383', name: '0027员工借款单3' },
      ];
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const row1 = document.querySelector(('.ag-center-cols-container div:nth-child(1)'));
        (row1 as HTMLDivElement).click();

        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(component.sbepQueryInputComponent.getSelectedValue().length).toEqual(3);
        });
      });
    }));
  });
  describe('onSelectionChanged', () => {
    it('有按下需選取值', waitForAsync(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const row = document.querySelector(('.ag-center-cols-container div:nth-child(1)'));
        (row as HTMLDivElement).click();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(document.querySelectorAll('.ag-center-cols-clipper div.ag-row-selected').length).toEqual(1);
          fixture.detectChanges();
          // expect(component.sbepQueryInputComponent.gridApi.getSelectedRows.length).toEqual(1);
        });
      });
    }));
  });
  describe('onSortChanged', () => {
    it('有按下需排序', waitForAsync(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        component.sbepQueryInputComponent.gridApi.setSortModel(
          [
            { colId: 'DOC_RTK', sort: 'asc' },
          ]
        );
        component.sbepQueryInputComponent.gridApi.onSortChanged();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
        });
      });
    }));
  });
  describe('filter', () => {
    it('有值需過濾資料', waitForAsync(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        // // const filterBT = document.querySelector('.ag-header-cell button');
        // // (filterBT as HTMLButtonElement).click();
        // const filterInput = document.querySelector('.ag-header-row-column-filter input');
        // (filterInput as HTMLInputElement).value = '0027员工借款单1';
        // filterInput.dispatchEvent(new Event('input'));
        // 程式觸發
        component.sbepQueryInputComponent.gridApi.setFilterModel({
          OBJECT_TRANSDOC_NAME: {
            filterType: 'text',
            type: 'equal',
            filter: '0027员工借款单1'
          }
        });
        component.sbepQueryInputComponent.gridApi.onFilterChanged();
        fixture.detectChanges();
        expect(component.sbepQueryInputComponent.gridApi.getDisplayedRowCount()).toEqual(1);
        fixture.whenStable().then(() => {
          fixture.detectChanges();
        });
      });
    }));
    it('沒有值需不過濾資料', waitForAsync(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        // 程式觸發
        component.sbepQueryInputComponent.gridApi.setFilterModel({
        });
        component.sbepQueryInputComponent.gridApi.onFilterChanged();
        fixture.detectChanges();
        expect(component.sbepQueryInputComponent.gridApi.getDisplayedRowCount()).toEqual(10);
        fixture.whenStable().then(() => {
          fixture.detectChanges();
        });
      });
    }));
    describe('多重過濾', () => {
      it('需過濾資料(date)', waitForAsync(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          // 程式觸發
          component.sbepQueryInputComponent.gridApi.setFilterModel({
            PAYMENT_DATE: {
              'dateFrom': '2023-04-18 00:00:00',
              'dateTo': '2023-04-26 00:00:00',
              'filterType': 'date',
              'type': 'inRange'
            }
          });
          component.sbepQueryInputComponent.gridApi.onFilterChanged();
          fixture.detectChanges();
          expect(component.sbepQueryInputComponent.gridApi.getDisplayedRowCount()).toEqual(0);
          fixture.whenStable().then(() => {
            fixture.detectChanges();
          });
        });
      }));
      it('需過濾資料(contains)', waitForAsync(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          // 程式觸發
          component.sbepQueryInputComponent.gridApi.setFilterModel({
            OBJECT_TRANSDOC_NAME: {
              'filterType': 'text',
              'operator': 'OR',
              'condition1': {
                'filterType': 'text',
                'type': 'contains',
                'filter': '0027员工借款单1'
              },
              'condition2': {
                'filterType': 'text',
                'type': 'equals',
                'filter': '0027员工借款单2'
              },
              'conditions': [
                {
                  'filterType': 'text',
                  'type': 'contains',
                  'filter': '0027员工借款单1'
                },
                {
                  'filterType': 'text',
                  'type': 'equals',
                  'filter': '0027员工借款单2'
                }
              ]
            }
          });
          component.sbepQueryInputComponent.gridApi.onFilterChanged();
          fixture.detectChanges();
          expect(component.sbepQueryInputComponent.gridApi.getDisplayedRowCount()).toEqual(2);
          fixture.whenStable().then(() => {
            fixture.detectChanges();
          });
        });
      }));
      it('需過濾資料(equal)', waitForAsync(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          // 程式觸發
          component.sbepQueryInputComponent.gridApi.setFilterModel({
            OBJECT_TRANSDOC_NAME: {
              'filterType': 'text',
              'operator': 'OR',
              'condition1': {
                'filterType': 'text',
                'type': 'equals',
                'filter': '0027员工借款单1'
              },
              'condition2': {
                'filterType': 'text',
                'type': 'equals',
                'filter': '0027员工借款单2'
              },
              'conditions': [
                {
                  'filterType': 'text',
                  'type': 'equals',
                  'filter': '0027员工借款单1'
                },
                {
                  'filterType': 'text',
                  'type': 'equals',
                  'filter': '0027员工借款单2'
                }
              ]
            }
          });
          component.sbepQueryInputComponent.gridApi.onFilterChanged();
          fixture.detectChanges();
          expect(component.sbepQueryInputComponent.gridApi.getDisplayedRowCount()).toEqual(2);
          fixture.whenStable().then(() => {
            fixture.detectChanges();
          });
        });
      }));
      it('需過濾資料(notEqual)', waitForAsync(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          // 程式觸發
          component.sbepQueryInputComponent.gridApi.setFilterModel({
            OBJECT_TRANSDOC_NAME: {
              'filterType': 'text',
              'operator': 'AND',
              'condition1': {
                'filterType': 'text',
                'type': 'equals',
                'filter': '0027员工借款单1'
              },
              'condition2': {
                'filterType': 'text',
                'type': 'notEqual',
                'filter': '0027员工借款单2'
              },
              'conditions': [
                {
                  'filterType': 'text',
                  'type': 'equals',
                  'filter': '0027员工借款单1'
                },
                {
                  'filterType': 'text',
                  'type': 'notEqual',
                  'filter': '0027员工借款单2'
                }
              ]
            }
          });
          component.sbepQueryInputComponent.gridApi.onFilterChanged();
          fixture.detectChanges();
          expect(component.sbepQueryInputComponent.gridApi.getDisplayedRowCount()).toEqual(1);
          fixture.whenStable().then(() => {
            fixture.detectChanges();
          });
        });
      }));
      it('需過濾資料(startsWith)', waitForAsync(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          // 程式觸發
          component.sbepQueryInputComponent.gridApi.setFilterModel({
            OBJECT_TRANSDOC_NAME: {
              'filterType': 'text',
              'operator': 'AND',
              'condition1': {
                'filterType': 'text',
                'type': 'startsWith',
                'filter': '0027员工借款单1'
              },
              'condition2': {
                'filterType': 'text',
                'type': 'notEqual',
                'filter': '0027员工借款单2'
              },
              'conditions': [
                {
                  'filterType': 'text',
                  'type': 'startsWith',
                  'filter': '0027员工借款单1'
                },
                {
                  'filterType': 'text',
                  'type': 'notEqual',
                  'filter': '0027员工借款单2'
                }
              ]
            }
          });
          component.sbepQueryInputComponent.gridApi.onFilterChanged();
          fixture.detectChanges();
          expect(component.sbepQueryInputComponent.gridApi.getDisplayedRowCount()).toEqual(1);
          fixture.whenStable().then(() => {
            fixture.detectChanges();
          });
        });
      }));
      it('需過濾資料(endsWith)', waitForAsync(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          // 程式觸發
          component.sbepQueryInputComponent.gridApi.setFilterModel({
            OBJECT_TRANSDOC_NAME: {
              'filterType': 'text',
              'operator': 'AND',
              'condition1': {
                'filterType': 'text',
                'type': 'endsWith',
                'filter': '0027员工借款单1'
              },
              'condition2': {
                'filterType': 'text',
                'type': 'notEqual',
                'filter': '0027员工借款单2'
              },
              'conditions': [
                {
                  'filterType': 'text',
                  'type': 'endsWith',
                  'filter': '0027员工借款单1'
                },
                {
                  'filterType': 'text',
                  'type': 'notEqual',
                  'filter': '0027员工借款单2'
                }
              ]
            }
          });
          component.sbepQueryInputComponent.gridApi.onFilterChanged();
          fixture.detectChanges();
          expect(component.sbepQueryInputComponent.gridApi.getDisplayedRowCount()).toEqual(1);
          fixture.whenStable().then(() => {
            fixture.detectChanges();
          });
        });
      }));
      it('需過濾資料(lessThan, greaterThan)', waitForAsync(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          // 程式觸發
          component.sbepQueryInputComponent.gridApi.setFilterModel({
            BALANCE_AMT_TC: {
              'filterType': 'number',
              'operator': 'AND',
              'condition1': {
                'filterType': 'number',
                'type': 'lessThan',
                'filter': '13'
              },
              'condition2': {
                'filterType': 'number',
                'type': 'greaterThan',
                'filter': '12'
              },
              'conditions': [
                {
                  'filterType': 'number',
                  'type': 'lessThan',
                  'filter': '13'
                },
                {
                  'filterType': 'number',
                  'type': 'greaterThan',
                  'filter': '12'
                }
              ]
            }
          });
          component.sbepQueryInputComponent.gridApi.onFilterChanged();
          fixture.detectChanges();
          expect(component.sbepQueryInputComponent.gridApi.getDisplayedRowCount()).toEqual(1);
          fixture.whenStable().then(() => {
            fixture.detectChanges();
          });
        });
      }));
      it('需過濾資料(lessThanOrEqual, greaterThanOrEqual)', waitForAsync(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          // 程式觸發
          component.sbepQueryInputComponent.gridApi.setFilterModel({
            BALANCE_AMT_TC: {
              'filterType': 'number',
              'operator': 'AND',
              'condition1': {
                'filterType': 'number',
                'type': 'lessThanOrEqual',
                'filter': '13'
              },
              'condition2': {
                'filterType': 'number',
                'type': 'greaterThanOrEqual',
                'filter': '12'
              },
              'conditions': [
                {
                  'filterType': 'number',
                  'type': 'lessThanOrEqual',
                  'filter': '13'
                },
                {
                  'filterType': 'number',
                  'type': 'greaterThanOrEqual',
                  'filter': '12'
                }
              ]
            }
          });
          component.sbepQueryInputComponent.gridApi.onFilterChanged();
          fixture.detectChanges();
          expect(component.sbepQueryInputComponent.gridApi.getDisplayedRowCount()).toEqual(1);
          fixture.whenStable().then(() => {
            fixture.detectChanges();
          });
        });
      }));
      it('需過濾資料(inRange)', waitForAsync(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          // 程式觸發
          component.sbepQueryInputComponent.gridApi.setFilterModel({
            BALANCE_AMT_TC: {
              'filterType': 'number',
              'operator': 'AND',
              'condition1': {
                'filterType': 'number',
                'type': 'inRange',
                'filter': '13',
                'filterTo': '14'
              },
              'condition2': {
                'filterType': 'number',
                'type': 'greaterThan',
                'filter': '12'
              },
              'conditions': [
                {
                  'filterType': 'number',
                  'type': 'inRange',
                  'filter': '13',
                  'filterTo': '14'
                },
                {
                  'filterType': 'number',
                  'type': 'greaterThan',
                  'filter': '12'
                }
              ]
            }
          });
          component.sbepQueryInputComponent.gridApi.onFilterChanged();
          fixture.detectChanges();
          expect(component.sbepQueryInputComponent.gridApi.getDisplayedRowCount()).toEqual(1);
          fixture.whenStable().then(() => {
            fixture.detectChanges();
          });
        });
      }));

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
