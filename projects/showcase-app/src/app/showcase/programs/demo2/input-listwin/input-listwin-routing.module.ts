import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DwAuthGuardService } from '@webdpt/framework/auth';
import { DwLanguageService } from '@webdpt/framework/language';
import { InputListwinComponent } from './input-listwin.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: InputListwinComponent,
    canActivate: [DwAuthGuardService],
    data: {
      dwRouteData: {
        programId: 'dw-input-listwin',
        dwAuthId: 'dw-input-listwin',
        i18n: ['select-modal-demo-order', 'select-modal-mock-data', 'select-modal-enum']
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
export class InputListwinRoutingModule { }
