import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DwAuthGuardService } from '@webdpt/framework/auth';
import { DwLanguageService } from '@webdpt/framework/language';
import { DynamicListwinComponent } from './dynamic-listwin.component';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: DynamicListwinComponent,
    canActivate: [DwAuthGuardService],
    data: {
      dwRouteData: {
        programId: 'dw-dynamic-listwin',
        dwAuthId: 'dw-dynamic-listwin'
      }
    },
    resolve: {
      transaction: DwLanguageService
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DynamicListwinRoutingModule { }
