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
import { DwSimpleJobScheduleInModalComponent } from './simple-schedule.component';

registerLocaleData(zh);

describe('DwSimpleJobScheduleInModalComponent', () => {
  let component: DwSimpleJobScheduleInModalComponent;
  let fixture: ComponentFixture<DwSimpleJobScheduleInModalComponent>;
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
      declarations: [DwSimpleJobScheduleInModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DwSimpleJobScheduleInModalComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('開窗', () => {
    it('按下開窗, 需顯示排程開窗', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000);
      const bts = de.queryAll(By.css('button'));
      bts[0].nativeElement.click();
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      expect(document.querySelector('nz-modal-container')).toBeTruthy();
    }));
    it('按下開窗, 需可切換至週期性背景執行', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000);
      const bts = de.queryAll(By.css('button'));
      bts[0].nativeElement.click();
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      const radios = document.querySelectorAll('input[type="radio"]');
      (radios[1] as HTMLInputElement).click();
      expect(document.querySelector('nz-modal-container')).toBeTruthy();
      fixture.detectChanges();
      tick(1000);
      expect(document.querySelector('.ant-radio-button-wrapper-checked').textContent).toEqual('cycle-day-bg-job');
    }));
    it('開窗後按下每日時間radio, schedule需改變值', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000);
      const bts = de.queryAll(By.css('button'));
      bts[0].nativeElement.click();
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      expect(component.schedule.time1).toEqual('17,00,00,17,59,00,5,1');
      const radios = document.querySelectorAll('input[type="radio"]');
      (radios[2] as HTMLInputElement).click();
      fixture.detectChanges();
      tick(1000);
      expect(component.schedule.time1).toEqual('');
    }));
    it('開窗後按下確認, 需關閉排程開窗', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000);
      const bts = de.queryAll(By.css('button'));
      bts[0].nativeElement.click();
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);

      const confirmBT = (document.querySelector('nz-modal-container button[ng-reflect-nz-type="primary"]'));
      (confirmBT as HTMLButtonElement).click();
      fixture.detectChanges();
      tick(1000);
      expect(document.querySelector('nz-modal-container')).not.toBeTruthy();
    }));
  });
  describe('每日', ()=>{
    it('按下每日, 需顯示每日排程', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000);
      const bts = de.queryAll(By.css('button'));
      bts[1].nativeElement.click();
      fixture.detectChanges();
      flush();
      expect(document.querySelector('nz-time-picker')).toBeTruthy();
    }));
  });
  describe('每日時段', ()=>{
    it('按下每日時段, 需顯示每日時段排程', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000);
      const bts = de.queryAll(By.css('button'));
      bts[2].nativeElement.click();
      fixture.detectChanges();
      flush();
      expect(document.querySelector('label').textContent).toContain('section-1');
    }));
  });
  describe('週期', ()=>{
    it('按下週期, 需顯示週期排程', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000);
      const bts = de.queryAll(By.css('button'));
      bts[3].nativeElement.click();
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      expect(document.querySelector('nz-pagination')).toBeTruthy();
    }));
  });
  describe('每日及每日時段', ()=>{
    it('按下每日及每日時段, 需顯示每日及每日時段排程', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000);
      const bts = de.queryAll(By.css('button'));
      bts[4].nativeElement.click();
      fixture.detectChanges();
      flush();
      expect(document.querySelector('.ant-radio-wrapper-checked').textContent).toContain('time-of-every-day');
    }));
  });
  describe('每日時段及週期', ()=>{
    it('按下每日時段及週期, 需顯示每日時段及週期排程', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000);
      const bts = de.queryAll(By.css('button'));
      bts[5].nativeElement.click();
      fixture.detectChanges();
      tick(1000);
      expect(document.querySelector('nz-radio-group').textContent).toContain('every-day-bg-job');
    }));
  });
});
