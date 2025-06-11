import { ExtraFieldsOrderStatusModel } from './enum.model';

/**
 * 單頭
 *
 * @export
 * @class ExtraFieldsOrderMasterModel
 */
export class ExtraFieldsOrderMasterModel {
  orderId: string = '';
  status: string = new ExtraFieldsOrderStatusModel().value;
  orderDate: Date;

  customerId: string = '';
  customerName: string = '';
  orderAddr: string = '';
  total: number = 0;
  salesmanId: string = '';
  salesmanName: string = '';
  gender: string = '';
  cust_field: string = '';

  constructor(values: any) {
    Object.assign(this, values);
  }
}


/**
 * 單身
 */
export class ExtraFieldsOrderProductInfo {
  seq = 0;
  productCode = '';
  productName = '';
  distributionStatus = '1';
  distributionStatusDesc = '未出貨';
  price = 0;
  quantity = 0;
  subtotal = 0;

  constructor(object: any) {
    Object.assign(this, object);
  }
}
