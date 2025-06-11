import { Component, OnInit } from '@angular/core';

import { ExtraFieldsOrderSearchConditionModel } from './model/search-condition.model';
import { ExtraFieldsOrderService } from './service/order.service';

@Component({
  selector: 'app-dw-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  providers: [ // 在應用組件中註冊的提供商只在該組件及其子組件中可用
    ExtraFieldsOrderSearchConditionModel,
    ExtraFieldsOrderService
  ]
})
export class ExtraFieldsOrderComponent implements OnInit {
  constructor(
  ) { }

  ngOnInit(): void {
  }
}
