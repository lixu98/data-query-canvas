import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-tree-node',
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.less']
})
export class TreeNodeComponent implements OnInit {
  @Input() keyword = '';
  @Input() node = null;

  constructor() { }

  ngOnInit(): void {
  }

}
