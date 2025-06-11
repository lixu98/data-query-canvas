import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DwAuthGuardService } from '@webdpt/framework/auth';
import { DwLanguageService } from '@webdpt/framework/language';
import { ExtraFieldsDocumentOrderCreateComponent } from './order-create/order-create.component';
import { ExtraFieldsDocumentOrderDetailComponent } from './order-detail/order-detail.component';
import { ExtraFieldsDocumentOrderListComponent } from './order-list/order-list.component';
import { ExtraFieldsDocumentOrderModifyComponent } from './order-modify/order-modify.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    data: {
      dwRouteData: {
        programId: 'dw-extra-fields-document'
      }
    },
    resolve: {
      transaction: DwLanguageService
    },
    children: [
      {
        path: '',
        component: ExtraFieldsDocumentOrderListComponent,
        canActivate: [DwAuthGuardService],
        data: {
          dwRouteData: {
            dwAuthId: 'dw-extra-fields-document'
          },
          reload: true // <== 此作業的頁籤切換至其它作業時銷毀，進入此頁籤時作業重新創建。
        }
      },
      {
        path: 'modify',
        component: ExtraFieldsDocumentOrderModifyComponent,
        canActivate: [DwAuthGuardService],
        data: {
          dwRouteData: {
            dwAuthId: 'dw-extra-fields-document-modify'
          }
        }
      },
      {
        path: 'create',
        component: ExtraFieldsDocumentOrderCreateComponent,
        canActivate: [DwAuthGuardService],
        data: {
          dwRouteData: {
            dwAuthId: 'dw-extra-fields-document-create'
          }
        }
      },
      {
        path: 'detail',
        component: ExtraFieldsDocumentOrderDetailComponent,
        canActivate: [DwAuthGuardService],
        data: {
          dwRouteData: {
            dwAuthId: 'dw-extra-fields-document-detail'
          }
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExtraFieldsDocumentOrderRoutingModule { }
