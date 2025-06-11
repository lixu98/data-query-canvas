import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DwLanguageCoreModule } from '@webdpt/components/core';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ShowcaseSharedModule } from '../../../shared/shared.module';
import { LanguageStyleRoutingModule } from './language-style-routing.module';
import { LanguageStyleComponent } from './language-style/language-style.component';

@NgModule({
  imports: [
    CommonModule,
    ShowcaseSharedModule,
    LanguageStyleRoutingModule,
    NzLayoutModule,
    NzTableModule,
    NzGridModule,
    NzIconModule,
    DwLanguageCoreModule
  ],
  declarations: [LanguageStyleComponent]
})
export class LanguageStyleModule {
}
