import { CommonModule } from '@angular/common';
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
import { Demo2EmployeeRepository } from '../../../repository';
import { EmployeeListComponent } from './employee-list.component';
@Component({
  template: `
      <app-dw-employee-list
      ></app-dw-employee-list>
    `
})
class TestComponent {
  @ViewChild(EmployeeListComponent, { static: true }) comp: EmployeeListComponent;
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
describe('EmployeeListComponent', () => {
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
      NzLayoutModule,
      NzButtonModule,
      NzTableModule,
      NzRadioModule,
      FormsModule
    ],
    providers: [
      { provide: NzModalRef, useValue: DwModalRefTest },
      {
        provide: Demo2EmployeeRepository, useValue: {
          getEmployees: (): Observable<any>=>{
            return of([{name: 'mockName', id: 'mockId'}]);
          }
        }
      }
    ],
    declarations: [
      TestComponent,
      EmployeeListComponent
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

    it('按下確認,需執行emitDataOutside, 沒有選取值, 需執行handleCancel', fakeAsync(() => {
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
      tick(1000);
      const spyEmitDataOutside = spyOn(component.comp, 'emitDataOutside').and.callThrough();
      const spyTriggerOk = spyOn(dwModalRef, 'triggerOk').and.callThrough();
      (de.queryAll(By.css('input[type="radio"]'))[0].nativeElement as HTMLButtonElement).click();
      fixture.detectChanges();
      tick(1000);
      (de.queryAll(By.css('.customize-footer button'))[0].nativeElement as HTMLButtonElement).click();
      fixture.detectChanges();
      tick(1000);
      expect(component.comp.employeeName).toEqual('mockName');
      expect(spyEmitDataOutside).toHaveBeenCalled();
      expect(spyTriggerOk).toHaveBeenCalled();
    }));
    it('按下取消,需執行handleCancel', fakeAsync(() => {
      fixture.detectChanges();
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
