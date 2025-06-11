import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DebugElement, TemplateRef} from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DwSelectModalService } from '@webdpt/components/modals/select';
import { Observable, of } from 'rxjs';
import { MockDataClientPagingService } from '../../../../shared/select-modal/mock-data/mock-data-client-paging.service';
import { DwAgGridDemoModule } from '../ag-grid-demo.module';
import { AgGridPerformanceComponent } from './ag-grid-performance.component';

describe('AgGridPerformanceComponent', () => {
  let component: AgGridPerformanceComponent;
  let fixture: ComponentFixture<AgGridPerformanceComponent>;
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
        }      ],
      declarations: [AgGridPerformanceComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgGridPerformanceComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    httpMocker = TestBed.inject(HttpTestingController);

    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
    commonGridDataReq = () => {
      fixture.whenStable().then(() => {
        const gridDataReq = httpMocker.expectOne('showcase/demo2/ag-grid/grid-large-data');
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
});
export const getGridData = [
  {
    '1': 0,
    '3': 8,
    'id': 1,
    'athlete': 'Black',
    'age': 23,
    'country': 'United States',
    'year': 2008,
    'date': '24/08/2008',
    'sport': 'Swimming',
    'gold': 8,
    'silver': 0,
    'bronze': 0,
    'total': 8,
    'athlete1': 'Black',
    'age1': 23,
    'country1': '',
    'country11': 'United States',
    'year1': 2008,
    'date1': '24/08/2008',
    'sport1': 'Swimming',
    'gold1': 8,
    'bronze1': 0,
    'total1': 8,
    'athlete2': 'Black',
    'age2': 23,
    'country2': '',
    'country22': 'United States',
    'year2': 2008,
    'date2': '24/08/2008',
    'sport2': 'Swimming',
    'gold2': 8,
    'silver2': 0,
    'bronze2': 0,
    'total2': 8,
    'athlete3': 'Black',
    'age3': 23,
    'country3': 'United States',
    'year3': 2008,
    'date3': '24/08/2008',
    'sport3': 'Swimming',
    'gold3': 8,
    'silver3': 0,
    'bronze3': 0
  },
  {
    '1': 0,
    '3': 8,
    'id': 2,
    'athlete': 'Michael Phelps',
    'age': 19,
    'country': 'United States',
    'year': 2004,
    'date': '29/08/2004',
    'sport': 'Swimming',
    'gold': 6,
    'silver': 0,
    'bronze': 2,
    'total': 8,
    'athlete1': 'Michael Phelps',
    'age1': 19,
    'country1': '',
    'country11': 'United States',
    'year1': 2004,
    'date1': '29/08/2004',
    'sport1': 'Swimming',
    'gold1': 6,
    'bronze1': 2,
    'total1': 8,
    'athlete2': 'Michael Phelps',
    'age2': 19,
    'country2': '',
    'country22': 'United States',
    'year2': 2004,
    'date2': '29/08/2004',
    'sport2': 'Swimming',
    'gold2': 6,
    'silver2': 0,
    'bronze2': 2,
    'total2': 8,
    'athlete3': 'Michael Phelps',
    'age3': 19,
    'country3': 'United States',
    'year3': 2004,
    'date3': '29/08/2004',
    'sport3': 'Swimming',
    'gold3': 6,
    'silver3': 0,
    'bronze3': 2
  },
  {
    '1': 2,
    '3': 6,
    'id': 3,
    'athlete': 'Black',
    'age': 27,
    'country': 'United States',
    'year': 2012,
    'date': '12/08/2012',
    'sport': 'Swimming',
    'gold': 4,
    'silver': 2,
    'bronze': 0,
    'total': 6,
    'athlete1': 'Black',
    'age1': 27,
    'country1': '',
    'country11': 'United States',
    'year1': 2012,
    'date1': '12/08/2012',
    'sport1': 'Swimming',
    'gold1': 4,
    'bronze1': 0,
    'total1': 6,
    'athlete2': 'Black',
    'age2': 27,
    'country2': '',
    'country22': 'United States',
    'year2': 2012,
    'date2': '12/08/2012',
    'sport2': 'Swimming',
    'gold2': 4,
    'silver2': 2,
    'bronze2': 0,
    'total2': 6,
    'athlete3': 'Black',
    'age3': 27,
    'country3': 'United States',
    'year3': 2012,
    'date3': '12/08/2012',
    'sport3': 'Swimming',
    'gold3': 4,
    'silver3': 2,
    'bronze3': 0
  },
  {
    '1': 2,
    '3': 6,
    'id': 4,
    'athlete': 'Natalie Coughlin',
    'age': 25,
    'country': 'United States',
    'year': 2008,
    'date': '24/08/2008',
    'sport': 'Swimming',
    'gold': 1,
    'silver': 2,
    'bronze': 3,
    'total': 6,
    'athlete1': 'Natalie Coughlin',
    'age1': 25,
    'country1': '',
    'country11': 'United States',
    'year1': 2008,
    'date1': '24/08/2008',
    'sport1': 'Swimming',
    'gold1': 1,
    'bronze1': 3,
    'total1': 6,
    'athlete2': 'Natalie Coughlin',
    'age2': 25,
    'country2': '',
    'country22': 'United States',
    'year2': 2008,
    'date2': '24/08/2008',
    'sport2': 'Swimming',
    'gold2': 1,
    'silver2': 2,
    'bronze2': 3,
    'total2': 6,
    'athlete3': 'Natalie Coughlin',
    'age3': 25,
    'country3': 'United States',
    'year3': 2008,
    'date3': '24/08/2008',
    'sport3': 'Swimming',
    'gold3': 1,
    'silver3': 2,
    'bronze3': 3
  },
  {
    '1': 1,
    '3': 6,
    'id': 5,
    'athlete': 'Aleksey Nemov',
    'age': 24,
    'country': 'Russia',
    'year': 2000,
    'date': '01/10/2000',
    'sport': 'Gymnastics',
    'gold': 2,
    'silver': 1,
    'bronze': 3,
    'total': 6,
    'athlete1': 'Aleksey Nemov',
    'age1': 24,
    'country1': '',
    'country11': 'Russia',
    'year1': 2000,
    'date1': '01/10/2000',
    'sport1': 'Gymnastics',
    'gold1': 2,
    'bronze1': 3,
    'total1': 6,
    'athlete2': 'Aleksey Nemov',
    'age2': 24,
    'country2': '',
    'country22': 'Russia',
    'year2': 2000,
    'date2': '01/10/2000',
    'sport2': 'Gymnastics',
    'gold2': 2,
    'silver2': 1,
    'bronze2': 3,
    'total2': 6,
    'athlete3': 'Aleksey Nemov',
    'age3': 24,
    'country3': 'Russia',
    'year3': 2000,
    'date3': '01/10/2000',
    'sport3': 'Gymnastics',
    'gold3': 2,
    'silver3': 1,
    'bronze3': 3
  }
];
