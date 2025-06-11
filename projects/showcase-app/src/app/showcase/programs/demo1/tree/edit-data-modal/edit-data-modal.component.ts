import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { APP_DATE_FORMAT, APP_TIME_FORMAT } from '@webdpt/framework/config';
import fnsFormat from 'date-fns/format';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { DataModel } from '../model/model';

@Component({
  selector: 'app-dw-showcase-edit-data-modal',
  templateUrl: './edit-data-modal.component.html',
  styleUrls: ['./edit-data-modal.component.css']
})
export class ShowcaseEditShowcaseDataModalComponent implements OnInit {
  validateForm: FormGroup;
  _item: DataModel;
  statusEnum: any[] = [
    { value: true, label: '運行中' },
    { value: false, label: '關閉' }
  ];
  @Input()
  set item(value: DataModel) {
    this._item = value;
  }

  constructor(
    private modalSubject: NzModalRef,
     private fb: FormBuilder,
    @Inject(APP_DATE_FORMAT) private dwDateFormat: string,
    @Inject(APP_TIME_FORMAT) private dwTimeFormat: string
  ) {

  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      key: [this._item.key],
      parent: [this._item.parent],
      name: [this._item.name, [Validators.required]],
      address: [this._item.address],
      amount: [this._item.amount, [Validators.required]],
      status: [this._item.status, [Validators.required]],
      update: fnsFormat(new Date(), `${this.dwDateFormat} ${this.dwTimeFormat}`)
    });
  }
  public emitDataOutside(): void {
    this.modalSubject.triggerOk(); // 表示銷毀模式的時候會執行用戶傳入的選項中的onCancel還是的OnOK方法
  }

  handleCancel(e: any): void {
    this.modalSubject.triggerCancel();
  }
}
