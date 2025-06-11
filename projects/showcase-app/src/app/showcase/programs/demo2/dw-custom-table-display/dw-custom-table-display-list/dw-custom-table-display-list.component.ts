import { Component, EventEmitter, forwardRef, Input, Optional, Output, SkipSelf, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

import { DwTableDirective, IDwColumnConfig } from '@webdpt/components/configurable/table';
import { DwComponent } from '@webdpt/components/redevelop';
import { Observable } from 'rxjs';
import { CustomerListComponent } from '../modals/customer.list/customer-list.component';
import { EmployeeListComponent } from '../modals/employee.list/employee-list.component';
import { DwCustomTableDisplayGenderModel, DwCustomTableDisplaySearchConditionModel, DwCustomTableDisplayStatusModel } from '../model';
import { DwCustomTableDisplayService } from '../service/dw-custom-table-display.service';

@Component({
  selector: 'app-dw-custom-table-display-list',
  templateUrl: './dw-custom-table-display-list.component.html',
  styleUrls: ['../dw-custom-table-display.component.css', './dw-custom-table-display-list.component.css'],
  providers: [
    { provide: DwComponent, useExisting: forwardRef(() => DwCustomTableDisplayListComponent) }
  ]
})
export class DwCustomTableDisplayListComponent extends DwComponent {

  public searchStatusOptions: DwCustomTableDisplayStatusModel[]; // 狀態碼列舉
  public pageSizeChanging: boolean = false;
  // 查詢列表
  public rowCount = 0; // 總筆數
  public dataSet = []; // 查詢列表資料
  public genders: DwCustomTableDisplayGenderModel[]; // 篩選業務員性別列舉
  searchForm: FormGroup;

  @ViewChild('dwTable', { read: DwTableDirective, static: true }) table: DwTableDirective;
  private tableConfig = null; // 表格欄位配置

  // 客戶名稱開窗設定
  @Input() public customerModalOptions: any;
  // 業務員名稱開窗設定
  @Input() public salesModalOptions: any;
  // 進階查詢開合 true:關閉, false:打開
  @Input() isCollapse = true;
  // 是否查詢載入中
  @Input() searchLoading = true;
  // 排序欄位方式 for UI
  // @Input() sortMap = { total: null, salesmanName: null };
  @Output() beforeSearch = new EventEmitter();
  @Output() afterSearch = new EventEmitter();
  @Output() init = new EventEmitter();
  @Output() pageIndexChange = new EventEmitter();
  @Output() pageSizeChange = new EventEmitter();

  public search: DwCustomTableDisplaySearchConditionModel = new DwCustomTableDisplaySearchConditionModel();

  constructor(
    protected router: Router,
    protected fb: FormBuilder,
    protected _route: ActivatedRoute,
    protected customTableDisplayService: DwCustomTableDisplayService,
    @SkipSelf() @Optional() pc: DwComponent
  ) {
    super(pc);
    // performance.mark('DwCustomTableDisplayListComponent create ~ after view init');
  }

  /* ----------- 排序-0.7 ---------- */
  genderList = [
    { text: '男', value: 'male' },
    { text: '女', value: 'female' }
  ];

  ExFilter(value: string[]): void {
    this.ExSearch(value);
  }

  ExSearch(value: string[]): void {
    this.dataSet = this.dataSet.filter((item) => {
      return value[0] === item.gender;
    });
  }
  /* ----------- 排序-0.7 ---------- */

  /**
   * 排序
   *
   * @param  sortName
   * @param  sortExpression
   * @memberof DwCustomTableDisplayComponent
   */
  public sortBy(): void {
    this.search.clearSortSet();

    Object.keys(this.tableConfig.dwColumnConfig).forEach(key => {
      if (this.tableConfig.dwColumnConfig[key].sort) {
        this.search.addSortSet({
          sortName: this.tableConfig.dwColumnConfig[key].dwColumnId, // 排序欄位
          sortExpression: this.tableConfig.dwColumnConfig[key].sort // 排序順序
        });
      }
    });
  }

  public filterGender(resetPageIndex: boolean): void {
    this.search.fields.gender = [];
    this.genders.forEach((gender) => {
      if (gender.checked) {
        this.search.fields.gender.push(gender.value);
      }
    });
    this.searchData(resetPageIndex);
  }

  /**
   * 查詢資料
   *
   * @param  [reset=false] 是否重新指定當前頁碼為第一頁
   * @memberof DwCustomTableDisplayComponent
   */
  public searchData(reset: boolean = false): void {

    this.onBeforeSearch();

    if (reset) { // 是否重新指定當前頁碼為第一頁
      this.search.pageIndex = 1;
    }


    // 篩選業務員性別
    this.search.fields.gender = this.genders
      .filter(item => item.checked)
      .map(item => item.value);

    this.customTableDisplayService.getDwCustomTableDisplayList(
      this.search.pageIndex, this.search.pageSize, this.searchForm.value, this.search.sortSet
    ).subscribe(
      (response: any) => {

        this.rowCount = response.rowCount; // 總筆數
        this.dataSet = response.datas || []; // 資料

        this.onAfterSearch();
      }
    );
  }

  /**
   * 清除篩選業務員性別
   *
   * @memberof DwCustomTableDisplayComponent
   */
  public resetFilterGender(): void {
    DwCustomTableDisplayGenderModel.resetList(this.genders);
    this.searchData(true);
  }

  /**
   * 清除
   *
   * @memberof DwCustomTableDisplayComponent
   */
  public resetForm(): void {
    // 查詢條件欄位初始化
    this.searchForm.reset(this.search.clear());
  }


  /**
   * 每頁筆數改變
   *
   * @memberof DwCustomTableDisplayComponent
   */
  public onPageSizeChange(): void {
    this.pageSizeChanging = true; // pageSize改變中
    setTimeout(() => {
      this.searchData(true); //  讀取後端分頁資料
      this.pageSizeChanging = false; // pageSize改變完畢
      this.pageSizeChange.emit();
    }, 0);
  }

  /**
   * 當前頁碼改變
   *
   * @param  pageIndex 當前頁碼
   * @memberof DwCustomTableDisplayComponent
   */
  public onPageIndexChange(): void {
    if (this.pageSizeChanging) { // pageSize改變中 return
      return;
    }
    this.pageIndexChange.emit();
    this.searchData(false);
  }

  public modify(orderId: string): void {
    const navigationExtras: NavigationExtras = {
      relativeTo: this._route, // 相對路徑導頁
      queryParams: { 'orderId': orderId }
    };

    this.router.navigate(['../dw-custom-table-display-modify'], navigationExtras);
  }

  onInit(): void {
    this.searchForm = this.fb.group({});
    this.searchForm.addControl('orderId', new FormControl(this.search.fields.orderId));
    this.searchForm.addControl('status', new FormControl(this.search.fields.status));
    this.searchForm.addControl('total', new FormControl(this.search.fields.total));
    this.searchForm.addControl('customerName', new FormControl(this.search.fields.customerName));
    this.searchForm.addControl('salesmanName', new FormControl(this.search.fields.salesmanName));
    this.searchForm.addControl('gender', new FormControl(this.search.fields.gender));

    DwCustomTableDisplayStatusModel.getList().subscribe(
      (result) => {
        this.searchStatusOptions = result;
      }
    ); // 狀態碼列舉初始化

    // 篩選業務員性別列舉初始化
    DwCustomTableDisplayGenderModel.getList().subscribe(
      (list: DwCustomTableDisplayGenderModel[]) => this.genders = list
    );

    // 初始化客戶開窗
    this.customerModalOptions = {
      title: '選擇客戶',
      content: CustomerListComponent,
      onOk: (result: any): void => {
        this.searchForm.patchValue({ customerName: result });
      },
      footer: false
    };

    // 初始化業務員開窗
    this.salesModalOptions = {
      title: '選擇業務員',
      content: EmployeeListComponent,
      onOk: (result: any): void => {
        console.log(result);
        this.searchForm.patchValue({ salesmanName: result });
      },
      footer: false
    };

    this.searchForm.get('gender').valueChanges.subscribe((selectedGenders) => {
      DwCustomTableDisplayGenderModel.resetList(this.genders);
      DwCustomTableDisplayGenderModel.setChecked(this.genders, selectedGenders);
    });

    this.init.emit();

    // // 是否已存在查詢條件
    // if (this.search.pageIndex) {

    //   const genderLen = this.search.fields.gender.length;
    //   if (genderLen > 0) {
    //     this.genders.forEach(item => {
    //       item.checked = false;
    //       for (let i = 0; i < genderLen; i++) {
    //         if (item.value === this.search.fields.gender[i]) {
    //           item.checked = true;
    //         }
    //       }
    //     });
    //   }

    //   this.searchData(false); // 查詢資料
    // } else {
    //   this.searchData(true); // 查詢資料
    // }

    // 每一次欄位狀態改變時,都會被觀察到
    this.table.dwTableConfigService.columnConfigSubject$.subscribe((config: IDwColumnConfig) => {
      this.tableConfig = config.tableConfig;
      // 當沒有用戶的配置而且又拿不到租戶的配置時, 資料會重撈, 並回到第1 頁
      if (!this.tableConfig.hasOwnProperty('dwColumnConfig') || this.tableConfig.dwColumnConfig.length === 0) {
        this.searchData(true);
        return;
      }
      // 當觸發tableConfig 改變的事件為[欄位的寬度改變]或[欄位的隱藏或顯示改變]時,
      // 不需要排序與重撈資料
      if (config.event === 'widthChange' || config.event === 'visibleChange') {
        return;
      }
      this.sortBy(); // 排序
      this.searchData(false);
    });
  }


  onBeforeSearch(): void {
    this.searchLoading = true;
    this.beforeSearch.emit();
  }


  onAfterSearch(): void {
    this.searchLoading = false;
    this.afterSearch.emit();
  }

  afterViewInit(): void {
    // performance.measure('DwCustomTableDisplayListComponent create ~ after view init');

  }


  afterContentInit(): void {

  }

  onDestroy(): void { }

  /**
   * 功能權限應用函式
   *
   * @description 在此可以加上應用邏輯，再回傳功能權限最終結果restrictionResult
   * @template [dwActionAuthorizedCallback]="actionAuthorizedCallback"
   * @param restriction 功能權限：allow 允許, hidden 隱藏, disabled 禁用
   * @param authorizedId 作業權限ID
   * @param actionId 功能按鈕ID
   * @returns restrictionResult 功能權限最終結果
   */
  public actionAuthorizedCallback = (restriction: string, authorizedId: string, actionId: string): Observable<string> => {
    return new Observable(
      (observe: any) => {
        let restrictionResult = restriction;

        if (restrictionResult !== 'allow') {
          // restrictionResult = 'disabled';
          restrictionResult = restriction;
          observe.next(restrictionResult);
          observe.complete();
        } else {
          observe.next(restrictionResult);
          observe.complete();
        }
      }
    );
  }
}
