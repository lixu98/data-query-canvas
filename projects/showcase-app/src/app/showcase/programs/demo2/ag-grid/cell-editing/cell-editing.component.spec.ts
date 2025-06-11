import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DebugElement, TemplateRef } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DwSelectModalService } from '@webdpt/components/modals/select';
import { Observable, of } from 'rxjs';
import { MockDataClientPagingService } from '../../../../shared/select-modal/mock-data/mock-data-client-paging.service';
import { DwAgGridDemoModule } from '../ag-grid-demo.module';
import { CellEditingComponent } from './cell-editing.component';

describe('CellEditingComponent', () => {
  let component: CellEditingComponent;
  let fixture: ComponentFixture<CellEditingComponent>;
  let de: DebugElement;
  let originalTimeout: number;
  let httpMocker: HttpTestingController;
  let commonGridDataReq: () => void;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        HttpClientTestingModule,
        DwAgGridDemoModule
      ],
      providers: [
        MockDataClientPagingService,
        {
          provide: DwSelectModalService, useValue: {
            open: (config: any, selected: Array<any>, tagTemplate?: TemplateRef<any>,
              selectedCountTemplate?: TemplateRef<any>): Observable<any> => of(['c03'])
          }
        }],
      declarations: [CellEditingComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CellEditingComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    httpMocker = TestBed.inject(HttpTestingController);

    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
    commonGridDataReq = () => {
      fixture.whenStable().then(() => {
        const gridDataReq = httpMocker.expectOne('showcase/demo2/ag-grid/grid-data');
        gridDataReq.flush(JSON.parse(JSON.stringify(getGridData))); // colne deep,避免個別測試後影嚮原始資料
        fixture.detectChanges();
      });
    };
    // fixture.detectChanges();
  });
  afterEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    // After every test, assert that there are no more pending requests.
    httpMocker.verify();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('需建立ag-grid表單', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      commonGridDataReq();
      fixture.whenStable().then(() => {
        expect(de.query(By.css('ag-grid-angular'))).toBeTruthy();
        fixture.detectChanges();
      });
    });
  }));
  it('dbclick athlete需可以編輯', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      commonGridDataReq();
      fixture.whenStable().then(() => {
        expect(de.query(By.css('ag-grid-angular'))).toBeTruthy();
        fixture.detectChanges();
        console.log();
        const athleteDiv = document.querySelector('.ag-pinned-left-cols-container>div:nth-child(1)>div:nth-child(2)');
        (athleteDiv as HTMLDivElement).dispatchEvent(new Event('dblclick', { bubbles: true }));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(document.querySelector('dw-country-button-editor')).toBeTruthy();
        });
      });
    });
  }));
  // it('athlete可以編輯, 按下查詢按鈕需開窗', waitForAsync(() => {
  //   fixture.detectChanges();
  //   fixture.whenStable().then(() => {
  //     fixture.detectChanges();
  //     commonGridDataReq();
  //     fixture.whenStable().then(() => {
  //       expect(de.query(By.css('ag-grid-angular'))).toBeTruthy();
  //       fixture.detectChanges();
  //       const athleteDiv = document.querySelector('.ag-pinned-left-cols-container>div:nth-child(1)>div:nth-child(2)');
  //       (athleteDiv as HTMLDivElement).dispatchEvent(new Event('dblclick', { bubbles: true }));
  //       fixture.detectChanges();
  //       fixture.whenStable().then(() => {
  //         fixture.detectChanges();
  //         const searchBT = document.querySelector('dw-country-button-editor button');
  //         (searchBT as HTMLButtonElement).dispatchEvent(new Event('click', { bubbles: true }));
  //         fixture.detectChanges();
  //         fixture.whenStable().then(() => {
  //           fixture.detectChanges();
  //         });
  //       });
  //     });
  //   });
  // }));
  // fit('athlete可以編輯, 按下查詢按鈕需開窗', fakeAsync(() => {
  //   fixture.detectChanges();
  //   tick(1000);
  //   const gridDataReq = httpMocker.expectOne('showcase/demo2/ag-grid/grid-data');
  //   gridDataReq.flush(JSON.parse(JSON.stringify(getGridData))); // colne deep,避免個別測試後影嚮原始資料
  //   fixture.detectChanges();
  //   tick(1000);
  //   const athleteDiv = document.querySelector('.ag-pinned-left-cols-container>div:nth-child(1)>div:nth-child(2)');
  //   (athleteDiv as HTMLDivElement).dispatchEvent(new Event('dblclick', { bubbles: true }));
  //   fixture.detectChanges();
  //   tick(1000);
  //   const searchBT = document.querySelector('dw-country-button-editor button');
  //   (searchBT as HTMLButtonElement).dispatchEvent(new Event('click', { bubbles: true }));
  //   fixture.detectChanges();
  //   tick(1000);
  // }));
});
export const getGridData = [
  {
    'id': 1,
    'athlete': 'Black',
    'age': 23,
    'country': [
      'United States'
    ],
    'year': 2008,
    'date': '24/08/2008',
    'sport': 'Swimming',
    'gold': 8,
    'silver': 0,
    'bronze': 0,
    'total': 8
  },
  {
    'id': 2,
    'athlete': 'Michael Phelps',
    'age': 19,
    'country': [
      'United States'
    ],
    'year': 2004,
    'date': '29/08/2004',
    'sport': 'Swimming',
    'gold': 6,
    'silver': 0,
    'bronze': 2,
    'total': 8
  },
  {
    'id': 3,
    'athlete': 'Black',
    'age': 27,
    'country': [
      'United States'
    ],
    'year': 2012,
    'date': '12/08/2012',
    'sport': 'Swimming',
    'gold': 4,
    'silver': 2,
    'bronze': 0,
    'total': 6
  },
  {
    'id': 4,
    'athlete': 'Natalie Coughlin',
    'age': 25,
    'country': [
      'United States'
    ],
    'year': 2008,
    'date': '24/08/2008',
    'sport': 'Swimming',
    'gold': 1,
    'silver': 2,
    'bronze': 3,
    'total': 6
  },
  {
    'id': 5,
    'athlete': 'Aleksey Nemov',
    'age': 24,
    'country': [
      'Russia'
    ],
    'year': 2000,
    'date': '01/10/2000',
    'sport': 'Gymnastics',
    'gold': 2,
    'silver': 1,
    'bronze': 3,
    'total': 6
  },
  {
    'id': 6,
    'athlete': 'Alicia Coutts',
    'age': 24,
    'country': 'Australia',
    'year': 2012,
    'date': '12/08/2012',
    'sport': 'Swimming',
    'gold': 1,
    'silver': 3,
    'bronze': 1,
    'total': 5
  },
  {
    'id': 7,
    'athlete': 'Missy Franklin',
    'age': 17,
    'country': [
      'United States'
    ],
    'year': 2012,
    'date': '12/08/2012',
    'sport': 'Swimming',
    'gold': 4,
    'silver': 0,
    'bronze': 1,
    'total': 5
  },
  {
    'id': 8,
    'athlete': 'Ryan Lochte',
    'age': 27,
    'country': [
      'United States'
    ],
    'year': 2012,
    'date': '12/08/2012',
    'sport': 'Swimming',
    'gold': 2,
    'silver': 2,
    'bronze': 1,
    'total': 5
  },
  {
    'id': 9,
    'athlete': 'Allison Schmitt',
    'age': 22,
    'country': [
      'United States'
    ],
    'year': 2012,
    'date': '12/08/2012',
    'sport': 'Swimming',
    'gold': 3,
    'silver': 1,
    'bronze': 1,
    'total': 5
  },
  {
    'id': 10,
    'athlete': 'Natalie Coughlin',
    'age': 21,
    'country': [
      'United States'
    ],
    'year': 2004,
    'date': '29/08/2004',
    'sport': 'Swimming',
    'gold': 2,
    'silver': 2,
    'bronze': 1,
    'total': 5
  },
  {
    'id': 11,
    'athlete': 'Ian Thorpe',
    'age': 17,
    'country': 'Australia',
    'year': 2000,
    'date': '01/10/2000',
    'sport': 'Swimming',
    'gold': 3,
    'silver': 2,
    'bronze': 0,
    'total': 5
  }
];
