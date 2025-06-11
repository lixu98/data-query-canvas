import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListRoutingModule } from './list-routing.module';
import { ListComponent } from './mode-list.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzModalModule } from 'ng-zorro-antd/modal'
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { ListService } from './list.service';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { PublishModelComponent } from '../model/publish-model/publish-model.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { SharedModule } from '../../../../shared/shared.module';
@NgModule({
  providers: [ListService],
  declarations: [
    ListComponent,
    PublishModelComponent
  ],
  imports: [
    CommonModule,
    ListRoutingModule,
    NzButtonModule,
    FormsModule,
    NzSelectModule,
    NzInputModule,
    NzIconModule,
    NzTableModule,
    NzPaginationModule,
    NzImageModule,
    NzModalModule,
    NzFormModule,
    ReactiveFormsModule,
    NzRadioModule,
    NzToolTipModule,
    NzTreeModule,
    NzSpinModule,
    SharedModule
  ]
})
export class ListModule { }
