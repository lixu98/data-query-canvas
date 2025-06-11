import { Injectable } from '@angular/core';
import { IExtraFieldsOrderSearchField, IExtraFieldsOrderSortSet } from '../../repository';


/**
 * 查詢條件
 *
 * @class DocumentOrderSearchConditionModel
 */

@Injectable()
export class DocumentOrderSearchConditionModel {
  private _pageIndex: number;
  private _pageSize: number;
  private _fields: IExtraFieldsOrderSearchField;
  private _sortSet: IExtraFieldsOrderSortSet[];

  constructor() {
    this._pageIndex = 1;
    this._pageSize = 10;
    this._fields = this._initFields();
    this._sortSet = [];
  }

  set pageIndex(idx: number) {
    this._pageIndex = idx;
  }

  get pageIndex(): number {
    return this._pageIndex;
  }

  set pageSize(size: number) {
    this._pageSize = size;
  }

  get pageSize(): number {
    return this._pageSize;
  }

  set fields(param: IExtraFieldsOrderSearchField) {
    this._fields = param;
  }

  get fields(): IExtraFieldsOrderSearchField {
    return this._fields;
  }

  set sortSet(sort: IExtraFieldsOrderSortSet[]) {
    this._sortSet = sort;
  }

  get sortSet(): IExtraFieldsOrderSortSet[] {
    return this._sortSet;
  }

  _initFields(): IExtraFieldsOrderSearchField {
    return <IExtraFieldsOrderSearchField>{
      orderId: '',
      status: [],
      total: '',
      customerName: '',
      salesmanName: '',
      gender: []
    };
  }

  public clear(): IExtraFieldsOrderSearchField {
    return this._initFields();
  }

  public clearSortSet(): void {
    this._sortSet = [];
  }

  public addSortSet(sortSet: IExtraFieldsOrderSortSet): void {
    this._sortSet.push(sortSet);
  }
}
