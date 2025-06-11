import { Observable } from 'rxjs';

export class ExtraFieldsDocumentOrderEnumModel {
  static gender = [
    { label: '男', value: 'male' },
    { label: '女', value: 'female' }
  ];

  static orderStatus = [
    { label: '有效', value: 'C' },
    { label: '無效', value: 'D' }
  ];
}

/**
 * 訂單狀態碼列舉
 *
 * @export
 * @class ExtraFieldsDocumentOrderStatusModel
 */
export class ExtraFieldsDocumentOrderStatusModel {
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
   * @returns {Observable<ExtraFieldsDocumentOrderStatusModel[]>}
   * @memberof ExtraFieldsDocumentOrderStatusModel
   */
  static getList(): Observable<ExtraFieldsDocumentOrderStatusModel[]> {
    return new Observable(observer => {
      const list = [
        new ExtraFieldsDocumentOrderStatusModel('Y', '有效'),
        new ExtraFieldsDocumentOrderStatusModel('N', '無效')
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
 * @class ExtraFieldsDocumentOrderDistributionStatusModel
 */
export class ExtraFieldsDocumentOrderDistributionStatusModel {
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

  static getList(): Observable<ExtraFieldsDocumentOrderDistributionStatusModel[]> {
    return new Observable(observer => {
      const list = [
        new ExtraFieldsDocumentOrderDistributionStatusModel('1', '未出貨'),
        new ExtraFieldsDocumentOrderDistributionStatusModel('2', '已出貨'),
        new ExtraFieldsDocumentOrderDistributionStatusModel('3', '未退貨'),
        new ExtraFieldsDocumentOrderDistributionStatusModel('4', '已退貨'),
        new ExtraFieldsDocumentOrderDistributionStatusModel('5', '未換退'),
        new ExtraFieldsDocumentOrderDistributionStatusModel('6', '已換退'),
        new ExtraFieldsDocumentOrderDistributionStatusModel('7', '未換出'),
        new ExtraFieldsDocumentOrderDistributionStatusModel('8', '已換出'),
        new ExtraFieldsDocumentOrderDistributionStatusModel('A', '未出未換'),
        new ExtraFieldsDocumentOrderDistributionStatusModel('B', '已出已換')
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
 * @class ExtraFieldsDocumentOrderGenderModel
 */
export class ExtraFieldsDocumentOrderGenderModel {
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

  static getList(): Observable<ExtraFieldsDocumentOrderGenderModel[]> {
    return new Observable(
      observer => {
        const list = [
          new ExtraFieldsDocumentOrderGenderModel('male', '男', false),
          new ExtraFieldsDocumentOrderGenderModel('female', '女', false)
        ];

        observer.next(list);
        observer.complete();
      }
    );
  }

  static resetList(list: ExtraFieldsDocumentOrderGenderModel[]): void {
    list.forEach(item => {
      item.checked = false;
    });
  }

  static setChecked(list: ExtraFieldsDocumentOrderGenderModel[], values: string[] | string): void {
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
