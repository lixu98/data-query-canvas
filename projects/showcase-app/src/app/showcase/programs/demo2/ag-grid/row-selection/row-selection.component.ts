import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-row-selection',
  template: `
    <div>
      <nz-radio-group [(ngModel)]="rowSelection">
      <label nz-radio nzValue="single">單選</label>
      <label nz-radio nzValue="multiple">多選</label>
    </nz-radio-group></div>
    <ag-grid-angular
      #agGrid
      style="flex: 1;"
      id="myGrid"
      [rowData]="rowData"
      class="ag-theme-material"
      [columnDefs]="columnDefs"
      [debug]="true"
      [defaultColDef]="defaultColDef"
      [rowSelection]="rowSelection"
      (selectionChanged)="onSelectionChanged()"
      (gridReady)="onGridReady($event)"
    ></ag-grid-angular>
    <div>{{ dataInfo | json }}</div>
  `,
  styles: [
    `
      :host {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        flex-direction: column;
      }
    `
  ]
})
export class RowSelectionComponent {
  private gridApi;
  private gridColumnApi;
  rowData: any;
  rowSelection: string;
  dataInfo: any;
  columnDefs;
  defaultColDef: ColDef = {
    sortable: true,
    resizable: true
  };
  constructor(private http: HttpClient) {
    this.columnDefs = [
      {
        headerName: '#',
        colId: 'rowNum',
        valueGetter: 'node.id',
        width: 40,
        pinned: 'left'
      },
      {
        headerName: 'Athlete',
        field: 'athlete',
        width: 150,
        pinned: 'left'
      },
      {
        headerName: 'Age',
        field: 'age',
        width: 90,
        pinned: 'left'
      },
      {
        headerName: 'Country',
        field: 'country',
        width: 120
      },
      {
        headerName: 'Year',
        field: 'year',
        width: 90
      },
      {
        headerName: 'Date',
        field: 'date',
        width: 110
      },
      {
        headerName: 'Sport',
        field: 'sport',
        width: 110
      },
      {
        headerName: 'Gold',
        field: 'gold',
        width: 100
      },
      {
        headerName: 'Silver',
        field: 'silver',
        width: 100
      },
      {
        headerName: 'Bronze',
        field: 'bronze'
      },
      {
        headerName: 'Total',
        field: 'total',
        width: 100,
        pinned: 'right'
      }
    ];
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.http
      .get('https://api.myjson.com/bins/ztxog')
      .subscribe((data: any): any => {
        this.rowData = data;
      });

    const sort = [
      {
        colId: 'age',
        sort: 'asc'
      }
    ];
    this.gridApi.setSortModel(sort);
    this.rowSelection = 'single';
  }

  onSelectionChanged(): void {
    const selectedRows = this.gridApi.getSelectedRows();

    this.dataInfo = selectedRows;
  }
}
