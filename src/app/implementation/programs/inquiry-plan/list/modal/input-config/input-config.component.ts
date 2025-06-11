import {Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd/message';
import {Parameter, paramTypeOptions} from '../../list-model';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {formValidators, markAllControlsAsDirty} from "../../../../../../shared/utils";

@Component({
  selector: 'app-input-config',
  templateUrl: './input-config.component.html',
  styleUrls: ['./input-config.component.less']
})
export class InputConfigComponent implements OnInit, OnChanges {
  @Output() visibleChange = new EventEmitter<any>();
  @Input() data: Parameter[] = [];
  loading = false;
  hideMessage = false;
  paramsTypeOptions = paramTypeOptions;
  form: FormGroup;
  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  constructor(
    private message: NzMessageService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.form = this.fb.group({
        items: this.fb.array([])
      });
      if (!this.data || !this.data?.length) {
        this.handleAdd();
      } else {
        this.data.forEach(data => this.handleAdd(data));
      }
    }
  }

  handleHideMessage() {
    this.hideMessage = true;
  }

  handleAdd(data?) {
    this.items.push(this.fb.group({
      column: [data?.column || ''],
      isRequired: [data?.isRequired || false],
      paramColType: [data?.paramColType || null, [Validators.required]],
      columnName: [data?.columnName || '',
        [Validators.required,
          Validators.maxLength(50),
          Validators.pattern(formValidators.enCode),
          (control) => formValidators.repeat(control, 'columnName')]
      ]
    }));
  }

  handleDelete(index: number) {
    // if (this.items.length <= 1) {
    //   this.message.warning('需保留至少一条');
    //   return false;
    // }
    this.items.removeAt(index);
  }

  close(data = null) {
    this.visibleChange.emit(data);
  }

  handleOk() {
    if (this.form.invalid) {
      markAllControlsAsDirty(this.form);
      return;
    }
    const data = this.items.value.map((d, i) => ({ ...d, paramType: 'P', column: d.columnName, sort: i }));
    this.close(data);
  }
}
