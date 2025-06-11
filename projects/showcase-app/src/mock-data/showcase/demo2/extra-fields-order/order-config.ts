import { RequestInfo } from 'angular-in-memory-web-api';
import { IDwMockData } from '@webdpt/framework/mock';
const mockResponse = require('../../mock-response.json');
import { demo2ExtraFieldsOrderModel } from './order.model';

class Demo2ExtraFieldsOrderConfigMockData implements IDwMockData {

  get data(): any {
    const mockData = demo2ExtraFieldsOrderModel.mockData;

    return mockData;
  }

  getMethod(reqInfo: any): any {
    return reqInfo.collection;
  }

  postMethod(reqInfo: any): any {
    let params;
    try {
      params = JSON.parse(reqInfo.req.body);
    } catch (error) {
      params = reqInfo.req.body;
    }
    const collectionDb = <any>demo2ExtraFieldsOrderModel.mockData;
    const collection = {
      config: [...collectionDb.extraFieldsConfig]
    };

    const mockResp = <any>JSON.parse(JSON.stringify(mockResponse));
    mockResp.response = {
      config: collection.config
    };

    return mockResp;
  }

  deleteMethod({ collection, collectionName, headers, id, url }: RequestInfo): any {
    return [];
  }

  putMethod({ collection, collectionName, headers, id, req, url }: RequestInfo): any {
    return [];
  }
}

export const demo2ExtraFieldsOrderConfig = new Demo2ExtraFieldsOrderConfigMockData();
