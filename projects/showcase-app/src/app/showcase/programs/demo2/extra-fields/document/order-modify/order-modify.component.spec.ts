/* eslint-disable max-len */
import { DebugElement, Injectable } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { NzIconTestModule } from 'ng-zorro-antd/icon/testing';
import { BehaviorSubject, of, Subscription, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { By } from '@angular/platform-browser';
import { DwActionTestingModule } from '@webdpt/components/action/testing';
import { DwCommonRouterTestingModule } from '@webdpt/framework/sharedTest/common-router-test';
import { ExtraFieldsDocumentOrderRoutingModule } from '../order-routing.module';
import { ExtraFieldsDocumentOrderModule } from '../order.module';
import { DwDataRow, DwDataTable, DwDocument, DwReadService, DwUpdateService } from '@webdpt/framework/document';
import { APP_DATE_FORMAT, APP_TIME_FORMAT, DW_USING_TAB } from '@webdpt/framework/config';
import { ExtraFieldsModule } from '../../extra-fields.module';
import { ExtraFieldsRoutingModule } from '../../extra-fields-routing.module';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DwDocumentTestingModule } from '@webdpt/framework/document/testing';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { ExtraFieldsDocumentOrderModifyComponent } from './order-modify.component';
import { ExtraFieldsCustomerClientPagingService } from '../modals/customer/customer-client-paging.service';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { DwTabRoutingService } from '@webdpt/framework/routing-tabset';
import { NzModalService } from 'ng-zorro-antd/modal';
import { HttpClient } from '@angular/common/http';
import { DwRoutingMessageService } from '@webdpt/components/routing-message';
registerLocaleData(zh);
@Injectable()
export class MockDwUpdateService {
  constructor(private http: HttpClient) { }
  update(url: string, data: object): Observable<any> {
    return this.http.put(url, { dataset: data });
  }
}
export class DwTabRoutingServiceStub {
  tabRouterChanged$: BehaviorSubject<any> = new BehaviorSubject({
    'componentType': ExtraFieldsDocumentOrderModifyComponent,
    'currentId': '1665454704062120',
    'previousId': '1665466574402212',
    'currentRouterLink': '/dw-demo2/extra-fields/document/modify',
    'tabChanged': false
  });
  get tabRouterChanged(): Observable<any> {
    return this.tabRouterChanged$.asObservable().pipe(
      filter(obsData => obsData !== null), // 不廣播初始值
      distinctUntilChanged() // 有改變時才廣播
    );
  }
}
describe('ExtraFieldsDocumentOrderModifyComponent', () => {
  let component: ExtraFieldsDocumentOrderModifyComponent;
  let fixture: ComponentFixture<ExtraFieldsDocumentOrderModifyComponent>;
  let de: DebugElement;
  let router: Router;
  let spyNavigate: jasmine.Spy;
  let doc: DwDocument;
  let dwModalService: NzModalService;
  let httpMocker: HttpTestingController;
  let dwRoutingMessageService: DwRoutingMessageService;
  const commonImports = [
    HttpClientTestingModule,
    ExtraFieldsDocumentOrderModule,
    ExtraFieldsModule,
    NoopAnimationsModule,
    NzIconTestModule,
    DwCommonRouterTestingModule,
    DwActionTestingModule,
    TranslateTestingModule,
    DwDocumentTestingModule
  ];
  const commonProviders = [
    { provide: APP_DATE_FORMAT, useValue: 'yyyy/MM/dd' },
    { provide: APP_TIME_FORMAT, useValue: 'hh:mm:ss' },
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
      provide: ExtraFieldsCustomerClientPagingService, useValue: {
        open: (selected: Array<any>): Observable<any> => of(['c03'])
      }
    },
    {
      provide: DwTabRoutingService, useValue: {
        tabRouterChanged: of({
          'componentType': ExtraFieldsDocumentOrderModifyComponent,
          'currentId': '1665454704062120',
          'previousId': '1665466574402212',
          'currentRouterLink': '/dw-demo2/extra-fields/document/modify',
          'tabChanged': true
        })

      }
    }
  ];
  const commonConfig = {
    imports: [
      ...commonImports
    ],
    providers: [
      ...commonProviders
    ],
    declarations: [
      ExtraFieldsDocumentOrderModifyComponent
    ]
  };
  describe('共用條件測試', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule(commonConfig)
        .overrideModule(ExtraFieldsDocumentOrderRoutingModule, { // 單元測試,只專注於當前component,故將原路由設置清空, 改用RouterTestingModule.withRoutes(routes)的配置
          set: {
            imports: [],
            exports: []
          }
        })
        .overrideModule(ExtraFieldsRoutingModule, { // 單元測試,只專注於當前component,故將原路由設置清空, 改用RouterTestingModule.withRoutes(routes)的配置
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
      fixture = TestBed.createComponent(ExtraFieldsDocumentOrderModifyComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      router = fixture.debugElement.injector.get(Router);
      spyNavigate = spyOn(router, 'navigate').and.callThrough();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
    describe('initData', () => {
      it('$custFieldsConfig有字段定義,需呈現自定義字段欄位', fakeAsync(() => {
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(de.queryAll(By.css('dw-extra-fields input')).length).toEqual(5);
        expect(de.queryAll(By.css('dw-extra-fields textarea')).length).toEqual(1);
      }));
    });
    it('price欄位改變值, 需執行totalSum(),重新計算總和', fakeAsync(() => {
      component.detail.demo_orderdetail.controls[0].get('price').setValue(100);
      component.detail.demo_orderdetail.controls[0].get('price').updateValueAndValidity();
      fixture.detectChanges();
      tick(1000);
      const masterRow = (component.master.at(0) as DwDataRow);
      expect(masterRow.get('totalcount').value).toEqual(405);
    }));
    it('quantity欄位改變值, 需執行totalSum(),重新計算總和', fakeAsync(() => {
      component.detail.demo_orderdetail.controls[0].get('quantity').setValue(10);
      component.detail.demo_orderdetail.controls[0].get('quantity').updateValueAndValidity();
      fixture.detectChanges();
      tick(1000);
      const masterRow = (component.master.at(0) as DwDataRow);
      expect(masterRow.get('totalcount').value).toEqual(75);
    }));
    it('按下單身刪除(detailDelete), 刪除的單身資料modifyState需變為d(刪除)', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000);
      expect(component.detail.demo_orderdetail.activeRows.length).withContext('原來筆數為3').toEqual(3);
      const deleteAtag: HTMLAnchorElement = de.queryAll(By.css('table tr td a'))[1].nativeElement; // 刪除
      deleteAtag.click();
      fixture.detectChanges();
      const delForSureBT: HTMLButtonElement = de.queryAll(By.css('.ant-popover-buttons button'))[1].nativeElement; // 確認刪除
      delForSureBT.click();
      fixture.detectChanges();
      tick();
      expect((component.detail.demo_orderdetail.controls[0] as DwDataRow).modifyState).toEqual('d'); // 變更狀態為刪除
      expect(component.detail.demo_orderdetail.activeRows.length).withContext('原來筆數為3,刪除後為2').toEqual(2);
    }));
    it('單身刪除(detailDelete), 刪除的單身資料不存在,需不刪除單身資料', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000);
      component.detailDelete('demo_orderdetail', new DwDataRow({
        productid: 'abc',
        seq: '1'
      }));
      fixture.detectChanges();
      tick();
      expect(component.detail.demo_orderdetail.controls.length).toEqual(3);
    }));
    it('按下整批刪除(detailClear), 所有單身資料,modifyState需變為d(刪除)', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000);
      expect(component.detail.demo_orderdetail.activeRows.length).withContext('原來筆數為3').toEqual(3);
      const deleteAllBT: HTMLAnchorElement = de.query(By.css('button[ng-reflect-title="dw-document-order-是否整批刪除"]')).nativeElement; // 整批刪除
      deleteAllBT.click();
      fixture.detectChanges();
      const delForSureBT: HTMLButtonElement = de.queryAll(By.css('.ant-popover-buttons button'))[1].nativeElement; // 確認刪除
      delForSureBT.click();
      fixture.detectChanges();
      tick();
      expect(component.detail.demo_orderdetail.activeRows.length).toEqual(0);
    }));
    it('按下取消(cancel), 需返回上層路由(列表頁)', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000);
      component.cancel();
      tick(1000);
      expect(spyNavigate.calls.mostRecent().args[0]).withContext('回到上層路由').toEqual(['../']);
    }));
    describe('按下客戶編號開窗(openCustomerDataWin)', () => {
      it('customerClientPagingService.open需被執行', fakeAsync(() => {
        fixture.detectChanges();
        tick(1000);
        const spyCustomerOpen = spyOn(de.injector.get(ExtraFieldsCustomerClientPagingService), 'open').and.callThrough();
        const searchBT: HTMLButtonElement = de.query(By.css('button:has(i[nztype="search"])')).nativeElement;
        searchBT.dispatchEvent(new Event('click'));
        tick();
        expect(spyCustomerOpen).toHaveBeenCalled();
      }));
    });
    describe('取得目前最大序號(getNewSeq)', () => {
      it('key值(單身)為null, 需return 1', () => {
        expect(component.getNewSeq(null)).toEqual(1);
      });
      it('key值(單身)不存在, detailInfo需新增key值屬性並設定maxSeq屬性值為1', () => {
        component.getNewSeq('notExistKey');
        expect((component as any).detailInfo['notExistKey'].maxSeq).toEqual(1);
      });
      it('key值(單身)的maxSeq值不為number, 需用parseInt轉換number', () => {
        (component as any).detailInfo.demo_orderdetail.maxSeq = '3';
        component.getNewSeq('demo_orderdetail');
        expect((component as any).detailInfo['demo_orderdetail'].maxSeq).toEqual(4);
      });
    });
    describe('重新設置最大序號(resetMaxSeq)', () => {
      it('單身所有seq比對後, 需找出最大序號', () => {
        component.detail.demo_orderdetail.controls[0].get('seq').setValue(-1);
        component.detail.demo_orderdetail.controls[1].get('seq').setValue(111);
        (component as any).resetMaxSeq();
        expect((component as any).detailInfo.demo_orderdetail.maxSeq).toEqual(111);
      });
      it('key值(單身)不存在, detailInfo需新增key值屬性,且將單身seq值設定至maxSeq', () => {
        component.detail.notExistKey = new DwDataTable([{ seq: 123 }]);
        (component as any).resetMaxSeq();
        expect((component as any).detailInfo.notExistKey.maxSeq).toEqual(123);
      });
    });
    it('onBeforeSaveOrder', () => {
      component.onBeforeSaveOrder();
    });
    describe('onAfterSaveOrder', () => {
      it('success為true', fakeAsync(() => {
        component.onAfterSaveOrder({
          message: null,
          success: true
        });
        tick(10000);
        expect(spyNavigate.calls.mostRecent().args[0]).withContext('回到上層路由').toEqual(['../']);
      }));
      it('success為true', fakeAsync(() => {
        const spyAddToRoute = spyOn(de.injector.get(DwRoutingMessageService), 'addToRoute').and.callThrough();
        component.onAfterSaveOrder({
          message: '成功訊息',
          success: true
        });
        tick(10000);
        expect(spyAddToRoute.calls.mostRecent().args[0]).toEqual('成功訊息');
        expect(spyNavigate.calls.mostRecent().args[0]).withContext('回到上層路由').toEqual(['../']);
      }));
      it('success為null, 但message有訊息', fakeAsync(() => {
        const spyMsgSuccess = spyOn(de.injector.get(DwRoutingMessageService), 'success').and.callThrough();
        component.onAfterSaveOrder({
          message: '成功訊息'
        });
        tick(10000);
        expect(spyMsgSuccess.calls.mostRecent().args[0]).toEqual('成功訊息');
        expect(spyNavigate).not.toHaveBeenCalled();
      }));
      it('success為null, message為null', fakeAsync(() => {
        const spyMsgSuccess = spyOn(de.injector.get(DwRoutingMessageService), 'success').and.callThrough();
        component.onAfterSaveOrder({
        });
        tick(10000);
        expect(spyMsgSuccess).not.toHaveBeenCalled();
        expect(spyNavigate).not.toHaveBeenCalled();
      }));
    });
  });
  describe('個別條件測試', () => {
    describe('按下單身修改(detailModify)', () => {
      it('按下確定修改, 需變更單身資料', fakeAsync(() => {
        TestBed.configureTestingModule(commonConfig)
          .overrideModule(ExtraFieldsDocumentOrderRoutingModule, {
            set: {
              imports: [],
              exports: []
            }
          })
          .overrideProvider(DwReadService, {
            useValue: commonReadService
          })
          .overrideProvider(NzModalService, {
            useValue: {
              create: (config): any => {
                config.nzOnOk({
                  detailEdit: {
                    price: 5,
                    quantity: 10,
                    distributionStatus: '1',
                    productCode: 'productCode1234',
                    seq: '1'
                  }
                }); // 模擬按下確認, 及返回資料
                // config.nzOnCancel({}); // 模擬按下取消
                return null;
              }
            }
          })
          .compileComponents().then(() => {
            fixture = TestBed.createComponent(ExtraFieldsDocumentOrderModifyComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            doc = de.injector.get(DwDocument);
            router = de.injector.get(Router);
            dwModalService = de.injector.get(NzModalService);
            fixture.detectChanges();

            const spyModalCreate = spyOn(dwModalService, 'create').and.callThrough();
            const modiyfyAtag: HTMLAnchorElement = de.queryAll(By.css('table tr td a'))[0].nativeElement;
            modiyfyAtag.click();
            fixture.detectChanges();
            tick(1000);
            expect(spyModalCreate).toHaveBeenCalledTimes(1);
            expect(component.detail.demo_orderdetail.controls[0].get('price').value).toEqual(5);
            expect(component.detail.demo_orderdetail.controls[0].get('quantity').value).toEqual(10);
          });
      }));
      it('按下取消修改, 需不變更單身資料', fakeAsync(() => {
        TestBed.configureTestingModule(commonConfig)
          .overrideModule(ExtraFieldsDocumentOrderRoutingModule, {
            set: {
              imports: [],
              exports: []
            }
          })
          .overrideProvider(DwReadService, {
            useValue: commonReadService
          })
          .overrideProvider(NzModalService, {
            useValue: {
              create: (config): any => {
                config.nzOnCancel(); // 模擬按下取消
                return null;
              }
            }
          })
          .compileComponents().then(() => {
            fixture = TestBed.createComponent(ExtraFieldsDocumentOrderModifyComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            doc = de.injector.get(DwDocument);
            router = de.injector.get(Router);
            dwModalService = de.injector.get(NzModalService);
            fixture.detectChanges();

            const spyModalCreate = spyOn(dwModalService, 'create').and.callThrough();
            const modiyfyAtag: HTMLAnchorElement = de.queryAll(By.css('table tr td a'))[0].nativeElement;
            modiyfyAtag.click();
            fixture.detectChanges();
            tick(1000);
            expect(spyModalCreate).toHaveBeenCalledTimes(1);
            expect(component.detail.demo_orderdetail.controls[0].get('price').value).withContext('原來的mock資料為6').toEqual(7);
            expect(component.detail.demo_orderdetail.controls[0].get('quantity').value).withContext('原來的mock資料為5').toEqual(4);
          });
      }));
    });
    describe('按下單身新增(detailAdd)', () => {
      it('按下確定新增, 需變更單身資料', fakeAsync(() => {
        TestBed.configureTestingModule(commonConfig)
          .overrideModule(ExtraFieldsDocumentOrderRoutingModule, {
            set: {
              imports: [],
              exports: []
            }
          })
          .overrideProvider(DwReadService, {
            useValue: commonReadService
          })
          .overrideProvider(NzModalService, {
            useValue: {
              create: (config): any => {
                config.nzOnOk({
                  detailEdit: {
                    price: 5,
                    quantity: 10,
                    distributionStatus: '1',
                    productCode: 'productCode1234',
                    seq: '1'
                  }
                }); // 模擬按下確認, 及返回資料
                return null;
              }
            }
          })
          .compileComponents().then(() => {
            fixture = TestBed.createComponent(ExtraFieldsDocumentOrderModifyComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            dwModalService = de.injector.get(NzModalService);
            fixture.detectChanges();

            const spyModalCreate = spyOn(dwModalService, 'create').and.callThrough();
            const addBT: HTMLButtonElement = de.query(By.css('button:has(i[ng-reflect-nz-type="plus"])')).nativeElement;
            addBT.click();
            fixture.detectChanges();
            tick(1000);
            expect(spyModalCreate).toHaveBeenCalledTimes(1);
            // console.log(component.detail.demo_orderdetail.controls[0].get('price'));
            expect(component.detail.demo_orderdetail.controls[0].get('price').value).toEqual(5);
            expect(component.detail.demo_orderdetail.controls[0].get('productid').value).toEqual('productCode1234');
          });
      }));
      it('按下取消新增, 需不變更單身資料', fakeAsync(() => {
        TestBed.configureTestingModule(commonConfig)
          .overrideModule(ExtraFieldsDocumentOrderRoutingModule, {
            set: {
              imports: [],
              exports: []
            }
          })
          .overrideProvider(DwReadService, {
            useValue: commonReadService
          })
          .overrideProvider(NzModalService, {
            useValue: {
              create: (config): any => {
                config.nzOnCancel(); // 模擬按下取消
                return null;
              }
            }
          })
          .compileComponents().then(() => {
            fixture = TestBed.createComponent(ExtraFieldsDocumentOrderModifyComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            dwModalService = de.injector.get(NzModalService);
            fixture.detectChanges();

            const spyModalCreate = spyOn(dwModalService, 'create').and.callThrough();
            const addBT: HTMLButtonElement = de.query(By.css('button:has(i[ng-reflect-nz-type="plus"])')).nativeElement;
            addBT.click();
            fixture.detectChanges();
            tick(1000);
            expect(spyModalCreate).toHaveBeenCalledTimes(1);
            expect(component.detail.demo_orderdetail.controls[0].get('price').value).withContext('原來的mock資料為7').toEqual(7);
            expect(component.detail.demo_orderdetail.controls[0].get('productid').value).withContext('原來的mock資料為1').toEqual('1');
          });
      }));
    });
    describe('執行setDetailInfo時', () => {
      it('單頭沒有$info資料, detailInfo需設定為空{}', fakeAsync(() => {
        TestBed.configureTestingModule(commonConfig)
          .overrideModule(ExtraFieldsDocumentOrderRoutingModule, {
            set: {
              imports: [],
              exports: []
            }
          })
          .overrideProvider(DwReadService, {
            useValue: {
              read: (url: string, oid: any): Observable<any> => of({
                'data': {
                  'demo_order': [{
                    'address': '台中市大里區',
                    'customerid': 'c03',
                    'employeeid': 'c02',
                    'employeename': '',
                    'gender': '',
                    'orderdate': new Date('2022/06/08 00:00:00'),
                    'orderid': '1591175815775',
                    'status': 'C',
                    'totalcount': 140.00,
                    // '$info': {
                    //   'child': {
                    //     'demo_orderdetail': {
                    //       'maxSeq': 2,
                    //       'seqName': 'seq'
                    //     }
                    //   }
                    // },
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
            }
          })
          .compileComponents().then(() => {
            fixture = TestBed.createComponent(ExtraFieldsDocumentOrderModifyComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            dwModalService = de.injector.get(NzModalService);
            fixture.detectChanges();
            tick(1000);
            expect((component as any).detailInfo).toEqual({});
          });
      }));

    });
    describe('按下保存', () => {
      beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
          imports: [
            ...commonImports
          ],
          providers: [
            DwRoutingMessageService,
            { provide: DwUpdateService, useClass: MockDwUpdateService }, // 使用httpClient請用,用來測試時可變換資料
            ...commonProviders
          ],
          declarations: [
            ExtraFieldsDocumentOrderModifyComponent
          ]
        })
          .overrideModule(ExtraFieldsDocumentOrderRoutingModule, { // 單元測試,只專注於當前component,故將原路由設置清空, 改用RouterTestingModule.withRoutes(routes)的配置
            set: {
              imports: [],
              exports: []
            }
          })
          .overrideModule(ExtraFieldsRoutingModule, { // 單元測試,只專注於當前component,故將原路由設置清空, 改用RouterTestingModule.withRoutes(routes)的配置
            set: {
              imports: [],
              exports: []
            }
          })
          .overrideProvider(DwReadService, {
            useValue: commonReadService
          })
          // .overrideProvider(DwUpdateService, {
          //   useValue: ''})
          .compileComponents();
      }));
      beforeEach(() => {
        fixture = TestBed.createComponent(ExtraFieldsDocumentOrderModifyComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        dwModalService = de.injector.get(NzModalService);
        router = de.injector.get(Router);
        spyNavigate = spyOn(router, 'navigate').and.callThrough();
        httpMocker = TestBed.inject(HttpTestingController);
        dwRoutingMessageService = TestBed.inject(DwRoutingMessageService);
        fixture.detectChanges();
      });
      it('保存成功, 需執行saved回到詳情頁', fakeAsync(() => {
        const saveBT: HTMLButtonElement = de.query(By.css('button[dwdocsave]')).nativeElement;
        saveBT.dispatchEvent(new Event('click'));
        fixture.detectChanges();
        tick(10000);
        const req = httpMocker.expectOne('restful/service/DEMO_DAP_CURRENT/DemoOrderCustField');
        req.flush({
          message: '已變更資料',
          success: true
        });
        fixture.detectChanges();
        tick(10000);
        expect(spyNavigate.calls.mostRecent().args[0]).withContext('回到上層路由').toEqual(['../']);
      }));
      it('保存成功, 有成功訊息, 需加入路由跳轉訊息(addToRoute)', fakeAsync(() => {
        const spyAddToRoute = spyOn(dwRoutingMessageService, 'addToRoute').and.callThrough();
        const saveBT: HTMLButtonElement = de.query(By.css('button[dwdocsave]')).nativeElement;
        saveBT.dispatchEvent(new Event('click'));
        fixture.detectChanges();
        tick(10000);
        const req = httpMocker.expectOne('restful/service/DEMO_DAP_CURRENT/DemoOrderCustField');
        req.flush({
          message: '已變更資料',
          success: true
        });
        fixture.detectChanges();
        tick(10000);
        expect(spyAddToRoute).toHaveBeenCalled();
        expect(spyNavigate.calls.mostRecent().args[0]).withContext('回到上層路由').toEqual(['../']);
      }));
      it('保存成功, 沒有成功訊息, 需不加入路由跳轉訊息(addToRoute)', fakeAsync(() => {
        const spyAddToRoute = spyOn(dwRoutingMessageService, 'addToRoute').and.callThrough();
        const saveBT: HTMLButtonElement = de.query(By.css('button[dwdocsave]')).nativeElement;
        saveBT.dispatchEvent(new Event('click'));
        fixture.detectChanges();
        tick(10000);
        const req = httpMocker.expectOne('restful/service/DEMO_DAP_CURRENT/DemoOrderCustField');
        req.flush({
          message: null,
          success: true
        });
        fixture.detectChanges();
        tick(10000);
        expect(spyAddToRoute).not.toHaveBeenCalled();
        expect(spyNavigate.calls.mostRecent().args[0]).withContext('回到上層路由').toEqual(['../']);
      }));
      it('有訊息但沒有success狀態, 需顯示訊息但不導回詳請頁', fakeAsync(() => {
        const saveBT: HTMLButtonElement = de.query(By.css('button[dwdocsave]')).nativeElement;
        saveBT.dispatchEvent(new Event('click'));
        fixture.detectChanges();
        tick(10000);
        const req = httpMocker.expectOne('restful/service/DEMO_DAP_CURRENT/DemoOrderCustField');
        req.flush({
          message: '已變更資料'
        });
        fixture.detectChanges();
        tick(10000);
        expect(spyNavigate).not.toHaveBeenCalled();
      }));
      it('沒有訊息也沒有success狀態, 需不處理', fakeAsync(() => {
        const saveBT: HTMLButtonElement = de.query(By.css('button[dwdocsave]')).nativeElement;
        saveBT.dispatchEvent(new Event('click'));
        fixture.detectChanges();
        tick(10000);
        const req = httpMocker.expectOne('restful/service/DEMO_DAP_CURRENT/DemoOrderCustField');
        req.flush({
          message: null,
          success: null
        });
        fixture.detectChanges();
        tick(10000);
        expect(spyNavigate).not.toHaveBeenCalled();
      }));
      it('保存失敗, 有errorMessage, 需執行dwModalService.error', fakeAsync(() => {
        const spyError = spyOn(dwModalService, 'error').and.callFake((options) => null);
        const saveBT: HTMLButtonElement = de.query(By.css('button[dwdocsave]')).nativeElement;
        saveBT.dispatchEvent(new Event('click'));
        fixture.detectChanges();
        tick(10000);
        const req = httpMocker.expectOne('restful/service/DEMO_DAP_CURRENT/DemoOrderCustField');
        req.flush({ errorMessage: 'bad request' }, { status: 400, statusText: 'Bad Request' });
        fixture.detectChanges();
        tick(10000);
        expect(spyError).toHaveBeenCalled();
      }));
      it('保存失敗, 沒有errorMessage, 需不執行dwModalService.error', fakeAsync(() => {
        const spyError = spyOn(dwModalService, 'error').and.callFake((options) => null);
        const saveBT: HTMLButtonElement = de.query(By.css('button[dwdocsave]')).nativeElement;
        saveBT.dispatchEvent(new Event('click'));
        fixture.detectChanges();
        tick(10000);
        const req = httpMocker.expectOne('restful/service/DEMO_DAP_CURRENT/DemoOrderCustField');
        req.flush({ message: 'bad request' }, { status: 400, statusText: 'Bad Request' });

        fixture.detectChanges();
        tick(10000);
        expect(spyError).not.toHaveBeenCalled();
      }));
    });
    describe('doc.read錯誤', () => {
      it('返回訊息有errorMessage,, 需執行dwModalService.error', fakeAsync(() => {
        // ininData在constructor觸發,spy的寫法要改如下......
        const spyInitDataTriggerByConstructor = spyOn(ExtraFieldsDocumentOrderModifyComponent.prototype, 'initData').and.callThrough();
        const mockDwModalService = jasmine.createSpyObj('NzModalService', ['error']);
        // ...................................................
        TestBed.configureTestingModule(commonConfig)
          .overrideModule(ExtraFieldsDocumentOrderRoutingModule, {
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
            fixture = TestBed.createComponent(ExtraFieldsDocumentOrderModifyComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            const dwModalServiceSpy = de.injector.get(NzModalService) as jasmine.SpyObj<NzModalService>;
            dwModalServiceSpy.error.and.callFake((options) => null); // fake,不跳出視窗
            expect(spyInitDataTriggerByConstructor).toHaveBeenCalled();
            expect(dwModalServiceSpy.error).toHaveBeenCalled();
            // console.log(dwModalServiceSpy.error.calls.mostRecent().args[0]);
            fixture.detectChanges();

            tick();
          });
      }));
      it('返回訊息沒有errorMessage,, 需不處理', fakeAsync(() => {
        const spyInitDataTriggerByConstructor = spyOn(ExtraFieldsDocumentOrderModifyComponent.prototype, 'initData').and.callThrough();
        const mockDwModalService = jasmine.createSpyObj('NzModalService', ['error']);
        TestBed.configureTestingModule(commonConfig)
          .overrideModule(ExtraFieldsDocumentOrderRoutingModule, {
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
            fixture = TestBed.createComponent(ExtraFieldsDocumentOrderModifyComponent);
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
    describe('頁籤模式下', () => {
      it('相同的orderId,來回切換list頁及modify頁,需觸發initData重取modify頁資料', fakeAsync(() => {
        const dwTabRoutingServiceStub = new DwTabRoutingServiceStub();
        TestBed.configureTestingModule(commonConfig)
          .overrideModule(ExtraFieldsDocumentOrderRoutingModule, {
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
            fixture = TestBed.createComponent(ExtraFieldsDocumentOrderModifyComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            dwModalService = de.injector.get(NzModalService);
            const spyInitData = spyOn(component, 'initData').and.callFake(() => { }); // 假執行
            fixture.detectChanges();
            tick(1000);
            expect((component as any).parametersChanged).toEqual(false);
            dwTabRoutingServiceStub.tabRouterChanged$.next({
              'componentType': ExtraFieldsDocumentOrderModifyComponent,
              'currentId': '1665454704062120',
              'previousId': '1665466574402212',
              'currentRouterLink': '/dw-demo2/extra-fields/document/modify',
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
          .overrideModule(ExtraFieldsDocumentOrderRoutingModule, {
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
            fixture = TestBed.createComponent(ExtraFieldsDocumentOrderModifyComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;

            const spySubscrAdd = spyOn(((component as any).tabInfoSubscription as Subscription), 'add').and.callThrough();
            fixture.detectChanges();
            tick(1000);
            expect(spySubscrAdd).not.toHaveBeenCalled();
          });
      }));
    });
  });
});


export const commonReadService = {
  read: (url: string, oid: any): Observable<any> => of({
    'data': {
      '$custFieldsConfig': {
        'demo_order': [
          {
            'config_id': 1,
            'table_name': 'demo_order',
            'field_id': 'userName',
            'field_label': '用戶帳號',
            'field_type': 'INPUTALPHANUMERIC',
            'field_config': '{"placeholder":"用戶帳號","validator":{"required":null,"minLength":3}}',
            'tenantsid': 28205582758464
          },
          {
            'config_id': 2,
            'table_name': 'demo_order',
            'field_id': 'email',
            'field_label': '電子郵箱',
            'field_type': 'INPUT',
            'field_config': '{"placeholder":"電子郵箱","validator":{"email":null,"minLength":3}}',
            'tenantsid': 28205582758464
          },
          {
            'config_id': 3,
            'table_name': 'demo_order',
            'field_id': 'memo',
            'field_label': '備註',
            'field_type': 'TEXTAREA',
            'field_config': '{"placeholder":"備註"}',
            'tenantsid': 28205582758464
          },
          {
            'config_id': 4,
            'table_name': 'demo_order',
            'field_id': 'postalCode',
            'field_label': '郵遞區號',
            'field_type': 'INPUTNUMBER',
            'field_config': '{"placeholder":"郵遞區號"}',
            'tenantsid': 28205582758464
          },
          {
            'config_id': 5,
            'table_name': 'demo_order',
            'field_id': 'shippingDate',
            'field_label': '出貨日期',
            'field_type': 'DATEPICKER',
            'field_config': '{"placeholder":"出貨日期"}',
            'tenantsid': 28205582758464
          },
          {
            'config_id': 6,
            'table_name': 'demo_order',
            'field_id': 'deliveryTime',
            'field_label': '希望到貨時段',
            'field_type': 'SELECT',
            'field_config': '{"placeholder":"希望到貨時段","multiple":true,"options":[{"label":"早上","value":"1"},{"label":"下午","value":"2"},{"label":"晚上","value":"3"}]}',
            'tenantsid': 28205582758464
          }
        ]
      },
      'demo_order': [
        {
          'orderid': '1592984190403',
          'status': 'C',
          'orderdate': new Date('2022/06/08 00:00:00'),
          'customerid': 'c02',
          'employeeid': '',
          'totalcount': 33,
          'address': '',
          'gender': '',
          'employeename': '',
          'cust_field': '{"userName":"1414","email":"","memo":null,"postalCode":null,"shippingDate":"2023/03/28 10:36:51","deliveryTime":null}',
          '$info': {
            'child': {
              'demo_orderdetail': {
                'maxSeq': 3,
                'seqName': 'seq'
              }
            }
          },
          'customername': 'Michel Lee',
          'child': {
            'demo_orderdetail': [
              {
                'orderid': '1592984190403',
                'seq': 1,
                'productid': '1',
                'price': 7,
                'quantity': 4,
                'count': 28,
                'deliverystatus': '1'
              },
              {
                'orderid': '1592984190403',
                'seq': 2,
                'productid': '2',
                'price': 2,
                'quantity': 1,
                'count': 2,
                'deliverystatus': '1'
              },
              {
                'orderid': '1592984190403',
                'seq': 3,
                'productid': '3',
                'price': 3,
                'quantity': 1,
                'count': 3,
                'deliverystatus': '1'
              }
            ]
          }
        }
      ],
      'demo_orderdetail': []
    }
  })
};
