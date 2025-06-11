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
import { TextareaAutosizeComponentComponent } from './textarea-autosize.component';
registerLocaleData(zh);
describe('TextareaAutosizeComponentComponent', () => {
  let component: TextareaAutosizeComponentComponent;
  let fixture: ComponentFixture<TextareaAutosizeComponentComponent>;
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
      declarations: [TextareaAutosizeComponentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
    fixture = TestBed.createComponent(TextareaAutosizeComponentComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });
  afterEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
  it('自適應需隨換行改變textarea高度', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const textarea = de.query(By.css('textarea')).nativeElement;
      expect((textarea as HTMLTextAreaElement).style.height).toEqual('32px');
      textarea.value = '123\n456\n789\n111\n';
      textarea.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect((textarea as HTMLTextAreaElement).style.height).toEqual('120px');
    });
  }));
  it('限制高度超過設定,需不改變textarea高度', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const textareas = de.queryAll(By.css('textarea'));
      const textarea = textareas[1].nativeElement as HTMLTextAreaElement;
      expect(textarea.style.height).toEqual('76px');
      textarea.value = '123\n456\n789\n111\n\n\n\n';
      textarea.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect((textarea as HTMLTextAreaElement).style.height).toEqual('142px');
      textarea.value = '123\n456\n789\n111\n\n\n\n\n\n\n\n';
      textarea.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect((textarea as HTMLTextAreaElement).style.height).toEqual('142px');
    });
  }));

});
