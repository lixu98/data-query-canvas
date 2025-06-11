import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DwListService } from '@webdpt/framework/document';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { SbepQueryModule } from '../../../shared/dynamic-modal/sbep-query/sbep-query.module';

import { DynamicListwinComponent } from './dynamic-listwin.component';
import { DynamicListwinModule } from './dynamic-listwin.module';

describe('DynamicListwinComponent', () => {
  let component: DynamicListwinComponent;
  let fixture: ComponentFixture<DynamicListwinComponent>;
  let de: DebugElement;
  let httpMocker: HttpTestingController;
  let dwListService: DwListService;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        DynamicListwinModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        TranslateTestingModule,
        SbepQueryModule
      ],
      declarations: [ DynamicListwinComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicListwinComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    httpMocker = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });
  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpMocker.verify();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('getFormGroupValue', () => {
    const spyGetFormGroupValue = spyOn(component, 'getFormGroupValue').and.callThrough();
    const getFormGroupValueBT = de.query(By.css('.dw-f-dynamic-val button')).nativeElement;
    getFormGroupValueBT.click();
    expect(spyGetFormGroupValue).toHaveBeenCalled();
  });
  it('clearValue', () => {
    const spyClearValue = spyOn(component, 'clearValue').and.callThrough();
    const clearValueBT = de.query(By.css('nz-form-control button:nth-child(2)')).nativeElement;
    clearValueBT.click();
    expect(spyClearValue).toHaveBeenCalled();
  });
  // fit('開窗需可以取資料', fakeAsync(()=>{
  //   const openWindBT = de.query(By.css('nz-form-control button:nth-child(1)')).nativeElement;
  //   openWindBT.click();
  //   const getDynamicListwinDataReq = httpMocker.expectOne('showcase/demo1/dynamic-listwin/getDynamicListwinData');
  //   getDynamicListwinDataReq.flush(JSON.parse(JSON.stringify(getDynamicListwinData)));
  //   fixture.detectChanges();
  //   tick(1000);
  // }));
});
export const getDynamicListwinData ={
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
