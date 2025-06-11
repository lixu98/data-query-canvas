import { Observable } from 'rxjs';

/**
 * 訂單狀態碼列舉
 *
 * @export
 * @class ExtraFieldsOrderStatusModel
 */
export class ExtraFieldsOrderStatusModel {
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
   * @returns {Observable<ExtraFieldsOrderStatusModel[]>}
   * @memberof ExtraFieldsOrderStatusModel
   */
  static getList(): Observable<ExtraFieldsOrderStatusModel[]> {
    return new Observable(observer => {
      const list = [
        new ExtraFieldsOrderStatusModel('Y', '有效'),
        new ExtraFieldsOrderStatusModel('N', '無效')
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
 * @class ExtraFieldsOrderDistributionOrderStatusModel
 */
export class ExtraFieldsOrderDistributionOrderStatusModel {
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

  static getList(): Observable<ExtraFieldsOrderDistributionOrderStatusModel[]> {
    return new Observable(observer => {
      const list = [
        new ExtraFieldsOrderDistributionOrderStatusModel('1', '未出貨'),
        new ExtraFieldsOrderDistributionOrderStatusModel('2', '已出貨'),
        new ExtraFieldsOrderDistributionOrderStatusModel('3', '未退貨'),
        new ExtraFieldsOrderDistributionOrderStatusModel('4', '已退貨'),
        new ExtraFieldsOrderDistributionOrderStatusModel('5', '未換退'),
        new ExtraFieldsOrderDistributionOrderStatusModel('6', '已換退'),
        new ExtraFieldsOrderDistributionOrderStatusModel('7', '未換出'),
        new ExtraFieldsOrderDistributionOrderStatusModel('8', '已換出'),
        new ExtraFieldsOrderDistributionOrderStatusModel('A', '未出未換'),
        new ExtraFieldsOrderDistributionOrderStatusModel('B', '已出已換')
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
 * @class ExtraFieldsOrderGenderModel
 */
export class ExtraFieldsOrderGenderModel {
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

  static getList(): Observable<ExtraFieldsOrderGenderModel[]> {
    return new Observable(
      observer => {
        const list = [
          new ExtraFieldsOrderGenderModel('male', '男', false),
          new ExtraFieldsOrderGenderModel('female', '女', false)
        ];

        observer.next(list);
        observer.complete();
      }
    );
  }

  static resetList(list: ExtraFieldsOrderGenderModel[]): void {
    list.forEach(item => {
      item.checked = false;
    });
  }

  static setChecked(list: ExtraFieldsOrderGenderModel[], values: string[] | string): void {
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
