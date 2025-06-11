import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DwFormItemsModule } from '@webdpt/components/form-items';
import { DwAuthGuardService } from '@webdpt/framework/auth';
import { DwLanguageService } from '@webdpt/framework/language';
import { NzAnchorModule } from 'ng-zorro-antd/anchor';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { ColorSketchModule } from 'ngx-color/sketch';
import { HighlightModule } from 'ngx-highlightjs';
import { ShowcaseSharedModule } from '../../../shared/shared.module';
import {
  CascaderBaseComponent,
  CascaderDocComponent,
  CascaderLoadingComponent,
  DatePickerBaseComponent,
  DatePickerDisabledComponent,
  DatePickerDocComponent,
  DatePickerFooterComponent,
  DatePickerOpenComponent,
  FormItemsCommonDocComponent,
  InputBaseComponent,
  InputDocumentComponent,
  InputFormComponent,
  InputGroupBaseComponent,
  InputGroupDocComponent,
  InputSizeComponent,
  RangePickerBaseComponent,
  RangePickerDocComponent,
  RangePickerRangeComponent,
  SelectBaseComponent,
  SelectDocComponent,
  SelectSearchComponent,
  SelectTagsComponent,
  TextareaAutosizeComponentComponent,
  TextareaBaseComponent,
  TextareaDocComponent, TimePickerBaseComponent, TimePickerDisabledComponent,
  TimePickerDisabledTimeComponent, TimePickerDocComponent, TimePickerFormComponent
} from './components';
import { DemoFormItemsComponent } from './demo-form-items.component';

const ROUTES: Routes = [
  {
    path: '',
    component: DemoFormItemsComponent,
    canActivate: [DwAuthGuardService],
    data: {
      dwRouteData: {
        programId: 'dw-form-items',
        dwAuthId: 'dw-form-items'
      }
    },
    resolve: {
      transaction: DwLanguageService
    }
  }

];

const DEMO_COMPONENTS = [
  DemoFormItemsComponent,
  InputBaseComponent,
  InputFormComponent,
  InputSizeComponent,
  TextareaBaseComponent,
  TextareaAutosizeComponentComponent,
  InputGroupBaseComponent,
  SelectBaseComponent,
  SelectSearchComponent,
  SelectTagsComponent,
  DatePickerBaseComponent,
  DatePickerDisabledComponent,
  DatePickerOpenComponent,
  DatePickerFooterComponent,
  RangePickerBaseComponent,
  RangePickerRangeComponent,
  CascaderBaseComponent,
  CascaderLoadingComponent,
  FormItemsCommonDocComponent,
  InputDocumentComponent,
  CascaderDocComponent,
  DatePickerDocComponent,
  RangePickerDocComponent,
  SelectDocComponent,
  TextareaDocComponent,
  InputGroupDocComponent,
  TimePickerDocComponent,
  TimePickerBaseComponent,
  TimePickerFormComponent,
  TimePickerDisabledComponent,
  TimePickerDisabledTimeComponent
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    ShowcaseSharedModule,
    ColorSketchModule,
    HighlightModule.forRoot({ theme: 'agate' }),
    DwFormItemsModule,
    TranslateModule,
    NzFormModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzIconModule,
    NzTableModule,
    NzAnchorModule,
    NzCardModule,
    NzLayoutModule,
    NzDividerModule,
    NzTabsModule,
    NzGridModule,
    NzCheckboxModule
  ],
  declarations: [
    ...DEMO_COMPONENTS

  ],
  entryComponents: [
    ...DEMO_COMPONENTS
  ]
})
export class DemoFormItemsModule {}
