import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModelDesignRoutingModule } from './model-design-routing.module';

const programsModules = [

];

@NgModule({
  imports: [
    CommonModule,
    ModelDesignRoutingModule,
    ...programsModules
  ],
  declarations: []
})
export class ModelDesignModule { }
