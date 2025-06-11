import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShowcaseSharedModule } from '../../../shared/shared.module';
import { UpdatePasswordRoutingModule } from './update-password-routing.module';
import { UpdatePasswordComponent } from './update-password.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    ShowcaseSharedModule,
    UpdatePasswordRoutingModule,
    NzButtonModule,
    NzLayoutModule,
    NzFormModule,
    NzGridModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  declarations: [
    UpdatePasswordComponent
  ]
})
export class UpdatePasswordModule { }
