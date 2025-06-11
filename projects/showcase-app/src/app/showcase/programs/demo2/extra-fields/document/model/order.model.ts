import { ExtraFieldsDocumentOrderStatusModel } from './enum.model';


/**
 * 單頭
 *
 * @export
 * @class ExtraFieldsDocumentOrderMasterModel
 */
export class ExtraFieldsDocumentOrderMasterModel {
  orderId: string = '';
  status: string = new ExtraFieldsDocumentOrderStatusModel().value;
  orderDate: Date;
  customerId: string = '';
  customerName: string = '';
  orderAddr: string = '';
  total: number = 0;
  salesmanId: string = '';
  salesmanName: string = '';
  gender: string = '';

  constructor(values: any) {
    Object.assign(this, values);
  }
}


/**
 * 單身
 */
export class ExtraFieldsDocumentOrderProductInfo {
  seq = 0;
  productCode = '';
  productName = '';
  distributionStatus = '1';
  distributionStatusDesc = '未出貨';
  price = 0;
  subtotal = 0;

  private _quantity = 0;

  constructor(object: any) {
    Object.assign(this, object);
  }

  get quantity(): number {
    return this._quantity;
  }

  set quantity(value: number) {
    this._quantity = value;
    this.onChange();
  }

  onChange(): void {
    this.subtotal = this.price * this.quantity;
  }

  static parseToArray(jsonArray: any[]): ExtraFieldsDocumentOrderProductInfo[] {
    const details: ExtraFieldsDocumentOrderProductInfo[] = [];
    jsonArray.forEach(
      (item) => { details.push(new ExtraFieldsDocumentOrderProductInfo(item)); }
    );
    return details;
  }
}
