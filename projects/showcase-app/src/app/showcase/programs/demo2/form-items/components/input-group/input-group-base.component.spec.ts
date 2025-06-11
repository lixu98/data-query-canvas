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
import { InputGroupBaseComponent } from './input-group-base.component';
registerLocaleData(zh);
describe('InputGroupBaseComponent', () => {
  let component: InputGroupBaseComponent;
  let fixture: ComponentFixture<InputGroupBaseComponent>;
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
      declarations: [InputGroupBaseComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputGroupBaseComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();

  });

  it('輸入框改變值, 繫結變數需跟著改變值', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const input = de.query(By.css('input')).nativeElement;
      input.value = '123';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(component.searchText).toEqual('123');
    });
  }));
  it('按下清除鈕, 需清空值', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const input = de.query(By.css('input')).nativeElement;
      input.value = '123';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(component.searchText).toEqual('123');
      const close = de.query(By.css('i[nztype="close-circle"]')).nativeElement;
      close.click();
      fixture.detectChanges();
      expect(component.searchText).toEqual(null);
    });
  }));
  it('需顯示前後綴圖示', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(de.query(By.css('i[ng-reflect-nz-type="search"]')).nativeElement).withContext('查詢icon').toBeTruthy();
      expect(de.query(By.css('button[nztype="primary"]')).nativeElement).withContext('加按鈕').toBeTruthy();
      expect(de.query(By.css('button[nztype="primary"]')).nativeElement).withContext('加按鈕').toBeTruthy();
    });
  }));
});
