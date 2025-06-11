import { Component, Input, OnInit } from '@angular/core';
import { CanvasService } from '../../canvas.service';
import { DomainObjectList, ModelTree } from '../../canvas-model';
import {CanvasApiService} from '../../canvas-api.service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-canvas-add-node',
  templateUrl: './canvas-add-node.component.html',
  styleUrls: ['./canvas-add-node.component.less']
})
export class CanvasAddNodeComponent implements OnInit {
  @Input() isVisible = false;
  @Input() node: ModelTree;
  loading = false;
  keyword: string;
  listOfData: DomainObjectList[];
  setOfCheckedId = new Set<string>();
  get checked(): boolean {
    return !!this.listOfData?.length && this.listOfData.every(d => this.setOfCheckedId.has(d.id));
  }
  get indeterminate(): boolean {
    return !!this.listOfData?.length && this.listOfData.some(d => this.setOfCheckedId.has(d.id) && !this.checked);
  }

  constructor(
      private canvasService: CanvasService,
      private canvasApiService: CanvasApiService,
      private message: NzMessageService,
  ) {
    this.canvasService.showAddModal.subscribe((data) => {
      this.node = data;
      this.isVisible = true;
      this.setOfCheckedId.clear();
      this.fetchData();
    });
  }

  ngOnInit(): void {}

  fetchData() {
    this.loading = true;
    this.canvasApiService.getReferenceDomainObjectList(this.node.path)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(res => {
        if (res.code === '200') {
          const ids = new Set<string>((this.node?.children || []).map(d => d.referenceId));
          this.listOfData = (res.data || []).filter(d => !ids.has(d.referenceId))
            .map(d => ({ ...d, id: d?.referenceId, leftDomainName: this.node.domainObjectName, rightDomainName: d.referenceDomainName }));
        } else {
          this.message.error(res?.message);
        }
      });
  }

  // 新增关联关系
  handleAddRelation() {
    this.close();
    this.canvasService.addRelation(this.node);
  }

  onAllChecked(checked: boolean) {
    this.listOfData.forEach(d => {
      this.onItemChecked(d.id, checked);
    });
  }

  onItemChecked(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  close() {
    this.isVisible = false;
  }

  handleOk() {
    this.close();
    const children = this.listOfData.filter(d => this.setOfCheckedId.has(d.id))
      .map(d => new ModelTree({ ...d }, this.node));
    this.canvasService.addChild(this.node.flag, children);
  }
}
