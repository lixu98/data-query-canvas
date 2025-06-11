import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import {markAllControlsAsDirty, formValidators, storage} from '../../../../../../shared/utils'
import {NzMessageService} from "ng-zorro-antd/message";
import {Pagination} from "../../../../../../shared/shared.model";
import { ListService } from '../../list.service';
import {finalize} from "rxjs/operators";
import {SchemeDesign} from "../../list-model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-scheme-design-add',
  templateUrl: './scheme-design-add.component.html',
  styleUrls: ['./scheme-design-add.component.less']
})
export class SchemeDesignAddComponent implements OnInit, OnChanges {
  @Output() visibleChange = new EventEmitter<any>();
  @Input() isEdit = false;
  @Input() data = new SchemeDesign(); // 查询方案
  @Input() listOfData = []; // 选择引用模型列表
  @Input() tenantType = 3; // 租户类型
  loading = false;
  form: FormGroup; // 基本信息表单
  ownerAppOptions = [ // 所属产品下拉框
    { label: 'BM', value: 'bm'},
    { label: 'UTPRO', value: 'utpro' },
    { label: 'TBDSPRO', value: 'tbdspro' },
    { label: 'SCHPRO', value: 'schpro' },
    { label: 'CMCPRO', value: 'cmcpro' },
    { label: 'ASC_PLM', value: 'asc_plm' }];
  keyword: string; // 选择引用模型检索
  disabledSearch = false; // 禁用检索
  pagination: Pagination = new Pagination(); // 选择引用模型分页器

  constructor(
      private message: NzMessageService,
      private fb: FormBuilder,
      public listService: ListService,
      private router: Router,
  ) { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.tenantType = storage.tenantType();
      // 模型设计方案创建、编辑查询方案 禁用引用模型检索
      if (this.data?.id || this.data?.plan === 'create') {
        this.disabledSearch = true;
        this.keyword = this.data?.businessModelCode;
      }
      this.form = this.fb.group({
        querySchemaName: [this.data?.querySchemaName || '', [Validators.required]],
        querySchemaCode: [this.data?.querySchemaCode || '', [Validators.required, Validators.maxLength(50), Validators.pattern(formValidators.enCode)]],
        ownerApp: [this.tenantType === 2 ? this.ownerAppOptions[0].value : (this.data?.ownerApp || null), [Validators.required]],
      });
      this.fetchData();
    }
  }

  fetchData() {
    const params = {
      ...this.pagination,
      type: "all",
      status: '',
      domainCode: '',
      modelInfo: this.keyword,
    };
    this.listService.getModelList(params).subscribe(res => {
      if (res.code === '200') {
        this.pagination = JSON.parse(JSON.stringify({
          page: this.pagination.page,
          limit: this.pagination.limit,
          total: res.data?.count || 0,
        }));
        this.listOfData = res.data?.list || [];
        if (this.disabledSearch) {
          this.listOfData = this.listOfData.filter(d => d.modelCode === this.data?.businessModelCode);
          this.pagination.total = 1;
        }
      } else {
        this.message.error(res?.message);
      }
    });
  }

  onModelChange(row) {
    this.data.businessModelCode = row.modelCode;
    this.data.modelCode = row.modelCode;
    this.data.modelName = row.modelName;
    this.data.modelType = row.type;
  }

  onPaginationChange(page = 1, key = 'page') {
    this.pagination[key] = page;
    this.fetchData();
  }

  close(data = null) {
    this.visibleChange.emit(data);
  }

  handleOk() {
    if (this.form.invalid) {
      markAllControlsAsDirty(this.form);
      return;
    }

    if (!this.data.businessModelCode) {
      this.message.warning('请选择引用模型');
      return
    }
    const data = { ...this.data, ...this.form.value };
    localStorage.setItem('planRouterInfo', JSON.stringify(data));
    this.close(data);
    if (!this.isEdit) { // 新增跳转
      this.router.navigate(['/inquiry-plan/schemeDesign'])
    }
  }
}
