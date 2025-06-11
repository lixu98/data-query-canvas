import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { APP_DATE_FORMAT, APP_TIME_FORMAT } from '@webdpt/framework/config';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { DwModalRefTest } from '@webdpt/framework/sharedTest/common-test-service';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { of } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Demo1RepositoryModule } from '../../repository';
import { GroupModule } from '../group.module';
import { DetailsInfoModel } from '../model/group.model';
import { GroupDetailEditComponent } from './group-detail-edit.component';
import zh from '@angular/common/locales/zh';
import { registerLocaleData } from '@angular/common';
import { By } from '@angular/platform-browser';
registerLocaleData(zh);
@Component({
  template: `
      <app-dw-group-detail-edit
        [groupDetail] = "groupDetail"
        [cmd] = "cmd"
      ></app-dw-group-detail-edit>
    `
})
class TestComponent {
  @ViewChild(GroupDetailEditComponent, { static: true }) comp: GroupDetailEditComponent;
  cmd = 'edit';
  groupDetail = new DetailsInfoModel({
    seq: 1,
    companyId: 'mockComponanyId',
    companyName: 'mockCompanyName',
    currencyId: 'CNY',
    currencyName: '人民幣',
    status: 'N',
    startDate: new Date('2023/1/1'),
    endDate: new Date('2023/2/1')
  });
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
describe('GroupDetailEditComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let de: DebugElement;
  let dwModalRef: NzModalRef;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        GroupModule,
        Demo1RepositoryModule,
        HttpClientTestingModule,
        TranslateTestingModule
      ],
      providers: [
        { provide: APP_DATE_FORMAT, useValue: 'yyyy/MM/dd' },
        { provide: APP_TIME_FORMAT, useValue: 'hh:mm:ss' },
        { provide: NzModalRef, useValue: DwModalRefTest }],
      declarations: [TestComponent, GroupDetailEditComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    dwModalRef = TestBed.inject(NzModalRef);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('cmd===add, 需清空欄位值', fakeAsync(() => {
    component.cmd = 'add';
    fixture.detectChanges();
    tick(1000);
    expect(component.comp.detailEditForm.get('detailEditCompanyId').value).toEqual('');
    expect(component.comp.detailEditForm.get('detailEditCompanyName').value).toEqual('');
    expect(component.comp.detailEditForm.get('detailEditCurrencyId').value).toEqual('');
    expect(component.comp.detailEditForm.get('detailEditStatus').value).toEqual(true);
  }));
  it('cmd!==add, 需帶入欄位值', fakeAsync(() => {
    fixture.detectChanges();
    tick(1000);
    expect(component.comp.detailEditForm.get('detailEditCompanyId').value).toEqual('mockComponanyId');
    expect(component.comp.detailEditForm.get('detailEditCompanyName').value).toEqual('mockCompanyName');
    expect(component.comp.detailEditForm.get('detailEditCurrencyId').value).toEqual('CNY');
    expect(component.comp.detailEditForm.get('detailEditStatus').value).toEqual(false);
  }));
  describe('emitDataOutside', ()=>{
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
    it('執行emitDataOutside, startDate, endDate沒值, 需不執行fnsFormat轉換時間格式', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000);
      component.comp.detailEditForm.get('detailEditStartDate').setValue(null);
      component.comp.detailEditForm.get('detailEditStartDate').updateValueAndValidity();
      component.comp.detailEditForm.get('detailEditEndDate').setValue(null);
      component.comp.detailEditForm.get('detailEditEndDate').updateValueAndValidity();
      fixture.detectChanges();
      tick(1000);
      const spyEmitDataOutside = spyOn(component.comp, 'emitDataOutside').and.callThrough();
      (de.queryAll(By.css('button'))[0].nativeElement as HTMLButtonElement).click();;
      fixture.detectChanges();
      tick(1000);
      expect(spyEmitDataOutside).toHaveBeenCalled();
    }));
  });
  it('groupDetail.startDate, groupDetail.endDate沒值, 需不用轉成Date格式', fakeAsync(()=>{
    component.groupDetail = new DetailsInfoModel({
      seq: 1,
      companyId: 'mockComponanyId',
      companyName: 'mockCompanyName',
      currencyId: 'CNY',
      currencyName: '人民幣',
      status: 'N',
      startDate: null,
      endDate: null
    });
    fixture.detectChanges();
    tick(1000);
    expect(component.comp.detailEditForm.get('detailEditStartDate').value).toEqual(null);
    expect(component.comp.detailEditForm.get('detailEditEndDate').value).toEqual(null);

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
  it('detailEditCurrencyId值改變, detailEdit.currencyId值需改變', fakeAsync(() => {
    fixture.detectChanges();
    tick(1000);
    component.comp.detailEditForm.get('detailEditCurrencyId').setValue('NTD');
    component.comp.detailEditForm.get('detailEditCurrencyId').updateValueAndValidity();
    fixture.detectChanges();
    tick(1000);
    expect(component.comp.detailEdit.currencyId).toEqual('NTD');
  }));
  it('detailEditStatus值改變, 需執行statusChange', fakeAsync(() => {
    const spyStatusChange = spyOn(component.comp, 'statusChange').and.callThrough();
    fixture.detectChanges();
    tick(1000);
    component.comp.detailEditForm.get('detailEditStatus').setValue('Y');
    component.comp.detailEditForm.get('detailEditStatus').updateValueAndValidity();
    fixture.detectChanges();
    tick(1000);
    expect(spyStatusChange).toHaveBeenCalled();
  }));
  describe('detailEditStartDate改變', () => {
    it('需執行startValueChange', fakeAsync(() => {
      const spyStartValueChange = spyOn(component.comp, 'startValueChange').and.callThrough();
      fixture.detectChanges();
      tick(1000);
      component.comp.detailEditForm.get('detailEditStartDate').setValue(new Date('2023/4/1'));
      component.comp.detailEditForm.get('detailEditStartDate').updateValueAndValidity();
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      expect(spyStartValueChange).toHaveBeenCalled();
    }));
    it('startDate > endDate, 需清空endDate值', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000);
      component.comp.detailEditForm.get('detailEditEndDate').setValue(new Date('2023/4/1'));
      component.comp.detailEditForm.get('detailEditEndDate').updateValueAndValidity();
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      component.comp.detailEditForm.get('detailEditStartDate').setValue(new Date('2023/4/2'));
      component.comp.detailEditForm.get('detailEditStartDate').updateValueAndValidity();
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      expect(component.comp.detailEdit.endDate).toEqual(null);
    }));
  });
  describe('detailEditEndDate改變', () => {
    it('需執行endValueChange ', fakeAsync(() => {
      const spyEndValueChange = spyOn(component.comp, 'endValueChange').and.callThrough();
      fixture.detectChanges();
      tick(1000);
      component.comp.detailEditForm.get('detailEditEndDate').setValue(new Date('2023/4/1'));
      component.comp.detailEditForm.get('detailEditEndDate').updateValueAndValidity();
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      expect(spyEndValueChange).toHaveBeenCalled();
    }));
    it('startDate > endDate, 需清空startDate值', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000);
      component.comp.detailEditForm.get('detailEditStartDate').setValue(new Date('2023/4/2'));
      component.comp.detailEditForm.get('detailEditStartDate').updateValueAndValidity();
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      component.comp.detailEditForm.get('detailEditEndDate').setValue(new Date('2023/4/1'));
      component.comp.detailEditForm.get('detailEditEndDate').updateValueAndValidity();
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);

      expect(component.comp.detailEdit.startDate).toEqual(null);
    }));
  });
  describe('disabledStartDate', () => {
    it('日曆彈窗的開始時間大於結束時間需不可以被選取', fakeAsync(() => {
      component.comp.cmd = 'add';
      fixture.detectChanges();
      tick(1000);
      component.comp.detailEditForm.get('detailEditEndDate').setValue(new Date('2023/4/1'));
      component.comp.detailEditForm.get('detailEditEndDate').updateValueAndValidity();
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      // 先清空開始時間
      component.comp.detailEditForm.get('detailEditStartDate').setValue(null);
      component.comp.detailEditForm.get('detailEditStartDate').updateValueAndValidity();
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      const startInput = de.query(By.css('nz-date-picker input')).nativeElement;
      startInput.click();
      fixture.detectChanges();
      tick(1000);
      expect(de.queryAll(By.css('td.ant-picker-cell-disabled')).length).toBeGreaterThan(0);
    }));
    it('沒設定結束時間,日曆彈窗的開始時間需可任意選取', fakeAsync(()=>{
      component.comp.cmd = 'add';
      fixture.detectChanges();
      tick(1000);
      // 清空結束時間
      component.comp.detailEditForm.get('detailEditEndDate').setValue(null);
      component.comp.detailEditForm.get('detailEditEndDate').updateValueAndValidity();
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      // // 先清空開始時間
      component.comp.detailEditForm.get('detailEditStartDate').setValue(null);
      component.comp.detailEditForm.get('detailEditStartDate').updateValueAndValidity();
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      const startInput = de.query(By.css('nz-date-picker input')).nativeElement;
      startInput.click();
      fixture.detectChanges();
      tick(1000);
      expect(de.queryAll(By.css('td.ant-picker-cell-disabled')).length).toEqual(0);

    }));
  });
  describe('disabledEndDate', () => {
    it('日曆彈窗的結束時間小於開始時間需不可以被選取', fakeAsync(() => {
      component.comp.cmd = 'add';
      fixture.detectChanges();
      tick(1000);
      // 設定結束時間
      component.comp.detailEditForm.get('detailEditEndDate').setValue('2023/5/1');
      component.comp.detailEditForm.get('detailEditEndDate').updateValueAndValidity();
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      // 設定開始時間
      component.comp.detailEditForm.get('detailEditStartDate').setValue(new Date('2023/5/10'));
      component.comp.detailEditForm.get('detailEditStartDate').updateValueAndValidity();
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);

      const endInput = de.queryAll(By.css('nz-date-picker input'))[1].nativeElement;
      endInput.click();
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      expect(de.queryAll(By.css('td.ant-picker-cell-disabled')).length).toBeGreaterThan(0);
    }));
    it('沒設定開始時間,日曆彈窗的結束時間需可任意選取', fakeAsync(()=>{
      component.comp.cmd = 'add';
      fixture.detectChanges();
      tick(1000);
      // 清空結束時間
      component.comp.detailEditForm.get('detailEditEndDate').setValue(null);
      component.comp.detailEditForm.get('detailEditEndDate').updateValueAndValidity();
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      // // 清空開始時間
      component.comp.detailEditForm.get('detailEditStartDate').setValue(null);
      component.comp.detailEditForm.get('detailEditStartDate').updateValueAndValidity();
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      const endInput = de.queryAll(By.css('nz-date-picker input'))[1].nativeElement;
      endInput.click();
      fixture.detectChanges();
      tick(1000);
      expect(de.queryAll(By.css('td.ant-picker-cell-disabled')).length).toEqual(0);

    }));
  });
});
