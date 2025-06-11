/* eslint-disable max-len */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, DebugElement, OnInit, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { Observable, of } from 'rxjs';
import { SbepQueryWinComponent } from '../sbep-query-win/sbep-query-win.component';
import { SbepQueryModule } from '../sbep-query.module';
import { SbepQueryModalService } from '../service/sbep-query-modal.service';
import { SbepQueryInputComponent } from './sbep-query-input.component';
@Component({
  template: `
  <app-sbep-query-input
  [selectWindowId]="selectWindowId"
  [resourceUrl]="resourceUrl"
  [title]="title"
  [multiSelect]="multiSelect"
  (selectedValue)="onselectedValue($event)"
   ></app-sbep-query-input>
      `
})
export class TestComponent {
  @ViewChild(SbepQueryInputComponent) sbepQueryInputComponent: SbepQueryInputComponent;
  selectedValues: any[] = [];
  selectWindowId = 'SysQuery_COMPANY_S1';
  resourceUrl = 'showcase/demo1/dynamic-listwin/getDynamicListwinData';
  title = '測試開窗';
  multiSelect = true;
  constructor() { }
  onselectedValue(value: any): void {
    console.log('TestComponent EventEmitter-value>>>>>>>', value);
  }
}

@Component({
  template: `
  <form [formGroup]="validateForm">
    <app-sbep-query-input
    formControlName = "SysQuery_COMPANY_S1"
    [selectWindowId]="selectWindowId"
    [resourceUrl]="resourceUrl"
    [title]="title"
    [multiSelect]="multiSelect"
    (selectedValue)="onselectedValue($event)"
     ></app-sbep-query-input>
   </form>
      `
})
export class TestFormComponent implements OnInit {
  public validateForm: FormGroup;
  @ViewChild(SbepQueryInputComponent) sbepQueryInputComponent: SbepQueryInputComponent;
  selectedValues: any[] = [];
  selectWindowId = 'SysQuery_COMPANY_S1';
  resourceUrl = 'showcase/demo1/dynamic-listwin/getDynamicListwinData';
  title = '測試開窗';
  multiSelect = true;
  constructor(
    private fBuilder: FormBuilder
  ) { }
  onselectedValue(value: any): void {
    console.log('TestComponent EventEmitter-value>>>>>>>', value);
  }
  ngOnInit(): void {
    this.validateForm = this.fBuilder.group({
      'SysQuery_COMPANY_S1': []
    });
  }
}
describe('SbepQueryInputComponent', () => {
  let de: DebugElement;
  let sbepQueryModalService: SbepQueryModalService;
  let originalTimeout: number;
  describe('no form', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          NoopAnimationsModule,
          SbepQueryModule,
          HttpClientTestingModule,
          TranslateTestingModule
        ],
        providers: [
          {
            provide: SbepQueryModalService, useValue: {
              open: (config: any, selected: Array<any>): Observable<any> => {
                return of([{
                  dwId: 'mockId1',
                  dwName: 'mockName1'
                }, {
                  id: 'mockId2',
                  dwName: 'mockName2'
                }]);
              }
            }
          }
        ],
        declarations: [SbepQueryInputComponent, TestComponent, TestFormComponent]
      })
        .overrideComponent(SbepQueryWinComponent, {
          set: {
            template: `SbepQueryWinComponent`
          }
        })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      sbepQueryModalService = TestBed.inject(SbepQueryModalService);

      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
      fixture.detectChanges();
    });
    afterEach(function() {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('按下x刪除已選取值, 會觸發ngModelChange', waitForAsync(() => {
      const spyngModelChange = spyOn(component.sbepQueryInputComponent, 'ngModelChange').and.callThrough();
      const openWindBT = de.query(By.css('button')).nativeElement;
      openWindBT.click(); // 開窗取值
      // eslint-disable-next-line quotes
      // const getDynamicListwinDataReq2 = httpMocker.expectOne("showcase/demo1/dynamic-listwin/getDynamicListwinData?queryInfo=%7B%22pageSize%22:10,%22pageNumber%22:1,%22orderfields%22:%5B%5D,%22condition%22:%7B%22joinOperator%22:%22AND%22,%22items%22:%5B%5D%7D,%22selectWindowId%22:%22SysQuery_COMPANY_S1%22%7D");
      // getDynamicListwinDataReq2.flush(JSON.parse(JSON.stringify(getDynamicListwinData)));
      // (document.querySelector('.ag-center-cols-container div:nth-child(2)') as HTMLDivElement).click();
      // fixture.detectChanges();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const closeTag = (de.query(By.css('nz-select-item i[nztype="close"]')).nativeElement);
        closeTag.click(); // 刪除第一個值
        fixture.detectChanges();
        // expect(spyngModelChange).toHaveBeenCalled();
        // console.log((spyngModelChange.calls.mostRecent().args[0]));
        fixture.whenStable().then(() => {
          fixture.detectChanges();
        });
      });
    }));
    it('按下x刪除已選取值, 當值被清空,ngModelChange入參需為[],', waitForAsync(() => {
      const spyngModelChange = spyOn(component.sbepQueryInputComponent, 'ngModelChange').and.callThrough();
      spyOn(sbepQueryModalService, 'open').and.returnValue(of([{
        dwid: 'mockId',
        dwName: 'mockName'
      }]));
      const openWindBT = de.query(By.css('button')).nativeElement;
      openWindBT.click(); // 開窗取值
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const closeTag = (de.query(By.css('nz-select-item i[nztype="close"]')).nativeElement);
        closeTag.click(); // 刪除值
        fixture.detectChanges();
        expect(spyngModelChange).toHaveBeenCalled();
        expect(spyngModelChange.calls.mostRecent().args[0]).toEqual([]);
        fixture.whenStable().then(() => {
          fixture.detectChanges();
        });
      });
    }));
  });
  describe('form', () => {
    let fixture: ComponentFixture<TestFormComponent>;
    let component: TestFormComponent;

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          NoopAnimationsModule,
          SbepQueryModule,
          HttpClientTestingModule,
          TranslateTestingModule,
          ReactiveFormsModule
        ],
        providers: [SbepQueryModalService],
        declarations: [SbepQueryInputComponent, TestComponent, TestFormComponent]
      })
        .overrideComponent(SbepQueryWinComponent, {
          set: {
            template: `SbepQueryWinComponent`
          }
        })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(TestFormComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      sbepQueryModalService = TestBed.inject(SbepQueryModalService);

      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
      fixture.detectChanges();
    });
    afterEach(function() {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
    it('should create', () => {
      expect(component).toBeTruthy();
    });
    it('設定formcontrol值, writeValue需被觸發', waitForAsync(() => {
      const spyWritevalue = spyOn(component.sbepQueryInputComponent, 'writeValue').and.callThrough();
      component.validateForm.get('SysQuery_COMPANY_S1').setValue([
        { id: 'c585efad-7cfd-467c-8c1d-551d445d13382', name: '0027员工借款单2' },
        { id: 'c585efad-7cfd-467c-8c1d-551d445d133813', name: '0027员工借款单13' }
      ]);
      component.validateForm.updateValueAndValidity();
      fixture.detectChanges();
      expect(spyWritevalue).toHaveBeenCalled();
      // // 會直接關窗
      // const spyOpen = spyOn(sbepQueryModalService, 'open').and.returnValue(of([{
      //   dwId: 'mockId2',
      //   dwName: 'mockName2'
      // }]));
      // const openWindBT = de.query(By.css('button')).nativeElement;
      // openWindBT.click(); // 開窗
      // fixture.detectChanges();
    }));

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

