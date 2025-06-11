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
import { InputSizeComponent } from './input-size.component';
registerLocaleData(zh);
describe('InputSizeComponent', () => {
  let component: InputSizeComponent;
  let fixture: ComponentFixture<InputSizeComponent>;
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
      declarations: [InputSizeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputSizeComponent);
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
      expect(component.username).toEqual('123');
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
        });
      });
    });
  }));
  it('設定dwSize, 需改變input font-size', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const inputs = de.queryAll(By.css('input'));
      expect((inputs[0].nativeElement as HTMLInputElement).classList.value).toContain('ant-input-sm');
      expect((inputs[2].nativeElement as HTMLInputElement).classList.value).toContain('ant-input-lg');
    });
  }));
});
