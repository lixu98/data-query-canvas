import { Component, OnInit } from '@angular/core';

import { DwCustomTableDisplaySearchConditionModel } from './model/search-condition.model';
import { DwCustomTableDisplayService } from './service/dw-custom-table-display.service';

@Component({
  selector: 'app-dw-custom-table-display',
  templateUrl: './dw-custom-table-display.component.html',
  styleUrls: ['./dw-custom-table-display.component.css'],
  providers: [DwCustomTableDisplaySearchConditionModel, DwCustomTableDisplayService] // 在應用組件中註冊的提供商只在該組件及其子組件中可用
})
export class DwCustomTableDisplayComponent implements OnInit {
  constructor(
  ) { }

  ngOnInit(): void {
  }
}
