import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NzTreeSelectComponent } from 'ng-zorro-antd/tree-select';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { ListService } from '../../list.service';
import { DwRouterKeyModule } from '@webdpt/framework/router-key';
import { NzMessageService } from 'ng-zorro-antd/message';
// 递归转换函数
function convertToNzTree(nodes) {
  return nodes.map((node, i) => ({
    key: node.businessModelCode + i,
    title: node.businessModelName,
    children: [
      // 将 fields 转换为子节点
      ...(node.querySchemaLs?.map(field => ({
        businessModelCode: field.businessModelCode,
        businessModelName: field.businessModelName,
        querySchemaCode: field.querySchemaCode,
        querySchemaLs: field.querySchemaLs,
        querySchemaName: field.querySchemaName,
        key: field.querySchemaCode,
        title: field.querySchemaName,
        isLeaf: true,
        children: [],
      })) || []),
      // 递归处理 child 节点
      ...convertToNzTree(node.child || [])
    ]
  }));
}

@Component({
  selector: 'app-publish-model',
  templateUrl: './publish-model.component.html',
  styleUrls: ['./publish-model.component.less']
})
export class PublishModelComponent implements OnInit {
  @Input() publishId: any;
  @Output() visibleChange = new EventEmitter<any>();
  @ViewChild('treePublish') treePublish!: NzTreeSelectComponent;
  @ViewChild('treeModel') treeModel!: NzTreeSelectComponent;

  constructor(public listService: ListService, private message: NzMessageService,) {
  }

  ngOnInit(): void {
    this.openPublishModule();
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

  publishNodes = [];
  getFieldTree(type): void {
    const params = {
      type: type,
      publishStatus: this.publishId,
    }
    this.listService.modelZtree(params).subscribe(res => {
      if (res.code === '200') {
        const data = res.data;
        if (type == 'model') {
          this.tableList = data;
        } else {
          this.publishNodes = convertToNzTree(data)
        }
      } else {
        this.tableList = []
      }
    });
  }

  // 发布
  tabIndex: number = 1;
  // 3 开发区/4 测试区/5 正式区
  publishTitle = '发布正式区'
  //模型列表
  tableList = []
  indeterminate: boolean = false;
  checked: boolean = false;
  setOfCheckedId = new Set<number>();
  openPublishModule(): void {
    if (this.publishId == '3') {
      this.publishTitle = '发布开发区'
    } else if (this.publishId == '4') {
      this.publishTitle = '发布测试区'
    } else if (this.publishId == '5') {
      this.publishTitle = '发布正式区'
    }
    this.restParams()
  }

  restParams(): void {
    this.tabIndex = 1;
    this.searchNodeValue = ''
    this.defaultCheckedKeys = []
    this.planNodeChildList = []
    this.selectNodeChildList = []
    this.tableList = []
    this.indeterminate = false;
    this.checked = false;
    this.setOfCheckedId.clear();
    this.getFieldTree('model');
    this.getFieldTree('queryschema')
    clearInterval(this.timer);
    this.timer = null;
  }
  changeTab(tab: number): void {
    this.tabIndex = tab;
    if (this.tabIndex == 1) {
      this.defaultCheckedKeys = []
      this.selectNodeChildList.forEach(item => {
        this.defaultCheckedKeys.push(item.key)
      })
    }
  }
  handlePublishCancel(): void {
    clearInterval(this.timer);
    this.timer = null;
    this.close(1);
  }
  //查询方案树操作
  searchNodeValue: string = ''
  defaultCheckedKeys = []
  selectNodeChildList = []
  planNodeChildList = []
  nzPlanEvent(event: NzFormatEmitEvent): void {
    const nodes = this.treePublish.getCheckedNodeList();
    this.planNodeChildList = []
    if (nodes && nodes.length > 0) {
      const data = this.collectAllCheckedNodes(nodes)
      const mergedArray = data.map(targetItem => {
        const matchedItem = this.selectNodeChildList.find(sourceItem => sourceItem.key === targetItem.key);
        return { ...targetItem, ...matchedItem };
      });
      this.selectNodeChildList = mergedArray;
      this.selectNodeChildList.forEach(item => {
        if (item.origin.isLeaf) {
          this.planNodeChildList.push(item.origin.key)
        }
      })
    } else {
      this.selectNodeChildList = []
    }
  }

  // 模型发布
  //全选
  onAllChecked(checked): void {
    this.tableList
      .forEach(({ businessModelCode }) => this.updateCheckedSet(businessModelCode, checked));
    this.refreshCheckedStatus();
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }
  //单选
  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }
  refreshCheckedStatus(): void {
    this.checked = this.tableList.every(item => this.setOfCheckedId.has(item.businessModelCode));
    this.indeterminate = this.tableList.some(item => this.setOfCheckedId.has(item.businessModelCode)) && !this.checked;
  }

  close(type: number) {
    this.visibleChange.emit(type);
  }
  isSpinning: boolean = false;
  tipTitle: string = '正在发布...'
  timer: any = null;
  handlePublishOk(): void {
    let modelList = []
    for (let id of this.setOfCheckedId) {
      modelList.push(id)
    }
    let publishInfosList = []
    if (this.planNodeChildList.length > 0) {
      let obj = {
        publishType: 'queryschema',
        code: [...this.planNodeChildList]
      }
      publishInfosList.push(obj)
    }
    if (modelList.length > 0) {
      let obj = {
        publishType: 'model',
        code: [...modelList]
      }
      publishInfosList.push(obj)
    }
    const params = {
      type: this.publishId,
      publishInfos: publishInfosList
    }
    if (!this.planNodeChildList?.length && !modelList?.length) {
      this.message.error('请选择要发布的模型或者查询方案！', {
        nzDuration: 5000
      });
      return
    }
    this.isSpinning = true;
    this.listService.modelPublish(params).subscribe(res => {
      if (res.code === '200') {
        const statusParams = {
          data: res?.data
        }
        this.publishRequestStatus(statusParams)
        this.timer = setInterval(() => {
          this.publishRequestStatus(statusParams)
        }, 5000);
      } else {
        clearInterval(this.timer);
        this.timer = null;
        this.isSpinning = false;
        this.message.error(res?.message);
      }
    });
  }

  publishRequestStatus(statusParams): void {
    this.listService.modelPublishStatus(statusParams).subscribe(res => {
      if (res.code === '200') {
        this.tipTitle = res.message != 'end' ? res.message : "正在发布..."
        if (res.message == 'end') {
          clearInterval(this.timer);
          this.timer = null;
          this.isSpinning = false;
          this.message.success(this.publishTitle + '成功!');
          this.close(2);
        } else if (res.message == 'error') {
          clearInterval(this.timer);
          this.timer = null;
          this.isSpinning = false;
          this.message.error('发布失败！');
        }
      } else {
        clearInterval(this.timer);
        this.timer = null;
        this.isSpinning = false;
        this.message.error(res?.message);
      }
    });
  }
}
