import { DatePipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

import { Subject } from 'rxjs';

import { NzModalService } from 'ng-zorro-antd/modal';

import { APP_DATE_FORMAT } from '@webdpt/framework/config';
import {
  DwDataRow, DwDocument, DwQueryCondition, DwQueryConditionInfo,
  DwQueryConditionOperator, DwQueryInfo
} from '@webdpt/framework/document';
import { ExtraFieldsDocumentOrderEnumModel } from '../model';


@Component({
  selector: 'app-dw-extra-fields-document-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
  providers: [DwDocument]
})
export class ExtraFieldsDocumentOrderListComponent implements OnInit, OnDestroy {

  // 進階查詢開合 true:關閉, false:打開
  public isCollapse = true;
  // 是否顯示查詢載入中
  public searchLoading = true;

  // 員工性別枚舉
  public genderList = ExtraFieldsDocumentOrderEnumModel.gender;

  // 訂單狀態枚舉
  public statusList = ExtraFieldsDocumentOrderEnumModel.orderStatus;
  public searchForm: FormGroup;
  public conditionField: { [key: string]: DwQueryConditionInfo } = {};

  // 查詢列表
  public rowCount = 0; // 總筆數
  public dataSet = []; // 查詢列表資料

  public queryInfo: DwQueryInfo = new DwQueryInfo();
  public pageSizeChanging: boolean = false;
  private destroy$: Subject<any> = new Subject();

  constructor (
    protected router: Router,
    protected _route: ActivatedRoute,
    protected fb: FormBuilder,
    public doc: DwDocument,
    private dwModalService: NzModalService,
    @Inject(APP_DATE_FORMAT) private dwDateFormat: string
  ) {

    this.searchForm = this.fb.group({});
    this.searchForm.addControl('orderid', new FormControl(''));
    this.searchForm.addControl('status', new FormControl([]));
    this.searchForm.addControl('totalcount', new FormControl(''));
    this.searchForm.addControl('customerid', new FormControl(''));
    this.searchForm.addControl('employeename', new FormControl(''));
    this.searchForm.addControl('gender', new FormControl([]));

    // this.searchData(true);
  }

  ngOnInit(): void {
    this.searchData(true);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * 查詢資料
   *
   * @param [reset=false] 是否重新指定當前頁碼為第一頁
   * @memberof ExtraFieldsDocumentOrderComponent
   */
  public searchData(reset: boolean = false): void {

    this.onBeforeSearch();

    if (reset) { // 是否重新指定當前頁碼為第一頁
      this.queryInfo.pageNumber = 1;
    }

    const searchCondition = new DwQueryCondition();

    for (const key of Object.keys(this.searchForm.controls)) {
      const ctrlValue = this.searchForm.get(key).value;
      // 自定義欄位
      if (key === 'cust_field') {
        Object.keys(ctrlValue).forEach(field => {
          if (ctrlValue[field] === '' || ctrlValue[field] === null || ctrlValue[field] === undefined) {
            return;
          }
          if (Array.isArray(ctrlValue[field]) && ctrlValue[field].length === 0) {
            return;
          }

          // 資料格式為[Array]
          if (Array.isArray(ctrlValue[field])) {
            searchCondition.addCondition(new DwQueryConditionInfo(
              `cust_field$.${field}`,
              ctrlValue[field],
              DwQueryConditionOperator.IN
            ));
            return;
          }

          // 資料格式為[日期]
          if (ctrlValue[field] instanceof Date) {
            const searchDate = (new DatePipe('zh_tw')).transform(ctrlValue[field], this.dwDateFormat);
            searchCondition.addCondition(new DwQueryConditionInfo(
              `cust_field$.${field}`,
              `%${searchDate}%`,
              DwQueryConditionOperator.LIKE
            ));
            return;
          }

          // 資料格式為[字串]
          searchCondition.addCondition(new DwQueryConditionInfo(
            `cust_field$.${field}`,
            `%${ctrlValue[field]}%`,
            DwQueryConditionOperator.LIKE
          ));
        });
        continue;
      }

      if (ctrlValue === '' || ctrlValue === undefined) {
        continue;
      }

      if (Array.isArray(ctrlValue) && ctrlValue.length === 0) {
        continue;
      }

      if (Array.isArray(ctrlValue)) {
        searchCondition.addCondition(new DwQueryConditionInfo(key, ctrlValue, DwQueryConditionOperator.IN));
      } else {
        searchCondition.addCondition(new DwQueryConditionInfo(key, ctrlValue, DwQueryConditionOperator.EQUAL));
      }
    }


    this.queryInfo.setCondition(searchCondition);

    this.doc.list(this.queryInfo.getRawValue()).subscribe(response => {
      this.rowCount = response.rowCount;
      this.dataSet = response.data.demo_order;
      this.onAfterSearch();
    },
    (error) => {
      if (error.hasOwnProperty('error') && error.error.hasOwnProperty('errorMessage') && error.error.errorMessage) {
        this.dwModalService.error({
          nzContent: error.error.errorMessage
        });
      }
    });

  }

  /**
   * 清除
   *
   * @memberof ExtraFieldsDocumentOrderComponent
   */
  public resetForm(): void {
    // 查詢條件欄位初始化
    this.searchForm.reset({
      orderid: '',
      status: [],
      totalcount: '',
      customerid: '',
      employeename: '',
      gender: []
    });
    this.queryInfo.clear();
  }

  /**
   * 每頁筆數改變
   *
   * @memberof ExtraFieldsDocumentOrderComponent
   */
  public onPageSizeChange(): void {
    this.pageSizeChanging = true; // pageSize改變中
    setTimeout(() => {
      this.searchData(true); //  讀取後端分頁資料
      this.pageSizeChanging = false; // pageSize改變完畢
    }, 0);
  }

  /**
   * 當前頁碼改變
   *
   * @param pageIndex 當前頁碼
   * @memberof ExtraFieldsDocumentOrderComponent
   */
  public onPageIndexChange(): void {
    if (this.pageSizeChanging) { // pageSize改變中 return
      return;
    }
    this.searchData(false);
  }

  public create(): void {
    const navigationExtras: NavigationExtras = {
      relativeTo: this._route // 相對路徑導頁
    };

    this.router.navigate(['../create'], navigationExtras);
  }

  public modify(orderId: string): void {
    const navigationExtras: NavigationExtras = {
      relativeTo: this._route, // 相對路徑導頁
      queryParams: { 'orderId': orderId }
    };

    this.router.navigate(['../modify'], navigationExtras);
  }

  public detail(orderId: string): void {
    const navigationExtras: NavigationExtras = {
      relativeTo: this._route, // 相對路徑導頁
      queryParams: { 'orderId': orderId }
    };

    this.router.navigate(['../detail'], navigationExtras);
  }

  public delete(index: number): void {
    const order = this.dataSet[index];
    const delRow = new DwDataRow(order);
    delRow.markAsDelete();

    this.doc.delete([delRow.getRawValue()]).subscribe(result => {
      console.log(result);
      // this.dataSet.splice(index, 1);

      // 刪除後, 應該要重取清單
      this.searchData(false);
    });
  }

  onBeforeSearch(): void {
    this.searchLoading = true;
  }

  onAfterSearch(): void {
    this.searchLoading = false;

    // 情境, 總筆數21筆, 20筆/1頁, 當在第2頁,刪除唯一的1筆時, 如果停留在第2頁會看不到資料, 手動發動回到第1頁
    if (this.rowCount > 0 && this.dataSet.length === 0) {
      this.searchData(true);
    }
  }

}
