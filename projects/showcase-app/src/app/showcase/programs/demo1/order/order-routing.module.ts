import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DwAuthGuardService } from '@webdpt/framework/auth';
import { DwLanguageService } from '@webdpt/framework/language';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderModifyComponent } from './order-modify/order-modify.component';
import { OrderComponent } from './order.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: OrderComponent,
    data: {
      dwRouteData: {
        programId: 'dw-order'
      }
    },
    resolve: {
      transaction: DwLanguageService
    },
    children: [
      {
        path: '',
        component: OrderListComponent,
        canActivate: [DwAuthGuardService],
        data: {
          dwRouteData: {
            dwAuthId: 'dw-order'
          }
        }
      },
      {
        path: 'dw-order-modify',
        component: OrderModifyComponent,
        canActivate: [DwAuthGuardService],
        data: {
          dwRouteData: {
            dwAuthId: 'dw-order-modify'
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
export class OrderRoutingModule { }
