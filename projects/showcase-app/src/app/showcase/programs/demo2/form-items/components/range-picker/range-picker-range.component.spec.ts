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
import { RangePickerRangeComponent } from './range-picker-range.component';
registerLocaleData(zh);
describe('RangePickerRangeComponent', () => {
  let component: RangePickerRangeComponent;
  let fixture: ComponentFixture<RangePickerRangeComponent>;
  let de: DebugElement;
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
      declarations: [RangePickerRangeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RangePickerRangeComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    // fixture.detectChanges();

  });

  it('輸入框改變值, 繫結變數需跟著改變值', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const datePicker = de.query(By.css('nz-range-picker')).nativeElement;
      datePicker.click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        ((document.querySelector('tr:nth-child(2) td:nth-child(1)')) as HTMLTableColElement).click();
        ((document.querySelector('tr:nth-child(2) td:nth-child(2)')) as HTMLTableColElement).click();
        fixture.detectChanges();
        expect(component.ranges.length).toEqual(2);
      });
    });
  }));
  it('按下今日, 需取值', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const datePicker = de.query(By.css('nz-range-picker')).nativeElement;
      datePicker.click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        ((document.querySelector('ul.ant-picker-ranges li:nth-child(1)')) as HTMLLIElement).click();
        fixture.detectChanges();
        expect(component.ranges.length).toEqual(2);
      });
    });
  }));
  it('按下本月, 需取值', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const datePicker = de.query(By.css('nz-range-picker')).nativeElement;
      datePicker.click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        ((document.querySelector('ul.ant-picker-ranges li:nth-child(2)')) as HTMLLIElement).click();
        fixture.detectChanges();
        expect(component.ranges.length).toEqual(2);
      });
    });
  }));
});
