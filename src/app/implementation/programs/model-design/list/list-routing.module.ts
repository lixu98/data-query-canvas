import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './mode-list.component';
import { DwLanguageService } from '@webdpt/framework/language';
import { DwAuthGuardService } from '@webdpt/framework/auth';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    // canActivate: [DwAuthGuardService],
    data: {
      dwRouteData: {
        programId: 'list',
        dwAuthId: 'list'
      }
    },
    resolve: {
      transaction: DwLanguageService
    },
    children: [
      {
        path: "",
        pathMatch: "prefix",
        component: ListComponent,
        // canActivate: [DwAuthGuardService],
        data: {
          dwRouteData: {
            dwAuthId: 'list',
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
export class ListRoutingModule { }
