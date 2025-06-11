import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { ShowcaseSharedModule } from '../../../shared/shared.module';
import { ShowcaseHeroListComponent } from './hero-list/hero-list.component';
import { ShowcaseMockDemoRoutingModule } from './mock-demo-routing.module';


@NgModule({
  imports: [
    CommonModule,
    ShowcaseSharedModule,
    ShowcaseMockDemoRoutingModule,
    TranslateModule
  ],
  declarations: [ShowcaseHeroListComponent]
})
export class ShowcaseMockDemoModule {
}
