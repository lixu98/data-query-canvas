import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DwAuthGuardService } from '@webdpt/framework/auth';
import { DwLanguageService } from '@webdpt/framework/language';
import { DwCustomTableDisplayListComponent } from './dw-custom-table-display-list/dw-custom-table-display-list.component';
import { DwCustomTableDisplayModifyComponent } from './dw-custom-table-display-modify/dw-custom-table-display-modify.component';
import { DwCustomTableDisplayComponent } from './dw-custom-table-display.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: DwCustomTableDisplayComponent,
    data: {
      dwRouteData: {
        programId: 'dw-custom-table-display'
      }
    },
    resolve: {
      transaction: DwLanguageService
    },
    children: [
      {
        path: '',
        component: DwCustomTableDisplayListComponent,
        canActivate: [DwAuthGuardService],
        data: {
          dwRouteData: {
            dwAuthId: 'dw-custom-table-display'
          }
        }
      },
      {
        path: 'dw-custom-table-display-modify',
        component: DwCustomTableDisplayModifyComponent,
        canActivate: [DwAuthGuardService],
        data: {
          dwRouteData: {
            dwAuthId: 'dw-custom-table-display'
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
export class DwCustomTableDisplayRoutingModule { }
