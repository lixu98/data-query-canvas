import { Component, Input, OnInit, OnDestroy, ViewContainerRef, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Graph, Shape } from '@antv/x6';
import { CanvasService } from '../canvas.service';
import { ModelTree } from '../canvas-model';

@Component({
  selector: 'app-canvas-node',
  templateUrl: './canvas-node.component.html',
  styleUrls: ['./canvas-node.component.less']
})
export class CanvasNodeComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() data: ModelTree;
  @Input() canOperate = false;
  nodeType: 1 | 2 | 3;

  constructor(
    public viewContainerRef: ViewContainerRef,
    private canvasService: CanvasService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.getNodeType();
  }

  ngOnDestroy() {
    this.viewContainerRef.clear(); // 必须清理动态容器
  }

  getNodeType() {
    if (this.data?.path === this.data?.domainObjectCode && this.data?.level === 1) {
      this.nodeType = 1;
    } else if (this.data?.type === '1') {
      this.nodeType = 2;
    } else {
      this.nodeType = 3;
    }
    this.cdr.detectChanges();
  }

  handleDelete() {
    this.canvasService.removeNode(this.data.flag);
  }

  handleAdd() {
    this.canvasService.addNode(this.data);
  }
}
