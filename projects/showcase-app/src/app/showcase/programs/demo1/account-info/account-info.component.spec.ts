import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { DwAccountModule } from '@webdpt/framework/account';
import { APP_DATE_FORMAT, DwSystemConfigService } from '@webdpt/framework/config';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { DwUserService } from '@webdpt/framework/user';
import { Observable, of } from 'rxjs';
import zh from '@angular/common/locales/zh';
registerLocaleData(zh);
import { AccountInfoComponent } from './account-info.component';
import { AccountInfoModule } from './account-info.module';
import { registerLocaleData } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('AccountInfoComponent', () => {
  let component: AccountInfoComponent;
  let fixture: ComponentFixture<AccountInfoComponent>;
  let de: DebugElement;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        AccountInfoModule,
        DwAccountModule,
        TranslateTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: DwSystemConfigService, useValue: {
            get: (key: string): Observable<any> => {
              return key === 'multiTenant' ? of(true) : of(`${key}-get`);
            }
          }
        },
        {
          provide: DwUserService, useValue: {
            getUser: (key: string): any => {
              return key === 'userType' ? 0 : `${key}-get`;
            }
          }
        },
        { provide: APP_DATE_FORMAT, useValue: 'yyyy/MM/dd' }
      ],
      declarations: [AccountInfoComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountInfoComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    // fixture.detectChanges();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(de.query(By.css('.photo-box nz-upload'))).toBeTruthy();
    expect(de.query(By.css('.user-pic-block .btn-block'))).toBeTruthy();
  });
  it('isUseHeadImage為false, 需不顯示頭像', () => {
    component.isUseHeadImage = false;
    fixture.detectChanges();
    expect(de.query(By.css('.photo-box nz-upload'))).not.toBeTruthy();
  });
  it('isUseUpdatePassword為false, 需不顯示變更預設密碼', () => {
    component.isUseUpdatePassword = false;
    fixture.detectChanges();
    expect(de.query(By.css('.user-pic-block .btn-block'))).not.toBeTruthy();
  });
  it('使用自訂的動態表單設定, getConfig需被執行', fakeAsync(() => {
    const spyGetConfig = spyOn(component as any, 'getConfig').and.callThrough();
    component.setUserInfo(userInfo);
    component.formOption = (component as any).getFormOption();
    component.isShowForm = true;
    fixture.detectChanges();
    tick(1000);
    const inputElem = de.queryAll(By.css('.user-data-block input'))[7].nativeElement;
    inputElem.value = 123456789012;
    inputElem.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    tick(1000);
    expect(de.query(By.css('.user-data-block .ant-form-item-explain-error'))
      .nativeElement.innerText).withContext('長度不可超過11位數字').toEqual('maxlength');
    expect(spyGetConfig).toHaveBeenCalled();
    const inputElem2 = de.queryAll(By.css('.user-data-block input'))[7].nativeElement;
    inputElem2.value = 1234567890;
    inputElem2.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    tick(1000);
    expect(de.query(By.css('.user-data-block .ant-form-item-explain-error'))
      .nativeElement.innerText).withContext('手機號碼重覆').toEqual('dw-account-info-form-phoneRepeat');
  }));
});
export const userInfo = {
  'sid': 39882414600768,
  'createBy': 0,
  'createProvider': 0,
  'createOrg': 0,
  'createDate': '2019-04-08 08:00:00',
  'modifyBy': 39882414600768,
  'modifyById': 'cloud01',
  'modifyProvider': 822023381984619651,
  'modifyDate': '2019-08-06 08:00:00',
  'hash': '1736a33b1c129c49ffe7175f1596986989b963d4',
  'disabled': false,
  'deleted': false,
  'id': 'cloud01',
  'name': 'cloud01',
  'telephone': '11111111001',
  'email': 'cloud01@digiwin.com1',
  'headImageUrl': '',
  'nickname': 'cloud01',
  'sex': '女',
  'birthday': '1977/01/23',
  'cellphonePrefix': '+86',
  'address': '台中',
  'activated': true,
  'enterprise': false,
  'defaultTenantSid': 0,
  'confirm': false,
  'visible': true,
  'readonly': false,
  'chargeSid': 0
};
