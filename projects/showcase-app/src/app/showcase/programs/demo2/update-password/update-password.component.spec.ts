import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import zh from '@angular/common/locales/zh';
registerLocaleData(zh);

import { registerLocaleData } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { UpdatePasswordComponent } from './update-password.component';
import { UpdatePasswordModule } from './update-password.module';
import { DwUpdatePasswordModalService } from '@webdpt/components/modals/update-password';
import { of } from 'rxjs';
import { DwSystemConfigService } from '@webdpt/framework/config';

describe('UpdatePasswordComponent', () => {
  let component: UpdatePasswordComponent;
  let fixture: ComponentFixture<UpdatePasswordComponent>;
  let de: DebugElement;
  let dwUpdatePasswordModalService: DwUpdatePasswordModalService;
  const commonConfigs = {
    imports: [
      NoopAnimationsModule,
      UpdatePasswordModule,
      TranslateTestingModule,
    ],
    providers: [
      { provide: DwUpdatePasswordModalService, useValue: { open: () => of(true) } },
      { provide: DwSystemConfigService, useValue: { get: (key: string) => of(true) } } // multiTenant為true
    ],
    declarations: [UpdatePasswordComponent]
  };
  describe('雲端', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule(commonConfigs)
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(UpdatePasswordComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      dwUpdatePasswordModalService = TestBed.inject(DwUpdatePasswordModalService);
      // fixture.detectChanges();
    });

    it('should create', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });
    it('endpoint', () => {
      fixture.detectChanges();
      expect(component.endpoint).toEqual('dw-update-password-demo-cloud');
    });
    it('按下按鈕, 需執行dwUpdatePasswordModalService.open', fakeAsync(() => {
      fixture.detectChanges();
      const spyOpen = spyOn(dwUpdatePasswordModalService, 'open').and.callThrough();
      const bt = de.queryAll(By.css('button'))[0].nativeElement;
      bt.click();
      fixture.detectChanges();
      tick();
      expect(spyOpen).toHaveBeenCalled();
    }));
    it('按下按鈕, 需執行dwUpdatePasswordModalService.open', fakeAsync(() => {
      fixture.detectChanges();
      const spyOpen = spyOn(dwUpdatePasswordModalService, 'open').and.callThrough();
      const bt = de.queryAll(By.css('button'))[1].nativeElement;
      bt.click();
      fixture.detectChanges();
      tick();
      expect(spyOpen).toHaveBeenCalled();
    }));
  });
  describe('地端', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule(commonConfigs)
        .overrideProvider(DwSystemConfigService, { useValue: { get: (key: string) => of(false) } })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(UpdatePasswordComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      dwUpdatePasswordModalService = TestBed.inject(DwUpdatePasswordModalService);
      // fixture.detectChanges();
    });
    it('endpoint', () => {
      fixture.detectChanges();
      expect(component.endpoint).toEqual('dw-update-password-demo-ground');
    });
  });

});

