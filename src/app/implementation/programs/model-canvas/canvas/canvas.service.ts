import { Injectable, Injector, ComponentFactoryResolver, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Graph } from '@antv/x6';
import { register } from './utils';
import { CanvasNodeComponent } from './canvas-node/canvas-node.component';
import {ModelTree, DomainObjectList, ModelInfo} from './canvas-model';
import {_addTreeChild, _deleteTreeNode, _updateTreeNode, _processTreeChildren} from "../../../../shared/utils";

@Injectable({
  providedIn: 'root'
})
export class CanvasService {
  private graph: Graph;
  showAddModal = new EventEmitter<ModelTree>();
  showAddRelationModal = new EventEmitter<{ node: ModelTree, targetNode?: ModelTree }>();
  showSelectDomainObjectModal = new EventEmitter<DomainObjectList>();
  nodeConfig = {
    width: 240, // 节点宽度
    height: 56, // 节点高度
    xSpacing: 60, // 同级节点水平间距
    ySpacing: 140, // 父子节点垂直间距
    yFirst: 20, // 一级节点垂直位置
  }
  modelData: ModelInfo;
  canOperate = false;
  showModelQuote = false; // 显示模型引用
  _initGraphComplete = new BehaviorSubject<boolean>(false);
  initGraphComplete$ = this._initGraphComplete.asObservable();
  private _treeData = new BehaviorSubject<ModelTree>({} as ModelTree);
  tree$ = this._treeData.asObservable();

  constructor() { }

  private getSiblingX(currentNode: ModelTree, parentNode: ModelTree) {
    const siblingChildren = (parentNode?.children || []).filter(d => !this.getNodeHide(d));
    const index = siblingChildren.indexOf(currentNode);
    return parentNode.x +
        (index - ((siblingChildren.length || 1) - 1) / 2) *
        (this.nodeConfig.width + this.nodeConfig.xSpacing);
  }

  // 初始化画布
  initGraph(container: HTMLElement, injector: Injector, componentFactoryResolver: ComponentFactoryResolver, canOperate) {
    this.canOperate = canOperate;
    this.graph = new Graph({
      container,
      async: false, // 异步时Zone.current为root不会触发onStable,节点触发dropdown会有问题
      connecting: {
        anchor: 'center', // 连线锚点
        connector: 'rounded', // 连线样式
        router: {
          name: 'er',
          args: {
            direction: 'V'
          }
        }
      },
      autoResize: false,
      panning: true, // 缩放
      mousewheel: true, // 画布拖拽
      interacting: {
        nodeMovable: true, // 节点拖拽
        // edgeMovable: true
      },
    });
    // 注册节点
    register({
      shape: 'canvas-node',
      width: this.nodeConfig.width,
      height: this.nodeConfig.height,
      content: CanvasNodeComponent,
      component: CanvasNodeComponent,
      injector,
      componentFactoryResolver,
      dataToProps: (d) => d,
    });
    // 边悬浮
    this.graph.on('edge:mouseenter', ({ cell, edge, view }) => {
      cell.attr('line', { stroke: '#605CE5' }); // 高亮边颜色
      // 关联关系标识
      edge.labels = [
        {
          position: 0.5,
          attrs: {
            label: {
              text: '关联关系',
              fill: '#4D4C66',
              fontSize: 12,
              textAnchor: 'middle',
              textVerticalAnchor: 'middle',
              pointerEvents: 'pointer',
            },
          },
        },
      ];
    });
    this.graph.on('edge:mouseleave', ({ cell, edge, view }) => {
      cell.attr('line', {
        stroke: '#C2C2CC',
      });
      edge.labels = [];
    });
    // 边点击
    this.graph.on('edge:click', ({ cell, edge, view }) => {
      const sourceNode = this.graph.getCellById(edge.getSourceNode().id)?.getData()?.ngArguments; // 获取源节点
      const targetNode = this.graph.getCellById(edge.getTargetNode().id)?.getData()?.ngArguments; // 获取目标节点
      this.showAddRelationModal.emit({ node: sourceNode, targetNode });
    });
    if (!this._initGraphComplete.value) {
      this._initGraphComplete.next(true);
    }
  }

  setTreeData(data: ModelTree) {
    this._treeData.next(data);
  }

  initTreeData(data: ModelTree, modelData?) {
    if (modelData) { this.modelData = modelData; }
    this.setTreeData(this._processTree(data));
    this.graph?.clearCells();
    this.renderTree(this._treeData.value);
  }

  renderTree(data: ModelTree, parentNode: ModelTree = null, index = 0) {
    if (!data || data?.isHide) {
      return;
    }
    const node = this.graph.addNode({
      shape: 'canvas-node',
      id: data.flag,
      width: this.nodeConfig.width,
      height: this.nodeConfig.height,
      x: data?.x,
      y: data?.y,
      data: {
        ngArguments: { ...data, canOperate: this.canOperate },
      }
    });
    if (parentNode?.flag) {
      this.graph.getCellById(parentNode.flag).addChild(node);
      this.graph.addEdge({
        shape: 'edge',
        source: parentNode.flag,
        target: data.flag,
        attrs: {
          line: {
            sourceMarker: {
              tagName: 'path',
              d: 'M -6 0 L 0 -6 L 6 0 L 0 6 Z', // 菱形路径
            },
            targetMarker: {
              name: 'classic'
            },
            stroke: '#C2C2CC',
            strokeWidth: 2,
          },
        },
      });
    }
    if (data.children) {
      data.children.forEach((child, i) => {
        this.renderTree(child, data, i);
      });
    }
  }

  // 画布自动布局
  autoLayout() {
    this.graph.zoomToFit({ padding: 20, maxScale: 1 });
  }

  getNodeHide(node: ModelTree): boolean {
    return !this.showModelQuote && node.type === '2' && !node.children?.length
  }

  private _processTree(node, parentNode = null, index = 0) {
    const isHide = this.getNodeHide(node);
    if (!isHide) {
      node.x = node.level === 1 ?
        (this.graph.container.clientWidth / 2) - (this.nodeConfig.width / 2)
        :
        this.getSiblingX(node, parentNode);
      node.y = ((node.level - 1) * this.nodeConfig.ySpacing) + this.nodeConfig.yFirst;
    }
    const newNode = new ModelTree({
      ...node, parentId: parentNode?.id, index, isHide
    }, parentNode);
    return _processTreeChildren(newNode, (child, i) =>
      this._processTree(child, newNode, i)
    );
  }

  // 更新模型节点数据
  updateNode(flag: string, data: Partial<ModelTree>): void {
    const newTree = _updateTreeNode(this._treeData.value, flag, data, 'flag');
    this.initTreeData(newTree);
  }

  // 删除模型节点
  removeNode(flag: string) {
    const newTree = _deleteTreeNode(this._treeData.value, flag, 'flag');
    this.initTreeData(newTree);
  }

  // 添加子模型节点
  addChild(flag: string, child: ModelTree[]): void {
    const newTree = _addTreeChild(this._treeData.value, flag, child, 'flag');
    this.initTreeData(newTree);
  }

  // 新增领域对象弹框
  addNode(node: ModelTree) {
    this.showAddModal.emit(node);
  }

  // 新增关联关系弹框
  addRelation(node: ModelTree) {
    this.showAddRelationModal.emit({ node });
  }

  // 新增关联关系-选择目标领域对象弹框
  selectDomainObject(node: DomainObjectList) {
    this.showSelectDomainObjectModal.emit(node);
  }
}
