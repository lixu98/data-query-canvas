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
import { OriginDataModel } from '../model';
import { ShowcaseTreeModule } from '../tree.module';
import { ShowcaseDataModalComponent } from './data-modal.component';
@Component({
  template: `
      <app-dw-showcase-data-modal
       [originData]='originData'
      ></app-dw-showcase-data-modal>
    `
})
class TestComponent {
  @ViewChild(ShowcaseDataModalComponent, { static: true }) comp: ShowcaseDataModalComponent;
  originData: OriginDataModel[] = [
    {
      key: 1,
      name: 'John Brown sr.',
      amount: 60,
      status: true,
      update: '2016-09-21  08:50:08',
      address: 'New York No. 1 Lake Park',
      children: [{
        key: 11,
        name: 'John Brown',
        amount: 42,
        status: true,
        update: '2016-09-21  08:50:08',
        address: 'New York No. 2 Lake Park',
      }, {
        key: 12,
        name: 'John Brown jr.',
        amount: 30,
        status: true,
        update: '2016-09-21  08:50:08',
        address: 'New York No. 3 Lake Park',
        children: [{
          key: 121,
          name: 'Jimmy Brown',
          amount: 16,
          status: true,
          update: '2016-09-21  08:50:08',
          address: 'New York No. 3 Lake Park',
        }],
      }
      ],
    },
    {
      key: 2,
      name: 'Joe Black',
      amount: 32,
      status: false,
      update: '2016-09-21  08:50:08',
      address: 'Sidney No. 1 Lake Park',
    }
  ];
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
describe('ShowcaseDataModalComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let de: DebugElement;
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
      ShowcaseDataModalComponent
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
    });
    it('should create', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000);
      expect(component).toBeTruthy();
    }));
    it('初始後, 需建立子分支選項資料', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000);
      expect(component.comp.typeOptions).not.toBeNull();
    }));
    it('選項為新組織, formcontrol parent值需為空[]', fakeAsync(()=>{
      fixture.detectChanges();
      tick(1000);
      const radioBranch = de.queryAll(By.css('input[type="radio"]'))[1].nativeElement;
      radioBranch.click();
      fixture.detectChanges();
      tick(1000);
      const radioNew = de.queryAll(By.css('input[type="radio"]'))[0].nativeElement;
      radioNew.click();
      fixture.detectChanges();
      tick(1000);
      expect(component.comp.validateForm.controls['parent'].value).toEqual([]);
    }));
    describe('選項為建立子分支', ()=>{
      it('formcontrol parent需為必選', fakeAsync(()=>{
        fixture.detectChanges();
        tick(1000);
        const radioInput = de.queryAll(By.css('input[type="radio"]'))[1].nativeElement;
        radioInput.click();
        fixture.detectChanges();
        tick(1000);
        expect(component.comp.validateForm.controls['parent'].errors).toEqual({required: true});
      }));
      it('validateForm.valid為true, 需可送出資料', fakeAsync(()=>{
        const spyEmitDataOutside = spyOn(component.comp, 'emitDataOutside').and.callThrough();
        fixture.detectChanges();
        tick(1000);
        const radioInput = de.queryAll(By.css('input[type="radio"]'))[1].nativeElement;
        radioInput.click();
        fixture.detectChanges();
        tick(1000);
        component.comp.validateForm.controls['parent'].setValue([2]);
        component.comp.validateForm.controls['name'].setValue('mockName');
        component.comp.validateForm.controls['address'].setValue('mockAddress');
        component.comp.validateForm.controls['amount'].setValue(100);
        component.comp.validateForm.controls['status'].setValue(true);
        component.comp.validateForm.updateValueAndValidity();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(component.comp.validateForm.valid).toEqual(true);
        de.query(By.css('button[type="submit"]')).nativeElement.click();
        fixture.detectChanges();
        tick(1000);
        expect(spyEmitDataOutside).toHaveBeenCalled();
      }));
    });
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
