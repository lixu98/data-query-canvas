import { CommonModule } from '@angular/common';
import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { APP_DATE_FORMAT, APP_TIME_FORMAT } from '@webdpt/framework/config';
import { DwLanguageService } from '@webdpt/framework/language';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { of } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DataModel, OriginDataModel } from '../model';
import { ShowcaseTreeModule } from '../tree.module';
import { ShowcaseEditShowcaseDataModalComponent } from './edit-data-modal.component';
@Component({
  template: `
      <app-dw-showcase-edit-data-modal
       [item]='item'
      ></app-dw-showcase-edit-data-modal>
    `
})
class TestComponent {
  @ViewChild(ShowcaseEditShowcaseDataModalComponent, { static: true }) comp: ShowcaseEditShowcaseDataModalComponent;
  item: DataModel = {
    key: 1,
    name:'mockName',
    address: 'mockAddress',
    amount: 100,
    status: true
  };
}
const ModalRefTest: any = {
  afterOpen: of(null),
  afterClose: of(true),
  open: (): any => { },
  close: (): any => { },
  destroy: (): any => { },
  triggerOk: (): any => { console.log('triggerOk'); },
  triggerCancel: (): any => { console.log('triggerCancel'); },
  getContentComponent: (): any => {
    return {
      errorSubject$: of(null).pipe(filter(obsData => obsData !== null))
    };
  },
  getElement: (): any => { },
  getInstance: (): any => { }
};
describe('ShowcaseEditShowcaseDataModalComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let de: DebugElement;
  let dwModalRef: NzModalRef;
  const configureTestingModule = {
    imports: [
      CommonModule,
      ReactiveFormsModule,
      TranslateTestingModule,
      NzModalModule,
      NoopAnimationsModule,
      ShowcaseTreeModule
    ],
    providers: [
      { provide: DwLanguageService, useValue: { language$: of('zh_TW') } }, // DwLanguageStylePipe(dwLanguage)使用到
      { provide: NzModalRef, useValue: ModalRefTest },
      { provide: APP_DATE_FORMAT, useValue: 'yyyy/MM/dd' },
      { provide: APP_TIME_FORMAT, useValue: 'hh:mm:ss' },
    ],
    declarations: [
      TestComponent,
      ShowcaseEditShowcaseDataModalComponent
    ]
  };
  describe('default', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule(configureTestingModule)
        .compileComponents();
    }));
    beforeEach(() => {
      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      dwModalRef = TestBed.inject(NzModalRef);
    });
    it('should create', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000);
      expect(component).toBeTruthy();
    }));
    it('validateForm.valid為true, 需可送出資料', fakeAsync(()=>{
      const spyEmitDataOutside = spyOn(component.comp, 'emitDataOutside').and.callThrough();
      fixture.detectChanges();
      tick(1000);

      expect(component.comp.validateForm.valid).toEqual(true);
      de.query(By.css('button[type="submit"]')).nativeElement.click();
      fixture.detectChanges();
      tick(1000);
      expect(spyEmitDataOutside).toHaveBeenCalled();
    }));
    it('按下取消, 需觸發handleCancel', fakeAsync(() => {
      const spyHandleCancel = spyOn(component.comp, 'handleCancel').and.callThrough();
      fixture.detectChanges();
      tick(1000);
      de.query(By.css('button[type="button"]')).nativeElement.click();
      fixture.detectChanges();
      tick(1000);
      expect(spyHandleCancel).toHaveBeenCalled();
    }));
  });

});
