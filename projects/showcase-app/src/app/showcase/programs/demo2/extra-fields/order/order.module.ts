import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DwActionModule } from '@webdpt/components/action';
import { DwExtraFieldsModule } from '@webdpt/components/extra-fields';
import { DwFormItemsModule } from '@webdpt/components/form-items';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
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
import { ShowcaseSharedModule } from '../../../../shared/shared.module';
import { ExtraFieldsOrderRepositoryModule } from '../repository/repository.module';
import { ExtraFieldsCustomerListComponent } from './modals/customer-list/customer-list.component';
import { ExtraFieldsEmployeeListComponent } from './modals/employee-list/employee-list.component';
import { ExtraFieldsOrderSearchConditionModel } from './model/search-condition.model';
import { ExtraFieldsOrderDetailEditComponent } from './order-detail-edit/order-detail-edit.component';
import { ExtraFieldsOrderListComponent } from './order-list/order-list.component';
import { ExtraFieldsOrderModifyComponent } from './order-modify/order-modify.component';
import { ExtraFieldsOrderRoutingModule } from './order-routing.module';
import { ExtraFieldsOrderComponent } from './order.component';
import { ExtraFieldsOrderService } from './service/order.service';


const COMPONENTS = [
  ExtraFieldsOrderComponent,
  ExtraFieldsOrderModifyComponent,
  ExtraFieldsOrderListComponent,
  ExtraFieldsOrderDetailEditComponent,
  ExtraFieldsCustomerListComponent,
  ExtraFieldsEmployeeListComponent,
];

const PROVIDERS = [
  ExtraFieldsOrderSearchConditionModel,
  ExtraFieldsOrderService
];

@NgModule({
  imports: [
    CommonModule,
    ExtraFieldsOrderRoutingModule,
    ShowcaseSharedModule,
    ExtraFieldsOrderRepositoryModule,
    DwExtraFieldsModule,
    NzButtonModule,
    NzRadioModule,
    NzTableModule,
    NzLayoutModule,
    NzDividerModule,
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
    NzModalModule // 使用自定義字段的作業模組, 需自行匯入
  ],
  declarations: [
    ...COMPONENTS
  ],
  entryComponents: [  // 對話框使用component模式，需要加入自定義component
    ExtraFieldsOrderDetailEditComponent,
    ExtraFieldsCustomerListComponent,
    ExtraFieldsEmployeeListComponent
  ],
  providers: [
    ...PROVIDERS
  ],
  exports: [
    ...COMPONENTS
  ]
})
export class ExtraFieldsOrderModule {}
