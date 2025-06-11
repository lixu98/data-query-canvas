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
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ShowcaseSharedModule } from '../../../shared/shared.module';
import { GroupAddComponent } from './group-add/group-add.component';
import { GroupDetailEditComponent } from './group-detail-edit/group-detail-edit.component';
import { GroupListComponent } from './group-list/group-list.component';
import { GroupRoutingModule } from './group-routing.module';
import { GroupViewComponent } from './group-view/group-view.component';
import { GroupComponent } from './group.component';
import { SearchConditionModel } from './model';
import { GroupService } from './service/group.service';
import { SaveService } from './service/save.service';


const COMPONENTS = [
  GroupComponent,
  GroupViewComponent,
  GroupAddComponent,
  GroupListComponent,
  GroupDetailEditComponent
];

const PROVIDERS = [
  SearchConditionModel,
  GroupService,
  SaveService

];

@NgModule({
  imports: [
    CommonModule,
    GroupRoutingModule,
    ShowcaseSharedModule,
    NzButtonModule,
    NzRadioModule,
    NzTableModule,
    NzAlertModule,
    NzLayoutModule,
    DwFormItemsModule,
    NzGridModule,
    NzFormModule,
    NzIconModule,
    DwActionModule,
    ReactiveFormsModule,
    TranslateModule,
    NzCardModule,
    DwDivMaskModule,
    NzPopconfirmModule,
    NzCheckboxModule,
    NzModalModule,
    NzMessageModule
  ],
  declarations: [
    ...COMPONENTS
  ],
  entryComponents: [
    GroupDetailEditComponent], // 對話框使用component模式，需要加入自定義component
  providers: [
    ...PROVIDERS
  ],
  exports: [
    ...COMPONENTS
  ]
})

export class GroupModule { }
