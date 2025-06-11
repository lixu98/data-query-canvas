import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShowcaseSharedModule } from '../../../shared/shared.module';
import { OrganizeTreeRoutingModule } from './organize-tree-routing.module';
import { OrganizeTreeComponent } from './organize-tree.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    ShowcaseSharedModule,
    OrganizeTreeRoutingModule,
    NzButtonModule,
    NzLayoutModule,
    NzFormModule,
    NzInputModule,
    NzListModule,
    NzSelectModule,
    NzGridModule,
    NzIconModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  declarations: [
    OrganizeTreeComponent
  ]
})
export class OrganizeTreeModule { }
