import { Observable } from 'rxjs';

/**
 * 訂單狀態碼列舉
 *
 * @export
 * @class DwCustomTableDisplayStatusModel
 */
export class DwCustomTableDisplayStatusModel {
  private _value: string;
  private _text: string;

  constructor(value?: string, text?: string) {
    this._value = value;
    this._text = text;
  }

  get value(): string {
    return this._value ? this._value : 'Y';
  }

  get label(): string {
    return this._text ? this._text : '有效';
  }

  /**
   * 訂單狀態碼列舉
   *
   * @static
   * @returns {Observable<DwCustomTableDisplayStatusModel[]>}
   * @memberof DwCustomTableDisplayStatusModel
   */
  static getList(): Observable<DwCustomTableDisplayStatusModel[]> {
    return new Observable(observer => {
      const list = [
        new DwCustomTableDisplayStatusModel('Y', '有效'),
        new DwCustomTableDisplayStatusModel('N', '無效')
      ];
      observer.next(list);
      observer.complete();
    });
  }
}

/**
 * 單身配送狀態碼列舉
 *
 * @export
 * @class DwCustomTableDisplayDistributionDwCustomTableDisplayStatusModel
 */
export class DwCustomTableDisplayDistributionDwCustomTableDisplayStatusModel {
  private _key: string;
  private _lable: string;

  constructor(key: string, lable: string) {
    this._key = key;
    this._lable = lable;
  }

  get key(): string {
    return this._key ? this._key : '';
  }

  get lable(): string {
    return this._lable ? this._lable : '';
  }

  static getList(): Observable<DwCustomTableDisplayDistributionDwCustomTableDisplayStatusModel[]> {
    return new Observable(observer => {
      const list = [
        new DwCustomTableDisplayDistributionDwCustomTableDisplayStatusModel('1', '未出貨'),
        new DwCustomTableDisplayDistributionDwCustomTableDisplayStatusModel('2', '已出貨'),
        new DwCustomTableDisplayDistributionDwCustomTableDisplayStatusModel('3', '未退貨'),
        new DwCustomTableDisplayDistributionDwCustomTableDisplayStatusModel('4', '已退貨'),
        new DwCustomTableDisplayDistributionDwCustomTableDisplayStatusModel('5', '未換退'),
        new DwCustomTableDisplayDistributionDwCustomTableDisplayStatusModel('6', '已換退'),
        new DwCustomTableDisplayDistributionDwCustomTableDisplayStatusModel('7', '未換出'),
        new DwCustomTableDisplayDistributionDwCustomTableDisplayStatusModel('8', '已換出'),
        new DwCustomTableDisplayDistributionDwCustomTableDisplayStatusModel('A', '未出未換'),
        new DwCustomTableDisplayDistributionDwCustomTableDisplayStatusModel('B', '已出已換')
      ];
      observer.next(list);
      observer.complete();
    });
  }
}

/**
 * 性別篩選列舉
 *
 * @export
 * @class DwCustomTableDisplayGenderModel
 */
export class DwCustomTableDisplayGenderModel {
  private _text: string;
  private _value: string;
  private _checked: boolean;

  constructor(value?: string, text?: string, checked?: boolean) {
    this._text = text;
    this._value = value;
    this._checked = !!checked;
  }

  get label(): string {
    return this._text ? this._text : '';
  }

  get value(): string {
    return this._value;
  }

  set value(value: string) {
    this._value = value;
  }

  get checked(): boolean {
    return !!this._checked;
  }

  set checked(value: boolean) {
    this._checked = value;
  }

  static getList(): Observable<DwCustomTableDisplayGenderModel[]> {
    return new Observable(
      observer => {
        const list = [
          new DwCustomTableDisplayGenderModel('male', '男', false),
          new DwCustomTableDisplayGenderModel('female', '女', false)
        ];

        observer.next(list);
        observer.complete();
      }
    );
  }

  static resetList(list: DwCustomTableDisplayGenderModel[]): void {
    list.forEach(item => {
      item.checked = false;
    });
  }

  static setChecked(list: DwCustomTableDisplayGenderModel[], values: string[] | string): void {
    if (values && values.length > 0) {
      list.forEach((gender) => {
        gender.checked = false;
        const _values = [].concat(values);
        _values.forEach((selected) => {
          if (gender.value === selected) {
            gender.checked = true;
          }
        });
      });
    }
  }
}
