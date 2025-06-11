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
import { DwCreateService, DwDataRow, DwDataTable, DwDocument, DwExtraFieldsService, DwReadService, DwUpdateService } from '@webdpt/framework/document';
import { APP_DATE_FORMAT, APP_TIME_FORMAT, DW_USING_TAB } from '@webdpt/framework/config';
import { ExtraFieldsModule } from '../../extra-fields.module';
import { ExtraFieldsRoutingModule } from '../../extra-fields-routing.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DwDocumentTestingModule } from '@webdpt/framework/document/testing';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { DwTabRoutingService } from '@webdpt/framework/routing-tabset';
import { NzModalService } from 'ng-zorro-antd/modal';
import { HttpClient } from '@angular/common/http';
import { DwRoutingMessageService } from '@webdpt/components/routing-message';
import { ExtraFieldsDocumentOrderCreateComponent } from './order-create.component';
import { ExtraFieldsCustomerClientPagingService } from '../modals/customer/customer-client-paging.service';
registerLocaleData(zh);

export class DwTabRoutingServiceStub {
  tabRouterChanged$: BehaviorSubject<any> = new BehaviorSubject({
    'componentType': ExtraFieldsDocumentOrderCreateComponent,
    'currentId': '1665454704062120',
    'previousId': '1665466574402212',
    'currentRouterLink': '/dw-demo2/extra-fields/document/detail',
    'tabChanged': false
  });
  get tabRouterChanged(): Observable<any> {
    return this.tabRouterChanged$.asObservable().pipe(
      filter(obsData => obsData !== null), // 不廣播初始值
      distinctUntilChanged() // 有改變時才廣播
    );
  }
}
describe('ExtraFieldsDocumentOrderCreateComponent', () => {
  let component: ExtraFieldsDocumentOrderCreateComponent;
  let fixture: ComponentFixture<ExtraFieldsDocumentOrderCreateComponent>;
  let de: DebugElement;
  let router: Router;
  let spyNavigate: jasmine.Spy;
  let doc: DwDocument;
  let dwModalService: NzModalService;
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
          'componentType': ExtraFieldsDocumentOrderCreateComponent,
          'currentId': '1665454704062120',
          'previousId': '1665466574402212',
          'currentRouterLink': '/dw-demo2/extra-fields/document/detail',
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
      ExtraFieldsDocumentOrderCreateComponent
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
        .overrideProvider(DwExtraFieldsService, {
          useValue: mockDwExtraFieldsService
        })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(ExtraFieldsDocumentOrderCreateComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      router = fixture.debugElement.injector.get(Router);
      doc = de.injector.get(DwDocument);
      spyNavigate = spyOn(router, 'navigate').and.callThrough();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
    describe('ngOnInit', () => {
      it('document依tableName取得字段定義,需呈現自定義字段欄位', fakeAsync(() => {
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);

        expect(de.queryAll(By.css('dw-extra-fields input')).length).toEqual(5);
        expect(de.queryAll(By.css('dw-extra-fields textarea')).length).toEqual(1);
      }));
      it('ngOnInit, 需初始化資料', fakeAsync(() => {
        const spySetMaterValidators = spyOn(component as any, 'setMaterValidators').and.callThrough();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);

        expect(component.master instanceof DwDataTable).toBeTrue();
        expect(component.detail.demo_orderdetail instanceof DwDataTable).toBeTrue();
        expect(doc.controls['demo_order'] instanceof DwDataTable).toBeTrue();
        expect(doc.controls['demo_orderdetail'] instanceof DwDataTable).toBeTrue();
        expect(spySetMaterValidators).toHaveBeenCalled();
      }));
    });
    it('按下單身刪除(detailDelete), 需直接刪除該筆單身資料, totalSum及resetMaxSeq需被執行', fakeAsync(() => {
      const spyTotalSum = spyOn(component, 'totalSum').and.callThrough();
      const spyResetMaxSeq = spyOn(component as any, 'resetMaxSeq').and.callThrough();
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      // 先新增資料
      component.detail['demo_orderdetail'].insertRow(0, {
        count: 10,
        deliverystatus: '1',
        price: 5,
        productid: 'productCode1234',
        quantity: 2,
        orderid: '1591175815775',
        seq: -1,
      });
      fixture.detectChanges();
      expect(component.detail.demo_orderdetail.controls.length).toEqual(1);
      const deleteAtag: HTMLAnchorElement = de.queryAll(By.css('table tr td a'))[1].nativeElement; // 刪除
      deleteAtag.click();
      fixture.detectChanges();
      const delForSureBT: HTMLButtonElement = de.queryAll(By.css('.ant-popover-buttons button'))[1].nativeElement; // 確認刪除
      delForSureBT.click();
      fixture.detectChanges();
      tick();
      expect(component.detail.demo_orderdetail.controls.length).toEqual(0);
      expect(spyTotalSum).toHaveBeenCalled();
      expect(spyResetMaxSeq).toHaveBeenCalled();
    }));
    it('按下整批刪除(detailClear), 所有單身資料需直接刪除, totalSum及resetMaxSeq需被執行', fakeAsync(() => {
      const spyTotalSum = spyOn(component, 'totalSum').and.callThrough();
      const spyResetMaxSeq = spyOn(component as any, 'resetMaxSeq').and.callThrough();
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      // 先新增資料
      component.detail['demo_orderdetail'].insertRow(0, {
        count: 10,
        deliverystatus: '1',
        price: 5,
        productid: 'productCode1234',
        quantity: 2,
        orderid: '1591175815775',
        seq: -1,
      });
      expect(component.detail.demo_orderdetail.controls.length).toEqual(1);
      const deleteAllBT: HTMLAnchorElement = de.query(By.css('button[ng-reflect-title="dw-document-order-是否整批刪除"]')).nativeElement; // 整批刪除
      deleteAllBT.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      const delForSureBT: HTMLButtonElement = de.queryAll(By.css('.ant-popover-buttons button'))[1].nativeElement; // 確認刪除
      delForSureBT.click();
      fixture.detectChanges();
      tick();
      expect(component.detail.demo_orderdetail.controls.length).toEqual(0);
      expect(spyTotalSum).toHaveBeenCalled();
      expect(spyResetMaxSeq).toHaveBeenCalled();
    }));
    it('按下取消(cancel), 需執行initMaxSeq(初始化單身最大序號)後,返回上層路由(列表頁)', fakeAsync(() => {
      const spyInitMaxSeq = spyOn(component as any, 'initMaxSeq').and.callThrough();
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      component.cancel();
      tick();
      expect(spyInitMaxSeq).toHaveBeenCalled();
      expect(spyNavigate.calls.mostRecent().args[0]).withContext('回到上層路由').toEqual(['../']);
    }));
    it('initMaxSeq(初始化單身最大序號),detailInfo不存在單身key, detailInfo需新增key值屬性,值為空{}', () => {
      fixture.detectChanges();
      component.detail.abcdefg = new DwDataTable([]);
      (component as any).initMaxSeq();
      expect((component as any).detailInfo.abcdefg.maxSeq).toEqual(0);
    });
    describe('按下客戶編號開窗(openCustomerDataWin)', () => {
      it('customerClientPagingService.open需被執行', fakeAsync(() => {
        fixture.detectChanges();
        tick(1000);
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
        fixture.detectChanges();
        expect(component.getNewSeq(null)).toEqual(1);
      });
      it('key值(單身)不存在, detailInfo需新增key值屬性,並設定maxSeq屬性值為1', () => {
        fixture.detectChanges();

        component.getNewSeq('notExistKey');
        expect((component as any).detailInfo['notExistKey'].maxSeq).toEqual(1);
      });
      it('key值(單身)的maxSeq值不為number, 需用parseInt轉換number', () => {
        fixture.detectChanges();

        (component as any).detailInfo.demo_orderdetail.maxSeq = '3';
        component.getNewSeq('demo_orderdetail');
        expect((component as any).detailInfo['demo_orderdetail'].maxSeq).toEqual(4);
      });
    });
    describe('重新設置單身最大序號(resetMaxSeq)', () => {
      it('單身所有seq比對後, 需找出最大序號', () => {
        fixture.detectChanges();
        // 先新增資料
        component.detail['demo_orderdetail'].insertRow(0, {
          count: 10,
          deliverystatus: '1',
          price: 5,
          productid: 'productCode1234',
          quantity: 2,
          orderid: '1591175815775',
          seq: -1,
        });
        component.detail['demo_orderdetail'].insertRow(1, {
          count: 10,
          deliverystatus: '1',
          price: 5,
          productid: 'productCode12345',
          quantity: 2,
          orderid: '1591175815775',
          seq: 111,
        });
        fixture.detectChanges();

        (component as any).resetMaxSeq();
        expect((component as any).detailInfo.demo_orderdetail.maxSeq).toEqual(111);
      });
      it('key值(單身)不存在, detailInfo需新增key值屬性,且將單身seq值設定至maxSeq', () => {
        fixture.detectChanges();
        component.detail.notExistKey = new DwDataTable([{ seq: 123 }]);
        (component as any).resetMaxSeq();
        expect((component as any).detailInfo.notExistKey.maxSeq).toEqual(123);
      });
    });
    describe('onAfterSaveOrder', () => {
      it('success為true', fakeAsync(() => {
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        component.onAfterSaveOrder({
          message: null,
          success: true
        });
        fixture.detectChanges();
        tick(1000);

        expect(spyNavigate.calls.mostRecent().args[0]).withContext('回到上層路由').toEqual(['../']);
      }));
      it('success為true', fakeAsync(() => {
        const spyAddToRoute = spyOn(de.injector.get(DwRoutingMessageService), 'addToRoute').and.callThrough();
        fixture.detectChanges();
        tick(1000);

        component.onAfterSaveOrder({
          message: '成功訊息',
          success: true
        });
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(spyAddToRoute.calls.mostRecent().args[0]).toEqual('成功訊息');
        expect(spyNavigate.calls.mostRecent().args[0]).withContext('回到上層路由').toEqual(['../']);
      }));
      it('success為null, 但message有訊息', fakeAsync(() => {
        const spyMsgSuccess = spyOn(de.injector.get(DwRoutingMessageService), 'success').and.callThrough();
        fixture.detectChanges();
        tick(1000);

        component.onAfterSaveOrder({
          message: '成功訊息'
        });
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(spyMsgSuccess.calls.mostRecent().args[0]).toEqual('成功訊息');
        expect(spyNavigate).not.toHaveBeenCalled();
      }));
      it('success為null, message為null', fakeAsync(() => {
        const spyMsgSuccess = spyOn(de.injector.get(DwRoutingMessageService), 'success').and.callThrough();
        fixture.detectChanges();
        tick(1000);

        component.onAfterSaveOrder({
        });
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(spyMsgSuccess).not.toHaveBeenCalled();
        expect(spyNavigate).not.toHaveBeenCalled();
      }));
    });
  });
  describe('個別條件測試', () => {
    describe('按下單身新增(detailAdd)', () => {
      it('按下確定新增, 需新增單身資料', fakeAsync(() => {
        TestBed.configureTestingModule(commonConfig)
          .overrideModule(ExtraFieldsDocumentOrderRoutingModule, {
            set: {
              imports: [],
              exports: []
            }
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
                    // seq: '1'
                  }
                }); // 模擬按下確認, 及返回新資料
                return null;
              }
            }
          })
          .compileComponents().then(() => {
            fixture = TestBed.createComponent(ExtraFieldsDocumentOrderCreateComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            dwModalService = de.injector.get(NzModalService);
            fixture.detectChanges();

            const spyModalCreate = spyOn(dwModalService, 'create').and.callThrough();
            const addBT: HTMLButtonElement = de.query(By.css('button:has(i[ng-reflect-nz-type="plus"])')).nativeElement;
            addBT.click();
            fixture.detectChanges();
            tick();
            expect(spyModalCreate).toHaveBeenCalledTimes(1);
            expect(component.detail.demo_orderdetail.controls[0].get('price').value).toEqual(5);
            expect(component.detail.demo_orderdetail.controls[0].get('productid').value).toEqual('productCode1234');
          });
      }));
      it('按下確定新增, 新增單身資料seq值需透過getNewSeq取新序號', fakeAsync(() => {
        TestBed.configureTestingModule(commonConfig)
          .overrideModule(ExtraFieldsDocumentOrderRoutingModule, {
            set: {
              imports: [],
              exports: []
            }
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
                    // seq: '1'
                  }
                }); // 模擬按下確認, 及返回新資料
                return null;
              }
            }
          })
          .compileComponents().then(() => {
            fixture = TestBed.createComponent(ExtraFieldsDocumentOrderCreateComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            dwModalService = de.injector.get(NzModalService);
            const spyGetNewSeq = spyOn(component, 'getNewSeq').and.callThrough();
            fixture.detectChanges();

            const addBT: HTMLButtonElement = de.query(By.css('button:has(i[ng-reflect-nz-type="plus"])')).nativeElement;
            addBT.click();
            fixture.detectChanges();
            tick();
            expect(spyGetNewSeq).toHaveBeenCalledTimes(1);
            expect(component.detail.demo_orderdetail.controls[0].get('seq').value).toEqual(1);
          });
      }));
      it('新增單身資料後, 修改price欄位值, 需重新計算和(totalSum)', fakeAsync(() => {
        TestBed.configureTestingModule(commonConfig)
          .overrideModule(ExtraFieldsDocumentOrderRoutingModule, {
            set: {
              imports: [],
              exports: []
            }
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
                    // seq: '1'
                  }
                }); // 模擬按下確認, 及返回新資料
                return null;
              }
            }
          })
          .compileComponents().then(() => {
            fixture = TestBed.createComponent(ExtraFieldsDocumentOrderCreateComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            dwModalService = de.injector.get(NzModalService);
            const spyTotalSum = spyOn(component, 'totalSum').and.callThrough();
            fixture.detectChanges();
            // 新增一筆資料
            const addBT: HTMLButtonElement = de.query(By.css('button:has(i[ng-reflect-nz-type="plus"])')).nativeElement;
            addBT.click();
            fixture.detectChanges();
            tick();
            expect(spyTotalSum).toHaveBeenCalledTimes(1);
            expect((component.master.at(0) as DwDataRow).get('totalcount').value).withContext('price:5, quantity: 10').toEqual(50);
            expect(component.detail.demo_orderdetail.controls[0].get('price').value).toEqual(5);
            // 變更值
            component.detail.demo_orderdetail.controls[0].get('price').setValue(10);
            fixture.detectChanges();
            tick();
            expect(spyTotalSum).toHaveBeenCalledTimes(2);
            expect((component.master.at(0) as DwDataRow).get('totalcount').value).withContext('price:10, quantity: 10').toEqual(100);
          });
      }));
      it('新增單身資料後, 修改quantity欄位值, 需重新計算和(totalSum)', fakeAsync(() => {
        TestBed.configureTestingModule(commonConfig)
          .overrideModule(ExtraFieldsDocumentOrderRoutingModule, {
            set: {
              imports: [],
              exports: []
            }
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
                    // seq: '1'
                  }
                }); // 模擬按下確認, 及返回新資料
                return null;
              }
            }
          })
          .compileComponents().then(() => {
            fixture = TestBed.createComponent(ExtraFieldsDocumentOrderCreateComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            dwModalService = de.injector.get(NzModalService);
            const spyTotalSum = spyOn(component, 'totalSum').and.callThrough();
            fixture.detectChanges();
            // 新增一筆資料
            const addBT: HTMLButtonElement = de.query(By.css('button:has(i[ng-reflect-nz-type="plus"])')).nativeElement;
            addBT.click();
            fixture.detectChanges();
            tick();
            expect(spyTotalSum).toHaveBeenCalledTimes(1);
            expect(component.detail.demo_orderdetail.controls[0].get('quantity').value).toEqual(10);
            expect((component.master.at(0) as DwDataRow).get('totalcount').value).withContext('price:5, quantity: 10').toEqual(50);
            // 變更值
            component.detail.demo_orderdetail.controls[0].get('quantity').setValue(11);
            fixture.detectChanges();
            tick();
            expect(spyTotalSum).toHaveBeenCalledTimes(2);
            expect((component.master.at(0) as DwDataRow).get('totalcount').value).withContext('price:5, quantity: 11').toEqual(55);
          });
      }));
      it('按下取消新增, 需不新增單身資料', fakeAsync(() => {
        TestBed.configureTestingModule(commonConfig)
          .overrideModule(ExtraFieldsDocumentOrderRoutingModule, {
            set: {
              imports: [],
              exports: []
            }
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
            fixture = TestBed.createComponent(ExtraFieldsDocumentOrderCreateComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            dwModalService = de.injector.get(NzModalService);
            fixture.detectChanges();

            const spyModalCreate = spyOn(dwModalService, 'create').and.callThrough();
            const addBT: HTMLButtonElement = de.query(By.css('button:has(i[ng-reflect-nz-type="plus"])')).nativeElement;
            addBT.click();
            fixture.detectChanges();
            tick();
            expect(spyModalCreate).toHaveBeenCalledTimes(1);
            expect(component.detail.demo_orderdetail.controls.length).toEqual(0);
          });
      }));
    });
    describe('按下單身修改(detailModify)', () => {
      it('按下確定修改, 需變更單身資料', fakeAsync(() => {
        TestBed.configureTestingModule(commonConfig)
          .overrideModule(ExtraFieldsDocumentOrderRoutingModule, {
            set: {
              imports: [],
              exports: []
            }
          })
          .overrideProvider(NzModalService, {
            useValue: {
              create: (config): any => {
                config.nzOnOk({
                  detailEdit: {
                    count: 100,
                    price: 10,
                    quantity: 10,
                    distributionStatus: '1',
                    productCode: 'productCode1234',
                    seq: '1',
                  }
                }); // 模擬按下確認, 及返回修改資料
                return null;
              }
            }
          })
          .compileComponents().then(() => {
            fixture = TestBed.createComponent(ExtraFieldsDocumentOrderCreateComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            doc = de.injector.get(DwDocument);
            router = de.injector.get(Router);
            dwModalService = de.injector.get(NzModalService);
            fixture.detectChanges(); // ngOnInit
            component.orderid = '1591175815775';
            // 先新增一筆資料
            component.detail['demo_orderdetail'].insertRow(0, {
              count: 10,
              deliverystatus: '1',
              price: 5,
              productid: 'productCode1234',
              quantity: 2,
              seq: '1',
              orderid: '1591175815775'
            });
            fixture.detectChanges();
            tick();
            const spyModalCreate = spyOn(dwModalService, 'create').and.callThrough();
            const modiyfyAtag: HTMLAnchorElement = de.queryAll(By.css('table tr td a'))[0].nativeElement;
            modiyfyAtag.click();
            fixture.detectChanges();
            tick();
            expect(spyModalCreate).toHaveBeenCalledTimes(1);
            expect(component.detail.demo_orderdetail.controls[0].get('price').value)
              .withContext('上方overrideProvider模擬按下確認, 修改值為10').toEqual(10);
            expect(component.detail.demo_orderdetail.controls[0].get('quantity').value)
              .withContext('上方overrideProvider模擬按下確認, 修改值為10').toEqual(10);
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
          .overrideProvider(NzModalService, {
            useValue: {
              create: (config): any => {
                config.nzOnCancel(); // 模擬按下取消
                return null;
              }
            }
          })
          .compileComponents().then(() => {
            fixture = TestBed.createComponent(ExtraFieldsDocumentOrderCreateComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            doc = de.injector.get(DwDocument);
            router = de.injector.get(Router);
            dwModalService = de.injector.get(NzModalService);
            fixture.detectChanges();
            component.orderid = '1591175815775';
            // 先新增一筆資料
            component.detail['demo_orderdetail'].insertRow(0, {
              count: 10,
              deliverystatus: '1',
              price: 5,
              productid: 'productCode1234',
              quantity: 2,
              seq: '1',
              orderid: '1591175815775'
            });
            fixture.detectChanges();
            tick();
            const spyModalCreate = spyOn(dwModalService, 'create').and.callThrough();
            const modiyfyAtag: HTMLAnchorElement = de.queryAll(By.css('table tr td a'))[0].nativeElement;
            modiyfyAtag.click();
            fixture.detectChanges();
            tick();
            expect(spyModalCreate).toHaveBeenCalledTimes(1);
            expect(component.detail.demo_orderdetail.controls[0].get('price').value).withContext('原來的mock資料為5').toEqual(5);
            expect(component.detail.demo_orderdetail.controls[0].get('quantity').value).withContext('原來的mock資料為2').toEqual(2);
          });
      }));
    });
    describe('按下保存', () => {
      it('保存成功, 需執行saved回到詳情頁', fakeAsync(() => {
        TestBed.configureTestingModule(commonConfig)
          .overrideModule(ExtraFieldsDocumentOrderRoutingModule, {
            set: {
              imports: [],
              exports: []
            }
          })
          .compileComponents().then(() => {
            fixture = TestBed.createComponent(ExtraFieldsDocumentOrderCreateComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            dwModalService = de.injector.get(NzModalService);
            router = de.injector.get(Router);
            spyNavigate = spyOn(router, 'navigate').and.callThrough();
            fixture.detectChanges();

            const saveBT: HTMLButtonElement = de.query(By.css('button[dwdocsave]')).nativeElement;
            saveBT.dispatchEvent(new Event('click'));
            fixture.detectChanges();
            tick();
            expect(spyNavigate.calls.mostRecent().args[0]).withContext('回到上層路由').toEqual(['../']);
          });

      }));
      it('保存成功, 有成功訊息, 需加入路由跳轉訊息(addToRoute)', fakeAsync(() => {
        TestBed.configureTestingModule(commonConfig)
          .overrideModule(ExtraFieldsDocumentOrderRoutingModule, {
            set: {
              imports: [],
              exports: []
            }
          })
          .overrideProvider(DwCreateService, {
            useValue: {
              create: (url: string, data: object): Observable<any> => of({
                message: '已新增資料',
                success: true
              })
            }
          })
          .compileComponents().then(() => {
            fixture = TestBed.createComponent(ExtraFieldsDocumentOrderCreateComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            dwModalService = de.injector.get(NzModalService);
            router = de.injector.get(Router);
            spyNavigate = spyOn(router, 'navigate').and.callThrough();
            fixture.detectChanges();

            const saveBT: HTMLButtonElement = de.query(By.css('button[dwdocsave]')).nativeElement;
            saveBT.dispatchEvent(new Event('click'));
            fixture.detectChanges();
            tick(10000);
            expect(spyNavigate.calls.mostRecent().args[0]).withContext('回到上層路由').toEqual(['../']);
          });
      }));
      it('有訊息但沒有success狀態, 需顯示訊息但不導回詳請頁', fakeAsync(() => {
        TestBed.configureTestingModule(commonConfig)
          .overrideModule(ExtraFieldsDocumentOrderRoutingModule, {
            set: {
              imports: [],
              exports: []
            }
          })
          .overrideProvider(DwCreateService, {
            useValue: {
              create: (url: string, data: object): Observable<any> => of({
                message: '已新增資料'
              })
            }
          })
          .compileComponents().then(() => {
            fixture = TestBed.createComponent(ExtraFieldsDocumentOrderCreateComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            dwModalService = de.injector.get(NzModalService);
            router = de.injector.get(Router);
            spyNavigate = spyOn(router, 'navigate').and.callThrough();
            fixture.detectChanges();

            const saveBT: HTMLButtonElement = de.query(By.css('button[dwdocsave]')).nativeElement;
            saveBT.dispatchEvent(new Event('click'));
            fixture.detectChanges();
            tick(10000);
            expect(spyNavigate).not.toHaveBeenCalled();
          });
      }));
      it('沒有訊息也沒有success狀態, 需不處理', fakeAsync(() => {
        TestBed.configureTestingModule(commonConfig)
          .overrideModule(ExtraFieldsDocumentOrderRoutingModule, {
            set: {
              imports: [],
              exports: []
            }
          })
          .overrideProvider(DwCreateService, {
            useValue: {
              create: (url: string, data: object): Observable<any> => of({
                message: null,
                success: null
              })
            }
          })
          .compileComponents().then(() => {
            fixture = TestBed.createComponent(ExtraFieldsDocumentOrderCreateComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            dwModalService = de.injector.get(NzModalService);
            router = de.injector.get(Router);
            spyNavigate = spyOn(router, 'navigate').and.callThrough();
            fixture.detectChanges();

            const saveBT: HTMLButtonElement = de.query(By.css('button[dwdocsave]')).nativeElement;
            saveBT.dispatchEvent(new Event('click'));
            fixture.detectChanges();
            tick(10000);
            expect(spyNavigate).not.toHaveBeenCalled();
          });
      }));
      it('保存失敗, 有errorMessage, 需執行dwModalService.error', fakeAsync(() => {
        TestBed.configureTestingModule(commonConfig)
          .overrideModule(ExtraFieldsDocumentOrderRoutingModule, {
            set: {
              imports: [],
              exports: []
            }
          })
          .overrideProvider(DwCreateService, {
            useValue: {
              create: (url: string, data: object): Observable<any> =>
                throwError({
                  error: { errorMessage: 'bad request' }
                })
            }
          })
          .compileComponents().then(() => {
            fixture = TestBed.createComponent(ExtraFieldsDocumentOrderCreateComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            dwModalService = de.injector.get(NzModalService);
            const spyError = spyOn(dwModalService, 'error').and.callFake((options) => null);
            fixture.detectChanges();

            const saveBT: HTMLButtonElement = de.query(By.css('button[dwdocsave]')).nativeElement;
            saveBT.dispatchEvent(new Event('click'));
            fixture.detectChanges();
            tick(10000);
            expect(spyError).toHaveBeenCalled();
          });
      }));
      it('保存失敗, 沒有errorMessage, 需不執行dwModalService.error', fakeAsync(() => {
        TestBed.configureTestingModule(commonConfig)
          .overrideModule(ExtraFieldsDocumentOrderRoutingModule, {
            set: {
              imports: [],
              exports: []
            }
          })
          .overrideProvider(DwCreateService, {
            useValue: {
              create: (url: string, data: object): Observable<any> =>
                throwError({
                  error: { message: 'bad request' }
                })
            }
          })
          .compileComponents().then(() => {
            fixture = TestBed.createComponent(ExtraFieldsDocumentOrderCreateComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            dwModalService = de.injector.get(NzModalService);
            const spyError = spyOn(dwModalService, 'error').and.callFake((options) => null);
            fixture.detectChanges();

            const saveBT: HTMLButtonElement = de.query(By.css('button[dwdocsave]')).nativeElement;
            saveBT.dispatchEvent(new Event('click'));
            fixture.detectChanges();
            tick(10000);
            expect(spyError).not.toHaveBeenCalled();
          });
      }));
    });
    describe('頁籤模式下', () => {
      it('來回切換list頁及create頁,需清空之前的資料', fakeAsync(() => {
        const dwTabRoutingServiceStub = new DwTabRoutingServiceStub();
        TestBed.configureTestingModule(commonConfig)
          .overrideModule(ExtraFieldsDocumentOrderRoutingModule, {
            set: {
              imports: [],
              exports: []
            }
          })
          .overrideProvider(DwTabRoutingService, {
            useValue: dwTabRoutingServiceStub
          })

          .compileComponents().then(() => {
            fixture = TestBed.createComponent(ExtraFieldsDocumentOrderCreateComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            dwModalService = de.injector.get(NzModalService);
            fixture.detectChanges();
            tick();
            // 建單頭假資料
            component.master.reset([{
              orderid: '123456',
              totalcount: 100,
              address: 'add eee'
            }]);
            // 建單身資料
            component.detail['demo_orderdetail'].insertRow(0, {
              count: 10,
              deliverystatus: '1',
              price: 5,
              productid: 'productCode1234',
              quantity: 2,
              orderid: '1591175815775',
              seq: -1,
            });
            component.detail['demo_orderdetail'].insertRow(1, {
              count: 10,
              deliverystatus: '1',
              price: 5,
              productid: 'productCode12345',
              quantity: 2,
              orderid: '1591175815775',
              seq: 111,
            });
            fixture.detectChanges();
            fixture.detectChanges();
            expect(component.master.at(0).value.orderid).toEqual('123456');
            expect(component.master.at(0).value.totalcount).toEqual(100);
            expect(component.detail.demo_orderdetail.controls.length).toEqual(2);
            // 假裝切換list頁及create頁,tabRouterChanged$資料改變
            dwTabRoutingServiceStub.tabRouterChanged$.next({
              'componentType': ExtraFieldsDocumentOrderCreateComponent,
              'currentId': '1665454704062120',
              'previousId': '1665466574402212',
              'currentRouterLink': '/dw-demo1/dw-document-order/dw-document-order-modify',
              'tabChanged': false // 不變換頁籤
            });
            tick();
            fixture.detectChanges();
            expect(component.master.at(0).value.orderid).not.toEqual('123456');
            expect(component.master.at(0).value.totalcount).toEqual(0);
            expect(component.detail.demo_orderdetail.controls.length).toEqual(0);
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
          .overrideProvider(DW_USING_TAB, { useValue: false }) // 非頁籤模式

          .compileComponents().then(() => {
            fixture = TestBed.createComponent(ExtraFieldsDocumentOrderCreateComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;

            const spySubscrAdd = spyOn(((component as any).tabInfoSubscription as Subscription), 'add').and.callThrough();
            fixture.detectChanges();
            tick();
            expect(spySubscrAdd).not.toHaveBeenCalled();
          });
      }));
    });
  });
});

const mockDwExtraFieldsService = {
  getCustomizeField: (tableName: string[]): Observable<any> => {
    return of({
      'data': {
        'demo_order': [{
          'config_id': 1,
          'table_name': 'demo_order',
          'field_id': 'userName',
          'field_label': '用戶帳號',
          'field_type': 'INPUTALPHANUMERIC',
          'field_config': '{"placeholder":"用戶帳號","validator":{"required":null,"minLength":3}}',
          'tenantsid': 28205582758464
        }, {
          'config_id': 2,
          'table_name': 'demo_order',
          'field_id': 'email',
          'field_label': '電子郵箱',
          'field_type': 'INPUT',
          'field_config': '{"placeholder":"電子郵箱","validator":{"email":null,"minLength":3}}',
          'tenantsid': 28205582758464
        }, {
          'config_id': 3,
          'table_name': 'demo_order',
          'field_id': 'memo',
          'field_label': '備註',
          'field_type': 'TEXTAREA',
          'field_config': '{"placeholder":"備註"}',
          'tenantsid': 28205582758464
        }, {
          'config_id': 4,
          'table_name': 'demo_order',
          'field_id': 'postalCode',
          'field_label': '郵遞區號',
          'field_type': 'INPUTNUMBER',
          'field_config': '{"placeholder":"郵遞區號"}',
          'tenantsid': 28205582758464
        }, {
          'config_id': 5,
          'table_name': 'demo_order',
          'field_id': 'shippingDate',
          'field_label': '出貨日期',
          'field_type': 'DATEPICKER',
          'field_config': '{"placeholder":"出貨日期"}',
          'tenantsid': 28205582758464
        }, {
          'config_id': 6,
          'table_name': 'demo_order',
          'field_id': 'deliveryTime',
          'field_label': '希望到貨時段',
          'field_type': 'SELECT',
          'field_config': '{"placeholder":"希望到貨時段","multiple":true,"options":[{"label":"早上","value":"1"},{"label":"下午","value":"2"},{"label":"晚上","value":"3"}]}',
          'tenantsid': 28205582758464
        }
        ]
      }
    });
  }
};

