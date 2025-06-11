import { Component, forwardRef, Inject, Optional, SkipSelf, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable, Subscription } from 'rxjs';

import { DwComponent } from '@webdpt/components/redevelop';
import { DwRoutingMessageService } from '@webdpt/components/routing-message';
import { DW_USING_TAB } from '@webdpt/framework/config';
import { DwTabRoutingService } from '@webdpt/framework/routing-tabset';
import { filter } from 'rxjs/operators'; // 訊息傳遞
import { DwCustomTableDisplayStatusModel } from '../model';
import { DwCustomTableDisplayService } from '../service/dw-custom-table-display.service';
import {
  DwCustomTableDisplayDetailEditComponent
} from './../dw-custom-table-display-detail-edit/dw-custom-table-display-detail-edit.component';
import { DwCustomTableDisplayMasterModel, DwCustomTableDisplayProductInfo } from './../model';

@Component({
  selector: 'app-dw-custom-table-display-modify',
  templateUrl: './dw-custom-table-display-modify.component.html',
  styleUrls: ['./dw-custom-table-display-modify.component.css', '../dw-custom-table-display.component.css'],
  providers: [
    {
      provide: DwComponent, useExisting: forwardRef(() => DwCustomTableDisplayModifyComponent)
    }
  ]
})
export class DwCustomTableDisplayModifyComponent extends DwComponent {
  public orderId: string;
  public master: DwCustomTableDisplayMasterModel = new DwCustomTableDisplayMasterModel({});

  // 是否顯示加載中
  public searchLoading: boolean;
  public validateForm: FormGroup;
  // 狀態碼列舉
  public searchStatusOptions: Observable<DwCustomTableDisplayStatusModel[]>;

  // 訂單明細開窗用，僅為了展示開窗標題可以使用template
  @ViewChild('modifyDetailTitle', { static: true }) modifyTitle: TemplateRef<any>;
  @ViewChild('addDetailTitle', { static: true }) addDetailTitle: TemplateRef<any>;
  private tabInfoSubscription: Subscription = new Subscription();
  private isDataLoaded = true;

  constructor(
    @SkipSelf() @Optional() _parentDwComponent: DwComponent,
    public route: ActivatedRoute,
    public router: Router,
    public fb: FormBuilder,
    public dwModalService: NzModalService,
    public customTableDisplayService: DwCustomTableDisplayService,
    public dwMessage: DwRoutingMessageService,
    @Inject(DW_USING_TAB) private usingTab: boolean,
    private dwTabRoutingService: DwTabRoutingService
  ) {
    super(_parentDwComponent);
  }

  afterContentInit(): void {
  }

  afterViewInit(): void {
  }

  onInit(): void {
    // 透過Http
    this.searchStatusOptions = DwCustomTableDisplayStatusModel.getList(); // 狀態碼列舉初始化

    // 單頭Form欄位
    this.validateForm = this.fb.group({
      'masterDwCustomTableDisplayId': [{ value: this.master.orderId, disabled: true }, [Validators.required]],
      'masterStatus': [this.master.status, [Validators.required]],
      'masterDwCustomTableDisplayDate': [this.master.orderDate, [Validators.required]],
      'masterCustomerId': [this.master.customerId, [Validators.required]],
      'masterSalesmanId': [this.master.salesmanId],
      'masterDwCustomTableDisplayAddr': [this.master.orderAddr],
      'formDetail': new FormArray([])
    });

    // 取得路由參數
    this.route.queryParamMap.subscribe(
      params => {
        this.orderId = params.get('orderId') || '';
        this.onBeforeGetDwCustomTableDisplay();
        this.initDetail();
        this.isDataLoaded = true;
      }
    );

    this.subscribeTabRouterChange();
  }

  /**
   * 多頁籤的狀況下，同頁籤內的路由要重新載入資料的情況如下：
   * 同頁籤同參數時，由tabRouterChanged負責載入資料；
   * 同頁籤不同參數時，由queryParamMap負責載入資料。
   */
  private subscribeTabRouterChange(): void {
    // 僅在多頁籤的情況下才需訂閱tabRouterChanged
    if (this.usingTab) {
      this.tabInfoSubscription.add(
        this.dwTabRoutingService.tabRouterChanged.pipe(
          filter(info => {
            // 條件：前一頁等於當前頁，且是此組件
            return info !== null && !info.tabChanged &&
              this instanceof info.componentType; // (this as any).constructor.name
          })
        ).subscribe(
          info => {
            if (!this.isDataLoaded) {
              // 刷新數據
              this.initDetail();
            }
            this.isDataLoaded = false;
          }
        )
      );
    }
  }

  /**
   * 依參數來初始化表單
   */
  private initDetail(): void {

    this.customTableDisplayService.getDwCustomTableDisplayDetail(this.orderId).subscribe(
      (data: any) => {
        this.master = new DwCustomTableDisplayMasterModel(data.master);
        this.master.orderDate = new Date(this.master.orderDate);
        this.validateForm.reset({
          masterDwCustomTableDisplayId: this.master.orderId,
          masterStatus: this.master.status,
          masterDwCustomTableDisplayDate: this.master.orderDate,
          masterCustomerId: this.master.customerId,
          masterSalesmanId: this.master.salesmanId,
          masterDwCustomTableDisplayAddr: this.master.orderAddr,
          formDetail: new FormArray([])
        });
        this.fieldControlInit(this.formDetail, data.detail);
        this.onAfterGetDwCustomTableDisplay();
      }
    );
  }

  onDestroy(): void {
    if (this.tabInfoSubscription) {
      this.tabInfoSubscription.unsubscribe();
    }
  }

  /**
   * <dw-table> 的[dwData]，當Array變動要改物件的參考
   */
  private referTableData(): void {
    this.validateForm.setControl('formDetail', new FormArray([...this.formDetail.controls]));
  }

  /**
   * ngFor trackBy函式
   */
  public trackByFn(index: number, item: any): number {
    return index;
  }

  /**
   * 取得畫面單身
   */
  get formDetail(): FormArray {
    return this.validateForm.get('formDetail') as FormArray; // Access the FormArray control
  }

  get dwDateFormat(): string {
    return this.customTableDisplayService.getDateFormat();
  }

  /**
   * 取得FormControl
   *
   * @param  name
   * @returns
   * @memberof DwCustomTableDisplayModifyComponent
   */
  public getFormControl(name: string): any {
    return this.validateForm.controls[name];
  }

  /**
   * 取得單身欄位值
   * @param idx
   * @param key
   * @returns form detail value
   */
  public getFormDetailValue(idx: number, key: string): any {
    const fGroup = this.formDetail.at(idx);
    return fGroup.get(key).value;
  }

  /**
   * 刪除訂單明細
   *
   * @param  idx
   * @memberof DwCustomTableDisplayModifyComponent
   */
  public detailDelete(idx: number): void {
    this.formDetail.removeAt(idx);
    this.totalSum(this.formDetail);
    this.referTableData();
  }

  /**
   * 修改訂單明細
   *
   * @param  idx
   * @memberof DwCustomTableDisplayModifyComponent
   */
  public detailModify(idx: number): void {
    const productInfo = {
      productCode: this.formDetail.controls[idx].get('productCode').value,
      productName: this.formDetail.controls[idx].get('productName').value,
      price: this.formDetail.controls[idx].get('price').value,
      quantity: this.formDetail.controls[idx].get('quantity').value
    };

    const modifyFn = (): void => {
      this.formDetail.controls[idx].get('productCode').setValue(productInfo.productCode);
      this.formDetail.controls[idx].get('productName').setValue(productInfo.productName);
      this.formDetail.controls[idx].get('price').setValue(productInfo.price);
      this.formDetail.controls[idx].get('quantity').setValue(productInfo.quantity);
      this.totalSum(this.formDetail);
    };

    this.dwModalService.create({
      nzTitle: this.modifyTitle,
      nzContent: DwCustomTableDisplayDetailEditComponent,
      nzOnOk: (data: any): void => {
        productInfo.productCode = data.detailEditForm.get('productCode').value;
        productInfo.productName = data.detailEditForm.get('productName').value;
        productInfo.price = data.detailEditForm.get('price').value;
        productInfo.quantity = data.detailEditForm.get('quantity').value;

        modifyFn();
      },
      nzOnCancel(): void {
      },
      nzFooter: null,
      nzComponentParams: {
        cmd: 'modify',
        orderDetail: productInfo
      }
    });
  }

  /**
   * 單身Form欄位校驗控制初始化
   * @param validateFormDetail
   * @param list
   */
  public fieldControlInit(validateFormDetail: FormArray, list: DwCustomTableDisplayProductInfo[]): void {
    validateFormDetail.clear();

    const len = list.length;
    for (let i = 0; i < len; i++) {
      this.addFieldControlRow(validateFormDetail, list[i]);
    }

    this.referTableData();
  }

  /**
   * 單身加入一筆資料的Form欄位校驗控制
   * @param validateFormDetail
   * @param listRow
   */
  public addFieldControlRow(validateFormDetail: FormArray, listRow: DwCustomTableDisplayProductInfo): void {
    const fGroup = new FormGroup({
      'productCode': new FormControl(listRow.productCode, Validators.required),
      'quantity': new FormControl(listRow.quantity, Validators.required),
      'seq': new FormControl(listRow.seq),
      'distributionStatus': new FormControl(listRow.distributionStatus),
      'distributionStatusDesc': new FormControl(listRow.distributionStatusDesc),
      'productName': new FormControl(listRow.productName),
      'price': new FormControl(listRow.price),
      'subtotal': new FormControl(listRow.subtotal)
    });

    validateFormDetail.push(fGroup);

    fGroup.get('quantity').valueChanges.subscribe(
      quantity => {
        fGroup.get('subtotal').setValue(
          this.subtotal(fGroup.get('price').value, quantity)
        );
        this.totalSum(validateFormDetail);
      }
    );
  }

  /**
   * 小計
   * @param price
   * @param quantity
   * @returns subtotal
   */
  private subtotal(price: number, quantity: number): number {
    return price * quantity;
  }

  /**
   * 訂單總額
   * @param validateFormDetail
   */
  public totalSum(validateFormDetail: FormArray): void {
    let total = 0;

    validateFormDetail.controls.forEach(
      fGroup => {
        total += fGroup.get('subtotal').value;
      }
    );

    this.master.total = total;
  }

  /**
   * 新增訂單明細
   *
   * @memberof DwCustomTableDisplayModifyComponent
   */
  public detailAdd(): void {
    const newProductInfo = {
      productCode: '',
      productName: '',
      price: 0,
      quantity: 0
    };

    const addDetailFn = (): void => {
      this.addDetail(newProductInfo);
    };

    this.dwModalService.create({
      nzTitle: this.addDetailTitle,
      nzContent: DwCustomTableDisplayDetailEditComponent,
      nzOnOk: (data: any): void => {
        newProductInfo.productCode = data.detailEditForm.get('productCode').value;
        newProductInfo.productName = data.detailEditForm.get('productName').value;
        newProductInfo.price = data.detailEditForm.get('price').value;
        newProductInfo.quantity = data.detailEditForm.get('quantity').value;
        addDetailFn();
      },
      nzOnCancel(): void {
      },
      nzFooter: null,
      nzComponentParams: { cmd: 'add' }
    });

  }

  /**
   * 取消
   *
   * @memberof DwCustomTableDisplayModifyComponent
   */
  public cancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route }); // 相對路徑導頁
  }

  /**
   * 取得訂單前
   */
  onBeforeGetDwCustomTableDisplay(): void {
    this.searchLoading = true; // 是否顯示加載中
  }

  onAfterGetDwCustomTableDisplay(): void {
    this.searchLoading = false; // 是否顯示加載中
  }

  /**
   * 保存前
   */
  onBeforeSaveDwCustomTableDisplay(): void {
    // 取畫面欄位值
    this.master.orderId = this.validateForm.get('masterDwCustomTableDisplayId').value;
    this.master.status = this.validateForm.get('masterStatus').value;
    this.master.orderDate = this.validateForm.get('masterDwCustomTableDisplayDate').value;
    this.master.customerId = this.validateForm.get('masterCustomerId').value;
    this.master.salesmanId = this.validateForm.get('masterSalesmanId').value;
    this.master.orderAddr = this.validateForm.get('masterDwCustomTableDisplayAddr').value;
  }

  /**
   * 保存後
   */
  onAfterSaveDwCustomTableDisplay(result: any): void {
    const msg = result.description;
    if (result.status) {
      if (msg) {
        this.dwMessage.addToRoute(msg);
      }
      this.router.navigate(['../'], { relativeTo: this.route }); // 相對路徑導頁
    } else {
      if (msg) {
        this.dwMessage.success(msg); // 單一訊息顯示
      }
    }
  }

  /**
   * 新增訂單明細
   */
  private addDetail(detail: any): void {
    const newDetail = new DwCustomTableDisplayProductInfo({});
    newDetail.seq = this.customTableDisplayService.orderDetailMaxSeq(this.formDetail) + 1;
    newDetail.productCode = detail.productCode;
    newDetail.productName = detail.productName;
    newDetail.price = detail.price;
    newDetail.quantity = detail.quantity;
    newDetail.subtotal = this.subtotal(newDetail.price, newDetail.quantity);
    this.addFieldControlRow(this.formDetail, newDetail);
    this.referTableData();
    this.totalSum(this.formDetail);
  }

  /**
   * 保存
   */
  public save(): void {
    this.onBeforeSaveDwCustomTableDisplay();

    // 取單頭畫面欄位
    this.master.orderId = this.validateForm.get('masterDwCustomTableDisplayId').value;
    this.master.status = this.validateForm.get('masterStatus').value;
    this.master.orderDate = this.validateForm.get('masterDwCustomTableDisplayDate').value;
    this.master.customerId = this.validateForm.get('masterCustomerId').value;
    this.master.salesmanId = this.validateForm.get('masterSalesmanId').value;
    this.master.orderAddr = this.validateForm.get('masterDwCustomTableDisplayAddr').value;

    // 取單身畫面欄位
    const detail = [];
    this.formDetail.controls.forEach(
      fGroup => {
        const item = {
          seq: fGroup.get('seq').value,
          productCode: fGroup.get('productCode').value,
          productName: fGroup.get('productName').value,
          distributionStatus: fGroup.get('distributionStatus').value,
          distributionStatusDesc: fGroup.get('distributionStatusDesc').value,
          price: fGroup.get('price').value,
          quantity: fGroup.get('quantity').value,
          subtotal: fGroup.get('subtotal').value
        };

        detail.push(item);
      }
    );

    this.customTableDisplayService.modifyDwCustomTableDisplay(this.master, detail).subscribe(
      (response: any) => {
        this.onAfterSaveDwCustomTableDisplay(response);
      }
    );
  }
}
