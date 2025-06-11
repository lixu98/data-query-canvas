import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { Demo1AsisRepository } from './demo1-asis-repository';
import { Demo1CustomerRepository } from './demo1-customer';
import { Demo1EmployeeRepository } from './demo1-employee';
import { Demo1GroupRepository } from './demo1-group-repository';
import { Demo1OrderRepository } from './demo1-order-repository';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    Demo1OrderRepository,
    Demo1GroupRepository,
    Demo1AsisRepository,
    Demo1EmployeeRepository,
    Demo1CustomerRepository
  ]
})
export class Demo1RepositoryModule { }
