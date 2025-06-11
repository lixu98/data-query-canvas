import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { NzIconTestModule } from 'ng-zorro-antd/icon/testing';
import { PaginationDemoModule } from '../pagination-demo.module';
import { PaginationAgGridCsComponent } from './pagination-ag-grid-cs.component';


describe('PaginationAgGridCsComponent', () => {
  let component: PaginationAgGridCsComponent;
  let fixture: ComponentFixture<PaginationAgGridCsComponent>;
  let de: DebugElement;
  let originalTimeout: number;
  let httpMocker: HttpTestingController;
  let commonGridDataReq: () => void;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslateTestingModule,
        NzIconTestModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
        PaginationDemoModule
      ],
      declarations: [PaginationAgGridCsComponent],
      providers: [
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationAgGridCsComponent);
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
        expect(document.querySelectorAll('.ag-center-cols-container>div').length).toEqual(10);
      });
    });
  }));
  it('按下分頁, 需觸發onDataSourceChange', waitForAsync(() => {
    const spyOnDataSourceChange = spyOn(component, 'onDataSourceChange').and.callThrough();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      commonGridDataReq();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const page2Tag = de.query(By.css('nz-pagination>li:nth-child(3) a')).nativeElement;
        page2Tag.click();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(spyOnDataSourceChange).toHaveBeenCalledTimes(1);
        });
      });
    });
  }));
});
export const getGridData = {
  rowCount: 11,
  pageCount: 3,
  pageSize: 5,
  currentPage: 1,
  data: [
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
      'total': 6,
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
  ]
};
