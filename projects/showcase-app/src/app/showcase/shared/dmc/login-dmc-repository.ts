import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DwDapHttpClient } from '@webdpt/framework/dap';

@Injectable()
export class LoginDmcRepository {
  constructor(
    private http: DwDapHttpClient
  ) {
  }

  /**
   * 後端登入 DMC 文檔中心
   */
  loginDmc(): Observable<string> {
    return this.http.post('restful/service/DEMO_DAP_CURRENT/IDmcService/login', {}).pipe(
      map(
        (response: any) => {
          const dmcUserToken = response.userToken;
          return dmcUserToken;
        }
      )
    );
  }
}
