import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Demo2OrderRepository } from './demo2-order-repository';
import { Demo2EmployeeRepository } from './demo2-employee';
import { Demo2CustomerRepository } from './demo2-customer';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    Demo2OrderRepository,
    Demo2EmployeeRepository,
    Demo2CustomerRepository
  ]
})
export class Demo2RepositoryModule { }
