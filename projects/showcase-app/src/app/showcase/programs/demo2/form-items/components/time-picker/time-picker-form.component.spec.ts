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
import { TimePickerFormComponent } from './time-picker-form.component';
registerLocaleData(zh);
describe('TimePickerFormComponent', () => {
  let component: TimePickerFormComponent;
  let fixture: ComponentFixture<TimePickerFormComponent>;
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
      declarations: [TimePickerFormComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
    fixture = TestBed.createComponent(TimePickerFormComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    // fixture.detectChanges();

  });
  afterEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
  it('選取框改變值, formcontrol需跟著改變值', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const picker = de.query(By.css('input')).nativeElement;
      picker.click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const item = de.query(By.css('ul li:nth-child(3)>div')).nativeElement;
        item.click();
        fixture.detectChanges();
        const confirm = de.query(By.css('button[nztype="primary"]')).nativeElement;
        confirm.click();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(component.form.controls['today'].value).toBeTruthy();
        });
      });
    });
  }));

});
