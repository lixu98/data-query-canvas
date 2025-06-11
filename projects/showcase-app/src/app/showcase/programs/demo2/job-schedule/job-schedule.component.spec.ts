import { DatePipe, registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_DATE_FORMAT, APP_TIME_FORMAT } from '@webdpt/framework/config';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { NzIconTestModule } from 'ng-zorro-antd/icon/testing';
import { DwJobScheduleComponent } from './job-schedule.component';
import { DwJobScheduleModule } from './job-schedule.module';

registerLocaleData(zh);

describe('DwJobScheduleComponent', () => {
  let component: DwJobScheduleComponent;
  let fixture: ComponentFixture<DwJobScheduleComponent>;
  let de: DebugElement;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        DwJobScheduleModule,
        TranslateTestingModule,
        NzIconTestModule,
        NoopAnimationsModule
      ],
      providers: [
        DatePipe,
        { provide: APP_DATE_FORMAT, useValue: 'yyyy/MM/dd' },
        { provide: APP_TIME_FORMAT, useValue: 'hh:mm:ss' }
      ],
      declarations: [DwJobScheduleComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DwJobScheduleComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('點擊代碼, 需顯示代碼', fakeAsync(() => {
    tick(1000);
    const tabCode = de.query(By.css('.ant-tabs-tab:nth-child(2)>div')).nativeElement;
    (tabCode as HTMLDivElement).click();
    fixture.detectChanges();
    tick(1000);
    expect(de.query(By.css('code'))).toBeTruthy();
  }));
});
