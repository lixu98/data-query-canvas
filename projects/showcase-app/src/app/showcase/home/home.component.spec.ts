/* eslint-disable max-len */
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { DwAnnouncementModalService } from '@webdpt/components/announcement';
import { DwSystemConfigService } from '@webdpt/framework/config';
import { TranslateServiceStub, TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { DwUserService } from '@webdpt/framework/user';
import { of } from 'rxjs';
import { ShowcaseHomeComponent } from './home.component';
import { ShowcaseHomeModule } from './home.module';

describe('ShowcaseHomeComponent', () => {
  let component: ShowcaseHomeComponent;
  let fixture: ComponentFixture<ShowcaseHomeComponent>;
  let de: DebugElement;
  let spyOpen: jasmine.Spy;
  const commonConfig = {
    imports: [
      ShowcaseHomeModule
    ],
    providers: [
      { provide: DwAnnouncementModalService, useValue: {} },
      { provide: DwUserService, useValue: { getUser: () => 'mockToken' } },
      {
        provide: DwSystemConfigService, useValue: {
          getConfig: () => of({
            screenUrl: '//mockScreenUrl.com',
            marketUrl: '//mockMarketUrl.com',
            consoleUrl: '//mockConsoleUrl.com',
          })
        }
      },
      { provide: TranslateService, useClass: TranslateServiceStub },
    ],
    declarations: [ShowcaseHomeComponent]
  };
  describe('共用條件測試', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule(commonConfig)
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(ShowcaseHomeComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      spyOpen = spyOn(window, 'open').and.callFake(() => {
        return { location: { href: '' } } as any;
      });
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
    describe('點擊卡片清單', () => {
      describe('點擊大屏設計方案卡片,有url', () => {
        it('點擊大屏設計方案卡片,newWin: true, ssoLogin: true, 需window.open開啟sso連結', fakeAsync(() => {
          const spyOpenSiteUrl = spyOn(component, 'openSiteUrl').and.callThrough();
          const card = de.queryAll(By.css('nz-card'))[3].nativeElement;
          card.click();
          fixture.detectChanges();
          expect(spyOpenSiteUrl.calls.mostRecent().args[0].url).toBeTruthy();
          expect(spyOpenSiteUrl).toHaveBeenCalled();
          expect(spyOpen).toHaveBeenCalled();
        }));
        it('點擊大屏設計方案卡片,newWin: true, ssoLogin: false, 需window.open開啟連結', fakeAsync(() => {
          const spyOpenSiteUrl = spyOn(component, 'openSiteUrl').and.callThrough();
          const card = de.queryAll(By.css('nz-card'))[5].nativeElement;
          card.click();
          fixture.detectChanges();
          expect(spyOpenSiteUrl.calls.mostRecent().args[0].url).toBeTruthy();
          expect(spyOpenSiteUrl.calls.mostRecent().args[0].ssoLogin).toBeFalse();
          expect(spyOpenSiteUrl).toHaveBeenCalled();
          expect(spyOpen).toHaveBeenCalled();
        }));
        it('openSiteUrl,有otherParams, 需將所有的參數組成 query parameters', fakeAsync(() => {
          component.openSiteUrl({
            title: '鼎捷 雲市集', sampleImage: './assets/img/showcase/card02.svg',
            newWin: true, ssoLogin: true, url: '//mockdap',
            otherParams: { orderId: '1234', owner: 'bruce' }
          });
          fixture.detectChanges();
          expect(spyOpen).toHaveBeenCalled();
        }));
      });
      it('openSiteUrl,沒有url, 需不往下執行', fakeAsync(() => {

        component.openSiteUrl({ title: '鼎捷 雲市集', sampleImage: './assets/img/showcase/card02.svg', newWin: true, ssoLogin: true, url: '', otherParams: {} });
        fixture.detectChanges();
        expect(spyOpen).not.toHaveBeenCalled();
      }));
    });
  });
  describe('個別條件測試', () => {
    it('card.url 為空字串時, checkSiteUrl需為false', waitForAsync(() => {
      TestBed.configureTestingModule(commonConfig)
        .overrideProvider(DwSystemConfigService, {
          useValue: {
            getConfig: () => of({
              screenUrl: '',
              marketUrl: '',
              consoleUrl: '',
            })
          }
        })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(ShowcaseHomeComponent);
          component = fixture.componentInstance;
          const spyCheckSiteUrl = spyOn(component, 'checkSiteUrl').and.callThrough();
          fixture.detectChanges();
          expect(spyCheckSiteUrl.calls.first().args[0].url).toEqual('');
          expect(spyCheckSiteUrl.calls.first().returnValue).toEqual(false);
        });
    }));
    it('card.url 為部署參數(未被代換)時, checkSiteUrl需為false', waitForAsync(() => {
      TestBed.configureTestingModule(commonConfig)
        .overrideProvider(DwSystemConfigService, {
          useValue: {
            getConfig: () => of({
              screenUrl: '@SCREEN_SERVICE_URL@',
              marketUrl: '@MARKET_URL@',
              consoleUrl: '@CONSOLE_URL@',
            })
          }
        })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(ShowcaseHomeComponent);
          component = fixture.componentInstance;
          const spyCheckSiteUrl = spyOn(component, 'checkSiteUrl').and.callThrough();
          fixture.detectChanges();
          expect(spyCheckSiteUrl.calls.first().args[0].url).toEqual('@SCREEN_SERVICE_URL@');
          expect(spyCheckSiteUrl.calls.first().returnValue).toEqual(false);
        });
    }));
    it('card.url 是為 Tab 與 一堆空字串, 去除後仍為空字串, checkSiteUrl需為false', waitForAsync(() => {
      TestBed.configureTestingModule(commonConfig)
        .overrideProvider(DwSystemConfigService, {
          useValue: {
            getConfig: () => of({
              screenUrl: '   ',
              marketUrl: '   ',
              consoleUrl: '   ',
            })
          }
        })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(ShowcaseHomeComponent);
          component = fixture.componentInstance;
          const spyCheckSiteUrl = spyOn(component, 'checkSiteUrl').and.callThrough();
          fixture.detectChanges();
          expect(spyCheckSiteUrl.calls.first().args[0].url).toEqual('   ');
          expect(spyCheckSiteUrl.calls.first().returnValue).toEqual(false);
        });
    }));
  });
});


