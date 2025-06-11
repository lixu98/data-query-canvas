import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { APP_SYSTEM_CONFIG, DW_AUTH_TOKEN, DwDapHttpClient, DwSystemConfigService } from '@webdpt/framework';
import { Observable } from 'rxjs';

@Injectable()
export class ListService {
  apiUrl: string;
  eocUrl: string;
  uibotUrl: string;
  smartDataUrl: string;
  opmUrl: string;
  content: any;
  executeContext: any;
  isLoadStatus: boolean = true;
  constructor(
    @Inject(DW_AUTH_TOKEN) protected authToken: any,
    @Inject(APP_SYSTEM_CONFIG) protected systemConfig: any,
    private http: DwDapHttpClient,
    private configService: DwSystemConfigService,
    private translateService: TranslateService
  ) {
    this.configService.get('dqtUrl').subscribe((url: string) => {
      this.apiUrl = url;
    });
    // this.configService.get('eocUrl').subscribe((url: string): void => {
    //   this.eocUrl = url;
    // });
    // this.configService.get('uibotUrl').subscribe((url: string): void => {
    //   this.uibotUrl = url;
    // });
    // this.configService.get('smartDataUrl').subscribe((url: string) => {
    //   this.smartDataUrl = url;
    // });
    // this.configService.get('opmUrl').subscribe((url: string) => {
    //   this.opmUrl = url + '/restful/standard/bmc/opm';
    // });
  }
  // getInvData(actionId: string, params?: any, eoc?: any): Observable<any> {
  //   const executeContext = this.content?.executeContext;
  //   const _params = {
  //     actionId,
  //     parameter: params,
  //     businessUnit: eoc || executeContext?.businessUnit,
  //     executeContext: executeContext, // 传参
  //   };
  //   return this.http.post(`${this.apiUrl}/api/atdm/v1/data/query/by/actionId`, _params, {
  //     headers: this.getHeader(),
  //   });
  // }
  getHeader(): any {
    const data = localStorage.getItem('DwUserInfo')
    const authToken = JSON.parse(data);
    if (authToken.token) {
      return {
        token: authToken.token
      };
    }
    return {};
  }
  //新增模型列表查询
  public getModelList(params): Observable<any> {
    const result = this.http.post(this.apiUrl + '/dqt/model/list/get', params, {
      headers: this.getHeader(),
    });
    return result;
  }

  //发布模型列表查询
  public modelZtree(params): Observable<any> {
    const result = this.http.post(this.apiUrl + '/dqt/publish/info/get', params, {
      headers: this.getHeader(),
    });
    return result;
  }
  //发布
  public modelPublish(params): Observable<any> {
    const result = this.http.post(this.apiUrl + '/dqt/publish/info', params, {
      headers: this.getHeader(),
    });
    return result;
  }
  //获取状态Api
  public modelPublishStatus(params): Observable<any> {
    const result = this.http.post(this.apiUrl + '/dqt/publish/info/display/get', params, {
      headers: this.getHeader(),
    });
    return result;
  }

  // 删除运营单元
  // public deleteFunctions(ids): Observable<any> {
  //   const result = this.http.delete(this.apiUrl + `/operation-unit?ids=${encodeURIComponent(JSON.stringify(ids))}`, {
  //     headers: this.getHeader(),
  //   });
  //   return result;
  // }

  // 运营单元状态变更
  // public changeFunctionStatus(p): Observable<any> {
  //   const result = this.http.put(this.apiUrl + `/operation-unit/status?ids=${encodeURIComponent(JSON.stringify(p.ids))}&status=${p.status}`, {}, {
  //     headers: this.getHeader(),
  //   });
  //   return result;
  // }

  public createDwDataSet(value: any, key: string, state: string): any {
    const newValue = {};
    Object.assign(newValue, value);
    newValue['$state'] = state;
    newValue['id'] = key;

    return newValue;
  }
}
