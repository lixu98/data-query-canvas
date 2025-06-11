import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { markAllControlsAsDirty, formValidators } from '../../../../../../shared/utils'

@Component({
  selector: 'app-field-mapping',
  templateUrl: './field-mapping.component.html',
  styleUrls: ['./field-mapping.component.less']
})
export class FieldMappingComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() inquiryField = []; // 查询字段
  @Input() mArray = []; // M数组条件
  @Output() visibleChange = new EventEmitter<any>();
  keyword: string;
  tabIndex: number = 0;
  tabList = [
    { title: '查询字段', data: 'inquiryFieldItems' },
    { title: 'M数组条件', data: 'mArrayItems' }
  ];
  form: FormGroup;
  get inquiryFieldItems(): FormArray {
    return this.form.get('inquiryFieldItems') as FormArray;
  }
  get mArrayItems(): FormArray {
    return this.form.get('mArrayItems') as FormArray;
  }

  constructor(
      private fb: FormBuilder
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['inquiryField'] && changes['mArray']) {
      this.initForm();
    }
  }

  initForm() {
    this.form = this.fb.group({
      inquiryFieldItems: this.fb.array(this.initFormItems('inquiryField')),
      mArrayItems: this.fb.array(this.initFormItems('mArray')),
    });
    markAllControlsAsDirty(this.form);
    return this.form.invalid;
  }

  initFormItems(dataName = 'inquiryField') {
    return this[dataName].filter(d => d?.origin && d?.origin?.column).map(field =>
      (this.fb.group({
        fieldId: [field?.origin?.fieldId || field?.origin?.key],
        title: [field?.origin?.columnName],
        path: [field?.origin?.path],
        column: [field?.origin?.column],
        level: [field?.level],
        alias: [field?.origin?.alias || field?.origin?.column,
          [Validators.required,
            Validators.maxLength(50),
            Validators.pattern(formValidators.enCode),
            (control) => formValidators.repeat(control, 'alias')]
        ]
      }))
    );
  }

  close(data = null) {
    this.visibleChange.emit(data);
  }

  handleOk() {
    if (this.form.invalid) {
      markAllControlsAsDirty(this.form);
      this.tabIndex = this.inquiryFieldItems.valid && this.mArrayItems.invalid ? 1 : this.inquiryFieldItems.invalid && this.mArrayItems.valid ? 0 : this.tabIndex;
      return;
    }
    const data = {
      inquiryField: this.getAliasList('inquiryField'),
      mArray: this.getAliasList('mArray'),
    }
    this.close(data);
  }

  getAliasList(dataName = 'inquiryField') {
    return this[dataName].filter(d => d?.origin && d?.origin?.column).map((field, i) => ({ ...field, origin: { ...field.origin,
        alias: this[`${dataName}Items`].value[i]?.alias || '' } }));
  }
}
