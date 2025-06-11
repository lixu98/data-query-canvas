import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { DwModalRefTest } from '@webdpt/framework/sharedTest/common-test-service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Observable, of } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Demo1CustomerRepository } from '../../../repository';
import { CustomerListComponent } from './customer-list.component';
@Component({
  template: `
      <app-dw-customer-list
      ></app-dw-customer-list>
    `
})
class TestComponent {
  @ViewChild(CustomerListComponent, { static: true }) comp: CustomerListComponent;
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
describe('CustomerListComponent', () => {
  let httpMocker: HttpTestingController;
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let de: DebugElement;
  let dwModalRef: NzModalRef;
  const configureTestingModule = {
    imports: [
      HttpClientTestingModule,
      CommonModule,
      ReactiveFormsModule,
      TranslateTestingModule,
      NzModalModule,
      NoopAnimationsModule,
      NzLayoutModule,
      NzButtonModule,
      NzTableModule,
      NzRadioModule,
      FormsModule
    ],
    providers: [
      HttpClient,
      { provide: NzModalRef, useValue: DwModalRefTest },
      Demo1CustomerRepository
      // {
      //   provide: ExtraFieldsCustomerRepository, useValue: {
      //     getCustomers: (): Observable<any>=>{
      //       return of([{name: 'mockName', id: 'mockId'}]);
      //     }
      //   }
      // }
    ],
    declarations: [
      TestComponent,
      CustomerListComponent
    ]
  };
  describe('default', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule(configureTestingModule)
        .compileComponents();
    }));
    beforeEach(() => {
      fixture = TestBed.createComponent(TestComponent);
      httpMocker = TestBed.inject(HttpTestingController);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      dwModalRef = TestBed.inject(NzModalRef);
    });
    afterEach(() => {
      // After every test, assert that there are no more pending requests.
      httpMocker.verify();
    });
    it('should create', fakeAsync(() => {
      fixture.detectChanges();
      const getCustomersReq = httpMocker.expectOne('showcase/demo1/getCustomers');
      getCustomersReq.flush([{name: 'mockName', id: 'mockId'}]);
      fixture.detectChanges();
      tick(1000);
      expect(component).toBeTruthy();

    }));

    it('按下確認,需執行emitDataOutside, 沒有選取值, 需執行handleCancel', fakeAsync(() => {
      fixture.detectChanges();
      const getCustomersReq = httpMocker.expectOne('showcase/demo1/getCustomers');
      getCustomersReq.flush([{name: 'mockName', id: 'mockId'}]);
      fixture.detectChanges();
      tick(1000);
      const spyEmitDataOutside = spyOn(component.comp, 'emitDataOutside').and.callThrough();
      const spyTriggerCancel = spyOn(dwModalRef, 'triggerCancel').and.callThrough();
      // const spyTriggerOk = spyOn(dwModalRef, 'triggerOk').and.callThrough();
      (de.queryAll(By.css('.customize-footer button'))[0].nativeElement as HTMLButtonElement).click();
      fixture.detectChanges();
      tick(1000);
      expect(spyEmitDataOutside).toHaveBeenCalled();
      expect(spyTriggerCancel).toHaveBeenCalled();
    }));
    it('按下確認,需執行emitDataOutside, 有選取值, 需執行triggerOk', fakeAsync(() => {
      fixture.detectChanges();
      const getCustomersReq = httpMocker.expectOne('showcase/demo1/getCustomers');
      getCustomersReq.flush([{name: 'mockName', id: 'mockId'}]);
      fixture.detectChanges();
      tick(1000);
      const spyEmitDataOutside = spyOn(component.comp, 'emitDataOutside').and.callThrough();
      // const spyTriggerCancel = spyOn(dwModalRef, 'triggerCancel').and.callThrough();
      const spyTriggerOk = spyOn(dwModalRef, 'triggerOk').and.callThrough();
      (de.queryAll(By.css('input[type="radio"]'))[0].nativeElement as HTMLButtonElement).click();
      fixture.detectChanges();
      tick(1000);
      (de.queryAll(By.css('.customize-footer button'))[0].nativeElement as HTMLButtonElement).click();
      fixture.detectChanges();
      tick(1000);
      expect(spyEmitDataOutside).toHaveBeenCalled();
      expect(spyTriggerOk).toHaveBeenCalled();
    }));
    it('按下取消,需執行handleCancel', fakeAsync(() => {
      fixture.detectChanges();
      const getCustomersReq = httpMocker.expectOne('showcase/demo1/getCustomers');
      getCustomersReq.flush([{name: 'mockName', id: 'mockId'}]);
      fixture.detectChanges();
      tick(1000);
      const spyHandleCancel = spyOn(component.comp, 'handleCancel').and.callThrough();
      const spyTriggerOk = spyOn(dwModalRef, 'triggerOk').and.callThrough();
      (de.queryAll(By.css('.customize-footer button'))[1].nativeElement as HTMLButtonElement).click();
      fixture.detectChanges();
      tick(1000);
      expect(spyHandleCancel).toHaveBeenCalled();
      expect(spyTriggerOk).toHaveBeenCalled();
    }));
  });

});
