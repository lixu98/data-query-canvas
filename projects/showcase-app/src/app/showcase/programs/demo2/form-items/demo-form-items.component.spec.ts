import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_DATE_FORMAT, APP_TIME_FORMAT } from '@webdpt/framework/config';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { NzIconTestModule } from 'ng-zorro-antd/icon/testing';
import { DemoFormItemsComponent } from './demo-form-items.component';
import { DemoFormItemsModule } from './demo-form-items.module';
registerLocaleData(zh);

describe('DemoFormItemsComponent', () => {
  let component: DemoFormItemsComponent;
  let fixture: ComponentFixture<DemoFormItemsComponent>;
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
      declarations: [DemoFormItemsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoFormItemsComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('基本使用', () => {
    it('點擊代碼, 需顯示代碼', fakeAsync(() => {
      const tabCode = de.query(By.css('[ng-reflect-nz-title="基本使用"] .ant-tabs-tab:nth-child(2)>div')).nativeElement;
      (tabCode as HTMLDivElement).click();
      fixture.detectChanges();
      tick(1000);
      expect(de.query(By.css('[ng-reflect-nz-title="基本使用"] code'))).toBeTruthy();
    }));
  });
});
