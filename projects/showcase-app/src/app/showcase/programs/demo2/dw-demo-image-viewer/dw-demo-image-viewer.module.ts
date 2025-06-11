import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { DwImageViewerModule } from '@webdpt/components/image-viewer';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { ShowcaseSharedModule } from '../../../shared/shared.module';
import { DwDemoImageViewerListComponent } from './dw-demo-image-viewer-list/dw-demo-image-viewer-list.component';
import { DwDemoImageViewerRoutingModule } from './dw-demo-image-viewer-routing.module';
import { DwDemoImageViewerUploadComponent } from './dw-demo-image-viewer-upload/dw-demo-image-viewer-upload.component';
import { DwDemoImageViewerComponent } from './dw-demo-image-viewer.component';
import { DwDemoImageViewerService } from './service/dw-demo-image-viewer.service';

@NgModule({
  imports: [
    CommonModule,
    DwDemoImageViewerRoutingModule,
    ShowcaseSharedModule,
    DwImageViewerModule,
    NzDividerModule,
    NzGridModule,
    TranslateModule,
    NzSliderModule,
    NzTagModule,
    NzButtonModule,
    NzSwitchModule,
    NzUploadModule,
    NzIconModule,
    NzMessageModule
  ],
  declarations: [
    DwDemoImageViewerComponent,
    DwDemoImageViewerListComponent,
    DwDemoImageViewerUploadComponent
  ],
  entryComponents: [],
  providers: [
    DwDemoImageViewerService
  ]
})

export class DwDemoImageViewerModule { }
