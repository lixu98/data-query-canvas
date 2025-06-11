import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { NzModalRef } from 'ng-zorro-antd/modal';

import { ExtraFieldsOrderProductInfo } from './../model/order.model';


@Component({
  selector: 'app-dw-order-detail-edit',
  templateUrl: './order-detail-edit.component.html',
  styleUrls: ['./order-detail-edit.component.css']
})
export class ExtraFieldsOrderDetailEditComponent implements OnInit {
  public detailEditForm: FormGroup;
  public detailEdit: ExtraFieldsOrderProductInfo;

  constructor(
    private modalSubject: NzModalRef,
    private fb: FormBuilder
  ) {
  }

  private _cmd: string;

  @Input()
  set cmd(cmd: string) {
    this._cmd = cmd;
  }

  @Input()
  set orderDetail(orderDetail: ExtraFieldsOrderProductInfo) {
    this.detailEdit = orderDetail;
  }

  /**
   * 確定
   *
   * @memberof ExtraFieldsOrderDetailEditComponent
   */
  public emitDataOutside(): void {
    // this.modalSubject.next(this.detailEdit); // 在彈出層組件中可以通過DwModalSubject向外層組件傳出數據
    this.modalSubject.triggerOk(); // 表示銷毀模式的時候會執行用戶傳入的選項中的onCancel還是的OnOK方法
  }

  /**
   * 取消
   *
   * @param e
   * @memberof ExtraFieldsOrderDetailEditComponent
   */
  public handleCancel(e: any): void {
    this.modalSubject.triggerCancel();
  }

  ngOnInit(): void {
    if (this._cmd === 'add') {
      this.detailEdit = new ExtraFieldsOrderProductInfo({});
      this.detailEdit.quantity = 1;
    }

    // Form欄位
    this.detailEditForm = this.fb.group({});
    this.detailEditForm.addControl('productCode', new FormControl(this.detailEdit.productCode, Validators.required));
    this.detailEditForm.addControl('productName', new FormControl(this.detailEdit.productName, Validators.required));
    this.detailEditForm.addControl('price', new FormControl(this.detailEdit.price, Validators.required));
    this.detailEditForm.addControl('quantity', new FormControl(this.detailEdit.quantity, Validators.required));
  }
}
