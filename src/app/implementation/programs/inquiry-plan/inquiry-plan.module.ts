import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InquiryPlanRoutingModule } from './inquiry-plan-routing.module';

const programsModules = [

];

@NgModule({
  imports: [
    CommonModule,
    InquiryPlanRoutingModule,
    ...programsModules
  ],
  declarations: []
})
export class InquiryPlanModule { }
