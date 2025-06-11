import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AG_GRID_FW_COMPONENT, AG_GRID_FW_COMPONENTS } from '@webdpt/components/ag-grid-editors';
import { ColDef } from 'ag-grid-community';
import { MockDataClientPagingService } from '../../../../shared/select-modal/mock-data/mock-data-client-paging.service';

@Component({
  selector: 'app-ag-grid-performance',
  template: `
    <div nz-row style="margin: 5px 8px;">
      <div nz-col nzSpan="8">
        <nz-radio-group [(ngModel)]="editType">
          <label nz-radio nzValue="">單一儲存格編輯</label>
          <label nz-radio nzValue="fullRow">整列編輯</label>
        </nz-radio-group>
      </div>
    </div>
    <form [formGroup]="validateForm">
      <ag-grid-angular
        #agGrid
        style="display: inline;"
        id="myGrid"
        [rowData]="rowData"
        class="ag-theme-balham"
        [columnDefs]="columnDefs"
        [debug]="true"
        [frameworkComponents]="frameworkComponents"
        [defaultColDef]="defaultColDef"
        [pagination]="false"
        [paginationPageSize]="10"
        [editType]="editType"
        [floatingFilter]="floatingFilter"
        (firstDataRendered)="firstDataRendered($event)"
        (gridReady)="onGridReady($event)"
      ></ag-grid-angular>
    </form>
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

      form {
        flex: 1;
      }

      :host > form.ng-invalid {
        border: 3px solid red;
      }
    `
  ]
})
export class AgGridPerformanceComponent {
  private gridApi;
  private gridColumnApi;
  editType = '';
  rowData: any;
  frameworkComponents: any;
  columnDefs;
  validateForm: FormGroup;
  floatingFilter: boolean = true;
  defaultColDef: ColDef = {
    sortable: true,
    floatingFilter: true,
    resizable: true
  };

  constructor(private fb: FormBuilder, private http: HttpClient, private orderService: MockDataClientPagingService) {
    this.validateForm = this.fb.group({});
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
        pinned: 'left',
        editable: true,
        cellEditor: AG_GRID_FW_COMPONENT.CellButtonEditor,
        cellEditorParams: {
          modalService: this.orderService,
          tableMultiSelect: false,
          form: this.validateForm,
          validators: [
            Validators.required
          ]
        },
        floatingFilterComponent: AG_GRID_FW_COMPONENT.FloatingButtonEditor,
        floatingFilterComponentParams: {
          modalService: this.orderService,
          tableMultiSelect: true,
          // suppressFilterButton: true
        },
        filter: AG_GRID_FW_COMPONENT.ButtonEditorFilter,
        filterParams: {
          modalService: this.orderService,
          tableMultiSelect: true,
          // suppressFilterButton: true
        },
      },
      {
        headerName: 'Age',
        field: 'age',
        width: 120,
        pinned: 'left',
        editable: true,
        cellEditor: 'agNumberCellEditor',
        cellEditorParams: {
          form: this.validateForm,
          validators: [Validators.required, Validators.min(10), Validators.max(130)],
          dwMin: 0,
          dwMax: 130,
          dwStep: 2
        }
      },
      {
        headerName: 'Country',
        field: 'country',
        width: 150,
        editable: true,
        cellEditor: 'agLargeTextCellEditor',
        cellEditorParams: {
          form: this.validateForm,
          validators: [Validators.required],
          // row: 6,
          dwAutosize: true
        },
        filter: 'agTextColumnFilter',
        // floatingFilterComponent: DwAgTextColumnFloatingFilterComponent
      },
      {
        headerName: 'Year',
        field: 'year',
        width: 120,
        editable: true,
        cellEditor: 'agTextCellEditor',
        cellEditorParams: {
          form: this.validateForm,
          validators: [
            Validators.required,
            Validators.minLength(4)
          ]
        }
      },
      {
        headerName: 'Date',
        field: 'date',
        width: 150,
        editable: true,
        cellEditor: 'agDateCellEditor',
        cellEditorParams: {
          form: this.validateForm,
          validators: [Validators.required],
          dateFormat: 'dd/MM/yyyy'
        },
        filter: 'agDateColumnFilter',
        filterParams: {
          comparator: AG_GRID_FW_COMPONENTS.dateFilterComparator
        }
      },
      {
        headerName: 'Sport',
        field: 'sport',
        width: 150,
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          dwShowSearch: true,
          dwAllowClear: true,
          form: this.validateForm,
          validators: [Validators.required],
          values: ['Wrestling', 'Swimming', 'Gymnastics', 'Speed Skating', 'Cross Country Skiing', 'Short-Track Speed Skating']
        }
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
      {field: 'athlete1'},
      {field: 'age1'},
      {field: 'country1'},
      {field: 'year1'},
      {field: 'date1'},
      {field: 'sport1'},
      {field: 'gold1'},
      {field: 'silver1'},
      {field: 'bronze1'},
      {field: 'athlete2'},
      {field: 'age2'},
      {field: 'country2'},
      {field: 'year2'},
      {field: 'date2'},
      {field: 'sport2'},
      {field: 'gold2'},
      {field: 'silver2'},
      {field: 'bronze2'},
      {field: 'athlete3'},
      {field: 'age3'},
      {field: 'country3'},
      {field: 'year3'},
      {field: 'date3'},
      {field: 'sport3'},
      {field: 'gold3'},
      {field: 'silver3'},
      {field: 'bronze3'}
    ];

    // TODO: DwAgGridEditorsModule 裡要統一整理清單到frameworkComponents
    this.frameworkComponents = {
      ...AG_GRID_FW_COMPONENTS
    };
  }

  firstDataRendered(e: any): void {
    performance.mark('first_data_rendered');
    performance.measure('xhr_end', 'first_data_rendered');
  }
  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.http
      .get('showcase/demo2/ag-grid/grid-large-data', {})
      .subscribe((data: any): any => {
        console.log(data);
        performance.mark('xhr_end');
        console.log('xhr_end');
        this.rowData = data;
      });

    const sort = [
      {
        // colId: 'age',
        // sort: 'asc'
      }
    ];
    this.gridApi.setSortModel(sort);
  }

}
