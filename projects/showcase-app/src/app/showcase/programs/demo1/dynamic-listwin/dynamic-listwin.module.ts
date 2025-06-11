import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { SbepQueryModule } from '../../../shared/dynamic-modal/sbep-query/sbep-query.module';
import { ShowcaseSharedModule } from '../../../shared/shared.module';
import { DynamicListwinRoutingModule } from './dynamic-listwin-routing.module';
import { DynamicListwinComponent } from './dynamic-listwin.component';


@NgModule({
  imports: [
    CommonModule,
    DynamicListwinRoutingModule,
    ShowcaseSharedModule,
    SbepQueryModule,
    NzButtonModule,
    NzLayoutModule,
    NzFormModule,
    NzGridModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  declarations: [DynamicListwinComponent]
})

export class DynamicListwinModule { }
