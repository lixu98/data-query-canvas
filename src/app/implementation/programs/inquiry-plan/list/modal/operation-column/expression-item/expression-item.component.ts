import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ExpressionNode } from '../../../list-model';
import {generateId} from "../../../../../../../shared/utils";

@Component({
  selector: 'app-expression-item',
  templateUrl: './expression-item.component.html',
  styleUrls: ['./expression-item.component.less']
})
export class ExpressionItemComponent implements OnInit {
  @Input() node: ExpressionNode;
  @Input() isRoot: boolean = false;
  @Output() nodeSelected = new EventEmitter<ExpressionNode>();
  @Output() nodeChange = new EventEmitter<ExpressionNode>();
  @Output() nodeDelete = new EventEmitter<string>();

  showInput = false; // 输入变量

  constructor() { }

  ngOnInit(): void {
  }

  onNodeClick(event): void {
    if (event.target === event.currentTarget) {
      this.nodeSelected.emit(this.node);
    }
  }

  nodeValueChange() {
    if (!this.node.display) { return; }
    const newNode: ExpressionNode = {
      ...this.node,
      type: 'field',
      value: this.node.display,
      display: this.node.display,
      key: this.node.display,
      selected: false,
      children: null,
    }
    this.nodeChange.emit(newNode);
  }

  showInputChange() {
    if (this.showInput) { // 取消输入
      this.node.display = this.node.display || this.node.value;
      if (!this.node.display) { return; }
    } else if (!this.node?.key) { this.node.display = ''; } // 初始输入清空内容
    this.showInput = !this.showInput;
  }

  handleAdd(index) {
    this.node.children.splice(index + 1, 0, ...this.node.addValue.map(d => ({...d, id: generateId()})));
    this.nodeChange.emit({ ...this.node });
  }

  handleDelete(index) {
    const size = (this.node?.addValue || []).length;
    this.node.children.splice(index - size + 1, size);
    this.nodeChange.emit({ ...this.node });
  }
}
