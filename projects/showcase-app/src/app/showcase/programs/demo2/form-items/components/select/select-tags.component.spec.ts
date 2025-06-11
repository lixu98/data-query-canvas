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
import { SelectTagsComponent } from './select-tags.component';
registerLocaleData(zh);
describe('SelectTagsComponent', () => {
  let component: SelectTagsComponent;
  let fixture: ComponentFixture<SelectTagsComponent>;
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
      declarations: [SelectTagsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
    fixture = TestBed.createComponent(SelectTagsComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    // fixture.detectChanges();

  });
  afterEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
  it('選取框改變值, 繫結變數需跟著改變值', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const selectPicker = de.query(By.css('input')).nativeElement;
      selectPicker.click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const item = de.query(By.css('nz-option-item:nth-child(2)')).nativeElement;
        item.click();
        fixture.detectChanges();
        expect(component.users).toEqual(['jack','lucy']);
      });
    });
  }));
  it('選取框輸入值, 需可自動新增選項內容', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {

      fixture.detectChanges();
      const selectPicker = de.query(By.css('input')).nativeElement;
      selectPicker.click();
      fixture.detectChanges();
      selectPicker.value = 'lu';
      selectPicker.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const item = de.query(By.css('nz-option-item:nth-child(1)')).nativeElement; // 會出現一個第一個選項lu
        item.click();
        fixture.detectChanges();
        expect(component.users).toEqual(['jack','lu']);
        fixture.whenStable().then(() => {
          fixture.detectChanges();
        });
      });
    });
  }));
});
