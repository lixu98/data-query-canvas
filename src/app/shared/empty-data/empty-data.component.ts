import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-empty-data',
  templateUrl: './empty-data.component.html',
  styleUrls: ['./empty-data.component.less']
})
export class EmptyDataComponent implements OnInit {
  @Input() text = '暂无数据';

  constructor() { }

  ngOnInit(): void {
  }

}
