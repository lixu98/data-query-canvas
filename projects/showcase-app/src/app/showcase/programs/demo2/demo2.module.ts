import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Demo2RoutingModule } from './demo2-routing.module';
import { ShowcaseSharedModule } from '../../shared/shared.module';
import { Demo2RepositoryModule } from './repository';


@NgModule({
  imports: [
    CommonModule,
    ShowcaseSharedModule,
    Demo2RoutingModule,
    Demo2RepositoryModule
  ],
  declarations: []
})
export class Demo2Module { }
