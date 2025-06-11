import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DwAuthGuardService } from '@webdpt/framework/auth';
import { DwLanguageService } from '@webdpt/framework/language';
import { DwDefaultAppGuardService } from '@webdpt/framework/program-info';
import { ShowcaseHomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '',
    component: ShowcaseHomeComponent,
    pathMatch: 'prefix',
    canActivate: [DwAuthGuardService, DwDefaultAppGuardService],
    data: {
      dwRouteData: {
        programId: 'home'
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
export class ShowcaseHomeRoutingModule { }
