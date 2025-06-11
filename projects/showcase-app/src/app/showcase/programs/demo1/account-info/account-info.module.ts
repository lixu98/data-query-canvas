import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DwAccountInfoModule } from '@webdpt/components/user/account';
import { ShowcaseSharedModule } from '../../../shared/shared.module';
import { AccountInfoRoutingModule } from './account-info-routing.module';
import { AccountInfoComponent } from './account-info.component';


@NgModule({
  imports: [
    CommonModule,
    ShowcaseSharedModule,
    AccountInfoRoutingModule,
    DwAccountInfoModule
  ],
  declarations: [
    AccountInfoComponent
  ]
})

export class AccountInfoModule { }
