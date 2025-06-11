import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DwAuthGuardService } from '@webdpt/framework/auth';
import { DwLanguageService } from '@webdpt/framework/language';
import { AsisAddComponent } from './asis-add/asis-add.component';
import { AsisListComponent } from './asis-list/asis-list.component';
import { AsisViewComponent } from './asis-view/asis-view.component';
import { AsisComponent } from './asis.component';
const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: AsisComponent,
    data: {
      dwRouteData: {
        programId: 'dw-asis'
      }
    },
    resolve: {
      transaction: DwLanguageService
    },
    children: [
      {
        path: '',
        component: AsisListComponent,
        canActivate: [DwAuthGuardService],
        data: {
          dwRouteData: {
            dwAuthId: 'dw-asis'
          }
        }
      },
      {
        path: 'dw-asis-add',
        component: AsisAddComponent,
        canActivate: [DwAuthGuardService],
        data: {
          dwRouteData: {
            dwAuthId: 'dw-asis-add'
          }
        }
      },
      {
        path: 'dw-asis-view',
        component: AsisViewComponent,
        canActivate: [DwAuthGuardService],
        data: {
          dwRouteData: {
            dwAuthId: 'dw-asis-view'
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
export class AsisRoutingModule { }
