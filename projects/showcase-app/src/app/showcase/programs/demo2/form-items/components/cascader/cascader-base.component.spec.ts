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
import { DemoFormItemsModule } from '../../demo-form-items.module';
import { CascaderBaseComponent } from './cascader-base.component';
registerLocaleData(zh);
describe('CascaderBaseComponent', () => {
  let component: CascaderBaseComponent;
  let fixture: ComponentFixture<CascaderBaseComponent>;
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
      declarations: [CascaderBaseComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
    fixture = TestBed.createComponent(CascaderBaseComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    // 在這裏觸發,會有error 'expect' was used when there was no current spec
    // fixture.detectChanges();
  });
  afterEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
  it('should be created', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges(); // settimeout
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
      });
    });

  }));
  it('點擊後需可彈窗選取', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const div = de.query(By.css('nz-cascader div')).nativeElement;
      div.click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const targetNode = document.querySelector('.cdk-overlay-container ul:nth-child(2) li:nth-child(2)');
        (targetNode as HTMLLIElement).click();
        fixture.detectChanges();
        expect(component.values).toEqual(['zhejiang', 'ningbo']);
      });

    });
  }));
});
