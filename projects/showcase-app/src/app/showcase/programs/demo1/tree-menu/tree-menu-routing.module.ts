import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DwAuthGuardService } from '@webdpt/framework/auth';
import { DwLanguageService } from '@webdpt/framework/language';
import { ListComponent } from './list/list.component';
import { TreeMenuComponent } from './tree-menu.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: TreeMenuComponent,
    data: {
      dwRouteData: {
        programId: 'dw-tree-menu',
        dwAuthId: 'dw-tree-menu'
      }
    },
    resolve: {
      transaction: DwLanguageService
    },
    children: [
      {
        path: '',
        component: ListComponent,
        canActivate: [DwAuthGuardService],
        data: {
          dwRouteData: {
            dwAuthId: 'dw-tree-menu'
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
export class TreeMenuRoutingModule { }
