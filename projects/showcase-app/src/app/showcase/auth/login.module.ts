import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzGridModule } from 'ng-zorro-antd/grid';

import { ShowcaseSharedModule } from '../shared/shared.module';
import { ShowcaseLoginRoutingModule } from './login-routing.module';
import { ShowcaseLoginComponent } from './login/login.component';
import { DwLoginModule } from '@webdpt/components/login';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    ShowcaseLoginRoutingModule,
    ShowcaseSharedModule,
    NzLayoutModule,
    NzGridModule,
    DwLoginModule,
    TranslateModule
  ],
  declarations: [
    ShowcaseLoginComponent
  ]
})
export class ShowcaseLoginModule { }
