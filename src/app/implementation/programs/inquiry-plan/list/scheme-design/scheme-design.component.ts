import { Component, OnInit, ViewChild, ChangeDetectorRef, ViewChildren, QueryList, ElementRef, NgZone, HostListener } from '@angular/core';
import { NzTreeSelectComponent } from 'ng-zorro-antd/tree-select';
import { NzFormatEmitEvent, NzTreeComponent } from 'ng-zorro-antd/tree';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { ListService } from '../list.service';
import { CalculateColumn, Parameter } from "../list-model";
import {
  convertToTree,
  markAllControlsAsDirty,
  storage,
  generateId,
} from '../../../../../shared/utils';
import { FieldMappingComponent } from "../modal/field-mapping/field-mapping.component";
import { PermissionService } from '../../../../../permission/permission.service'
// 递归转换函数
function convertToNzTree(nodes) {
  return nodes.map(node => ({
    key: node.flag,
    title: node.domainObjectName,
    disabled: true,
    children: [
      // 将 fields 转换为子节点
      ...(node.fields?.map(field => ({
        key: field.fieldId,
        fieldId: field.fieldId,
        title: field.fieldName,
        isLeaf: true,
        children: [],
        type: field.type,
        path: field.path,
        pathName: field.pathName,
        flag: field.flag,
        column: field.fieldCode,
        columnName: field.fieldName,
        originalPath: field.originalPath,
        desc: false,
        alias: field.alias ? field.alias : field.fieldCode
      })) || []),
      // 递归处理 child 节点
      ...convertToNzTree(node.child || [])
    ]
  }));
}


@Component({
  selector: 'app-schemeDesign',
  templateUrl: './scheme-design.component.html',
  styleUrls: ['./scheme-design.component.less']
})
export class SchemeDesignComponent implements OnInit {
  @ViewChild('treeComponent') treeComponent!: NzTreeComponent;
  @ViewChild('treeSelect') treeSelect!: NzTreeSelectComponent;
  @ViewChild('treeSelect2') treeSelect2!: NzTreeSelectComponent;
  @ViewChild('treeSort') treeSort!: NzTreeSelectComponent;
  @ViewChild('treeSelect3') treeSelect3!: NzTreeSelectComponent;
  @ViewChild('treeSelect4') treeSelect4!: NzTreeSelectComponent;
  @ViewChildren(NzTreeSelectComponent) treeSelects!: QueryList<NzTreeSelectComponent>;
  @ViewChild('treeSelectComponent') treeSelectComponent!: NzTreeSelectComponent;  // 获取组件实例
  @ViewChild('fieldMappingModal') fieldMappingModal: FieldMappingComponent;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private fb: FormBuilder,
    public listService: ListService,
    private cdr: ChangeDetectorRef,
    public permissionService: PermissionService,
    private el: ElementRef,
    private zone: NgZone
  ) {}
  // 查询方案参数
  routerParams = null;
  sourceType = '';
  inquiryFieldMapping: boolean = false;
  inquiryParameter: boolean = false;
  inquiryCalColumn: boolean = false;
  inquiryOperation: boolean = false;
  inquiryGenInvoke: boolean = false;
  //只读权限
  readOnlyPermis: boolean = false;
  ngOnInit(): void {
    this.settingForm = this.fb.group({
      group: [false], // 是否分组
      pageSize: [null, [Validators.required]], // 每页笔数
      pageType: ['M', [Validators.required]] // 分页方式
    });
    this.inquiryFieldMapping = this.permissionService.hasPermission('bm-dqt_inquiry-plan-fieldMapping')
    this.inquiryParameter = this.permissionService.hasPermission('bm-dqt_inquiry-plan-parameter')
    this.inquiryCalColumn = this.permissionService.hasPermission('bm-dqt_inquiry-plan-calColumn')
    this.inquiryOperation = this.permissionService.hasPermission('bm-dqt_inquiry-plan-operation')
    this.inquiryGenInvoke = this.permissionService.hasPermission('bm-dqt_inquiry-plan-genInvoke')
    this.routerParams = JSON.parse(localStorage.getItem('planRouterInfo') || '');
    if (this.routerParams) {
      this.sourceType = this.routerParams.sourceType;
      if (this.sourceType == 'list' && storage.store) {
        this.readOnlyPermis = storage.isReadonly() && storage.userId !== this.routerParams.userName;
      }
    }
    this.fetchData();
  }
  fetchData() {
    this.inquiryField = [];
    this.inquiryFieldChild = [];
    this.mArrayNode = [];
    this.mArrayNodeChild = [];
    this.calColumn = [];
    this.defaultCheckedKeys = [];
    this.sortNodeChildList = [];
    this.sortNodeStorage = [];
    this.selectedSortList = [];
    this.fixedConditionsList = [];
    this.selectedConditions = [];
    this.getFieldTree();
    this.getFieldInfo()
  }
  //操作收起
  isOperatModule: boolean = false
  //设置查询条件
  fieldNodes = []; // 原始字段树
  calcFieldNodes = []; // 包含运算列字段树
  getFieldTree(): void {
    const params = {
      modelCode: this.routerParams.businessModelCode,
      modelType: this.routerParams.modelType,
      searchType: '1',
      querySchema: this.routerParams.querySchemaCode,
    }
    this.listService.getFieldInfo(params).subscribe(res => {
      if (res.code === '200') {
        this.fieldNodes = convertToTree(res.data);
        this.domainObjectTree = convertToTree(res.data, false, 'path');

        if (this.sourceType == 'list') {
          this.queryPlan()
        } else {
          this.initCalcFieldNodes(); // 查询字段树
        }
      } else {
        this.message.error(res?.message);
      }
    });
  }
  //递归循获取勾选所有子节点
  collectAllCheckedNodes(nodes) {
    const result = [];
    nodes.forEach(node => {
      result.push(node);
      if (node.origin.children?.length) {
        result.push(...this.collectAllCheckedNodes(node.children));
      }
    });
    return result;
  }

  // 查询字段、M数组条件tab 检索
  keyword = '';
  tabList = [
    { title: '查询字段', data: 'inquiryField', tree: 'calcFieldNodes' },
    { title: 'M数组条件', data: 'mArrayNode', tree: 'fieldNodes' }
  ];
  onTabChange() {
    this.keyword = '';
  }
  // 左侧拖拽
  leftWidth = 320;
  minWidth = 240;
  maxWidth = 500;
  private isDragging = false;
  private startX = 0;
  private startWidth = 0;
  startDrag(event: MouseEvent) {
    this.isDragging = true;
    this.startX = event.clientX;
    this.startWidth = this.leftWidth;
    event.preventDefault();
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }
  @HostListener('document:mousemove', ['$event'])
  onDrag(event: MouseEvent) {
    if (!this.isDragging) return;
    this.zone.runOutsideAngular(() => {
      const delta = event.clientX - this.startX;
      const newWidth = Math.min(
          Math.max(this.startWidth + delta, this.minWidth),
          this.maxWidth
      );
      requestAnimationFrame(() => {
        this.leftWidth = newWidth;
        this.cdr.detectChanges();
      });
    });
  }
  @HostListener('document:mouseup')
  stopDrag() {
    if (!this.isDragging) return;
    this.isDragging = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }

  // 查询字段
  inquiryField: string[] = [];
  inquiryFieldChild = [];
  // M数组条件
  mArrayNode: string[] = [];
  mArrayNodeChild = [];
  changeTreeCheckedKeys({ checkedKeys, keys }, key = 'inquiryField'): void {
    this[key] = keys;
    this[`${key}Child`] = checkedKeys.map(d => {
      return {
        ...d,
        origin: {
          ...d.origin,
          alias: this[`${key}Child`].find(o => d.key === o.key)?.origin?.alias || d?.origin?.alias
        }
      }
    });
  }
  delTreeCheckedKeys(index, key = 'inquiryField') {
    this[key] = this[key].filter((_, i) => i !== index);
    this[`${key}Child`] = this[`${key}Child`].filter((_, i) => i !== index);
  }

  // 条件设定表单
  settingForm: FormGroup;

  //排序弹窗
  sortVisible: boolean = false;
  selectedSortList: any = []
  // 删除已选中的排序字段
  delSelectedSortField(e, index = 0) {
    e.preventDefault();
    e.stopPropagation();
    this.selectedSortList = this.selectedSortList.filter((_, i) => i !== index);
  }
  openSortModule(): void {
    this.sortVisible = true;
    this.searchNodeValue = '';
    if (this.selectedSortList.length > 0) {
      this.sortNodeChildList = this.selectedSortList;
      this.sortNodeChildList.forEach(item => {
        this.defaultCheckedKeys.push(item.key)
      })
    } else {
      this.sortNodeChildList = [];
      this.defaultCheckedKeys = []
    }
  }
  handleSortCancel(): void {
    this.selectedSortList = this.sortNodeStorage
    this.sortVisible = false
  }
  handleeSortOk() {
    this.sortVisible = false;
    this.selectedSortList = this.sortNodeChildList;
  }

  // 排序字段
  sortFieldNodes = [];
  getFieldInfo(): void {
    const params = {
      modelCode: this.routerParams.businessModelCode,
      modelType: this.routerParams.modelType,
      searchType: '1',
      querySchema: this.routerParams.querySchemaCode,
      colInfo: this.searchNodeValue
    }
    this.listService.getFieldInfo(params).subscribe(res => {
      if (res.code === '200') {
        this.sortFieldNodes = convertToTree(res?.data);
      } else {
        this.message.error(res?.message);
      }
    });
  }

  defaultCheckedKeys = [];
  searchNodeValue = ''
  // 排序树操作
  sortNodeChildList = []
  sortNodeStorage = []

  changeSortTreeCheckedKeys(): void {
    const nodes = this.treeSort.getCheckedNodeList();
    if (nodes && nodes.length > 0) {
      this.sortNodeChildList = this.collectAllCheckedNodes(nodes).map(targetItem => {
        const matchedItem = this.sortNodeChildList.find(sourceItem => sourceItem.key === targetItem.key);
        return { ...targetItem, ...matchedItem };
      });
    }
    this.sortNodeStorage = [...this.sortNodeChildList];
  }

  // 删除
  deleteCuurentNode(item, index): void {
    this.sortNodeChildList.splice(index, 1)
    this.defaultCheckedKeys = this.defaultCheckedKeys.filter(key => key !== item.key);
  }
  //升降序
  descNodeEvent(index: number, type: boolean): void {
    this.sortNodeChildList[index].origin.desc = type
  }
  //上移下移
  moveNodeEvent(index: number, type: string): void {
    if (type == 'up') {
      if (index > 0) {
        [this.sortNodeChildList[index], this.sortNodeChildList[index - 1]] = [this.sortNodeChildList[index - 1], this.sortNodeChildList[index]];
      }
    } else if (type == 'down') {
      if (index < this.sortNodeChildList.length - 1) {
        [this.sortNodeChildList[index], this.sortNodeChildList[index + 1]] = [this.sortNodeChildList[index + 1], this.sortNodeChildList[index]];  // 交换元素
      }
    }
    // this.sortNodeChildList[index].origin.desc = type
  }

  //固定条件
  fixedVisible: boolean = false;
  selectedConditions: any = [];
  fixedConditionsList: any = []
  openFixedModule(): void {
    this.fixedVisible = true;
    if (this.selectedConditions.length == 0) {
      this.fixedConditionsList = []
    } else {
      this.fixedConditionsList = this.selectedConditions;
    }
  }
  handleFixedCancel(): void {
    //取消恢复删除数据
    this.fixedConditionsList.forEach(item => {
      if (item.isDelete == 2) {
        item.isDelete = 1
      }
    });
    this.fixedVisible = false
  }
  handleeFixedOk() {
    this.fixedConditionsList.forEach(item => {
      if (!item.fieldName && !item.condition && !item.whereType) {
        item.isDelete = 2
      }
    });
    this.selectedConditions = this.fixedConditionsList.filter(d => d.isDelete == 1);
    this.fixedVisible = false;
  }
  //添加条件
  addRow(): void {
    this.fixedConditionsList = [
      ...this.fixedConditionsList,
      {
        isDelete: 1, //1代表未删除 2代表删除
        leftExpand: '', //左括号
        fieldName: '',//字段名称
        fieldId: '',
        path: "",
        pathName: "",
        flag: "",
        column: "",
        columnName: "",
        type: "",
        originalPath: "",
        condition: '',//条件
        whereType: '',//参数类型
        param: '',//参数1
        param2: '',//参数2
        fieldValue: '',//字段1
        fieldValue2: '',//字段2
        rightExpand: '',//右括号
        logic: 'AND'//逻辑
      }
    ];
  }

  changeWhereNode($event: string[], index: number): void {
    let treeSelectId = 'treeSelect_' + (index + 10)
    this.treeSelects.forEach((ts: NzTreeSelectComponent) => {
      if (ts.nzId == treeSelectId) {
        let selectedNodes = ts.selectedNodes
        this.fixedConditionsList[index].fieldId = $event;
        this.fixedConditionsList[index].path = selectedNodes[0].origin.path;
        this.fixedConditionsList[index].pathName = selectedNodes[0].origin.pathName
        this.fixedConditionsList[index].flag = selectedNodes[0].origin.flag
        this.fixedConditionsList[index].column = selectedNodes[0].origin.column
        this.fixedConditionsList[index].columnName = selectedNodes[0].origin.columnName
        this.fixedConditionsList[index].type = selectedNodes[0].origin.type
        this.fixedConditionsList[index].originalPath = selectedNodes[0].origin.originalPath
      }
    });
  }

  //参数类型切换
  changeParamsType(index: number) {
    this.fixedConditionsList[index].fieldValue = '';
  }

  changeLogic(index: number, type: number): void {
    this.fixedConditionsList[index].logic = type
  }
  // 固定条件删除
  //临时缓存拷贝防止删除完，取消操作
  delteConditions(index: number): void {
    this.fixedConditionsList[index].isDelete = 2
    this.fixedConditionsList = [
      ...this.fixedConditionsList
    ];
  }

  // 保存查询方案、执行运算、产生调用示例是否禁止执行
  disabledExecuted() {
    if (this.settingForm.invalid) {
      markAllControlsAsDirty(this.settingForm);
      return true;
    }
    if (this.inquiryField.length == 0) {
      this.message.error('请设置查询字段条件！', {
        nzDuration: 5000
      });
      return true;
    }
    return false;
  }

  // 保存查询方案、执行运算、产生调用示例 参数
  getSaveParams() {
    // 固定条件
    const where = this.fixedConditionsList.filter(d => d.isDelete == 1).map((item, index) => {
      const list = [item.param, item.param2, item.fieldValue, item.fieldValue2];
      const listName = list.filter(x => x?.trim() !== "");
      return {
        sort: index + 1,
        ...item,
        leftBracket: item.leftExpand,
        rightBracket: item.rightExpand,
        operator: item.condition,
        whereName: listName,
      }
    })
    // M数组条件
    const param = this.mArrayNodeChild.map((d, i) => ({ sort: i + 1, ...d.origin, paramType: 'M' })).concat(this.paramP || []);
    return {
      ...this.routerParams,
      ...this.settingForm.value,
      ownerApp: (this.routerParams.ownerApp || 'bm').toLowerCase(),
      struction: {
        select: this.inquiryFieldChild.map((d, i) => ({ sort: i + 1, ...d.origin })), // 查询字段
        order: this.selectedSortList.map((d, i) => ({ sort: i + 1, ...d.origin })), // 排序字段
        where, // 固定条件
        param, // M数组条件
        calColumn: this.calColumn.map((d, i) => ({ ...d, sort: i })), // 运算列
      }
    }
  }

  // 执行运算
  sqlStatement = '' // SQL预览
  performOperationVisible = false; // 数据查询/SQL预览弹框
  performOperation(): void {
    if (this.disabledExecuted()) { return; }
    this.peration(1);
  }
  handlePerformCancel() {
    this.performOperationVisible = false;
  }

  // 保存查询方案
  createVisible: boolean = false;
  errorInfo: string = ''
  handleCreateCancel(): void {
    this.createVisible = false;
  }
  createPlan(): void {
    if (this.disabledExecuted()) {
      return;
    }
    if (this.invalidFieldMapping()) {
      return
    }
    if (this.invalidParamP()) {
      return
    }
    this.savePlane();
  }

  // 字段映射别名重复校验
  invalidFieldMapping() {
    if (this.fieldMappingModal.initForm()) {
      this.message.error('查询字段别名有重复，请在字段映射中进行配置！');
      this.fieldMappingChange(true);
      return true;
    }
    return false;
  }

  // P参数在固定条件中未使用校验
  invalidParamP() {
    const params = this.paramP.map(d => d.columnName); // P参数字段名称列表
    const fixedParams = this.fixedConditionsList.filter(d => d.whereType === '3').map(d => d.param); // 固定条件参数类型值列表
    const unusedParams = params.filter(column => !fixedParams.includes(column)).map(d => `“${d}”`).join('、'); // 未使用的P参数
    if (unusedParams) {
      this.message.error(`您设定的 ${unusedParams} P参数未使用，请在固定条件中进行配置！`);
      this.openFixedModule();
      return true;
    }
    return false;
  }

  //新增保存
  savePlane(): void {
    //查询字段组装
    const params = this.getSaveParams();
    if (this.planId && this.routerParams.sourceType == 'list') {
      params['id'] = this.planId;
      this.updatePlan(params)
    } else {
      this.listService.saveDetail(params).subscribe(res => {
        if (res.code === '200') {
          this.message.success(`${this.routerParams.querySchemaName}创建成功！`);
          localStorage.removeItem('planRouterInfo');
          this.router.navigate(['/inquiry-plan']);
        } else {
          this.createVisible = true;
          this.errorInfo = res.message;
        }
      });
    }

  }

  updatePlan(params): void {
    this.listService.updateDetail(params).subscribe(res => {
      if (res.code === '200') {
        this.message.success(`${this.routerParams.querySchemaName}保存成功！`);
        localStorage.removeItem('planRouterInfo');
        this.router.navigate(['/inquiry-plan']);
      } else {
        this.createVisible = true;
        this.errorInfo = res.message;
      }
    });
  }
  // type=1-执行运算 2-产生调用示例
  peration(type: number): void {
    const params = this.getSaveParams();
    if (type == 2) {
      this.callExampleEvent(params)
    } else {
      this.listService.performOperation(params).subscribe(res => {
        if (res.code === '200') {
          this.sqlStatement = res.message;
          this.performOperationVisible = true;
        } else {
          this.sqlStatement = ''
          this.message.error(res.message, {
            nzDuration: 2000
          });
        }
      });
    }
  }

  //  获取详情
  planId = null
  initInquiryFieldChildItem(item) {
    return {
      key: item.fieldId,
      origin: {
        key: item.fieldId,
        ...item
      }
    }
  }
  queryPlan(): void {
    const params = {
      businessModelCode: this.routerParams.businessModelCode,
      querySchemaCode: this.routerParams.queryschemaCode,
    }
    this.listService.getDetail(params).subscribe(res => {
      if (res.code === '200') {
        const data = res.data;
        if (data) {
          this.planId = data.id;
          this.routerParams = { ...this.routerParams, ...data, modelCode: data?.businessModelCode };
          this.calColumn = data?.struction?.calColumn || [];
          this.settingForm.patchValue(data);

          //查询字段
          this.inquiryFieldChild = [];
          this.inquiryField = [];
          let select = data.struction.select || [];
          select.forEach(item => {
            this.inquiryFieldChild.push(this.initInquiryFieldChildItem(item))
            this.inquiryField.push(item.fieldId)
          });
          this.initCalcFieldNodes(); // 查询字段树

          //排序字段和kye
          this.selectedSortList = []
          this.defaultCheckedKeys = []
          let orderList = data.struction.order
          orderList.forEach(item => {
            let obj = {
              key: item.fieldId,
              title: item.columnName,
              _title: item.columnName,
              origin: {
                key: item.fieldId,
                title: item.columnName,
                ...item
              }
            }
            this.selectedSortList.push(obj)
            this.sortNodeChildList.push(obj)
            this.defaultCheckedKeys.push(item.fieldId)
            // 浅拷贝
            this.sortNodeStorage = [...this.sortNodeChildList];
          });

          //固定条件
          this.fixedConditionsList = [];
          let fixWhere = data.struction.where;
          fixWhere.forEach(item => {
            let obj = {
              isDelete: 1,
              fieldName: item.fieldId,
              fieldId: item.fieldId,
              leftExpand: item.leftBracket,
              path: item.path,
              pathName: item.pathName,
              flag: item.flag,
              column: item.column,
              columnName: item.columnName,
              type: item.type,
              originalPath: item.originalPath,
              rightExpand: item.rightBracket,
              logic: item.logic,
              condition: item.operator,
              whereType: item.whereType,
              param: '',
              param2: '',
              fieldValue: '',
              fieldValue2: ''
            }
            if (item.whereType == '1' && item.whereName) {
              obj.fieldValue = item.whereName[0] ? item.whereName[0] : '';
              obj.fieldValue2 = item.whereName[1] ? item.whereName[1] : ''
            }
            if (item.whereType == '3' && item.whereName) {
              obj.param = item.whereName[0] ? item.whereName[0] : '';
              obj.param2 = item.whereName[1] ? item.whereName[1] : ''
            }
            this.fixedConditionsList.push(obj)
          });
          this.selectedConditions = [...this.fixedConditionsList]

          //M数组字段和key及P参数回显
          this.mArrayNodeChild = [];
          this.mArrayNode = [];
          this.paramP = []
          let mList = data.struction.param || [];
          mList.forEach(item => {
            if (item.paramType == 'M') {
              let obj = {
                origin: {
                  ...item
                }
              }
              this.mArrayNodeChild.push(obj)
              this.mArrayNode.push(item.fieldId)
            } else if (item.paramType == 'P') {
              //P参数回显
              this.paramP.push(item)
            }
          });
        }
      } else {
        this.message.error(res.message, {
          nzDuration: 2000
        });
      }
    });
  }

  //删除查询方案
  deleteQueryPlan(): void {
    if (this.readOnlyPermis) {
      this.message.warning('只有管理员角色才能删除非自己创建的查询方案！', {
        nzDuration: 5000
      });
      return
    }
    const params = {
      businessModelCode: this.routerParams.businessModelCode,
      querySchemaCode: this.routerParams.querySchemaCode,
    }
    this.listService.deleteDetail(params).subscribe(res => {
      if (res.code === '200') {
        this.message.success(`${this.routerParams.querySchemaName}删除成功！`);
        localStorage.removeItem('planRouterInfo');
        this.router.navigate(['/inquiry-plan']);
      } else {
        this.message.error(res.message, {
          nzDuration: 2000
        });
      }
    });
  }
  // 编辑查询弹窗
  addVisible: boolean = false;
  modelCode = ''; // 初始引用模型
  addChange(visible, data?): void {
    if (visible) { this.modelCode = this.routerParams?.businessModelCode }
    this.addVisible = visible;
    if (data) {
      this.routerParams = JSON.parse(JSON.stringify(data));
      if (this.modelCode !== data?.businessModelCode) {
        this.fetchData();
      }
    }
  }

  //调用示例
  callExampleVisible: boolean = false;
  jsonExample = '';
  apiName = ""
  async copyToClipboard(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        this.message.success('复制成功！');
        return true;
      } else {
        // 兼容旧版浏览器（需用户触发点击事件）
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        this.message.success('复制成功！');
        return true;
      }
    } catch (error) {
      return false;
    }
  }

  // 产生调用示例
  openCallExamp(): void {
    if (this.disabledExecuted()) { return; }
    this.jsonExample = '';
    this.peration(2);
  }
  // 复制API名称
  copyApiName() {
    const params = this.getSaveParams();
    this.callExampleEvent(params, true);
  }
  handleExampleCancel(): void {
    this.callExampleVisible = false
  }
  handleExampleCopy(): void {
    this.copyToClipboard(this.jsonExample);
    this.callExampleVisible = false;
  }
  //调用示例
  callExampleEvent(params, isCopyApiName = false): void {
    this.listService.callExample(params).subscribe(res => {
      if (res.code === '200') {
        let parsedData = JSON.parse(res.data.example);
        let formattedJson = JSON.stringify(parsedData, null, 4);
        this.jsonExample = res.data.example ? formattedJson : "";
        this.apiName = res.data.api_name;
        if (isCopyApiName) {
          this.copyToClipboard(res.data.api_name);
        } else {
          this.callExampleVisible = true
        }
      } else {
        this.jsonExample = '';
        this.apiName = '';
        this.message.error(res?.message);
        this.callExampleVisible = false
      }
    });
  }

  // 字段映射操作
  fieldMappingVisible: boolean = false;
  fieldMappingChange(visible, data?): void {
    this.fieldMappingVisible = visible;
    this.inquiryFieldChild = [...(data?.inquiryField || this.inquiryFieldChild)];
    this.mArrayNodeChild = [...(data?.mArray || this.mArrayNodeChild)];
  }

  // P参数
  paramP: Parameter[] = [];
  parameterVisible: boolean = false
  parameterChange(visible, data?): void {
    this.parameterVisible = visible;
    if (data) { this.paramP = data; }
  }

  // 运算列
  domainObjectTree = []; // 所属领域对象
  calColumn: CalculateColumn[] = [];
  calColumnIndex: number;
  operColumnVisible: boolean = false
  calcFieldKey = 'DQT_CAL_COLUMN'
  calcFieldExpandedKeys = [this.calcFieldKey];
  operColumnChange(visible = true, data: CalculateColumn = null): void {
    this.operColumnVisible = visible;
    if (data) {
      const item = JSON.parse(JSON.stringify((this.initCalcFieldItem(data))));
      if (this.calColumnIndex === -1) { // 新增
        this.calColumn.push(item);
      } else { // 编辑
        this.calColumn[this.calColumnIndex] = item;
        const inquiryFieldIndex = this.inquiryFieldChild.findIndex(d => d.key === item.key);
        if (inquiryFieldIndex !== -1) { // 编辑的已选中
          this.inquiryFieldChild[inquiryFieldIndex] = this.initInquiryFieldChildItem(item);
        }
      }
      this.initCalcFieldNodes();
    }
  }
  initCalcFieldItem(data) {
    const key = data?.key || data?.fieldId || generateId();
    return {
      ...data,
      isField: true,
      isLeaf: true,
      key,
      fieldId: key,
      title: data.columnName,
      path: data.ownerPath,
      pathName: data.ownerPath,
      alias: data.column,
      type: 2,
      domainObjectName: '运算列',
      domainObjectCode: this.calcFieldKey,
      flag: this.calcFieldKey,
      desc: true,
    }
  }
  initCalcFieldNodes() {
    this.calcFieldNodes = (this.calColumn && this.calColumn?.length ? [{
      isField: false,
      key: this.calcFieldKey,
      title: '运算列',
      disabled: true,
      children: this.calColumn.map(data => (this.initCalcFieldItem(data)))
    }] : []).concat(this.fieldNodes[0]);
    this.inquiryField = [...this.inquiryField];
    this.calcFieldExpandedKeys = [...this.calcFieldExpandedKeys];
  }
  // -1时为新增
  editCalColumn(index: number = -1) {
    this.calColumnIndex = index;
    this.operColumnChange();
  }
  deleteCalColumn(index: number, key: string) {
    this.calColumn.splice(index, 1);
    this.initCalcFieldNodes();
    this.inquiryFieldChild = [...this.inquiryFieldChild.filter(d => d.key !== key)];
    this.inquiryField = [...this.inquiryField.filter(d => d !== key)];
  }
}
