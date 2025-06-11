import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { APP_SYSTEM_CONFIG, DW_AUTH_TOKEN, DwDapHttpClient, DwSystemConfigService } from '@webdpt/framework';
import { Observable } from 'rxjs';

@Injectable()
export class CanvasApiService {
  apiUrl: string;
  content: any;
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
  }
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
  public createDwDataSet(value: any, key: string, state: string): any {
    const newValue = {};
    Object.assign(newValue, value);
    newValue['$state'] = state;
    newValue['id'] = key;

    return newValue;
  }

  // 查询实际/虚拟模型详情
  public getModelDetail(params, modelType: 'real' | 'virtual' = 'real'): Observable<any> {
    return this.http.post(this.apiUrl + `/dqt/model/${modelType}/detail/get`, params, { headers: this.getHeader(), });
  }
  // 删除虚拟模型
  public deleteVirtualModel(modelCode): Observable<any> {
    return this.http.post(this.apiUrl + `/dqt/model/virtual/delete`, { modelCode }, { headers: this.getHeader(), });
  }
  // 保存虚拟模型
  public saveVirtualModel(params, method = 'post'): Observable<any> {
    return this.http[method](this.apiUrl + `/dqt/model/virtual`, params, { headers: this.getHeader(), });
  }
  // 查询模型引用领域对象（新增领域对象）
  public getReferenceDomainObjectList(path: string): Observable<any> {
    return this.http.post(this.apiUrl + `/dqt/domainobject/reference/get`, { path }, { headers: this.getHeader(), });
  }
  // 查询全部领域对象（选择目标领域对象）
  public getDomainObjectList(params): Observable<any> {
    return this.http.post(this.apiUrl + `/dqt/domainobject/all/get`, params, { headers: this.getHeader(), });
  }
  // 查询领域对象字段
  public getDomainObjectFields(path): Observable<any> {
    return this.http.post(this.apiUrl + `/dqt/domainobject/field/get`, { path }, { headers: this.getHeader(), });
  }
}
