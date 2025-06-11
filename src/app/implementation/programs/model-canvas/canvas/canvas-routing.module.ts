import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanvasComponent } from './canvas.component';
import { DwLanguageService } from '@webdpt/framework/language';
import { DwAuthGuardService } from '@webdpt/framework/auth';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    canActivate: [DwAuthGuardService],
    data: {
      dwRouteData: {
        programId: 'canvas',
        dwAuthId: 'canvas'
      }
    },
    resolve: {
      transaction: DwLanguageService
    },
    children: [
      {
        path: "",
        pathMatch: "prefix",
        component: CanvasComponent,
        canActivate: [DwAuthGuardService],
        data: {
          dwRouteData: {
            dwAuthId: 'canvas',
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
export class CanvasRoutingModule { }
