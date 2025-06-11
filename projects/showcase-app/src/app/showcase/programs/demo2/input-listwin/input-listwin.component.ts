import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { Subscription } from 'rxjs';

import { NzMessageService } from 'ng-zorro-antd/message';

import { DemoOrderServerPagingService } from '../../../shared/select-modal/demo-order/demo-order-server-paging.service';
import { EnumClientPagingService } from '../../../shared/select-modal/enum/enum-client-paging.service';
import { MockDataClientPagingService } from '../../../shared/select-modal/mock-data/mock-data-client-paging.service';
import { SpecifyMockClientPagingService } from '../../../shared/select-modal/specify-mock/specify-mock-client-paging.service';
import {
  SpecifyOrderErrorServerPagingService
} from '../../../shared/select-modal/specify-order-error/specify-order-error-server-paging.service';
import { SpecifyOrderServerPagingService } from '../../../shared/select-modal/specify-order/specify-order-server-paging.service';
import { TableMockClientPagingService } from '../../../shared/select-modal/table-mock/table-mock-client-paging.service';


@Component({
  selector: 'app-input-listwin',
  templateUrl: './input-listwin.component.html',
  styleUrls: ['./input-listwin.component.css']
})
export class InputListwinComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  demoOrder                 = [];   // 後端分頁(多選) - 固定條件(DwQueryCondition)
  mockData                  = [];   // 前端分頁(單選)
  enumData                  = [];   // 前端分頁(多選) - 枚舉
  specifyOrder              = [];   // 後端分頁(多選) - 設定回傳欄位 - 自定義 Tag 格式 - ng-template - 固定條件(DwQueryConditionInfo)
  specifyMock               = [];   // 前端分頁(單選) - 設定回傳欄位
  specifyOrderFn            = [];   // 後端分頁(多選) - 設定回傳欄位 - 自定義 Tag 格式 - function - 固定條件(DwQueryConditionInfo)
  specifyOrderErr           = [];   // 後端分頁(多選) - 開窗的錯誤(結果-因為錯誤不會有結果, 為了在 html 裡綁定用)
  specifyOrderErrMsg: any   = null; // 後端分頁(多選) - 開窗的錯誤(錯誤訊息)
  tableMock                 = [];   // 前端分頁(多選) - Table固定表頭

  @ViewChild('tagTemplate', { static: true }) tagTemplate: TemplateRef<any>; // 自定義 Tag 格式(ng-template)
  @ViewChild('selectedCountTemplate') selectedCountTemplate: TemplateRef<any>; // 自定義 選中筆數 格式(ng-template)

  constructor(
    private demoOrderServerPagingService: DemoOrderServerPagingService,
    private mockDataClientPagingService: MockDataClientPagingService,
    private enumClientPagingService: EnumClientPagingService,
    private specifyOrderService: SpecifyOrderServerPagingService,
    private specifyMockService: SpecifyMockClientPagingService,
    private specifyOrderErrorServer: SpecifyOrderErrorServerPagingService,
    private tableMockService: TableMockClientPagingService,
    private dwMessage: NzMessageService
  ) {
  }


  /**
   * 多選
   * [後端分頁(多選) - 固定條件(DwQueryCondition)]
   *
   */
  openDemoOrderWin(event: MouseEvent): void {
    event.preventDefault();
    this.subscription.add(
      this.demoOrderServerPagingService.open(this.demoOrder).subscribe(
        (result) => {
          this.demoOrder = result;
        },
        (error: HttpErrorResponse) => {
          this.dwMessage.error(error.message);
        }
      )
    );
  }


  /**
   * 單選
   * [前端分頁(單選)]
   *
   */
  openMockDataWin(event: MouseEvent): void {
    event.preventDefault();

    this.subscription.add(
      this.mockDataClientPagingService.open(this.mockData).subscribe(
        (result) => {
          this.mockData = result;
        },
        (error: HttpErrorResponse) => {
          this.dwMessage.error(error.message);
        }
      )
    );
  }


  /**
   * 多選
   * [前端分頁(多選) - 枚舉]
   *
   */
  openEnumDataWin(event: MouseEvent): void {
    event.preventDefault();

    this.subscription.add(
      this.enumClientPagingService.open(this.enumData).subscribe(
        (result) => {
          this.enumData = result;
        },
        (error: HttpErrorResponse) => {
          this.dwMessage.error(error.message);
        }
      )
    );
  }


  /**
   * 多選
   * [後端分頁(多選) - 設定回傳欄位 - 自定義 Tag 格式(ng-template) - 固定條件(DwQueryConditionInfo)]
   *
   */
  openSpecifyOrderWin(event: MouseEvent): void {
    const _config = {
      tableTagColor: 'purple', // Tag標籤顏色.
    };

    event.preventDefault();
    this.subscription.add(
      this.specifyOrderService.open(this.specifyOrder, _config, this.tagTemplate, this.selectedCountTemplate).subscribe(
        (result) => {
          this.specifyOrder = result;
        },
        (error: HttpErrorResponse) => {
          this.dwMessage.error(error.message);
        }
      )
    );
  }


  /**
   * 單選
   * [前端分頁(單選) - 設定回傳欄位]
   *
   */
  openSpecifyMockWin(event: MouseEvent): void {
    event.preventDefault();

    this.subscription.add(
      this.specifyMockService.open(this.specifyMock).subscribe(
        (result) => {
          this.specifyMock = result;
        },
        (error: HttpErrorResponse) => {
          this.dwMessage.error(error.message);
        }
      )
    );
  }


  /**
   * 多選
   * [後端分頁(多選) - 設定回傳欄位 - 自定義 Tag 格式(function) - 固定條件(DwQueryConditionInfo)]
   *
   */
  openSpecifyOrderWinFn(event: MouseEvent): void {
    event.preventDefault();
    this.subscription.add(
      this.specifyOrderService.open(this.specifyOrderFn).subscribe(
        (result) => {
          this.specifyOrderFn = result;
        },
        (error: HttpErrorResponse) => {
          this.dwMessage.error(error.message);
        }
      )
    );
  }


  /**
   * 多選
   * [後端分頁(多選) - 開窗的錯誤]
   *
   */
  openSpecifyOrderWinError(event: MouseEvent): void {
    event.preventDefault();
    this.specifyOrderErrMsg = null;
    this.subscription.add(
      this.specifyOrderErrorServer.open(this.specifyOrderErr).subscribe(
        (result) => {
          this.specifyOrderErr = result;
        },
        (error: HttpErrorResponse) => {
          this.specifyOrderErrMsg = error;
        }
      )
    );
  }


  /**
   * 多選
   * [前端分頁(多選) - Table固定表頭]
   *
   */
  openTableMockWin(event: MouseEvent): void {
    event.preventDefault();

    this.subscription.add(
      this.tableMockService.open(this.tableMock).subscribe(
        (result) => {
          this.tableMock = result;
        },
        (error: HttpErrorResponse) => {
          this.dwMessage.error(error.message);
        }
      )
    );
  }


  ngOnInit(): void {
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
