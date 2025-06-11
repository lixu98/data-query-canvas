import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DwDocument, DwDocumentModule } from '@webdpt/framework/document';

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
import { NzTableModule } from 'ng-zorro-antd/table';
import { ShowcaseSharedModule } from '../../../../shared/shared.module';
import { ExtraFieldsCustomerClientPagingService } from './modals/customer/customer-client-paging.service';
import { ExtraFieldsDocumentOrderSlaveEditComponent } from './modals/order-slave-edit/order-slave-edit.component';
import { ExtraFieldsDocumentOrderCreateComponent } from './order-create/order-create.component';
import { ExtraFieldsDocumentOrderDetailComponent } from './order-detail/order-detail.component';
import { ExtraFieldsDocumentOrderListComponent } from './order-list/order-list.component';
import { ExtraFieldsDocumentOrderModifyComponent } from './order-modify/order-modify.component';
import { ExtraFieldsDocumentOrderRoutingModule } from './order-routing.module';


@NgModule({
  imports: [
    CommonModule,
    ExtraFieldsDocumentOrderRoutingModule,
    ShowcaseSharedModule,
    DwDocumentModule, // 20200417-為了要使用 exports 裡的 Directive
    DwExtraFieldsModule, // 使用自定義字段的作業模組, 需自行匯入
    NzButtonModule,
    NzLayoutModule,
    NzDividerModule,
    NzTableModule,
    DwFormItemsModule,
    NzGridModule,
    NzFormModule,
    NzIconModule,
    NzPopconfirmModule,
    DwActionModule,
    ReactiveFormsModule,
    TranslateModule,
    NzInputNumberModule,
    NzInputModule,
    NzModalModule
  ],
  declarations: [
    ExtraFieldsDocumentOrderCreateComponent,
    ExtraFieldsDocumentOrderDetailComponent,
    ExtraFieldsDocumentOrderModifyComponent,
    ExtraFieldsDocumentOrderListComponent,
    ExtraFieldsDocumentOrderSlaveEditComponent
  ],
  entryComponents: [  // 對話框使用component模式，需要加入自定義component
    ExtraFieldsDocumentOrderSlaveEditComponent
  ],
  providers: [
    DwDocument,
    ExtraFieldsCustomerClientPagingService,
    { provide: 'DocumentResource', useValue: 'restful/service/DEMO_DAP_CURRENT/DemoOrderCustField' }
  ],
  exports: [
    ExtraFieldsDocumentOrderCreateComponent,
    ExtraFieldsDocumentOrderDetailComponent,
    ExtraFieldsDocumentOrderModifyComponent,
    ExtraFieldsDocumentOrderListComponent
  ]
})
export class ExtraFieldsDocumentOrderModule { }

