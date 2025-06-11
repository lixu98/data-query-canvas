import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

import { DwRoutingMessageService } from '@webdpt/components/routing-message'; // 訊息傳遞
import { APP_DATE_FORMAT, DW_USING_TAB } from '@webdpt/framework/config'; // 訊息傳遞
import { DwDataTable, DwDocument, IDwDocumentOnRead } from '@webdpt/framework/document'; // 訊息傳遞
import { DwTabRoutingService } from '@webdpt/framework/routing-tabset';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DocumentOrderEnumModel } from '../model';


@Component({
  selector: 'app-dw-document-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css'],
  providers: [DwDocument]
})
export class DocumentOrderDetailComponent implements OnInit, OnDestroy, IDwDocumentOnRead {

  public orderid: string = ''; // 訂單編號
  public searchLoading: boolean; // 是否顯示加載中
  public statusList = DocumentOrderEnumModel.orderStatus; // 訂單狀態枚舉
  public master: DwDataTable; // 單頭
  public detail: DwDataTable; // 單身
  private tabInfoSubscription: Subscription;
  private parametersChanged = true;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    protected _route: ActivatedRoute,
    public dwMessage: DwRoutingMessageService,
    public doc: DwDocument,
    @Inject(APP_DATE_FORMAT) public dwDateFormat: string,
    @Inject(DW_USING_TAB) private usingTab: boolean,
    private dwTabRoutingService: DwTabRoutingService,
    private dwModalService: NzModalService
  ) {
    doc.registerEvent(this);
    this.master = new DwDataTable([]);
    this.detail = new DwDataTable([]);

    // 取得路由參數
    this.route.queryParamMap.subscribe(
      params => {
        this.orderid = params.get('orderId') || '';
        this.initData();
        this.parametersChanged = true;
        this.subscribeTabRouterChange();
      }
    );


  }
  initData(): void {
    this.onBeforeGetOrder();
    // this.doc.clearTables();
    this.doc.read({ orderid: this.orderid }).subscribe(response => {
      this.master = response.demo_order;
      this.detail = response.demo_orderdetail;

      this.onAfterGetOrder();
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
   * 多頁籤的狀況下，同頁籤內的路由要重新載入資料的情況如下：
   * 同頁籤同參數時，由tabRouterChanged負責載入資料；
   * 同頁籤不同參數時，由queryParamMap負責載入資料。
   */
  private subscribeTabRouterChange(): void {
    if (!this.tabInfoSubscription) {
      this.tabInfoSubscription = new Subscription();

      if (this.usingTab) {
        this.tabInfoSubscription.add(this.dwTabRoutingService.tabRouterChanged.pipe(
          filter(info => info !== null)
        ).subscribe(
          info => {
            if (!info.tabChanged && this instanceof info.componentType) {
              if (!this.parametersChanged) {
                this.initData();
              }
              this.parametersChanged = false;
            }

          }
        ));
      }
    }
  }
  ngOnDestroy(): void {
    if (this.tabInfoSubscription) {
      this.tabInfoSubscription.unsubscribe();
    }
  }
  ngOnInit(): void {


    // 透過Http
  }

  reading(): boolean {
    return true;
  }

  readed(): void {
  }

  public modify(): void {
    const navigationExtras: NavigationExtras = {
      relativeTo: this._route, // 相對路徑導頁
      queryParams: { 'orderId': this.orderid }
    };

    this.router.navigate(['../dw-document-order-modify'], navigationExtras);
  }

  public list(): void {
    this.router.navigate(['../'], { relativeTo: this._route }); // 相對路徑導頁

  }

  onBeforeGetOrder(): void {
    this.searchLoading = true; // 是否顯示加載中
  }

  onAfterGetOrder(): void {
    this.searchLoading = false; // 是否顯示加載中
  }
}
