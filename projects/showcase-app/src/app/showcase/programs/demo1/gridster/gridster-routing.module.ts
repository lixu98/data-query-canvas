import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DwAuthGuardService } from '@webdpt/framework/auth';
import { GridsterComponent } from './gridster.component';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: GridsterComponent,
    canActivate: [DwAuthGuardService],
    data: {
      dwRouteData: {
        dwAuthId: 'dw-gridster'
      }
    }
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GridsterRoutingModule { }
