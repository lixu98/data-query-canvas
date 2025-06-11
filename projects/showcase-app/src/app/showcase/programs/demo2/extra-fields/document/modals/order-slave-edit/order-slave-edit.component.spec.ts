import { Overlay } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DwFormItemsModule } from '@webdpt/components/form-items';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ExtraFieldsDocumentOrderProductInfo } from '../../model';
import { ExtraFieldsDocumentOrderSlaveEditComponent } from './order-slave-edit.component';

@Component({
  template: `
       <div>TestModalComponent</div>
      `
})
export class TestModalComponent {
  constructor(
        private dwModalService: NzModalService
  ) { }
    modifyData = {
      productCode: 'id1234',
      price: 10,
      quantity: 2,
    };
    onOk(_data: ExtraFieldsDocumentOrderSlaveEditComponent): void {
    }
    cancel(): void {}
    modalRef: NzModalRef;
    open(state: string): void {
      this.modalRef = this.dwModalService.create({
        nzTitle: 'test',
        nzContent: ExtraFieldsDocumentOrderSlaveEditComponent,
        nzOnOk: (_data: any): void => {
          this.onOk(_data);
        },
        nzOnCancel: (): void => {
          this.cancel();
        },
        nzFooter: null,
        nzComponentParams: state === 'modify' ? {
          cmd: state,
          orderDetail: new ExtraFieldsDocumentOrderProductInfo(this.modifyData)
        } : { cmd: state }
      });
    }

}
describe('ExtraFieldsDocumentOrderSlaveEditComponent', () => {
  let testComponent: TestModalComponent;
  let fixture: ComponentFixture<TestModalComponent>;
  let spyOnOk: jasmine.Spy;
  let spyCancel: jasmine.Spy;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        CommonModule,
        NzFormModule,
        ReactiveFormsModule,
        TranslateTestingModule,
        NzInputNumberModule,
        NzInputModule,
        NzLayoutModule,
        DwFormItemsModule,
        NzButtonModule
      ],
      providers: [
        Overlay,
        NzModalService],
      declarations: [ExtraFieldsDocumentOrderSlaveEditComponent, TestModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestModalComponent);
    testComponent = fixture.componentInstance;
    spyOnOk = spyOn(testComponent, 'onOk').and.callThrough();
    spyCancel = spyOn(testComponent, 'cancel').and.callThrough();
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(testComponent).toBeTruthy();
  });
  describe('當開窗修改時', () => {
    it('需呈現帶入的資料', () => {
      testComponent.open('modify');
      fixture.detectChanges();
      expect(document.querySelector('input[ng-reflect-model="id1234"]')).toBeTruthy();
      expect(document.querySelector('input[ng-reflect-model="10"]')).toBeTruthy();
      expect(document.querySelector('input[ng-reflect-model="2"]')).toBeTruthy();
    });
    it('按下確認, 需執行modalSubject.triggerOk, 返回ExtraFieldsDocumentOrderSlaveEditComponent給dwOnOk', fakeAsync(() => {
      testComponent.open('modify');
      fixture.detectChanges();
      const submitBT: HTMLButtonElement = document.querySelector('button[type="submit"]');
      submitBT.click();
      fixture.detectChanges();
      tick(1000);
      expect(spyOnOk.calls.mostRecent().args[0] instanceof ExtraFieldsDocumentOrderSlaveEditComponent).toBeTrue();
    }));
    it('按下取消, 需執行modalSubject.triggerCancel', fakeAsync(() => {
      testComponent.open('modify');
      fixture.detectChanges();
      const cancelBT: HTMLButtonElement = document.querySelector('button[type="button"]');
      cancelBT.click();
      fixture.detectChanges();
      tick(1000);
      expect(spyCancel).toHaveBeenCalled();
    }));
  });
  describe('當開窗新增時', () => {
    it('按下確認, 需執行modalSubject.triggerOk, 返回ExtraFieldsDocumentOrderSlaveEditComponent給dwOnOk', fakeAsync(() => {
      testComponent.open('add');
      fixture.detectChanges();
      // 加資料
      (testComponent.modalRef.componentInstance as ExtraFieldsDocumentOrderSlaveEditComponent)
        .detailEditForm.controls['detailEditProductCode'].setValue('id9999');

      fixture.detectChanges();
      tick();
      const submitBT: HTMLButtonElement = document.querySelector('button[type="submit"]');
      submitBT.click();
      fixture.detectChanges();
      tick(1000);
      expect((spyOnOk.calls.mostRecent().args[0] as ExtraFieldsDocumentOrderSlaveEditComponent).detailEdit.productCode).toEqual('id9999');
    }));
  });
});
