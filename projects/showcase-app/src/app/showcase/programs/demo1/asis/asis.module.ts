import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DwActionModule } from '@webdpt/components/action';
import { DwFormItemsModule } from '@webdpt/components/form-items';
import { DwDivMaskModule } from '@webdpt/components/load-mask';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ShowcaseSharedModule } from '../../../shared/shared.module';
import { AsisAddComponent } from './asis-add/asis-add.component';
import { AsisDetailChildEditComponent } from './asis-detail-child-edit/asis-detail-child-edit.component';
import { AsisDetailEditComponent } from './asis-detail-edit/asis-detail-edit.component';
import { AsisListComponent } from './asis-list/asis-list.component';
import { AsisRoutingModule } from './asis-routing.module';
import { AsisViewComponent } from './asis-view/asis-view.component';
import { AsisComponent } from './asis.component';
import { SearchConditionModel } from './model';
import { AsisService } from './service/asis.service';
import { SaveService } from './service/save.service';


const COMPONENTS = [
  AsisComponent,
  AsisViewComponent,
  AsisAddComponent,
  AsisListComponent,
  AsisDetailEditComponent,
  AsisDetailChildEditComponent
];

const PROVIDERS = [
  SearchConditionModel,
  AsisService,
  SaveService
];

@NgModule({
  imports: [
    CommonModule,
    AsisRoutingModule,
    ShowcaseSharedModule,
    NzAlertModule,
    NzButtonModule,
    NzLayoutModule,
    NzTableModule,
    DwFormItemsModule,
    NzGridModule,
    NzFormModule,
    NzIconModule,
    DwActionModule,
    ReactiveFormsModule,
    TranslateModule,
    NzCardModule,
    NzDividerModule,
    DwDivMaskModule,
    NzPopconfirmModule,
    NzModalModule
  ],
  declarations: [
    ...COMPONENTS
  ],
  entryComponents: [
    AsisDetailEditComponent, AsisDetailChildEditComponent], // 對話框使用component模式，需要加入自定義component
  providers: [
    ...PROVIDERS
  ],
  exports: [
    ...COMPONENTS
  ]
})

export class AsisModule {}
