import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { Router } from '@angular/router';
import { NzTreeSelectComponent } from 'ng-zorro-antd/tree-select';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { ListService } from './list.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PermissionService } from '../../../../permission/permission.service';
interface fieldParams {
  label: string;
  value: string;
}

interface listParams {
  modelName?: string;
  modelCode?: string;
  type?: string;
  domainName?: string;
  domainCode?: string;
  status?: string;
  createBy?: string;
  createDate?: string;
}

@Component({
  selector: 'modal-list',
  templateUrl: './mode-list.component.html',
  styleUrls: ['./mode-list.component.less']
})

export class ListComponent {
  @ViewChild('treePublish') treePublish!: NzTreeSelectComponent;
  @ViewChild('treeModel') treeModel!: NzTreeSelectComponent;

  dbCodeOptions = [ // 数据库编码
    { label: '业务中台业务库', value: '1'},
    { label: '全量库starrocks', value: '2' }];
  constructor(private fb: FormBuilder, private router: Router, public listService: ListService, private message: NzMessageService, private cdr: ChangeDetectorRef, public permissionService: PermissionService) {
    this.validateForm = this.fb.group({
      mainModel: ['', [Validators.required]],
      modelNumber: ['', [Validators.required]],
      modelName: ['', [Validators.required]],
      modelFieldOf: [{ value: '', disabled: true }],
      dbCode: ['1', [Validators.required]],
      modelDes: ['', [Validators.maxLength(200)]]
    });
  }
  // regex = /^_/;
  // modelNumberValidator = (control: FormControl): { [s: string]: boolean } => {
  //   if (!control.value) {
  //     return { required: true };
  //   }
  //   else if (!this.regex.test(control.value)) {
  //     // return { confirm: true, error: true };
  //     return { required: true };
  //   }
  //   return {};
  // };

  //权限
  modeldesignSearch: boolean = false;
  modeldesignReset: boolean = false;
  modeldesignAdd: boolean = false;
  modeldesignPublish: boolean = false;
  modeldesignPublishDev: boolean = false;
  modeldesignPublishTest: boolean = false;
  modeldesignPublishProd: boolean = false;
  modeldesignPlanList: boolean = false;
  modeldesignCreatePlan: boolean = false;
  modeldesignCreateModel: boolean = false;

  publishOptions = [
    { name: '发布正式区', auth: 'modeldesignPublishProd', value: '5' },
    { name: '发布测试区', auth: 'modeldesignPublishTest', value: '4' },
    { name: '发布开发区', auth: 'modeldesignPublishDev', value: '3' },
  ]
  ngOnInit(): void {
    this.modeldesignSearch = this.permissionService.hasPermission('bm-dqt_model-design-search')
    this.modeldesignReset = this.permissionService.hasPermission('bm-dqt_model-design-reset')
    this.modeldesignAdd = this.permissionService.hasPermission('bm-dqt_model-design-add')
    this.modeldesignPublish = this.permissionService.hasPermission('bm-dqt_model-design-publish')
    this.modeldesignPublishDev = this.permissionService.hasPermission('bm-dqt_model-design-publishDev')
    this.modeldesignPublishTest = this.permissionService.hasPermission('bm-dqt_model-design-publishTest')
    this.modeldesignPublishProd = this.permissionService.hasPermission('bm-dqt_model-design-publishProd')
    this.modeldesignPlanList = this.permissionService.hasPermission('bm-dqt_model-design-planList')
    this.modeldesignCreatePlan = this.permissionService.hasPermission('bm-dqt_model-design-createPlan')
    this.modeldesignCreateModel = this.permissionService.hasPermission('bm-dqt_model-design-createModel')
    //专门处理零部件租户
    const data = localStorage.getItem('store')
    const store = JSON.parse(data);
    if (store) {
      const tenantSid = store?.tentDetail?.sid || '';
      if (tenantSid === '1064751793044480' || tenantSid === '1064700052676608') {
        //开发区隐藏
        this.modeldesignPublishDev = false;
      }
    }
    //获取模型列表
    this.getTable(1)
  }

  // 筛选字段
  selectedValue: string = '';
  fieldOfList: fieldParams[] = [
    { label: '项目领域', value: 'BM-PI' },
    { label: '质量领域', value: 'BM-QM' },
    { label: 'BOM领域', value: 'BM-BM' },
    { label: '采购领域', value: 'BM-PO' },
    { label: '工艺领域', value: 'BM-OP' },
    { label: '计划领域', value: 'BM-PP' },
    { label: '公共基础领域', value: 'BM-BA' },
    { label: '工单领域', value: 'BM-MO' },
    { label: '存货领域', value: 'BM-IM' },
    { label: '销售领域', value: 'BM-SD' },
    { label: '研发设计领域', value: 'BM-DE' },
    { label: '应付领域', value: 'BM-AP' },
    { label: '总账领域', value: 'BM-GL' },
    { label: '分录领域', value: 'BM-AJS' },
    { label: '成本领域', value: 'BM-CST' },
    { label: '结算领域', value: 'BM-ST' },
    { label: '应收领域', value: 'BM-AR' },
  ];
  modelText: string = '';
  // "":全部，1：草稿，2：开发中，3：开发区，4：测试区，5：正式区
  currentStatus: string = '';

  //列表
  listOfData: listParams[] = [];
  currentPage: number = 1;
  pageSize: number = 20;
  total: number = 0;
  //获取列表数据
  getTable(type: number): void {
    if (type == 1) {
      this.currentPage = 1;
      this.pageSize = 20;
    }
    const params = {
      type: 'all',
      status: this.currentStatus,
      domainCode: this.selectedValue,
      modelInfo: this.modelText,
      page: this.currentPage,
      limit: this.pageSize
    }
    this.listService.getModelList(params).subscribe(res => {
      if (res.code === '200') {
        const data = res?.data;
        this.listOfData = data.list;
        this.total = data.count || 0;
      } else {
        this.listOfData = [];
        this.total = 0;
        this.message.error(res?.message);
      }
    });
  }
  // 重置表单数据
  restData(): void {
    this.selectedValue = '';
    this.modelText = ''
    this.currentStatus = '';
    this.currentPage = 1;
    this.pageSize = 20;
    this.total = 0;
    this.getTable(1);
  }
  //状态筛选
  changeStatus(type): void {
    this.currentStatus = type
    this.getTable(1)
  }
  // 分页事件
  pageIndexChange(currentPage: number): void {
    this.currentPage = currentPage;
    this.getTable(2)
  }
  pageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.getTable(2)
  }

  //新增模型弹窗
  showModal: boolean = false;
  showAddModal(): void {
    const data = this.validateForm.value;
    this.validateForm.reset();
    this.validateForm.patchValue({ ...data });
    this.showModal = true;
    this.isQuote = false;
  }
  handleOk(): void {
    this.submitForm()
  }
  //取消
  handleCancel(): void {
    this.showModal = false;
  }

  //引用模型
  isQuote: boolean = true
  quoteModel(data): void {
    // if (data.type == 'real') {
    //   this.goToCanvas('list', data)
    //   this.selectData = null;
    //   return;
    // }
    this.isQuote = true;
    this.showModal = true;
    let formData = {
      mainModel: data.modelName,
      modelNumber: '',
      modelName: '',
      modelFieldOf: data.domainName,
      modelDes: '',
    }
    this.validateForm.patchValue(formData)
    this.selectData = data;
  }

  // 表单验证
  validateForm: FormGroup;
  submitForm(): void {
    if (this.validateForm.valid) {
      this.showModal = false;
      const data = this.validateForm.value
      this.router.navigate(['/model-canvas'],
        {
          queryParams: {
            source: 'add',
            ...data,
            mainBusinessModelCode: this.selectData.modelCode,
            mainBusinessModelName: this.selectData.modelName,
            virtualBusinessModelCode: data.modelNumber,
            virtualBusinessModelName: data.modelName,
            domainName: this.selectData.domainName,
            domainCode: this.selectData.domainCode,
            remark: data.modelDes
          }
        })
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity();
        }
      });
    }
  }

  //选择主模型
  selectModal: boolean = false
  mainModelText: string = ''
  mainModalData: listParams[] = []
  modalCurrentPage: number = 1;
  modalPageSize: number = 10;
  modalTotal: number = 0;
  getSelectModalList(type: number): void {
    if (type == 1) {
      this.modalCurrentPage = 1;
      this.modalPageSize = 10;
    }
    const params = {
      type: 'real',
      status: '',
      domainCode: '',
      modelInfo: this.mainModelText,
      page: this.modalCurrentPage,
      limit: this.modalPageSize
    }
    this.listService.getModelList(params).subscribe(res => {
      if (res.code === '200') {
        const data = res.data;
        this.mainModalData = data.list;
        this.modalTotal = data.count || 0;
      } else {
        this.mainModalData = [];
        this.modalTotal = 0
        // this.message.error(res?.message);
      }
    });
  }
  //打开选择模型弹窗
  openSelectModal(): void {
    if (this.isQuote) {
      return
    }
    const data = this.validateForm.value
    if (data.mainModel == '' || data.mainModel == null) {
      this.selectRowId = '';
      this.selectData = null;
    }
    this.selectModal = true
    this.mainModelText = '';
    this.modalCurrentPage = 1;
    this.modalPageSize = 10;
    this.getSelectModalList(2);
  }
  //取消
  handleSelectCancel(): void {
    this.selectModal = false
  }
  //选择模型
  selectRowId: string = '';
  selectData = null;
  selectRow(data): void {
    this.selectRowId = data.modelCode;
    this.selectData = data;
  }
  // 分页事件
  modalPageSizeChange(newSize: number): void {
    this.modalPageSize = newSize
    this.getSelectModalList(2);
  }
  modalPageIndexChange(currentPage: number): void {
    this.modalCurrentPage = currentPage;
    this.getSelectModalList(2);
  }
  //选择主模型确定
  handleSelectOk(): void {
    this.selectModal = false;
    let formData = {
      mainModel: this.selectData.modelName,
      modelFieldOf: this.selectData.domainName,
    }
    this.validateForm.patchValue(formData)
  }

  //跳转画布
  goToCanvas(source, data): void {
    this.router.navigate(['/model-canvas'], {
      queryParams: {
        source: source,
        modelCode: data.modelCode,
        modelName: data.modelName,
        type: data.type
      }
    })
  }
  //查询方案列表
  goToInquiry(data): void {
    this.router.navigate(['/inquiry-plan'], {
      queryParams: {
        businessModelCode: data.modelCode,
        modelName: data.modelName,
        plan: 'query'
      }
    });
  }
  // 创建查询方案
  createQueryPlan(data): void {
    localStorage.setItem('create', '1')
    this.router.navigate(['/inquiry-plan'], {
      queryParams: {
        businessModelCode: data.modelCode,
        modelName: data.modelName,
        modelType: data.type,
        plan: 'create'
      }
    })
  }

  // 发布
  isHovered: boolean = false;
  isSendModule: boolean = false;
  publishTitle: string = '3'
  publishVisible: boolean = false;
  openPublishModule(title: string): void {
    this.publishVisible = true;
    this.publishTitle = title;
  }
  closePublishVisible(type) {
    this.publishVisible = false;
    if (type == 2) {
      this.getTable(1)
    }
  }
}


