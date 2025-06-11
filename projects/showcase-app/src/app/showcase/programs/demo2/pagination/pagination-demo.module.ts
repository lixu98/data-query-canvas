import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DwAuthGuardService } from '@webdpt/framework/auth';
import { PaginationTableComponent } from './pagination/pagination-table.component';
import { PaginationAgGridComponent } from './pagination/pagination-ag-grid.component';
import { PaginationAgGridCsComponent } from './pagination/pagination-ag-grid-cs.component';
import { ShowcaseSharedModule } from '../../../shared/shared.module';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { DwPagingModule } from '@webdpt/components/paging';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { AgGridModule } from 'ag-grid-angular';
import { DwAgGridEditorsModule } from '@webdpt/components/ag-grid-editors';

export const PG_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    redirectTo: 'table'
  },
  {
    path: 'table',
    component: PaginationTableComponent,
    canActivate: [DwAuthGuardService],
    data: {
      dwRouteData: {
        dwAuthId: 'dw-pagination-table'
      }
    }
  },
  {
    path: 'ag-grid',
    component: PaginationAgGridComponent,
    canActivate: [DwAuthGuardService],
    data: {
      dwRouteData: {
        dwAuthId: 'dw-pagination-ag-grid'
      }
    }
  },
  {
    path: 'ag-grid-cs',
    component: PaginationAgGridCsComponent,
    canActivate: [DwAuthGuardService],
    data: {
      dwRouteData: {
        dwAuthId: 'dw-pagination-ag-grid-cs'
      }
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PG_ROUTES),
    ShowcaseSharedModule,
    NzDividerModule,
    NzTableModule,
    DwPagingModule,
    NzGridModule,
    AgGridModule,
    DwAgGridEditorsModule
  ],
  declarations: [
    PaginationTableComponent,
    PaginationAgGridComponent,
    PaginationAgGridCsComponent
  ],
  exports: [
    RouterModule
  ]
})
export class PaginationDemoModule { }
