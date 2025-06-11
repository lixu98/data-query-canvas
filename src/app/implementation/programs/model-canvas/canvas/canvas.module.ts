import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module'

import { CanvasRoutingModule } from './canvas-routing.module';
import { CanvasApiService } from './canvas-api.service';
import { CanvasComponent } from './canvas.component';
import { CanvasNodeComponent } from './canvas-node/canvas-node.component';
import { CanvasAddNodeComponent } from './modal/canvas-add-node/canvas-add-node.component';
import { CanvasAddRelationComponent } from './modal/canvas-add-relation/canvas-add-relation.component';
import { CanvasSelectDomainObjectComponent } from './modal/canvas-select-domain-object/canvas-select-domain-object.component';
import { CanvasViewRelationComponent } from './modal/canvas-view-relation/canvas-view-relation.component';
import { ModelEditComponent } from './modal/model-edit/model-edit.component';

@NgModule({
  providers: [ CanvasApiService ],
  declarations: [
    // EmptyDataComponent,
    CanvasComponent,
    CanvasNodeComponent,
    CanvasAddNodeComponent,
    CanvasAddRelationComponent,
    CanvasSelectDomainObjectComponent,
    CanvasViewRelationComponent,
    ModelEditComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    CanvasRoutingModule,
    FormsModule,
  ],
  bootstrap: [CanvasComponent],
  entryComponents: [CanvasNodeComponent],
})
export class CanvasModule {
}
