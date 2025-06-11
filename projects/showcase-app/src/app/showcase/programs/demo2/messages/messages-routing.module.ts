import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DwAuthGuardService } from '@webdpt/framework/auth';
import { DwLanguageService } from '@webdpt/framework/language';
import { ShowcaseRouteBackPageComponent } from './route-back-page/route-back-page.component';
import { ShowcaseSendMessagesComponent } from './send-messages/send-messages.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dw-send-message'
  },
  {
    path: 'dw-send-message',
    component: ShowcaseSendMessagesComponent,
    canActivate: [DwAuthGuardService],
    data: {
      dwRouteData: {
        dwAuthId: 'dw-messages',
        programId: 'dw-messages'
      }
    },
    resolve: {
      transaction: DwLanguageService
    }
  },
  {
    path: 'dw-route-back-page',
    component: ShowcaseRouteBackPageComponent,
    canActivate: [DwAuthGuardService],
    data: {
      dwRouteData: {
        dwAuthId: 'dw-messages',
        programId: 'dw-messages'
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
export class ShowcaseMessagesRoutingModule { }
