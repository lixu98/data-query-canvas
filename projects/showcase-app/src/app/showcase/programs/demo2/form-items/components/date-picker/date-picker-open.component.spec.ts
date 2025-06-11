import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_DATE_FORMAT, APP_TIME_FORMAT } from '@webdpt/framework/config';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { NzIconTestModule } from 'ng-zorro-antd/icon/testing';
import { DemoFormItemsModule } from '../../demo-form-items.module';
import { DatePickerOpenComponent } from './date-picker-open.component';
registerLocaleData(zh);
describe('DatePickerOpenComponent', () => {
  let component: DatePickerOpenComponent;
  let fixture: ComponentFixture<DatePickerOpenComponent>;
  let de: DebugElement;
  let originalTimeout: number;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        DemoFormItemsModule,
        TranslateTestingModule,
        NzIconTestModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: APP_DATE_FORMAT, useValue: 'yyyy/MM/dd' },
        { provide: APP_TIME_FORMAT, useValue: 'hh:mm:ss' }
      ],
      declarations: [DatePickerOpenComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
    fixture = TestBed.createComponent(DatePickerOpenComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    // fixture.detectChanges();

  });
  afterEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
  it('輸入框改變值, 繫結變數需跟著改變值', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const datePicker = de.query(By.css('nz-date-picker')).nativeElement;
      datePicker.click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        ((document.querySelector('tr:nth-child(2) td:nth-child(1)')) as HTMLTableColElement).click();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          ((document.querySelector('button[nztype="primary"]')) as HTMLTableColElement).click();
          fixture.detectChanges();
          expect(component.startValue).toBeTruthy();
        });
      });
    });
  }));
  it('有選取開始時間, 結束時間需disabled開始時間之前的日期選取', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const datePickers = de.queryAll(By.css('nz-date-picker'));
      datePickers[0].nativeElement.click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        ((document.querySelector('tr:nth-child(2) td:nth-child(1)')) as HTMLTableColElement).click(); // 選取開始時間
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          ((document.querySelector('button[nztype="primary"]')) as HTMLTableColElement).click();
          fixture.detectChanges();
          expect(component.startValue).toBeTruthy();
          datePickers[1].nativeElement.click(); // 按下結束時間
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            fixture.detectChanges();
            ((document.querySelector('tr:nth-child(2) td:nth-child(1)')) as HTMLTableColElement).click(); // 再次按下同一個時間
            fixture.detectChanges();
            expect(component.endValue).not.toBeTruthy(); // 沒取到值
          });
        });
      });
    });
  }));
});
