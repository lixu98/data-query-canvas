import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShowcaseSharedModule } from '../../../shared/shared.module';
import { SbepQueryModalService } from './service/sbep-query-modal.service';
import { SbepQueryWinComponent } from './sbep-query-win/sbep-query-win.component';
import { SbepQueryInputComponent } from './sbep-query-input/sbep-query-input.component';
import { DwPagingModule } from '@webdpt/components/paging';
import { AgGridModule } from 'ag-grid-angular';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { DwAgGridEditorsModule } from '@webdpt/components/ag-grid-editors';



@NgModule({
  imports: [
    CommonModule,
    ShowcaseSharedModule,
    DwPagingModule,
    AgGridModule,
    NzGridModule,
    NzButtonModule,
    NzInputModule,
    NzSelectModule,
    NzIconModule,
    DwAgGridEditorsModule
  ],
  declarations: [SbepQueryInputComponent, SbepQueryWinComponent],
  entryComponents: [ // 所有要 [ 動態 ] 加載的組件, 都需要在[entryComponents]模塊部分進行聲明。
    SbepQueryWinComponent
  ],
  exports: [
    SbepQueryInputComponent
  ],
  providers: [
    SbepQueryModalService
  ]
})
export class SbepQueryModule { }
