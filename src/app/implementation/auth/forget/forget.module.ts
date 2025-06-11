import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { ForgetRoutingModule } from './forget-routing.module';
import { ForgetComponent } from './forget.component';
import { DwForgetModule } from '@webdpt/components/user/forget-block';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    ForgetRoutingModule,
    SharedModule,
    DwForgetModule,
    NzGridModule,
    TranslateModule
  ],
  declarations: [
    ForgetComponent
  ]
})
export class ForgetModule { }
