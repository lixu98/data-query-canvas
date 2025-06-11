import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModelCanvasRoutingModule } from './model-canvas-routing.module';

const programsModules = [

];

@NgModule({
  imports: [
    CommonModule,
    ModelCanvasRoutingModule,
    ...programsModules
  ],
  declarations: []
})
export class ModelCanvasModule { }
