import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShowcaseSharedModule } from '../../shared/shared.module';
import { ShowcaseForgetRoutingModule } from './forget-routing.module';
import { ShowcaseForgetComponent } from './forget.component';
import { DwForgetModule } from '@webdpt/components/user/forget-block';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { DwLanguageCoreModule } from '@webdpt/components/core';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    ShowcaseForgetRoutingModule,
    ShowcaseSharedModule,
    DwForgetModule,
    NzGridModule,
    DwLanguageCoreModule,
    TranslateModule
  ],
  declarations: [
    ShowcaseForgetComponent
  ]
})
export class ShowcaseForgetModule { }
