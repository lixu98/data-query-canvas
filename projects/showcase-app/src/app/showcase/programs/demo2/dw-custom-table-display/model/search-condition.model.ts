import { Injectable } from '@angular/core';
import { IDemo2OrderSearchField, IDemo2OrderSortSet } from '../../repository';


/**
 * 查詢條件
 *
 * @class DwCustomTableDisplaySearchConditionModel
 */

@Injectable()
export class DwCustomTableDisplaySearchConditionModel {
  private _pageIndex: number;
  private _pageSize: number;
  private _fields: IDemo2OrderSearchField;
  private _sortSet: IDemo2OrderSortSet[];

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

  set fields(param: IDemo2OrderSearchField) {
    this._fields = param;
  }

  get fields(): IDemo2OrderSearchField {
    return this._fields;
  }

  set sortSet(sort: IDemo2OrderSortSet[]) {
    this._sortSet = sort;
  }

  get sortSet(): IDemo2OrderSortSet[] {
    return this._sortSet;
  }

  _initFields(): IDemo2OrderSearchField {
    return <IDemo2OrderSearchField>{
      orderId: '',
      status: [],
      total: '',
      customerName: '',
      salesmanName: '',
      gender: []
    };
  }

  public clear(): IDemo2OrderSearchField {
    return this._initFields();
  }

  public clearSortSet(): void {
    this._sortSet = [];
  }

  public addSortSet(sortSet: IDemo2OrderSortSet): void {
    this._sortSet.push(sortSet);
  }
}
