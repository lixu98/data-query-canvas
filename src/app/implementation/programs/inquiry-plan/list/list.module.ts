import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';

import { ListRoutingModule } from './list-routing.module';
import { ListComponent } from './list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SchemeDesignComponent } from './scheme-design/scheme-design.component';
import { OperationColumnComponent } from './modal/operation-column/operation-column.component';
import { InputConfigComponent } from './modal/input-config/input-config.component';
import { FieldMappingComponent } from './modal/field-mapping/field-mapping.component';
import { ExpressionItemComponent } from './modal/operation-column/expression-item/expression-item.component';
import { PublishModelComponent } from './modal/publish-model/publish-model.component'
import { ListService } from './list.service';
import { SchemeDesignAddComponent } from './modal/scheme-design-add/scheme-design-add.component';
@NgModule({
  providers: [ListService],
  declarations: [
    ListComponent,
    SchemeDesignComponent,
    OperationColumnComponent,
    InputConfigComponent,
    FieldMappingComponent,
    PublishModelComponent,
    FieldMappingComponent,
    ExpressionItemComponent,
    SchemeDesignAddComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    ListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ListModule { }
