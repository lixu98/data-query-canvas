import { Component, OnInit } from '@angular/core';

import { NzModalRef } from 'ng-zorro-antd/modal';

import { ExtraFieldsCustomerRepository } from '../../../repository';


@Component({
  selector: 'app-dw-customer-list',
  templateUrl: './customer-list.component.html',
  styles: [`
    .customize-footer {
      border-top: 1px solid #e9e9e9;
      padding: 10px 18px 0 10px;
      text-align: right;
      border-radius: 0 0 0 0;
      margin: 15px -16px -5px -16px;
    }

    dw-radio-group {
      width: 100%;
    }
  `]
})
export class ExtraFieldsCustomerListComponent implements OnInit {

  customerName: string;
  customers: any[] = [];

  constructor(
    private subject: NzModalRef,
    private customer: ExtraFieldsCustomerRepository
  ) {

  }

  emitDataOutside(): void {
    if (this.customerName) {
      this.handleCancel('onOk');
    } else {
      this.handleCancel();
    }
  }

  handleCancel(type?: string): void {
    type ? this.subject.triggerOk() : this.subject.triggerCancel();
  }

  ngOnInit(): void {
    this.customer.getCustomers().subscribe(
      (customers) => {
        this.customers = customers;
      }
    );

  }

}
