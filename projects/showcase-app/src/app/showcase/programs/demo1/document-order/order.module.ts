import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DwActionModule } from '@webdpt/components/action';
import { DwFormItemsModule } from '@webdpt/components/form-items';
import { DwDocument, DwDocumentModule } from '@webdpt/framework/document';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ShowcaseSharedModule } from '../../../shared/shared.module';
import { CustomerClientPagingService } from './modals/customer/customer-client-paging.service';
import { DocumentOrderSlaveEditComponent } from './modals/order-slave-edit/order-slave-edit.component';
import { DocumentOrderCreateComponent } from './order-create/order-create.component';
import { DocumentOrderDetailPagerComponent } from './order-detail-pager/order-detail.component';
import { DocumentOrderDetailComponent } from './order-detail/order-detail.component';
import { DocumentOrderListComponent } from './order-list/order-list.component';
import { DocumentOrderModifyPagerComponent } from './order-modify-pager/order-modify.component';
import { DocumentOrderModifyComponent } from './order-modify/order-modify.component';
import { DocumentOrderRoutingModule } from './order-routing.module';
@NgModule({
  imports: [
    CommonModule,
    DocumentOrderRoutingModule,
    ShowcaseSharedModule,
    DwDocumentModule,
    NzButtonModule,
    NzLayoutModule,
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
    NzModalModule // 20200417-為了要使用 exports 裡的 Directive
  ],
  declarations: [
    DocumentOrderCreateComponent,
    DocumentOrderDetailComponent,
    DocumentOrderModifyComponent,
    DocumentOrderListComponent,
    DocumentOrderSlaveEditComponent,
    DocumentOrderDetailPagerComponent,
    DocumentOrderModifyPagerComponent
  ],
  entryComponents: [
    DocumentOrderSlaveEditComponent,
  ], // 對話框使用component模式，需要加入自定義component
  providers: [
    DwDocument,
    CustomerClientPagingService,
    { provide: 'DocumentResource', useValue: 'restful/service/DEMO_DAP_CURRENT/DemoOrder' }
  ],
  exports: [
    DocumentOrderCreateComponent,
    DocumentOrderDetailComponent,
    DocumentOrderModifyComponent,
    DocumentOrderDetailPagerComponent,
    DocumentOrderModifyPagerComponent,
    DocumentOrderListComponent]
})
export class DocumentOrderModule { }

