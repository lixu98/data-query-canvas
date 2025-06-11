import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { SbepQueryWinComponent } from '../sbep-query-win/sbep-query-win.component';
import { sbepQueryModalDefault } from '../default';

@Injectable()
export class SbepQueryModalService {
  private _defaultDefs: any; // 共用的開窗設定檔.
  private _modal: Subject<any>;
  private _modalConfig: any = {}; // 共用+作業的開窗設定檔.
  private _gridDefs: any; // 共用+作業的Table設定檔.

  constructor(
    private modalService: NzModalService,
    private translateService: TranslateService
  ) {
    // 為了進行產生新的物件, 只用在單純只有資料的物件.
    this._defaultDefs = JSON.parse(JSON.stringify(sbepQueryModalDefault));
  }

  private _getModalConfig(config: any): any {
    const modalConfig = {};
    if (config.title) {
      modalConfig['nzTitle'] = config.title;
    }
    if (config.width) {
      modalConfig['nzWidth'] = config.width;
    }
    if (config.okText) {
      modalConfig['nzOkText'] = config.okText;
    }
    if (config.cancelText) {
      modalConfig['nzCancelText'] = config.cancelText;
    }

    return modalConfig;
  }

  private _getGridDefs(config: any): any {
    const gridDefs = {};

    if (config.multiSelect !== undefined && typeof config.multiSelect === 'boolean') {
      gridDefs['multiSelect'] = config.multiSelect;
    }
    return gridDefs;
  }

  private _analyzeConfig(config: any): void {
    // 把未設定值的 key 清除.
    for (const key of Object.keys(config)) {
      if (typeof config[key] === 'undefined' || (config[key] !== false && !config[key])) {
        delete config[key];
      }
    }

    // 允許作業的 tableDefs override defaultDefs.
    const _allConfig = {...this._defaultDefs, ...config};

    // 開窗 modal 的參數.
    this._modalConfig = this._getModalConfig(_allConfig);

    // 開窗 grid 的作業用設定參數.
    this._gridDefs = this._getGridDefs(_allConfig);
  }

  private _registerEvent(): void {
    this._modalConfig.nzOnOk = (result: any): void => {
      const selectedValue = result.getSelectedValue();
      this._modal.next(selectedValue);
      this._modal.complete();
    };

    this._modalConfig.nzOnCancel = (result: any): void => {
      this._modal.complete();
    };

  }

  private _modalCreate(dataSource: any, selected: Array<any>): NzModalRef {
    // 建立的開窗，都會返回一個 NzModalRef 物件.
    let modalRef: NzModalRef = null;

    // 最終開窗的設定檔.
    const modalConfig: any = {
      nzContent: SbepQueryWinComponent,
      nzFooter: [
        {
          label: this.translateService.instant('dw-cancel'),
          shape: 'default',
          onClick(): void {
            modalRef.triggerCancel();
          }
        },
        {
          label: this.translateService.instant('dw-determine'),
          type: 'primary',
          onClick(): void {
            modalRef.triggerOk();
          }
        }
      ],
      nzComponentParams: {
        gridDefs: this._gridDefs,
        selected: selected,           // 已選取的清單.
        dataSource: dataSource        // 資料源(後端服務).
      },
      ...this._modalConfig
    };

    modalRef = this.modalService.create(modalConfig);

    return modalRef;
  }

  public open(config: any, selected: Array<any>): Observable<any> {
    this._modal = new Subject();

    // 分析設定檔.
    this._analyzeConfig(config);

    // 設定觸發事件.
    this._registerEvent();

    const dwModalRef: NzModalRef = this._modalCreate(config.dataSource, selected);

    return this._modal.asObservable();
  }
}
