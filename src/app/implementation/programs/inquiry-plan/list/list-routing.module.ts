import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list.component';
import { DwLanguageService } from '@webdpt/framework/language';
import { DwAuthGuardService } from '@webdpt/framework/auth';
import { SchemeDesignComponent } from './scheme-design/scheme-design.component';

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
      },
      {
        path: 'schemeDesign',
        component: SchemeDesignComponent,
        // canActivate: [DwAuthGuardService],
        data: {
          dwRouteData: {
            dwAuthId: 'schemeDesign'
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
