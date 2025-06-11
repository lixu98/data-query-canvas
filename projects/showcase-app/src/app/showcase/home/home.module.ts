import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { DwAnnouncementModule } from '@webdpt/components/announcement';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { ShowcaseSharedModule } from '../shared/shared.module';
import { ShowcaseHomeRoutingModule } from './home-routing.module';
import { ShowcaseHomeComponent } from './home.component';


@NgModule({
  imports: [
    CommonModule,
    ShowcaseSharedModule,
    ShowcaseHomeRoutingModule,
    DwAnnouncementModule,
    NzCardModule,
    NzGridModule,
    TranslateModule
  ],
  declarations: [ShowcaseHomeComponent],
  exports: [RouterModule]
})
export class ShowcaseHomeModule { }
