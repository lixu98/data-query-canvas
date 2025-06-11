import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DwAuthGuardService } from '@webdpt/framework/auth';
import { DwLanguageService } from '@webdpt/framework/language';
import { LanguageStyleComponent } from './language-style/language-style.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: LanguageStyleComponent,
    canActivate: [DwAuthGuardService],
    data: {
      dwRouteData: {
        dwAuthId: 'dw-language-style',
        programId: 'dw-language-style'
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
export class LanguageStyleRoutingModule { }
