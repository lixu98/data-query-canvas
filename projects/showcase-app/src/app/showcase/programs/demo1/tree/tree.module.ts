import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DwActionModule } from '@webdpt/components/action';
import { DwLanguageCoreModule } from '@webdpt/components/core';
import { DwFormItemsModule } from '@webdpt/components/form-items';
import { DwContainerModule } from '@webdpt/components/redevelop';
import { DwAuthGuardService } from '@webdpt/framework/auth';
import { DwLanguageService } from '@webdpt/framework/language';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ShowcaseSharedModule } from '../../../shared/shared.module';
import { ShowcaseDataModalComponent } from './data-modal/data-modal.component';
import { ShowcaseEditShowcaseDataModalComponent } from './edit-data-modal/edit-data-modal.component';
import { ShowcaseTreeSearchPipe } from './model/searchPipe';
import { ShowcaseTreeComponent } from './tree.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: ShowcaseTreeComponent,
    canActivate: [DwAuthGuardService],
    data: {
      dwRouteData: {
        dwAuthId: 'dw-tree',
        programId: 'dw-tree'
      }
    },
    resolve: {
      transaction: DwLanguageService
    }
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    ShowcaseSharedModule,
    NzButtonModule,
    NzFormModule,
    NzRadioModule,
    DwFormItemsModule,
    NzGridModule,
    ReactiveFormsModule,
    DwLanguageCoreModule,
    TranslateModule,
    NzAlertModule,
    NzCardModule,
    NzLayoutModule,
    NzDropDownModule,
    NzTableModule,
    NzIconModule,
    NzInputModule,
    NzMenuModule,
    DwActionModule,
    NzModalModule,
    DwContainerModule
  ],
  declarations: [ShowcaseTreeComponent, ShowcaseTreeSearchPipe, ShowcaseDataModalComponent, ShowcaseEditShowcaseDataModalComponent],
  entryComponents: [ShowcaseDataModalComponent, ShowcaseEditShowcaseDataModalComponent]
})
export class ShowcaseTreeModule { }
