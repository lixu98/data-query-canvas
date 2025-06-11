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
import { InputFormComponent } from './input-form.component';
registerLocaleData(zh);
describe('InputFormComponent', () => {
  let component: InputFormComponent;
  let fixture: ComponentFixture<InputFormComponent>;
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
      declarations: [InputFormComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputFormComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('輸入框改變值, 繫結變數需跟著改變值', waitForAsync(() => {
    // fixture.detectChanges();
    fixture.whenStable().then(() => {
      const input1 = de.queryAll(By.css('input'))[0].nativeElement;
      input1.value = '1234567';
      input1.dispatchEvent(new Event('input'));
      const input2 = de.queryAll(By.css('input'))[1].nativeElement;
      input2.value = 'b@gmail.com';
      input2.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(component.form.value).toEqual({ username: '1234567', email: 'b@gmail.com' });
    });
  }));
  it('不符驗證規則,需顯示錯誤訊息', waitForAsync(() => {
    // fixture.detectChanges();
    fixture.whenStable().then(() => {
      const input1 = de.queryAll(By.css('input'))[0].nativeElement;
      input1.value = '1234';
      input1.dispatchEvent(new Event('input'));
      const input2 = de.queryAll(By.css('input'))[1].nativeElement;
      input2.value = 'bbb';
      input2.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(component.form.controls['email'].errors).toEqual({ email: true });
      expect(component.form.controls['username'].errors).toEqual({ minlength: { requiredLength: 6, actualLength: 4 } });
    });
  }));
});
