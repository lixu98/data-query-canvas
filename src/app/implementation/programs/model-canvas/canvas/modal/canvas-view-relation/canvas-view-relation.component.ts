import {Component, Input, OnInit} from '@angular/core';
import {CanvasService} from '../../canvas.service';

@Component({
  selector: 'app-canvas-view-relation',
  templateUrl: './canvas-view-relation.component.html',
  styleUrls: ['./canvas-view-relation.component.less']
})
export class CanvasViewRelationComponent implements OnInit {
  @Input() data: any;
  @Input() showEdit = false;

  constructor(
      private canvasService: CanvasService,
  ) {}

  ngOnInit(): void {}

  handleUpdateRelation() {
    this.canvasService.addRelation(this.data);
  }
}
