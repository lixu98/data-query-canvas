import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {functionTree, paramTypeOptions, ExpressionNode, FunctionNode, CalculateColumn} from "../../list-model";
import {NzMessageService} from "ng-zorro-antd/message";
import {
  _deleteTreeNode,
  _deselectAllTreeNodes,
  _updateTreeNode,
  markAllControlsAsDirty,
  formValidators, generateId
} from "../../../../../../shared/utils";

@Component({
  selector: 'app-operation-column',
  templateUrl: './operation-column.component.html',
  styleUrls: ['./operation-column.component.less']
})
export class OperationColumnComponent implements OnInit, OnChanges {
  @Input() isEdit = false;
  @Input() data: CalculateColumn;
  @Input() domainObjectTree = []; // 所属领域对象
  @Input() fieldTree = []; // 引用字段树
  @Output() visibleChange = new EventEmitter<any>();
  loading = false;
  form: FormGroup;
  columnTypeOptions = paramTypeOptions; // 输出数据类型下拉框
  referenceType: 'function' | 'field' = 'function';
  referenceTypeList = [
    { label: '引用函数', value: 'function', message: '计算字段允许使用的函数范围，应用可以基于函数组装字段业务逻辑' },
    { label: '引用字段', value: 'field', message: '计算字段可以引用模型中的字段参与业务逻辑组装' }
  ];
  // 左侧引用字段/引用函数树
  get treeData() {
    return this.referenceType === 'function' ? functionTree : this.fieldTree;
  };
  keyword: string = '';
  selectedKeys = [];
  currentNode = null;
  // 右侧字段表达式树
  currentExpression: ExpressionNode = null;
  selectedVariable: ExpressionNode = null;
  // 快速转化表单
  conversionForm: FormGroup;

  constructor(
      private fb: FormBuilder,
      private message: NzMessageService,
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.loading = false;
      this.data = JSON.parse(JSON.stringify(this.data));
      this.form = this.fb.group({
        column: [this.data?.column || '', [Validators.required, Validators.maxLength(30), Validators.pattern(formValidators.enCode)]],
        columnName: [this.data?.columnName || '', [Validators.required]],
        columnType: [this.data?.columnType || 'int', [Validators.required]],
        ownerPath: [this.data?.ownerPath || null, [Validators.required]]
      });
      this.conversionForm = this.fb.group({
        dataType: [null, [Validators.required]],
        columnSelect: [null, [Validators.required]],
        dateType: [null, [Validators.required]],
        hms: [null, [Validators.required]],
      });
      this.currentExpression = this.data?.calFormulasDisplay ? JSON.parse(this.data?.calFormulasDisplay) : null;
    }
  }

  // 引用字段/引用函数切换
  changeReferenceType(type): void {
    this.keyword = '';
    this.selectedKeys = [...[]];
    this.referenceType = type;
  }

  onColumnTypeChange(value) {
    this.form.patchValue({
      ...this.form.value,
      columnType: value,
    });
  }

  onNodeChange(node) {
    const data = node?.node?.origin;
    this.selectedKeys = [];
    if (this.referenceType === 'function') {
      if (this.currentExpression && !this.selectedVariable && this.currentExpression.children.some(d => d.type === 'operator')) {
        this.message.warning('请选择需要替换的函数');
        return false;
      }
    }
    if (this.referenceType === 'field') {
      if (!this.currentExpression) {
        this.message.warning('请先选择函数');
        return false;
      }
      if (!this.selectedVariable) {
        this.message.warning('请先选择函数变量');
        return false;
      }
    }
    this.selectedKeys = [...[data.key]];
    this.currentNode = data;
    this[this.referenceType === 'function' ? 'changeFunction' : 'changeField'](data);
  }

  changeField(node) {
    this.updateNode(this.selectedVariable.id, {
      id: generateId(),
      type: 'field',
      value: node.fieldCode,
      display: node.fieldName,
      key: `[${node.domainObjectCode}&${node.flag}&${node.fieldCode}]`,
    });
    this.deselectAllNodes();
  }

  changeFunction(node) {
    const newNode = this.createExpressionFromFunction(node);
    if (this.selectedVariable) {
      this.updateNode(this.selectedVariable.id, newNode);
    } else {
      this.currentExpression = newNode;
    }
    this.deselectAllNodes();
  }

  updateNode(id: string, data: Partial<ExpressionNode>) {
    this.currentExpression = _updateTreeNode(this.currentExpression, id, data);
  }

  removeNode(id: string) {
    this.currentExpression = _deleteTreeNode(this.currentExpression, id);
  }

  deselectAllNodes() {
    this.selectedVariable = null;
    _deselectAllTreeNodes(this.currentExpression);
  }

  // 根据表达式把字符串转为数组
  generateArrayByRegex(str = '', regex = /(\b[A-Z0-9_]+\b)/g) {
    return str.split(regex).filter(d => d).map(d => d.trim());
  }

  private createExpressionFromFunction(func): ExpressionNode {
    const template = func.key;
    const regex = /(\b[A-Z0-9_]+\b)/g;
    const variables = template.match(regex) || []; // 变量数组
    const addValueArr = this.generateArrayByRegex(func.addValue);
    const valueArr = this.generateArrayByRegex(template);

    const children = valueArr.map(v => {
      const canInput = typeof func?.canInput === 'boolean' ? func.canInput && !v.includes('FIELD') :
        typeof func?.canInput === 'object' && Object.keys(func.canInput).includes(v) ? func?.canInput[v] : false;
      return {
        id: generateId(),
        type: 'variable' as const,
        value: variables.includes(v) ? v : null,
        display: v,
        selected: false,
        canAdd: !!func.addValue && v === addValueArr[addValueArr.length - 1],
        canInput,
        displayOptions: v.includes('=') ? ['=', '!='] : null,
      }
    });
    const startIndex = valueArr.findIndex(d => d.includes(addValueArr[0]));
    const endIndex = valueArr.findIndex(d => d.includes(addValueArr[addValueArr.length - 1])) + 1;
    const addValue = children.slice(startIndex, endIndex).map((d, i) => ({
      ...d, display: addValueArr[i], value: d?.value ? addValueArr[i] : null, canDelete: d.canAdd }));
    return {
      id: generateId(),
      title: func.title,
      type: 'operator',
      addValue,
      children
    };
  }

  // 表达式变量选择
  onVariableSelected(node: ExpressionNode): void {
    this.deselectAllNodes();
    this.updateNode(node.id, { ...node, selected: true });
    this.selectedVariable = node;
  }

  handleClear() {
    this.currentExpression = null;
    this.selectedVariable = null;
  }

  // 快速转化
  handleConversion() {
    if (!this.conversionForm.valid) {
      markAllControlsAsDirty(this.conversionForm);
      return;
    }
  }

  close(data = null) {
    this.selectedKeys = [...[]];
    this.currentNode = null;
    this.visibleChange.emit(data);
  }

  private getCalFormulas(node: ExpressionNode, tips): string {
    if (!node) { return; }
    // 处理操作符节点（递归处理子节点）
    if (node.type === 'operator') {
      return (node.children || []).map(child => this.getCalFormulas(child, tips)).join('');
    }
    // 处理变量节点（直接返回显示值）
    if (node.type === 'variable') {
      return node?.value ? tips : `${node.display} `;
    }
    // 处理字段节点（返回key）
    if (node.type === 'field' && node.key) {
      return `${node.key} `;
    }
    return '';
  }

  handleOk(): void {
    console.log('calFormulas: ', this.getCalFormulas(this.currentExpression, '??'));
    if (!this.form.valid) {
      markAllControlsAsDirty(this.form);
      return;
    }
    this.loading = true;
    const tips = '请配置完整的字段表达式';
    const calFormulas = this.getCalFormulas(this.currentExpression, tips).trim();
    if (calFormulas.includes(tips)) {
      this.message.warning(tips);
      this.loading = false;
      return;
    }
    const data = {
      ...this.data,
      ...this.form.value,
      calFormulas,
      calFormulasDisplay: JSON.stringify(this.currentExpression),
    };
    this.close(data);
  }
}
