import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { APP_DATE_FORMAT, APP_TIME_FORMAT } from '@webdpt/framework/config';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { of } from 'rxjs';
import { filter } from 'rxjs/operators';
import { TreeDetailsInfoModel } from '../model';
import { TreeMenuModule } from '../tree-menu.module';
import { DetailEditComponent } from './detail-edit.component';
import zh from '@angular/common/locales/zh';
registerLocaleData(zh);
@Component({
  template: `
      <app-dw-detail-edit
       [cmd]='cmd'
       [groupDetail]= 'groupDetail'
      ></app-dw-detail-edit>
    `
})
class TestComponent {
  @ViewChild(DetailEditComponent, { static: true }) comp: DetailEditComponent;
  cmd: string = 'edit';
  groupDetail: TreeDetailsInfoModel = {
    'seq': 1,
    'companyId': '1111',
    'companyName': '鼎新電腦',
    'currencyId': 'NTD',
    'currencyName': '新台幣',
    'status': 'N',
    'startDate': '2017/10/31',
    'endDate': '2017/12/31'
  }
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
describe('DetailEditComponent', () => {
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
      TreeMenuModule,
      HttpClientTestingModule
    ],
    providers: [
      // { provide: DwLanguageService, useValue: { language$: of('zh_TW') } }, // DwLanguageStylePipe(dwLanguage)使用到
      { provide: NzModalRef, useValue: ModalRefTest },
      { provide: APP_DATE_FORMAT, useValue: 'yyyy/MM/dd' },
      { provide: APP_TIME_FORMAT, useValue: 'hh:mm:ss' },
    ],
    declarations: [
      TestComponent,
      DetailEditComponent
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

      expect(component.comp.detailEditForm.valid).toEqual(true);
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
    describe('add', ()=>{
      it('detailEditForm.valid為true, 需可按下確認', fakeAsync(()=>{
        const spyEmitDataOutside = spyOn(component.comp, 'emitDataOutside').and.callThrough();

        component.cmd = 'add';
        fixture.detectChanges();
        tick(1000);
        const ctrls = component.comp.detailEditForm.controls;
        ctrls['companyId'].setValue('1111');
        ctrls['companyName'].setValue('鼎新電腦');
        ctrls['currencyId'].setValue('NTD');
        // ctrls['currencyName'].setValue('新台幣');
        ctrls['status'].setValue('N');
        ctrls['startDate'].setValue(new Date('2017/10/31'));
        ctrls['endDate'].setValue(new Date('2017/12/31'));
        component.comp.detailEditForm.updateValueAndValidity();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(component.comp.detailEditForm.valid).toEqual(true);
        de.query(By.css('button[type="submit"]')).nativeElement.click();
        fixture.detectChanges();
        tick(1000);
        expect(spyEmitDataOutside).toHaveBeenCalled();
      }));
      it('部分欄位沒填寫,detailEditForm.valid為true, 需可按下確認', fakeAsync(()=>{
        const spyEmitDataOutside = spyOn(component.comp, 'emitDataOutside').and.callThrough();

        component.cmd = 'add';
        fixture.detectChanges();
        tick(1000);
        const ctrls = component.comp.detailEditForm.controls;
        ctrls['companyId'].setValue('1111');
        ctrls['companyName'].setValue('鼎新電腦');
        // ctrls['currencyId'].setValue('NTD');
        // // ctrls['currencyName'].setValue('新台幣');
        // ctrls['status'].setValue('N');
        // ctrls['startDate'].setValue(new Date('2017/10/31'));
        // ctrls['endDate'].setValue(new Date('2017/12/31'));
        component.comp.detailEditForm.updateValueAndValidity();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(component.comp.detailEditForm.valid).toEqual(true);
        de.query(By.css('button[type="submit"]')).nativeElement.click();
        fixture.detectChanges();
        tick(1000);
        expect(spyEmitDataOutside).toHaveBeenCalled();
      }));
    });
    it('開始日期大於結束日期, 要送出的結束日期值需被清空', fakeAsync(()=>{
      const spyEmitDataOutside = spyOn(component.comp, 'emitDataOutside').and.callThrough();

      component.cmd = 'add';
      fixture.detectChanges();
      tick(1000);
      const ctrls = component.comp.detailEditForm.controls;
      // 先設定開始及結束日期
      ctrls['startDate'].setValue(new Date('2017/10/31'));
      ctrls['endDate'].setValue(new Date('2017/12/31'));
      component.comp.detailEditForm.updateValueAndValidity();
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      // 重設開始日期
      ctrls['startDate'].setValue(new Date('2018/10/31'));
      component.comp.detailEditForm.updateValueAndValidity();
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      expect(component.comp.detailEdit.endDate).toBeNull();
    }));
    describe('startValueChange', ()=>{
      it('開始日期大於結束日期, 要送出的結束日期值需被清空', fakeAsync(()=>{
        component.cmd = 'add';
        fixture.detectChanges();
        tick(1000);
        const ctrls = component.comp.detailEditForm.controls;
        // 先設定開始及結束日期
        ctrls['startDate'].setValue(new Date('2017/10/31'));
        ctrls['endDate'].setValue(new Date('2017/12/31'));
        component.comp.detailEditForm.updateValueAndValidity();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        // 重設開始日期
        ctrls['startDate'].setValue(new Date('2018/10/31'));
        component.comp.detailEditForm.updateValueAndValidity();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(component.comp.detailEdit.endDate).toBeNull();
      }));
    });
    describe('endValueChange', ()=>{
      it('開始日期大於結束日期, 要送出的開始日期值需被清空', fakeAsync(()=>{
        component.cmd = 'add';
        fixture.detectChanges();
        tick(1000);
        const ctrls = component.comp.detailEditForm.controls;
        // 先設定開始及結束日期
        ctrls['startDate'].setValue(new Date('2017/10/31'));
        ctrls['endDate'].setValue(new Date('2017/12/31'));
        component.comp.detailEditForm.updateValueAndValidity();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        // 重設開始日期
        ctrls['endDate'].setValue(new Date('2016/10/31'));
        component.comp.detailEditForm.updateValueAndValidity();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(component.comp.detailEdit.startDate).toBeNull();
      }));
    });
    describe('disabledStartDate', () => {
      it('日曆彈窗的開始時間大於結束時間需不可以被選取', fakeAsync(() => {
        component.comp.cmd = 'add';
        fixture.detectChanges();
        tick(1000);
        component.comp.detailEditForm.get('endDate').setValue(new Date('2023/4/1'));
        component.comp.detailEditForm.get('endDate').updateValueAndValidity();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        // 先清空開始時間
        component.comp.detailEditForm.get('startDate').setValue(null);
        component.comp.detailEditForm.get('startDate').updateValueAndValidity();
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
        component.comp.detailEditForm.get('endDate').setValue(null);
        component.comp.detailEditForm.get('endDate').updateValueAndValidity();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        // // 先清空開始時間
        component.comp.detailEditForm.get('startDate').setValue(null);
        component.comp.detailEditForm.get('startDate').updateValueAndValidity();
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
        component.comp.detailEditForm.get('endDate').setValue('2023/5/1');
        component.comp.detailEditForm.get('endDate').updateValueAndValidity();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        // 設定開始時間
        component.comp.detailEditForm.get('startDate').setValue(new Date('2023/5/10'));
        component.comp.detailEditForm.get('startDate').updateValueAndValidity();
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
        component.comp.detailEditForm.get('endDate').setValue(null);
        component.comp.detailEditForm.get('endDate').updateValueAndValidity();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        // // 清空開始時間
        component.comp.detailEditForm.get('startDate').setValue(null);
        component.comp.detailEditForm.get('startDate').updateValueAndValidity();
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

});
