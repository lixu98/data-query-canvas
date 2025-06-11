import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DwAuthGuardService } from '@webdpt/framework/auth';
import { DwLanguageService } from '@webdpt/framework/language';
import { ShowcaseHeroListComponent } from './hero-list/hero-list.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: ShowcaseHeroListComponent,
    canActivate: [DwAuthGuardService],
    data: {
      dwRouteData: {
        dwAuthId: 'dw-mock-demo',
        programId: 'dw-mock-demo'
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
export class ShowcaseMockDemoRoutingModule { }
