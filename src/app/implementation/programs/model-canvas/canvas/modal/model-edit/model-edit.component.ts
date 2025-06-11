import {Component, EventEmitter, Input, OnInit, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {markAllControlsAsDirty} from "../../../../../../shared/utils";

@Component({
  selector: 'app-model-edit',
  templateUrl: './model-edit.component.html',
  styleUrls: ['./model-edit.component.less']
})
export class ModelEditComponent implements OnInit, OnChanges {
  @Input() data = null;
  @Output() visibleChange = new EventEmitter<any>();
  form: FormGroup;
  dbCodeOptions = [ // 数据库编码
    { label: '业务中台业务库', value: '1'},
    { label: '全量库starrocks', value: '2' }];

  constructor(
      private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      mainBusinessModelName: [{ value: this.data?.mainBusinessModelName || '', disabled: true }], // 主模型
      virtualBusinessModelCode: [{ value: this.data?.virtualBusinessModelCode || '', disabled: !!this.data?.id },
        [Validators.required]], // 模型编号
      virtualBusinessModelName: [this.data?.virtualBusinessModelName || '', [Validators.required]], // 模型名称
      domainName: [{ value: this.data?.domainName || '', disabled: true }], // 所属领域对象
      dbCode: [this.data?.dbCode || '1', [Validators.required]], // 数据库编码
      remark: [this.data?.remark || '', [Validators.maxLength(200)]]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.data = JSON.parse(JSON.stringify(this.data));
    }
  }

  close(data = null) {
    this.visibleChange.emit(data);
  }

  handleOk() {
    if (this.form.invalid) {
      markAllControlsAsDirty(this.form);
      return;
    }
    this.close(this.form.value);
  }
}
