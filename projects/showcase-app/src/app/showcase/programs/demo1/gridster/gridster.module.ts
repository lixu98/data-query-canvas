import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GridsterModule } from 'angular-gridster2';

import { DwActionModule } from '@webdpt/components/action';
import { DwBaseIframeModule } from '@webdpt/components/iframe';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ShowcaseSharedModule } from '../../../shared/shared.module';
import { GridsterRoutingModule } from './gridster-routing.module';
import { GridsterComponent } from './gridster.component';



const COMPONENTS = [
  GridsterComponent
];

const PROVIDERS = [
];

@NgModule({
  imports: [
    CommonModule,
    GridsterRoutingModule,
    ShowcaseSharedModule,
    GridsterModule,
    NzButtonModule,
    DwBaseIframeModule,
    DwActionModule
  ],
  declarations: [
    ...COMPONENTS
  ],
  providers: [
    ...PROVIDERS
  ]
})
export class ShowcaseGridsterModule { }
