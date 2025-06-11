import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

import { DemoThemeComponent } from './demo-theme/demo-theme.component';
import { DwAuthGuardService } from '@webdpt/framework/auth';
import { DwLanguageService } from '@webdpt/framework/language';
import { ThemeBaseComponent } from './demo-theme/theme-base/theme-base.component';
import { ThemePopComponent } from './demo-theme/theme-pop/theme-pop.component';
import { ThemeButtonTemplateComponent } from './demo-theme/theme-button-template/theme-button.template';
import { ColorSketchModule } from 'ngx-color/sketch';
import { HighlightModule } from 'ngx-highlightjs';
import { ShowcaseSharedModule } from '../../../shared/shared.module';
import { DwThemeButtonModule } from '@webdpt/components/theme-button';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';

const ROUTES: Routes = [
  {
    path: '',
    component: DemoThemeComponent,
    canActivate: [DwAuthGuardService],
    data: {
      dwRouteData: {
        programId: 'dw-demo-theme',
        dwAuthId: 'dw-demo-theme'
      }
    },
    resolve: {
      transaction: DwLanguageService
    }
  }
];
@NgModule({
  imports: [
    CommonModule,
    NzLayoutModule,
    NzGridModule,
    NzIconModule,
    NzCardModule,
    NzTabsModule,
    ShowcaseSharedModule,
    RouterModule.forChild(ROUTES),
    ColorSketchModule,
    HighlightModule.forRoot({ theme: 'agate' }),
    DwThemeButtonModule,
    NzButtonModule,
    NzTableModule
  ],
  declarations: [DemoThemeComponent, ThemeBaseComponent, ThemePopComponent, ThemeButtonTemplateComponent],
  entryComponents: [ThemeBaseComponent, ThemePopComponent, ThemeButtonTemplateComponent]
})
export class DemoThemeModule { }
