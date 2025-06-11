import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd/message';
import { ListService } from './list.service';
import { PermissionService } from '../../../../permission/permission.service';
import {formValidators, storage} from "../../../../shared/utils";
import {SchemeDesign} from "./list-model";
interface listParams {
  businessModelName?: string;
  businessModelCode?: string;
  queryschemaCode?: string;
  queryschemaName?: string;
  modelType?: string;
  status?: string;
  createBy?: string;
  createDate?: string;
}

@Component({
  selector: 'queryschema-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})

export class ListComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private message: NzMessageService, public listService: ListService, public permissionService: PermissionService) {
    this.route.queryParams.subscribe(params => {
      this.routerParams = params
    });
  }
  //路由参数
  routerParams: any = null;
  //权限
  inquiryPlanSearch: boolean = false;
  inquiryPlanReset: boolean = false;
  inquiryPlanAdd: boolean = false;
  inquiryPlanPublish: boolean = false;
  inquiryPlanPublishDev: boolean = false;
  inquiryPlanPublishTest: boolean = false;
  inquiryPlanPublishProd: boolean = false;
  inquiryPlanDesign: boolean = false;
  publishOptions = [
    { name: '发布正式区', auth: 'inquiryPlanPublishProd', value: '5' },
    { name: '发布测试区', auth: 'inquiryPlanPublishTest', value: '4' },
    { name: '发布开发区', auth: 'inquiryPlanPublishDev', value: '3' },
  ]
  ngOnInit(): void {
    this.inquiryPlanSearch = this.permissionService.hasPermission('bm-dqt_inquiry-plan-search')
    this.inquiryPlanReset = this.permissionService.hasPermission('bm-dqt_inquiry-plan-reset')
    this.inquiryPlanAdd = this.permissionService.hasPermission('bm-dqt_inquiry-plan-add')
    this.inquiryPlanPublish = this.permissionService.hasPermission('bm-dqt_inquiry-plan-publish')
    this.inquiryPlanPublishDev = this.permissionService.hasPermission('bm-dqt_inquiry-plan-publishDev')
    this.inquiryPlanPublishTest = this.permissionService.hasPermission('bm-dqt_inquiry-plan-publishTest')
    this.inquiryPlanPublishProd = this.permissionService.hasPermission('bm-dqt_inquiry-plan-publishProd')
    this.inquiryPlanDesign = this.permissionService.hasPermission('bm-dqt_inquiry-plan-planDesign')
    // 租户类型为零部件 开发区隐藏
    this.inquiryPlanPublishDev = storage.tenantType() !== 1;
    if (this.routerParams && this.routerParams.plan == 'query') {
      this.modelText = this.routerParams.businessModelCode
    }
    this.getTable(1)
    // 从模型设计创建方案跳转
    if (localStorage.getItem('create') === '1') {
      localStorage.setItem('create', '2')
      if (this.routerParams && this.routerParams.plan == 'create') {
        this.addChange(true, { ...this.routerParams })
      }
    }
  }

  //模型名称下拉
  selectedValue: string = 'model'
  // modeNameList = [];
  modelText: string = '';
  // "":全部，1：草稿，2：开发中，3：开发区，4：测试区，5：正式区
  currentStatus: string = '';
  inquiryTable: listParams[] = []
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
      schemaInfo: this.modelText,
      type: this.selectedValue,
      status: this.currentStatus,
      page: this.currentPage,
      limit: this.pageSize
    }
    this.listService.queryschemaList(params).subscribe(res => {
      if (res.code === '200') {
        const data = res.data;
        this.inquiryTable = data.list;
        this.total = data.count || 0;
      } else {
        this.inquiryTable = [];
        this.total = 0;
        this.message.error(res?.message);
      }
    });
  }
  // 重置表单数据
  restData(): void {
    this.modelText = ''
    this.currentStatus = '';
    this.currentPage = 1;
    this.pageSize = 20;
    this.selectedValue = 'model';
    this.getTable(1)
  }
  //类型切换
  changeSelectType() {
    // this.modelText = ''
    // if (this.routerParams && this.routerParams.plan == 'query' && this.selectedValue == 'model') {
    //   this.modelText = this.routerParams.modelCode
    // }
  }
  //状态筛选
  changeStatus(type): void {
    this.currentStatus = type
    this.getTable(1)
  }
  // 分页事件
  pageIndexChange(currentPage: number) {
    this.currentPage = currentPage;
    this.getTable(2)
  }
  pageSizeChange(newSize: number) {
    this.pageSize = newSize;
    this.getTable(2)
  }

  // 新增查询方案
  addVisible: boolean = false;
  addData = new SchemeDesign();
  addChange(visible, data?): void {
    this.addVisible = visible;
    this.addData = JSON.parse(JSON.stringify(data || this.addData));
  }

  //方案设计
  goToSchemeDesign(data): void {
    const planParams = {
      ...data,
      sourceType: 'list',
      modelCode: data.businessModelCode,
      modelName: data.businessModelName,
      userName: data.createBy,
    }
    localStorage.setItem('planRouterInfo', JSON.stringify(planParams));
    this.router.navigate(['/inquiry-plan/schemeDesign'])
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
