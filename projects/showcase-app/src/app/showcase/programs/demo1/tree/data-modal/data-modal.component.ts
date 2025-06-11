import { Component, Inject, Input, OnInit } from '@angular/core';
import {
  AbstractControl, FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { APP_DATE_FORMAT, APP_TIME_FORMAT } from '@webdpt/framework/config';
import fnsFormat from 'date-fns/format';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { DataModel, OriginDataModel } from '../model/model';

@Component({
  selector: 'app-dw-showcase-data-modal',
  templateUrl: './data-modal.component.html',
  styleUrls: ['./data-modal.component.css']
})
export class ShowcaseDataModalComponent implements OnInit {
  validateForm: FormGroup;
  _originData: OriginDataModel[];
  typeOptions: any[] = [];
  _value: any[] = null;
  statusEnum: any[] = [
    { value: true, label: '運行中' },
    { value: false, label: '關閉' }
  ];
  parentRequired: boolean = false;
  addressRequired: boolean = false;
  @Input()
  set originData(value: OriginDataModel[]) {
    this._originData = value;
  }


  constructor(
    private modalSubject: NzModalRef,
    private fb: FormBuilder,
    @Inject(APP_DATE_FORMAT) private dwDateFormat: string,
    @Inject(APP_TIME_FORMAT) private dwTimeFormat: string
  ) {

  }

  ngOnInit(): void {
    this.toOptions();
    this.validateForm = this.fb.group({
      type: 1,
      parent: [null],
      name: [null, [Validators.required]],
      address: [null],
      amount: [null, [Validators.required]],
      status: true,
      update: fnsFormat(new Date(), `${this.dwDateFormat} ${this.dwTimeFormat}`)
    });
    this.validateForm.controls['type'].valueChanges.subscribe(val=>{
      const parentCtrl = this.validateForm.get('parent');
      if (val === 2) {
        parentCtrl.setValidators([Validators.required]);
        parentCtrl.setValue([]);
        parentCtrl.updateValueAndValidity();
      } else {
        parentCtrl.setValidators(null);
        parentCtrl.setValue([]);
        parentCtrl.updateValueAndValidity();
      }
    });
  }
  public emitDataOutside(): void {
    this.modalSubject.triggerOk(); // 表示銷毀模式的時候會執行用戶傳入的選項中的onCancel還是的OnOK方法
  }

  handleCancel(e: any): void {
    this.modalSubject.triggerCancel();
  }

  toOptions(): void {
    this._originData.forEach(elem => {
      const obj = {
        value: elem.key,
        label: elem.name
      };
      if (elem.hasOwnProperty('children')) {
        obj['children'] = childrenOptons(elem.children);
      } else {
        obj['isLeaf'] = true;
      }
      this.typeOptions.push(obj);
    });

    function childrenOptons(elements: any): any[] {
      const ar: any[] = [];
      elements.forEach(elem => {
        const obj = {
          value: elem.key,
          label: elem.name
        };
        if (elem.hasOwnProperty('children')) {
          obj['children'] = childrenOptons(elem.children);
        } else {
          obj['isLeaf'] = true;
        }
        ar.push(obj);
      });
      return ar;
    }
  }
}
