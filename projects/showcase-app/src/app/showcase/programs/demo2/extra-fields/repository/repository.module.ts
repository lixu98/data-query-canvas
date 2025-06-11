import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ExtraFieldsCustomerRepository } from './customer';
import { ExtraFieldsEmployeeRepository } from './employee';
import { ExtraFieldsOrderRepository } from './order-repository';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    ExtraFieldsOrderRepository,
    ExtraFieldsEmployeeRepository,
    ExtraFieldsCustomerRepository
  ]
})
export class ExtraFieldsOrderRepositoryModule { }
