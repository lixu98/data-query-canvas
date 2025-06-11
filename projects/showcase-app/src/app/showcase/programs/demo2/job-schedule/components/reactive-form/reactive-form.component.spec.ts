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
import { DwJobScheduleModule } from '../../job-schedule.module';
import { DwJobScheduleInReactiveFormComponent } from './reactive-form.component';

registerLocaleData(zh);

describe('DwJobScheduleInReactiveFormComponent', () => {
  let component: DwJobScheduleInReactiveFormComponent;
  let fixture: ComponentFixture<DwJobScheduleInReactiveFormComponent>;
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
      declarations: [DwJobScheduleInReactiveFormComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DwJobScheduleInReactiveFormComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('開窗後按下每日時間radio, form需改變值', fakeAsync(() => {
    fixture.detectChanges();
    tick(1000);
    expect(component.form.controls['schedule'].value.time1).toEqual('17,00,00,17,59,00,5,1');
    const radios = document.querySelectorAll('input[type="radio"]');
    (radios[2] as HTMLInputElement).click();
    fixture.detectChanges();
    tick(1000);
    expect(component.form.controls['schedule'].value.time1).toEqual('');
  }));

});
