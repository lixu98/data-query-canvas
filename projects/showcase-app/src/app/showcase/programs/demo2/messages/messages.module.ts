import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';

import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { ShowcaseSharedModule } from '../../../shared/shared.module';
import { ShowcaseMessagesRoutingModule } from './messages-routing.module';
import { ShowcaseRouteBackPageComponent } from './route-back-page/route-back-page.component';
import { ShowcaseRoutedMessageComponent } from './routed-message/routed-message.component';
import { ShowcaseSendMessagesComponent } from './send-messages/send-messages.component';
import { ShowcaseSinglePageBatchComponent } from './single-page-batch/single-page-batch.component';
import { ShowcaseSinglePageComponent } from './single-page/single-page.component';

@NgModule({
  imports: [
    CommonModule,
    NzIconModule,
    NzButtonModule,
    NzFormModule,
    NzGridModule,
    NzCardModule,
    NzInputModule,
    ShowcaseSharedModule,
    ShowcaseMessagesRoutingModule,
    TranslateModule,
    ReactiveFormsModule,
    NzMessageModule,
  ],
  declarations: [
    ShowcaseSendMessagesComponent,
    ShowcaseSinglePageComponent,
    ShowcaseSinglePageBatchComponent,
    ShowcaseRoutedMessageComponent,
    ShowcaseRouteBackPageComponent]
})
export class ShowcaseMessagesModule {
}
