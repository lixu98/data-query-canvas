import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DwAgGridEditorsModule } from '@webdpt/components/ag-grid-editors';
import { DwAuthGuardService } from '@webdpt/framework/auth';
import { DwLanguageService } from '@webdpt/framework/language';
import { AgGridModule } from 'ag-grid-angular';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { DemoOrderServerPagingService } from '../../../shared/select-modal/demo-order/demo-order-server-paging.service';
import { MockDataClientPagingService } from '../../../shared/select-modal/mock-data/mock-data-client-paging.service';
import { ShowcaseSharedModule } from '../../../shared/shared.module';
import { CellEditingComponent } from './cell-editing/cell-editing.component';
import { ColumnPinningComponent } from './column-pinning/column-pinning.component';
import { AgGridPerformanceComponent } from './performance/ag-grid-performance.component';
import { RowDataSourceComponent } from './row-datasource/row-data-source.component';
import { RowPaginationComponent } from './row-pagination/row-pagination.component';
import { RowSelectionComponent } from './row-selection/row-selection.component';
import { RowSortingComponent } from './row-sorting/row-sorting.component';

const AG_GRID_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    redirectTo: 'pinning'
  },
  {
    path: 'pinning',
    component: ColumnPinningComponent
  },
  {
    path: 'sorting',
    component: RowSortingComponent
  },
  {
    path: 'selection',
    component: RowSelectionComponent
  },
  {
    path: 'pagination',
    component: RowPaginationComponent
  },
  {
    path: 'datasource',
    component: RowDataSourceComponent
  },
  {
    path: 'editing',
    component: CellEditingComponent,
    canActivate: [DwAuthGuardService],
    data: {
      dwRouteData: {
        programId: 'dw-ag-grid-editing',
        dwAuthId: 'dw-ag-grid-editing',
        i18n: ['select-modal-demo-order', 'select-modal-mock-data', 'select-modal-enum']
      }
    },
    resolve: {
      transaction: DwLanguageService
    }
  },
  {
    path: 'performance',
    component: AgGridPerformanceComponent,
    data: {
      dwRouteData: {
        programId: 'dw-ag-grid-editing',
        dwAuthId: 'dw-ag-grid-editing',
        i18n: ['select-modal-demo-order', 'select-modal-mock-data', 'select-modal-enum']
      }
    },
    resolve: {
      transaction: DwLanguageService
    }
  }
];

const COMPONENTS = [
  ColumnPinningComponent,
  RowSortingComponent,
  RowSelectionComponent,
  RowPaginationComponent,
  RowDataSourceComponent,
  CellEditingComponent,
  AgGridPerformanceComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ShowcaseSharedModule,
    RouterModule.forChild(AG_GRID_ROUTES),
    AgGridModule,
    NzRadioModule,
    NzGridModule,
    DwAgGridEditorsModule
  ],
  declarations: [
    ...COMPONENTS
  ],
  providers: [
    MockDataClientPagingService,
    DemoOrderServerPagingService
  ],
  exports: [
    ...COMPONENTS,
    RouterModule
  ]
})
export class DwAgGridDemoModule {
}
