import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DwActionModule } from '@webdpt/components/action';
import { DwFormItemsModule } from '@webdpt/components/form-items';
import { DwDivMaskModule } from '@webdpt/components/load-mask';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { ShowcaseSharedModule } from '../../../shared/shared.module';
import { DetailEditComponent } from './detail-edit/detail-edit.component';
import { ListComponent } from './list/list.component';
import { TreeMenuService } from './service/tree-menu.service';
import { TreeMenuRoutingModule } from './tree-menu-routing.module';
import { TreeMenuComponent } from './tree-menu.component';

const ENTRYCOMPONENTS = [
  DetailEditComponent
];

const COMPONENTS = [
  TreeMenuComponent,
  ListComponent,
  DetailEditComponent
];

const PROVIDERS = [
  TreeMenuService
];

@NgModule({
  imports: [
    CommonModule,
    TreeMenuRoutingModule,
    ShowcaseSharedModule,
    NzLayoutModule,
    NzTreeModule,
    NzButtonModule,
    NzFormModule,
    DwFormItemsModule,
    NzGridModule,
    ReactiveFormsModule,
    TranslateModule,
    NzCardModule,
    NzTableModule,
    DwDivMaskModule,
    NzIconModule,
    NzPopconfirmModule,
    DwActionModule,
    NzCheckboxModule,
    NzModalModule
  ],
  entryComponents: [ // 對話框使用component模式，需要加入自定義component,
    ...ENTRYCOMPONENTS
  ],
  declarations: [
    ...COMPONENTS
  ],
  providers: [
    ...PROVIDERS
  ]
})
export class TreeMenuModule { }
