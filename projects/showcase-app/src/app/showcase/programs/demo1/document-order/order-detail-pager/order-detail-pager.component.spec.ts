import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, Routes } from '@angular/router';
import { DwDataTable, DwDocument, DwReadService } from '@webdpt/framework/document';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { NzIconTestModule } from 'ng-zorro-antd/icon/testing';
import { BehaviorSubject, of, Subscription, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { DocumentOrderRoutingModule } from '../order-routing.module';
import { DocumentOrderModule } from '../order.module';
import { APP_DATE_FORMAT, DW_USING_TAB } from '@webdpt/framework/config';
import { CustomerClientPagingService } from '../modals/customer/customer-client-paging.service';
import { DwTabRoutingService } from '@webdpt/framework/routing-tabset';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { FormArray } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DwDocumentTestingModule } from '@webdpt/framework/document/testing';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { DocumentOrderDetailPagerComponent } from './order-detail.component';
import { DwActionTestingModule } from '@webdpt/components/action/testing';
import { DwCommonRouterTestingModule } from '@webdpt/framework/sharedTest/common-router-test';

registerLocaleData(zh);
export class DwTabRoutingServiceStub {
  tabRouterChanged$: BehaviorSubject<any> = new BehaviorSubject({
    'componentType': DocumentOrderDetailPagerComponent,
    'currentId': '1665454704062120',
    'previousId': '1665466574402212',
    'currentRouterLink': '/dw-demo1/dw-document-order/dw-document-order-detail',
    'tabChanged': false
  });
  get tabRouterChanged(): Observable<any> {
    return this.tabRouterChanged$.asObservable().pipe(
      filter(obsData => obsData !== null), // 不廣播初始值
      distinctUntilChanged() // 有改變時才廣播
    );
  }
}

describe('DocumentOrderDetailPagerComponent', () => {
  let component: DocumentOrderDetailPagerComponent;
  let fixture: ComponentFixture<DocumentOrderDetailPagerComponent>;
  let de: DebugElement;
  let router: Router;
  let spyNavigate: jasmine.Spy;
  const commonConfig = {
    imports: [
      DocumentOrderModule,
      NoopAnimationsModule,
      NzIconTestModule,
      DwCommonRouterTestingModule,
      DwActionTestingModule,
      TranslateTestingModule,
      DwDocumentTestingModule
    ],
    providers: [
      {
        provide: ActivatedRoute, useValue: {
          snapshot: new ActivatedRouteSnapshot(), // this.router.navigate(['../'], { relativeTo: this.route }); // 相對路徑導頁
          queryParamMap: of({ // this.route.queryParamMap.subscribe
            get: (key: string): any => {
              return `${key}-get`;
            }
          })
        }
      },
      { provide: APP_DATE_FORMAT, useValue: 'yyyy/MM/dd' },
      { provide: DW_USING_TAB, useValue: true },
      {
        provide: CustomerClientPagingService, useValue: {
          open: (selected: Array<any>): Observable<any> => of(['c03'])
        }
      },
      {
        provide: DwTabRoutingService, useValue: {
          tabRouterChanged: of({
            'componentType': DocumentOrderDetailPagerComponent,
            'currentId': '1665454704062120',
            'previousId': '1665466574402212',
            'currentRouterLink': '/dw-demo1/dw-document-order/dw-document-order-detail',
            'tabChanged': true
          })

        }
      }
    ],
    declarations: [
      DocumentOrderDetailPagerComponent
    ],
  };
  const commonReadService = {
    read: (url: string, oid: any): Observable<any> => of({
      'data': {
        'demo_order': [{
          'address': '台中市大里區',
          'customerid': 'c03',
          'employeeid': 'c02',
          'employeename': '',
          'gender': '',
          'orderdate': '2022/06/08 00:00:00',
          'orderid': '1591175815775',
          'status': 'C',
          'totalcount': 140.00,
          '$info': {
            'child': {
              'demo_orderdetail': {
                'maxSeq': 2,
                'seqName': 'seq'
              }
            }
          },
          'customername': 'David Richard',
          'child': {
            'demo_orderdetail': [{
              'count': 30,
              'deliverystatus': '1',
              'orderid': '1591175815775',
              'price': 6.00,
              'productid': 'sssss',
              'quantity': 5.00,
              'seq': 1
            }, {
              'count': 90,
              'deliverystatus': '1',
              'orderid': '1591175815775',
              'price': 90.00,
              'productid': '2',
              'quantity': 1.00,
              'seq': 2
            }
            ]
          }
        }
        ],
        'demo_orderdetail': []
      }
    })
  };
  describe('共用條件測試', () => {
    let spyReading: jasmine.Spy;
    let spyReaded: jasmine.Spy;
    beforeEach(waitForAsync(() => {
      // ininData在constructor觸發,spy的寫法要改如下......
      spyReading = spyOn(DocumentOrderDetailPagerComponent.prototype, 'reading').and.callThrough();
      spyReaded = spyOn(DocumentOrderDetailPagerComponent.prototype, 'readed').and.callThrough();
      TestBed.configureTestingModule(commonConfig)
        .overrideModule(DocumentOrderRoutingModule, { // 單元測試,只專注於當前component,故將原路由設置清空, 改用RouterTestingModule.withRoutes(routes)的配置
          set: {
            imports: [],
            exports: []
          }
        })
        .overrideProvider(DwReadService, {
          useValue: commonReadService
        })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(DocumentOrderDetailPagerComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      router = de.injector.get(Router);
      spyNavigate = spyOn(router, 'navigate').and.callThrough();

      fixture.detectChanges();
    });


    it('should create', () => {
      expect(component).toBeTruthy();
    });
    it('doc.read讀取資料前後, 需先執行IDwDocumentOnRead的reading及readed方法', () => {
      expect(spyReading).toHaveBeenCalled();
      expect(spyReaded).toHaveBeenCalled();
    });
    it('doc.read後, 請求回來的資料需已轉成DwDataTable類型', fakeAsync(() => {
      expect(component.master instanceof DwDataTable).toBeTrue();
      expect(component.master instanceof FormArray).toBeTrue();
      expect(component.detail instanceof DwDataTable).toBeTrue();
      expect(component.detail instanceof FormArray).toBeTrue();
    }));
    it('按下修改(modify), 需導向編輯頁', fakeAsync(() => {
      const modiyfBT: HTMLButtonElement = de.queryAll(By.css('nz-form-item button'))[0].nativeElement;
      modiyfBT.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      tick();
      expect(spyNavigate.calls.mostRecent().args[0]).toEqual(['../dw-document-order-modify']);
    }));
    it('按下返回(list), 需導向上一層路由列表頁', fakeAsync(() => {
      const modiyfBT: HTMLButtonElement = de.queryAll(By.css('nz-form-item button'))[1].nativeElement;
      modiyfBT.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      tick();
      expect(spyNavigate.calls.mostRecent().args[0]).toEqual(['../']);
    }));
  });
  describe('個別條件測試', () => {
    describe('頁籤模式下', () => {
      it('相同的orderId,來回切換list頁及deatail頁,需觸發initData重取deatail頁資料', fakeAsync(() => {
        const dwTabRoutingServiceStub = new DwTabRoutingServiceStub();
        TestBed.configureTestingModule(commonConfig)
          .overrideModule(DocumentOrderRoutingModule, {
            set: {
              imports: [],
              exports: []
            }
          })
          .overrideProvider(DwReadService, {
            useValue: commonReadService
          })
          .overrideProvider(DwTabRoutingService, {
            useValue: dwTabRoutingServiceStub
          })

          .compileComponents().then(() => {
            fixture = TestBed.createComponent(DocumentOrderDetailPagerComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            const spyInitData = spyOn(component, 'initData').and.callFake(() => { }); // 假執行
            fixture.detectChanges();
            tick();
            expect((component as any).parametersChanged).toEqual(false);
            dwTabRoutingServiceStub.tabRouterChanged$.next({
              'componentType': DocumentOrderDetailPagerComponent,
              'currentId': '1665454704062120',
              'previousId': '1665466574402212',
              'currentRouterLink': '/dw-demo1/dw-document-order/dw-document-order-detail',
              'tabChanged': false // 不變換頁籤
            });
            tick();
            fixture.detectChanges();
            expect(spyInitData).toHaveBeenCalled();
          });
      }));
    });
    describe('非頁籤模式下', () => {
      it('需不訂閱dwTabRoutingService.tabRouterChanged', fakeAsync(() => {
        TestBed.configureTestingModule(commonConfig)
          .overrideModule(DocumentOrderRoutingModule, {
            set: {
              imports: [],
              exports: []
            }
          })
          .overrideProvider(DwReadService, {
            useValue: commonReadService
          })
          .overrideProvider(DW_USING_TAB, { useValue: false }) // 非頁籤模式

          .compileComponents().then(() => {
            fixture = TestBed.createComponent(DocumentOrderDetailPagerComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;

            const spySubscrAdd = spyOn(((component as any).tabInfoSubscription as Subscription), 'add').and.callThrough();
            fixture.detectChanges();
            tick();
            expect(spySubscrAdd).not.toHaveBeenCalled();
          });
      }));
    });
    describe('doc.read錯誤', () => {
      it('返回訊息有errorMessage,, 需執行dwModalService.error, IDwDocumentOnRead的readed方法需不被執行', fakeAsync(() => {
        // ininData在constructor觸發,spy的寫法要改如下......
        const spyInitDataTriggerByConstructor = spyOn(DocumentOrderDetailPagerComponent.prototype, 'initData').and.callThrough();
        const mockDwModalService = jasmine.createSpyObj('NzModalService', ['error']);
        // ...................................................
        TestBed.configureTestingModule(commonConfig)
          .overrideModule(DocumentOrderRoutingModule, {
            set: {
              imports: [],
              exports: []
            }
          })
          .overrideProvider(DwReadService, {
            useValue: {
              read: (url: string, oid: any): Observable<any> =>
                throwError({
                  error: { errorMessage: 'bad request' }
                })
            }
          })
          .overrideProvider(NzModalService, {
            useValue: mockDwModalService
          })
          .compileComponents().then(() => {
            fixture = TestBed.createComponent(DocumentOrderDetailPagerComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            const dwModalServiceSpy = de.injector.get(NzModalService) as jasmine.SpyObj<NzModalService>;
            dwModalServiceSpy.error.and.callFake((options) => null); // fake,不跳出視窗
            expect(spyInitDataTriggerByConstructor).toHaveBeenCalled();
            expect(dwModalServiceSpy.error).toHaveBeenCalled();
            expect(spyOn(component, 'readed').and.callThrough()).not.toHaveBeenCalled();
            // console.log(dwModalServiceSpy.error.calls.mostRecent().args[0]);
            fixture.detectChanges();

            tick();
          });
      }));
      it('返回訊息沒有errorMessage,, 需不處理', fakeAsync(() => {
        const spyInitDataTriggerByConstructor = spyOn(DocumentOrderDetailPagerComponent.prototype, 'initData').and.callThrough();
        const mockDwModalService = jasmine.createSpyObj('NzModalService', ['error']);
        TestBed.configureTestingModule(commonConfig)
          .overrideModule(DocumentOrderRoutingModule, {
            set: {
              imports: [],
              exports: []
            }
          })
          .overrideProvider(DwReadService, {
            useValue: {
              read: (url: string, oid: any): Observable<any> =>
                throwError({
                  error: { message: 'bad request' } // 不是errorMessage屬性
                })
            }
          })
          .overrideProvider(NzModalService, {
            useValue: mockDwModalService
          })
          .compileComponents().then(() => {
            fixture = TestBed.createComponent(DocumentOrderDetailPagerComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            const dwModalServiceSpy = de.injector.get(NzModalService) as jasmine.SpyObj<NzModalService>;
            dwModalServiceSpy.error.and.callFake((options) => null); // fake,不跳出視窗
            expect(spyInitDataTriggerByConstructor).toHaveBeenCalled();
            expect(dwModalServiceSpy.error).not.toHaveBeenCalled();
            fixture.detectChanges();

            tick();
          });
      }));
    });
  });
});

