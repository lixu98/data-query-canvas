import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DwAuthGuardService } from '@webdpt/framework/auth';
import { DwLanguageService } from '@webdpt/framework/language';
import { ExtraFieldsOrderListComponent } from './order-list/order-list.component';
import { ExtraFieldsOrderModifyComponent } from './order-modify/order-modify.component';
import { ExtraFieldsOrderComponent } from './order.component';


export const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: ExtraFieldsOrderComponent,
    data: {
      dwRouteData: {
        programId: 'dw-extra-fields-order'
      }
    },
    resolve: {
      transaction: DwLanguageService
    },
    children: [
      {
        path: '',
        component: ExtraFieldsOrderListComponent,
        canActivate: [DwAuthGuardService],
        data: {
          dwRouteData: {
            dwAuthId: 'dw-extra-fields-order'
          },
          reload: true // <== 此作業的頁籤切換至其它作業時銷毀，進入此頁籤時作業重新創建。
        }
      },
      {
        path: 'modify',
        component: ExtraFieldsOrderModifyComponent,
        canActivate: [DwAuthGuardService],
        data: {
          dwRouteData: {
            dwAuthId: 'dw-extra-fields-order-modify'
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
export class ExtraFieldsOrderRoutingModule { }
