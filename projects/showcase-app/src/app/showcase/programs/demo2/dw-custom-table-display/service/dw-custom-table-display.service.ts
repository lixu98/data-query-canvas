import { Inject, Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';
import fnsFormat from 'date-fns/format';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
// 應用共享的模組Repository
import { APP_DATE_FORMAT } from '@webdpt/framework/config';
import {
  Demo2OrderRepository,
  IDemo2OrderSearchField, IDemo2OrderSortSet, IGetOrderDetailParam, IGetOrderListParam
} from '../../repository';
import {
  DwCustomTableDisplayDistributionDwCustomTableDisplayStatusModel,
  DwCustomTableDisplayGenderModel,
  DwCustomTableDisplayMasterModel,
  DwCustomTableDisplayProductInfo,
  DwCustomTableDisplaySearchConditionModel,
  DwCustomTableDisplayStatusModel
} from '../model';


@Injectable()
export class DwCustomTableDisplayService {

  constructor(
    private searchConditionModel: DwCustomTableDisplaySearchConditionModel,
    private demo2DwCustomTableDisplayRepository: Demo2OrderRepository,
    @Inject(APP_DATE_FORMAT) private dwDateFormat: string) {
  }

  getDateFormat(): string {
    return this.dwDateFormat;
  }

  /**
   * 查詢取訂單列表
   *
   * @param pageIndex
   * @param pageSize
   * @param searchParam
   * @param sortSet
   * @returns {Observable<any>}
   * @memberof DwCustomTableDisplayService
   */
  public getDwCustomTableDisplayList(
    pageIndex: number,
    pageSize: number,
    searchParam: IDemo2OrderSearchField,
    sortSet: IDemo2OrderSortSet[]
  ): Observable<any> {

    this.setDwCustomTableDisplaySearchConditionModel(pageIndex, pageSize, searchParam, sortSet);

    const paramObj: IGetOrderListParam = {
      pageSize: pageSize,
      currentPage: pageIndex,
      param: searchParam,
      sortSet: sortSet
    };

    // 訂單列表
    // switchMap 將每個源值投射成 Observable，該 Observable 會合併到輸出 Observable 中， 並且只發出最新投射的 Observable 中的值。
    const obsGetDwCustomTableDisplayList = this.demo2DwCustomTableDisplayRepository.getOrderList(paramObj).pipe(
      switchMap(
        orderList => {
          // 性別篩選列舉
          return DwCustomTableDisplayGenderModel.getList().pipe(
            map((enumGender: DwCustomTableDisplayGenderModel[]) => {
              const enumGenderLen = enumGender.length;
              if (orderList.hasOwnProperty('datas')) {
                // 業務員性別描述
                orderList.datas.forEach(obj => {
                  if (obj.hasOwnProperty('gender')) {
                    for (let i = 0; i < enumGenderLen; i++) {
                      if (enumGender[i].value === obj.gender) {
                        obj.genderDesc = enumGender[i].label;
                      }
                    }
                  }
                });
              }
              return orderList;
            }));
        }
      ),
      switchMap(
        orderListResp => {
          // 狀態碼
          return DwCustomTableDisplayStatusModel.getList().pipe(
            map((enumStatus: DwCustomTableDisplayStatusModel[]) => {
              const enumStatusLen = enumStatus.length;
              if (orderListResp.hasOwnProperty('datas')) {
                // 狀態描述
                orderListResp.datas.forEach(obj => {
                  if (obj.hasOwnProperty('status')) {
                    for (let i = 0; i < enumStatusLen; i++) {
                      if (enumStatus[i].value === obj.status) {
                        obj.statusDesc = enumStatus[i].label;
                      }
                    }
                  }
                });
              }
              return orderListResp;
            }));
        }
      )
    );

    return obsGetDwCustomTableDisplayList;
  }

  /**
   * 取得訂單詳情
   *
   * @param  orderId 訂單編號
   * @returns {Observable<any>}
   * @memberof DwCustomTableDisplayService
   */
  public getDwCustomTableDisplayDetail(orderId: string): Observable<any> {
    const paramObj: IGetOrderDetailParam = {
      orderId: orderId
    };

    const ObsDistributionStatus: Observable<any> = DwCustomTableDisplayDistributionDwCustomTableDisplayStatusModel.getList(); // 單身配送狀態碼列舉

    const ObsDwCustomTableDisplayDetail = ObsDistributionStatus.pipe(
      switchMap(
        statusList => {
          // 取訂單明細
          return this.demo2DwCustomTableDisplayRepository.getOrderDetail(paramObj).pipe(
            map((orderDetailValue: any) => {
              const detail = orderDetailValue.detail;

              if (detail.length > 0) {
              // 配送狀態碼描述
                detail.forEach(element => {
                  element.subtotal = element.price * element.quantity;

                  const descItem = statusList.filter(status => {
                    if (status.key === element.distributionStatus) {
                      return status;
                    }
                  });

                  if (descItem.length === 0) {
                    element.distributionStatusDesc = '';
                  } else {
                    element.distributionStatusDesc = descItem[0].lable;
                  }
                });
              }

              return orderDetailValue;
            }));
        }
      )
    );

    return ObsDwCustomTableDisplayDetail;
  }

  /**
   * 修改訂單
   *
   * @param master
   * @param detail
   * @param  dwDateFormat
   * @returns {Observable<any>}
   * @memberof DwCustomTableDisplayService
   */
  public modifyDwCustomTableDisplay(master: DwCustomTableDisplayMasterModel, detail: DwCustomTableDisplayProductInfo[]): Observable<any> {
    // 日期轉字串再傳給API
    const masterStr = {
      ...master,
      orderDate: (master.orderDate instanceof Date) ? fnsFormat(master.orderDate, this.dwDateFormat) : master.orderDate
    };

    const paramObj = {
      master: masterStr,
      detail: detail
    };

    return this.demo2DwCustomTableDisplayRepository.modifyOrder(paramObj).pipe(
      map(
        result => {
          return result;
        }
      )
    );
  }

  public orderDetailMaxSeq(validateFormDetail: FormArray): number {
    let maxSeq = 0;

    const getMax = (max: number, cur: number): number => Math.max(max, cur);

    maxSeq = validateFormDetail.controls.map(
      item => {
        return item.get('seq').value;
      }
    ).reduce(getMax, 0);

    return maxSeq;
  }

  /**
   * 設定查詢條件
   *
   * @private
   * @param pageIndex
   * @param pageSize
   * @param searchParam
   * @param sortSet
   * @memberof DwCustomTableDisplayService
   */
  private setDwCustomTableDisplaySearchConditionModel(
    pageIndex: number,
    pageSize: number,
    searchParam: IDemo2OrderSearchField,
    sortSet: IDemo2OrderSortSet[]
  ): void {
    this.searchConditionModel.pageIndex = pageIndex;
    this.searchConditionModel.pageSize = pageSize;
    this.searchConditionModel.fields = searchParam;
    this.searchConditionModel.sortSet = sortSet;
  }
}
