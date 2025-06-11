import { Component, Input, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { DomainObjectList, FieldOption, FieldTypeEnum, ModelTree, Relation } from '../../canvas-model';
import { CanvasService } from '../../canvas.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CanvasApiService } from "../../canvas-api.service";
import { finalize } from "rxjs/operators";

@Component({
  selector: 'app-canvas-add-relation',
  templateUrl: './canvas-add-relation.component.html',
  styleUrls: ['./canvas-add-relation.component.less']
})
export class CanvasAddRelationComponent implements OnInit {
  protected readonly FieldTypeEnum = FieldTypeEnum;
  @Input() isVisible = false;
  @Input() isEdit = false;
  @Input() isDetail = false; // 仅查看
  @Input() node: ModelTree;
  loading = false;
  targetObject: ModelTree;
  mode: 'right' | 'inner' = 'right'; // 关联方式
  relations: Relation[] = [];
  leftOptions: FieldOption[];
  rightOptions: FieldOption[];
  get okDisabled(): boolean {
    return !this.targetObject?.domainObjectCode ||
      this.relations.some(d => !d.leftCode || !d.rightCode || d.error) ||
      this.relations.every(d => !d.mainField);
  }
  canOperate = false;

  constructor(
    private canvasService: CanvasService,
    private canvasApiService: CanvasApiService,
    private message: NzMessageService,
    private cdr: ChangeDetectorRef,
  ) {
    this.canvasService.showAddRelationModal.subscribe(({ node, targetNode }) => {
      this.node = node;
      this.canOperate = node?.canOperate && (targetNode?.type === '3' || !targetNode);
      this.isVisible = true;
      this.isEdit = !!targetNode;
      this.fetchData(this.node?.originalPath || this.node?.path, 'leftOptions');
      if (targetNode?.domainObjectCode) {
        this.targetObject = targetNode;
        this.relations = this.targetObject?.relations;
        this.fetchData(this.targetObject?.originalPath || this.targetObject?.path);
      } else {
        this.targetObject = null;
        this.relations = [new Relation({
          leftCode: 'tenantsid',
          leftName: '租户ID',
          rightCode: 'tenantsid',
          rightName: '租户ID',
        }), new Relation()];
        this.rightOptions = [];
      }
    });
  }

  ngOnInit(): void { }

  // 查询字段下拉框数据
  fetchData(path, options: 'leftOptions' | 'rightOptions' = 'rightOptions') {
    this.loading = true;
    this.canvasApiService.getDomainObjectFields(path)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(res => {
        if (res.code === '200') {
          this[options] = res.data || [];
        } else {
          this.message.error(res?.message);
        }
      });
  }

  filterOption = (input: string, option): boolean => {
    return option?.nzLabel.includes(input)
  };

  getOptionsDisabled(code: string, key: string): boolean {
    return this.relations.some(r => r[key] === code)
  }

  // 选择目标领域对象
  selectTargetObject() {
    if (this.isEdit) { return false; }
    this.canvasService.selectDomainObject(this.targetObject);
  }

  // 目标领域对象变更
  onTargetObjectChange(data: DomainObjectList) {
    this.targetObject = new ModelTree({ ...data, originalPath: data?.path, path: '' }, this.node);
    this.fetchData(this.targetObject?.originalPath);
  }

  // 新增关联关系
  handleAdd() {
    this.relations.push(new Relation());
  }

  handleDelete(index: number) {
    if (this.relations.length <= 1) {
      this.message.warning('需保留至少一条');
      return false;
    }
    this.relations.splice(index, 1);
  }

  changeMainField(relation: Relation, value: boolean) {
    this.relations.forEach(d => d.mainField = false);
    relation.mainField = value;
  }

  changeRightType(relation: Relation, value: FieldTypeEnum) {
    relation.rightType = value;
  }

  changeFieldCode(relation: Relation, value: string, codeType = 'left') {
    const option = this[codeType + 'Options'].find(d => d.fieldCode === value);
    relation[codeType + 'DataType'] = option?.businessDataType
    relation[codeType + 'Name'] = option?.fieldName;
    relation.error = relation.rightCode && relation.leftCode && relation.leftDataType !== relation.rightDataType;
  }

  changeRightCode(relation: Relation, value: string) {
    if (relation.rightType === FieldTypeEnum.CONST) { // 常量
      relation.rightCode = value;
    } else if (relation.rightType === FieldTypeEnum.FIELD) { // 字段
      this.changeFieldCode(relation, value, 'right');
    }
  }

  close() {
    this.isVisible = false;
  }

  handleOk() {
    this.close();
    const newValue = { ...this.targetObject, relations: this.relations };
    if (this.isEdit) {
      this.canvasService.updateNode(this.targetObject.flag, newValue);
    } else {
      this.canvasService.addChild(this.node.flag, [newValue]);
    }
  }
}
