import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ShowcaseSharedModule } from '../../../shared/shared.module';
import { DwCustomTableDisplayListComponent } from './dw-custom-table-display-list/dw-custom-table-display-list.component';
import { DwCustomTableDisplayModifyComponent } from './dw-custom-table-display-modify/dw-custom-table-display-modify.component';
import { DwCustomTableDisplayComponent } from './dw-custom-table-display.component';
// eslint-disable-next-line max-len
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DwActionModule } from '@webdpt/components/action';
import { DwTableConfigModule } from '@webdpt/components/configurable/table';
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
import {
  DwCustomTableDisplayDetailEditComponent
} from './dw-custom-table-display-detail-edit/dw-custom-table-display-detail-edit.component';
import { DwCustomTableDisplayRoutingModule } from './dw-custom-table-display-routing.module';
import { CustomerListComponent } from './modals/customer.list/customer-list.component';
import { EmployeeListComponent } from './modals/employee.list/employee-list.component';
import { DwCustomTableDisplaySearchConditionModel } from './model';
import { DwCustomTableDisplayService } from './service/dw-custom-table-display.service';


const COMPONENTS = [
  DwCustomTableDisplayComponent,
  DwCustomTableDisplayModifyComponent,
  DwCustomTableDisplayListComponent,
  DwCustomTableDisplayDetailEditComponent,
  CustomerListComponent,
  EmployeeListComponent,
];

const PROVIDERS = [
  DwCustomTableDisplaySearchConditionModel,
  DwCustomTableDisplayService
];

@NgModule({
  imports: [
    CommonModule,
    DwCustomTableDisplayRoutingModule,
    ShowcaseSharedModule,
    DwTableConfigModule,
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
    DwCustomTableDisplayDetailEditComponent,
    CustomerListComponent,
    EmployeeListComponent], // 對話框使用component模式，需要加入自定義component
  providers: [
    ...PROVIDERS
  ],
  exports: [
    ...COMPONENTS
  ]
})
export class DwCustomTableDisplayModule { }
