import { RequestInfo } from 'angular-in-memory-web-api';
import { IDwMockData } from '@webdpt/framework/mock';
import { demo2InputListwin } from './input-listwin-data';
import { DatePipe } from '@angular/common';


class Demo2InputListwinMockData implements IDwMockData {

  get data(): any {
    return demo2InputListwin;
  }

  getMethod(reqInfo: any): any {
    return reqInfo.collection;
  }

  postMethod(reqInfo: any): any {
    const mockResp = [];
    const orderInfo = reqInfo.collection.orderInfo; // 訂單詳細資料
    const addrInfo = reqInfo.collection.addrInfo; // 地區
    const companyInfo = reqInfo.collection.companyInfo; // 公司
    const salesmanNameInfo = reqInfo.collection.salesmanNameInfo; // 業務員姓名

    const mockRandomFloat = (): number => {
      const arrayBuffer = new Uint32Array(10);
      const randomValues = window.crypto.getRandomValues(arrayBuffer);
      return parseFloat('0.' + randomValues[0].toString());
    };

    let key = 1;
    for (let i = 0; i < 100; i++) { // 可以產生多筆資料.
      const object = Object.assign({}, orderInfo);
      const plusOrMinus = mockRandomFloat() < 0.5 ? -1 : 1;
      const orderDate  = new Date(+new Date() + ((Math.floor(mockRandomFloat() * 50) * 86400000 * plusOrMinus)));
      const orderAddr = {
        city: addrInfo[key % 25],
        address: object.orderAddr.address
      };

      Object.assign(object, {
        orderId: 'No_00000' + key,
        customerId: 'C0' + (Math.floor(mockRandomFloat() * 9 + 1)),
        status: key % 2,
        orderAddr: orderAddr,
        customerName: companyInfo[key % 41],
        total: Math.floor(mockRandomFloat() * (10000 - 1000 + 1)) + 1000,
        orderDate: (new DatePipe('zh_tw')).transform(orderDate, 'yyyy/MM/dd'),
        gender: (key % 2) ? 'male' : 'female',
        salesmanName: salesmanNameInfo[key % 4]
      });
      mockResp.push(object);
      key++;
    }

    return mockResp;
    // return reqInfo.collection;
  }

  deleteMethod(reqInfo: RequestInfo): any {
    return [];
  }

  putMethod(reqInfo: RequestInfo): any {
    return [];
  }
}

export const demo2InputListwinData = new Demo2InputListwinMockData();
