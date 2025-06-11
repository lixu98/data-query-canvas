import { CommonModule } from '@angular/common';
import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DwFormItemsModule } from '@webdpt/components/form-items';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { DwModalRefTest } from '@webdpt/framework/sharedTest/common-test-service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { of } from 'rxjs';
import { filter } from 'rxjs/operators';
import { OrderDetailEditComponent } from './order-detail-edit.component';
@Component({
  template: `
      <app-dw-order-detail-edit
       [orderDetail]='orderDetail'
       [cmd]='cmd'
      ></app-dw-order-detail-edit>
    `
})
class TestComponent {
  @ViewChild(OrderDetailEditComponent, { static: true }) comp: OrderDetailEditComponent;
  cmd = 'edit';
  orderDetail = {
    productCode: 'productCode1234',
    productName: 'productName',
    price: 10,
    quantity: 1
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
describe('OrderDetailEditComponent', () => {
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
      DwFormItemsModule,
      NzFormModule,
      NzInputNumberModule,
      NzInputModule,
      NzLayoutModule,
      NzButtonModule,
    ],
    providers: [
      { provide: NzModalRef, useValue: DwModalRefTest },
    ],
    declarations: [
      TestComponent,
      OrderDetailEditComponent
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
    it('cmd===add, 需清空欄位值', fakeAsync(() => {
      component.cmd = 'add';
      fixture.detectChanges();
      tick(1000);
      expect(component.comp.detailEditForm.get('productCode').value).toEqual('');
      expect(component.comp.detailEditForm.get('productName').value).toEqual('');
      expect(component.comp.detailEditForm.get('price').value).toEqual(0);
      expect(component.comp.detailEditForm.get('quantity').value).toEqual(1);
    }));
    it('cmd!==add, 需帶入欄位值', fakeAsync(() => {
      component.cmd = null;
      component.orderDetail = {
        productCode: 'productCode1234',
        productName: 'productName',
        price: 10,
        quantity: 2
      };
      fixture.detectChanges();
      tick(1000);
      expect(component.comp.detailEditForm.get('productCode').value).toEqual('productCode1234');
      expect(component.comp.detailEditForm.get('productName').value).toEqual('productName');
      expect(component.comp.detailEditForm.get('price').value).toEqual(10);
      expect(component.comp.detailEditForm.get('quantity').value).toEqual(2);
    }));

    it('按下確認,需執行emitDataOutside', fakeAsync(() => {
      fixture.detectChanges();
      const spyEmitDataOutside = spyOn(component.comp, 'emitDataOutside').and.callThrough();
      const spyTriggerOk = spyOn(dwModalRef, 'triggerOk').and.callThrough();
      (de.queryAll(By.css('button'))[0].nativeElement as HTMLButtonElement).click();;
      fixture.detectChanges();
      tick(1000);
      expect(spyEmitDataOutside).toHaveBeenCalled();
      expect(spyTriggerOk).toHaveBeenCalled();
    }));
    it('按下取消,需執行handleCancel', fakeAsync(() => {
      fixture.detectChanges();
      const spyHandleCancel = spyOn(component.comp, 'handleCancel').and.callThrough();
      const spyTriggerCancel = spyOn(dwModalRef, 'triggerCancel').and.callThrough();
      (de.queryAll(By.css('button'))[1].nativeElement as HTMLButtonElement).click();;
      fixture.detectChanges();
      tick(1000);
      expect(spyHandleCancel).toHaveBeenCalled();
      expect(spyTriggerCancel).toHaveBeenCalled();
    }));
  });

});
