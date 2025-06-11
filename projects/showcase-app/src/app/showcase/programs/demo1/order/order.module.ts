import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DwActionModule } from '@webdpt/components/action';
import { DwFormItemsModule } from '@webdpt/components/form-items';
import { DwContainerModule } from '@webdpt/components/redevelop';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ShowcaseSharedModule } from '../../../shared/shared.module';
import { CustomerListComponent } from './modals/customer.list/customer-list.component';
import { EmployeeListComponent } from './modals/employee.list/employee-list.component';
import { OrderSearchConditionModel } from './model';
import { OrderDetailEditComponent } from './order-detail-edit/order-detail-edit.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderModifyComponent } from './order-modify/order-modify.component';
import { OrderRoutingModule } from './order-routing.module';
import { OrderComponent } from './order.component';
import { OrderService } from './service/order.service';


const COMPONENTS = [
  OrderComponent,
  OrderModifyComponent,
  OrderListComponent,
  OrderDetailEditComponent,
  CustomerListComponent,
  EmployeeListComponent,
];

const PROVIDERS = [
  OrderSearchConditionModel,
  OrderService
];

@NgModule({
  imports: [
    CommonModule,
    OrderRoutingModule,
    ShowcaseSharedModule,
    NzButtonModule,
    NzRadioModule,
    NzTableModule,
    NzLayoutModule,
    DwFormItemsModule,
    NzGridModule,
    NzFormModule,
    NzIconModule,
    DwActionModule,
    ReactiveFormsModule,
    TranslateModule,
    NzInputNumberModule,
    NzInputModule,
    NzPopconfirmModule,
    NzModalModule,
    DwContainerModule
  ],
  declarations: [
    ...COMPONENTS
  ],
  entryComponents: [
    OrderDetailEditComponent,
    CustomerListComponent,
    EmployeeListComponent], // 對話框使用component模式，需要加入自定義component
  providers: [
    ...PROVIDERS
  ],
  exports: [
    ...COMPONENTS
  ]
})
export class OrderModule {}
