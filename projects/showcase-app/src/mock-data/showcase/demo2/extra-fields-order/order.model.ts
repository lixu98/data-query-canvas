const demo2ExtraFieldsOrderJson = require('./order.json');

// 單頭
interface IMockDemo2ExtraFieldsOrderMaster {
  orderId: string;
  status: string;
  orderDate: Date;
  customerId: string;
  customerName: string;
  orderAddr: string;
  total: number;
  salesmanId: string;
  salesmanName: string;
  gender: string;
}

// 單身
export interface IMockRDemo2ExtraFieldsOrderDetail {
  seq: number;
  distributionStatus: string;
  productCode: string;
  productName: string;
  price: number;
  quantity: number;
}

interface IDemo2ExtraFieldsOrderModel {
  master?: Array<IMockDemo2ExtraFieldsOrderMaster>;
  detail?: Array<IMockRDemo2ExtraFieldsOrderDetail>;
}

/**
 * 訂單資料
 *
 * @class Demo2ExtraFieldsOrderModel
 */
class Demo2ExtraFieldsOrderModel {
  private _mockData?: IDemo2ExtraFieldsOrderModel;

  constructor() {
    this._mockData = (<any>demo2ExtraFieldsOrderJson); // 資料初始化來自JSON檔
  }

  get mockData(): IDemo2ExtraFieldsOrderModel {
    const str = JSON.stringify(this._mockData);
    return JSON.parse(str);
  }

  set mockData(newData: IDemo2ExtraFieldsOrderModel) {
    this._mockData.master = newData.master;
    this._mockData.detail = newData.detail;
  }
}

export const demo2ExtraFieldsOrderModel = new Demo2ExtraFieldsOrderModel(); // Single Instance
