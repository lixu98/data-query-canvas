import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import {
  DwDataRow, DwDataTable, DwDocument, DwReadService, DwUpdateService
} from '@webdpt/framework/document';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { NzIconTestModule } from 'ng-zorro-antd/icon/testing';
import { BehaviorSubject, of, Subject, Subscription, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { DwActionTestingModule } from '@webdpt/components/action/testing';
import { DocumentOrderRoutingModule } from '../order-routing.module';
import { DocumentOrderModule } from '../order.module';
import { DocumentOrderModifyComponent } from './order-modify.component';
import { APP_DATE_FORMAT, DW_USING_TAB } from '@webdpt/framework/config';
import { CustomerClientPagingService } from '../modals/customer/customer-client-paging.service';
import { DwTabRoutingService } from '@webdpt/framework/routing-tabset';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { FormArray } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DwDocumentTestingModule } from '@webdpt/framework/document/testing';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { DwRoutingMessageService } from '@webdpt/components/routing-message';
import { DwCommonRouterTestingModule } from '@webdpt/framework/sharedTest/common-router-test';

registerLocaleData(zh);

export class DwTabRoutingServiceStub {
  tabRouterChanged$: BehaviorSubject<any> = new BehaviorSubject({
    'componentType': DocumentOrderModifyComponent,
    'currentId': '1665454704062120',
    'previousId': '1665466574402212',
    'currentRouterLink': '/dw-demo1/dw-document-order/dw-document-order-modify',
    'tabChanged': false
  });
  get tabRouterChanged(): Observable<any> {
    return this.tabRouterChanged$.asObservable().pipe(
      filter(obsData => obsData !== null), // 不廣播初始值
      distinctUntilChanged() // 有改變時才廣播
    );
  }
}

// export class ActivatedMockRoute {
//   testQueryParamMap = null;
//   get snapshot(): any {
//     return {
//       queryParamMap: convertToParamMap(this.testQueryParamMap)
//     };
//   }
//   get queryParamMap(): any {
//     return of({
//       get: (key: string): any => {
//         return `${key}-get`;
//       }
//     });
//   }
// }
describe('DocumentOrderModifyComponent', () => {
  let component: DocumentOrderModifyComponent;
  let fixture: ComponentFixture<DocumentOrderModifyComponent>;
  let de: DebugElement;
  let doc: DwDocument;
  let router: Router;
  let dwModalService: NzModalService;
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
            'componentType': DocumentOrderModifyComponent,
            'currentId': '1665454704062120',
            'previousId': '1665466574402212',
            'currentRouterLink': '/dw-demo1/dw-document-order/dw-document-order-modify',
            'tabChanged': true
          })

        }
      }
    ],
    declarations: [
      DocumentOrderModifyComponent
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
          'orderdate': new Date('2022/06/08 00:00:00'),
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
    beforeEach(waitForAsync(() => {
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
      fixture = TestBed.createComponent(DocumentOrderModifyComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      doc = de.injector.get(DwDocument);
      router = de.injector.get(Router);
      dwModalService = de.injector.get(NzModalService);
      spyNavigate = spyOn(router, 'navigate').and.callThrough();

      fixture.detectChanges();
    });


    it('should create', () => {
      expect(component).toBeTruthy();
    });
    it('doc.read後, 請求回來的資料需已轉成DwDataTable類型', fakeAsync(() => {
      expect(component.master instanceof DwDataTable).toBeTrue();
      expect(component.master instanceof FormArray).toBeTrue();
      expect(component.detail.demo_orderdetail instanceof DwDataTable).toBeTrue();
      expect(component.detail.demo_orderdetail instanceof FormArray).toBeTrue();
    }));
    it('price欄位改變值, 需執行totalSum(),重新計算總和', fakeAsync(() => {
      component.detail.demo_orderdetail.controls[0].get('price').setValue(100);
      component.detail.demo_orderdetail.controls[0].get('price').updateValueAndValidity();
      fixture.detectChanges();
      const masterRow = (component.master.at(0) as DwDataRow);
      expect(masterRow.get('totalcount').value).toEqual(590);
    }));
    it('quantity欄位改變值, 需執行totalSum(),重新計算總和', fakeAsync(() => {
      component.detail.demo_orderdetail.controls[0].get('quantity').setValue(10);
      component.detail.demo_orderdetail.controls[0].get('quantity').updateValueAndValidity();
      fixture.detectChanges();
      const masterRow = (component.master.at(0) as DwDataRow);
      expect(masterRow.get('totalcount').value).toEqual(150);
    }));
    it('按下單身刪除(detailDelete), 刪除的單身資料modifyState需變為d(刪除)', fakeAsync(() => {
      expect(component.detail.demo_orderdetail.activeRows.length).withContext('原來筆數為2').toEqual(2);
      const deleteAtag: HTMLAnchorElement = de.queryAll(By.css('table tr td a'))[1].nativeElement; // 刪除
      deleteAtag.click();
      fixture.detectChanges();
      const delForSureBT: HTMLButtonElement = de.queryAll(By.css('.ant-popover-buttons button'))[1].nativeElement; // 確認刪除
      delForSureBT.click();
      fixture.detectChanges();
      tick();
      expect((component.detail.demo_orderdetail.controls[0] as DwDataRow).modifyState).toEqual('d'); // 變更狀態為刪除
      expect(component.detail.demo_orderdetail.activeRows.length).withContext('原來筆數為2,刪除後為1').toEqual(1);
    }));
    it('單身刪除(detailDelete), 刪除的單身資料不存在,需不刪除單身資料', fakeAsync(() => {
      component.detailDelete('demo_orderdetail', new DwDataRow({
        productid: 'abc',
        seq: '1'
      }));
      fixture.detectChanges();
      tick();
      expect(component.detail.demo_orderdetail.controls.length).toEqual(2);
    }));
    it('按下整批刪除(detailClear), 所有單身資料,modifyState需變為d(刪除)', fakeAsync(() => {
      expect(component.detail.demo_orderdetail.activeRows.length).withContext('原來筆數為2').toEqual(2);
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
      component.cancel();
      tick();
      expect(spyNavigate.calls.mostRecent().args[0]).withContext('回到上層路由').toEqual(['../']);
    }));
    describe('按下客戶編號開窗(openCustomerDataWin)', () => {
      it('customerClientPagingService.open需被執行', fakeAsync(() => {
        const spyCustomerOpen = spyOn(de.injector.get(CustomerClientPagingService), 'open').and.callThrough();
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
    // it('dwDocOnReaded', () => {
    //   component.dwDocOnReaded();
    // });
    // it('dwDocOnReading', () => {
    //   component.dwDocOnReading();
    // });
    // it('dwDocOnSaveing', () => {
    //   component.dwDocOnSaveing();
    // });
    // it('dwDocOnSaveed', () => {
    //   component.dwDocOnSaveed();
    // });
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
          .overrideModule(DocumentOrderRoutingModule, {
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
            fixture = TestBed.createComponent(DocumentOrderModifyComponent);
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
            tick();
            expect(spyModalCreate).toHaveBeenCalledTimes(1);
            expect(component.detail.demo_orderdetail.controls[0].get('price').value).toEqual(5);
            expect(component.detail.demo_orderdetail.controls[0].get('quantity').value).toEqual(10);
          });
      }));
      it('按下取消修改, 需不變更單身資料', fakeAsync(() => {
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
          .overrideProvider(NzModalService, {
            useValue: {
              create: (config): any => {
                config.nzOnCancel(); // 模擬按下取消
                return null;
              }
            }
          })
          .compileComponents().then(() => {
            fixture = TestBed.createComponent(DocumentOrderModifyComponent);
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
            tick();
            expect(spyModalCreate).toHaveBeenCalledTimes(1);
            expect(component.detail.demo_orderdetail.controls[0].get('price').value).withContext('原來的mock資料為6').toEqual(6);
            expect(component.detail.demo_orderdetail.controls[0].get('quantity').value).withContext('原來的mock資料為5').toEqual(5);
          });
      }));
    });
    describe('按下單身新增(detailAdd)', () => {
      it('按下確定新增, 需變更單身資料', fakeAsync(() => {
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
            fixture = TestBed.createComponent(DocumentOrderModifyComponent);
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
            // console.log(component.detail.demo_orderdetail.controls[0].get('price'));
            expect(component.detail.demo_orderdetail.controls[0].get('price').value).toEqual(5);
            expect(component.detail.demo_orderdetail.controls[0].get('productid').value).toEqual('productCode1234');
          });
      }));
      it('按下取消新增, 需不變更單身資料', fakeAsync(() => {
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
          .overrideProvider(NzModalService, {
            useValue: {
              create: (config): any => {
                config.nzOnCancel(); // 模擬按下取消
                return null;
              }
            }
          })
          .compileComponents().then(() => {
            fixture = TestBed.createComponent(DocumentOrderModifyComponent);
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
            expect(component.detail.demo_orderdetail.controls[0].get('price').value).withContext('原來的mock資料為6').toEqual(6);
            expect(component.detail.demo_orderdetail.controls[0].get('productid').value).withContext('原來的mock資料為sssss').toEqual('sssss');
          });
      }));
    });
    describe('執行setDetailInfo時', () => {
      it('單頭沒有$info資料, detailInfo需設定為空{}', fakeAsync(() => {
        TestBed.configureTestingModule(commonConfig)
          .overrideModule(DocumentOrderRoutingModule, {
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
            fixture = TestBed.createComponent(DocumentOrderModifyComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            dwModalService = de.injector.get(NzModalService);
            fixture.detectChanges();
            tick();
            expect((component as any).detailInfo).toEqual({});
          });
      }));

    });
    describe('按下保存', () => {
      it('保存成功, 需執行saved回到詳情頁', fakeAsync(() => {
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
          .compileComponents().then(() => {
            fixture = TestBed.createComponent(DocumentOrderModifyComponent);
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
          .overrideModule(DocumentOrderRoutingModule, {
            set: {
              imports: [],
              exports: []
            }
          })
          .overrideProvider(DwReadService, {
            useValue: commonReadService
          })
          .overrideProvider(DwUpdateService, {
            useValue: {
              update: (url: string, data: object): Observable<any> => of({
                message: '已變更資料',
                success: true
              })
            }
          })
          .compileComponents().then(() => {
            fixture = TestBed.createComponent(DocumentOrderModifyComponent);
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
          .overrideModule(DocumentOrderRoutingModule, {
            set: {
              imports: [],
              exports: []
            }
          })
          .overrideProvider(DwReadService, {
            useValue: commonReadService
          })
          .overrideProvider(DwUpdateService, {
            useValue: {
              update: (url: string, data: object): Observable<any> => of({
                message: '已變更資料'
              })
            }
          })
          .compileComponents().then(() => {
            fixture = TestBed.createComponent(DocumentOrderModifyComponent);
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
          .overrideModule(DocumentOrderRoutingModule, {
            set: {
              imports: [],
              exports: []
            }
          })
          .overrideProvider(DwReadService, {
            useValue: commonReadService
          })
          .overrideProvider(DwUpdateService, {
            useValue: {
              update: (url: string, data: object): Observable<any> => of({
                message: null,
                success: null
              })
            }
          })
          .compileComponents().then(() => {
            fixture = TestBed.createComponent(DocumentOrderModifyComponent);
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
          .overrideModule(DocumentOrderRoutingModule, {
            set: {
              imports: [],
              exports: []
            }
          })
          .overrideProvider(DwReadService, {
            useValue: commonReadService
          })
          .overrideProvider(DwUpdateService, {
            useValue: {
              update: (url: string, data: object): Observable<any> =>
                throwError({
                  error: { errorMessage: 'bad request' }
                })
            }
          })
          .compileComponents().then(() => {
            fixture = TestBed.createComponent(DocumentOrderModifyComponent);
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
          .overrideModule(DocumentOrderRoutingModule, {
            set: {
              imports: [],
              exports: []
            }
          })
          .overrideProvider(DwReadService, {
            useValue: commonReadService
          })
          .overrideProvider(DwUpdateService, {
            useValue: {
              update: (url: string, data: object): Observable<any> =>
                throwError({
                  error: { message: 'bad request' }
                })
            }
          })
          .compileComponents().then(() => {
            fixture = TestBed.createComponent(DocumentOrderModifyComponent);
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
      it('相同的orderId,來回切換list頁及modify頁,需觸發initData重取modify頁資料', fakeAsync(() => {
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
            fixture = TestBed.createComponent(DocumentOrderModifyComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            dwModalService = de.injector.get(NzModalService);
            const spyInitData = spyOn(component, 'initData').and.callFake(() => { }); // 假執行
            fixture.detectChanges();
            tick();
            expect((component as any).parametersChanged).toEqual(false);
            dwTabRoutingServiceStub.tabRouterChanged$.next({
              'componentType': DocumentOrderModifyComponent,
              'currentId': '1665454704062120',
              'previousId': '1665466574402212',
              'currentRouterLink': '/dw-demo1/dw-document-order/dw-document-order-modify',
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
            fixture = TestBed.createComponent(DocumentOrderModifyComponent);
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
      it('返回訊息有errorMessage,, 需執行dwModalService.error', fakeAsync(() => {
        // ininData在constructor觸發,spy的寫法要改如下......
        const spyInitDataTriggerByConstructor = spyOn(DocumentOrderModifyComponent.prototype, 'initData').and.callThrough();
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
            fixture = TestBed.createComponent(DocumentOrderModifyComponent);
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
        const spyInitDataTriggerByConstructor = spyOn(DocumentOrderModifyComponent.prototype, 'initData').and.callThrough();
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
            fixture = TestBed.createComponent(DocumentOrderModifyComponent);
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

