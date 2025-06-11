import {
  Component, DebugElement
} from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DwDocument } from '@webdpt/framework/document';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { NzIconTestModule } from 'ng-zorro-antd/icon/testing';
import { NzModalService } from 'ng-zorro-antd/modal';
import { of,throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { DwActionTestingModule } from '@webdpt/components/action/testing';
import { DocumentOrderRoutingModule } from '../order-routing.module';
import { DocumentOrderModule } from '../order.module';
import { DocumentOrderListComponent } from './order-list.component';
import { DwCommonRouterTestingModule } from '@webdpt/framework/sharedTest/common-router-test';
describe('DocumentOrderListComponent', () => {
  let component: DocumentOrderListComponent;
  let fixture: ComponentFixture<DocumentOrderListComponent>;
  let de: DebugElement;
  let doc: DwDocument;
  let router: Router;
  let spyDocList: jasmine.Spy;
  let spyNavigate: jasmine.Spy;
  describe('共用條件測試', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          DocumentOrderModule,
          NoopAnimationsModule,
          NzIconTestModule,
          DwCommonRouterTestingModule,
          DwActionTestingModule,
          TranslateTestingModule
        ],
        providers: [],
        declarations: [
          DocumentOrderListComponent
        ],
      })
        .overrideModule(DocumentOrderRoutingModule, { // 單元測試,只專注於當前component,故將原路由設置清空, 改用RouterTestingModule.withRoutes(routes)的配置
          set: {
            imports: [],
            exports: []
          }
        })
        .overrideProvider(DwDocument, {
          useValue: {
            list: (queryInfo: object): Observable<any> => {
              return of({
                'rowCount': 55,
                'pageCount': 3,
                'pageSize': 20,
                'currentPage': 1,
                'message': null,
                'success': true,
                'data': {
                  'demo_order': [
                    {
                      'address': '台中市大里區',
                      'customerid': 'c03',
                      'employeeid': 'c02',
                      'employeename': '',
                      'gender': '',
                      'orderdate': '2022/06/08 00:00:00',
                      'orderid': '1591175815775',
                      'status': 'C',
                      'totalcount': 140
                    },
                    {
                      'address': '台北市內湖區民政里瑞光路七段8巷168號',
                      'customerid': 'c02',
                      'employeeid': '',
                      'employeename': '',
                      'gender': '',
                      'orderdate': '2020/06/12 00:00:00',
                      'orderid': '1591953187400',
                      'status': 'C',
                      'totalcount': 3
                    },
                  ]
                }
              });
            },
            delete: (oids: any): Observable<any> => {
              return of({
                'message': null,
                'success': true,
                'data': {
                  'countInfo': {
                    'demo_order': {
                      'D': 1
                    },
                    'demo_orderdetail': {
                      'D': 1
                    }
                  },
                  'generatedKeys': {},
                  'primaryTable': 'demo_orderdetail'
                }
              });
            }
          }
        })
        .compileComponents();
      // .overrideModule(DwActionModule, {
      //   set: {
      //     declarations: [MockDwActionAuthorizedDirective], // 替換DwActionAuthorizedDirective
      //     exports: [MockDwActionAuthorizedDirective]
      //   }
      // })
      // .overrideModule(TranslateModule, {
      //   set: {
      //     declarations: [TranslatePipeMock], // 替換TranslatePipe
      //     exports: [TranslatePipeMock]
      //   }
      // })
      // DwDocument在component裏重新注入, 故替換DwDocument需在overrideProvider定義

    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(DocumentOrderListComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      doc = fixture.debugElement.injector.get(DwDocument);
      router = fixture.debugElement.injector.get(Router);
      spyDocList = spyOn(doc, 'list').and.callThrough();
      spyNavigate = spyOn(router, 'navigate').and.callThrough();

      // fixture.detectChanges(); // 觸發ngOnInit
    });


    it('should create', () => {
      expect(component).toBeTruthy();
    });
    describe('當執行searchData時', () => {
      it('this.doc.list需取得列表資料', fakeAsync(() => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(); // 讓第一次searchData異步完成
        expect(spyDocList).toHaveBeenCalled();
      }));
      describe('searchCondition搜尋條件', () => {
        it('沒有設定時, this.doc.list入參condition.items筆數需為0', fakeAsync(() => {
          fixture.detectChanges(); // 觸發ngOnInit
          tick();
          expect(spyDocList.calls.mostRecent().args[0].condition.items.length).toEqual(0);
        }));
        it('有設定時, this.doc.list入參condition.items筆數需大於0', fakeAsync(() => {
          fixture.detectChanges(); // 觸發ngOnInit
          tick(); // 讓第一次searchData異步完成
          expect(spyDocList.calls.mostRecent().args[0].condition.items.length).toEqual(0);
          // 設定搜尋條件
          component.searchForm.patchValue({
            orderid: 'ID1234',
            totalcount: 999
          });
          component.searchData(true); // 直接執行代碼
          fixture.detectChanges();
          tick();
          console.log(spyDocList.calls.mostRecent().args[0]);
          expect(spyDocList.calls.mostRecent().args[0].condition.items[0].items.length).toEqual(2);
        }));
        it('帶入搜尋值有Arry格式, this.doc.list入參condition.items[0].items[0].operator需為IN', fakeAsync(() => {
          fixture.detectChanges(); // 觸發ngOnInit
          tick(); // 讓第一次searchData異步完成
          expect(spyDocList.calls.mostRecent().args[0].condition.items.length).toEqual(0);
          component.searchForm.controls['status'].setValue(['C', 'D']);
          fixture.detectChanges();

          component.searchData(true); // 直接執行代碼
          fixture.detectChanges();
          tick();
          expect(spyDocList.calls.mostRecent().args[0].condition.items[0].items[0].operator).toEqual('IN');
        }));

      });
    });
    it('當執行resetForm, 需清空searchForm, queryInfo值', fakeAsync(() => {
      fixture.detectChanges(); // 觸發ngOnInit
      tick(); // 讓第一次searchData異步完成
      component.searchForm.patchValue({
        orderid: 'ID1234',
        totalcount: 999,
        status: ['C', 'D']
      });
      component.searchData(true);
      fixture.detectChanges();
      tick();
      expect(component.searchForm.getRawValue()).toEqual({
        orderid: 'ID1234',
        status: ['C', 'D'],
        totalcount: 999,
        customerid: '',
        employeename: '',
        gender: []
      });
      expect(component.queryInfo.condition.items.length).toEqual(3);
      component.resetForm();
      fixture.detectChanges();
      expect(component.searchForm.getRawValue()).toEqual({
        orderid: '',
        status: [],
        totalcount: '',
        customerid: '',
        employeename: '',
        gender: []
      });
      expect(component.queryInfo.condition).toEqual(null);
    }));
    it('當執行onPageSizeChange(每頁筆數改變), 需執行searchData重新撈取資料', fakeAsync(() => {
      const spySearchData = spyOn(component, 'searchData').and.callThrough();
      fixture.detectChanges(); // 觸發ngOnInit
      tick(); // 讓第一次searchData異步完成異步完成
      expect(spySearchData).toHaveBeenCalledTimes(1);
      component.onPageSizeChange();
      tick(0); // 快轉時間和onPageSizeChange裏setTimeout時間一致為0
      expect(spySearchData).toHaveBeenCalledTimes(2);
    }));
    it('當執行onPageIndexChange(換頁), 需執行searchData重新撈取資料, searchData入參需為false', fakeAsync(() => {
      const spySearchData = spyOn(component, 'searchData').and.callThrough();
      fixture.detectChanges(); // 觸發ngOnInit
      tick(); // 讓第一次searchData異步完成異步完成
      expect(spySearchData).toHaveBeenCalledTimes(1);
      component.onPageIndexChange();
      tick();
      expect(spySearchData).toHaveBeenCalledTimes(2);
      expect(spySearchData.calls.mostRecent().args[0]).toEqual(false);
    }));
    it('當執行onPageIndexChange(換頁), onPageSizeChange執行中時,需不執行searchData', fakeAsync(() => {
      const spySearchData = spyOn(component, 'searchData').and.callThrough();
      fixture.detectChanges(); // 觸發ngOnInit
      tick(); // 讓第一次searchData異步完成異步完成
      expect(spySearchData).toHaveBeenCalledTimes(1);
      component.onPageSizeChange(); // this.pageSizeChanging = true;
      component.onPageIndexChange();
      tick();
      expect(spySearchData).toHaveBeenCalledTimes(2);
      expect(spySearchData.calls.mostRecent().args[0]).toEqual(true);
    }));
    it('當執行create(跳轉路由至新增作業), 需跳轉至新增頁', fakeAsync(() => {
      fixture.detectChanges(); // 觸發ngOnInit
      tick(); // 讓第一次searchData異步完成異步完成
      component.create();
      tick();
      expect(spyNavigate.calls.mostRecent().args[0]).toEqual(['../dw-document-order-create']);
    }));
    it('當執行modify(跳轉路由至修改作業), 需跳轉至修改頁', fakeAsync(() => {
      fixture.detectChanges(); // 觸發ngOnInit
      tick(); // 讓第一次searchData異步完成異步完成
      component.modify('ID1234');
      tick();
      expect(spyNavigate.calls.mostRecent().args[0]).toEqual(['../dw-document-order-modify']);
      expect(spyNavigate.calls.mostRecent().args[1].queryParams).toEqual({ orderId: 'ID1234' });
    }));
    it('當執行detail(跳轉路由至詳情作業), 需跳轉至詳情頁', fakeAsync(() => {
      fixture.detectChanges(); // 觸發ngOnInit
      tick(); // 讓第一次searchData異步完成異步完成
      component.detail('ID1234');
      tick();
      expect(spyNavigate.calls.mostRecent().args[0]).toEqual(['../dw-document-order-detail']);
      expect(spyNavigate.calls.mostRecent().args[1].queryParams).toEqual({ orderId: 'ID1234' });
    }));
    it('當執行delete, 需送出要刪除的資料', fakeAsync(() => {
      const spyDelete = spyOn(doc, 'delete').and.callThrough();
      fixture.detectChanges(); // 觸發ngOnInit
      tick(); // 讓第一次searchData異步完成異步完成
      component.delete(0);
      tick();
      expect(spyDelete.calls.mostRecent().args[0][0]).toEqual({
        'address': '台中市大里區',
        'customerid': 'c03',
        'employeeid': 'c02',
        'employeename': '',
        'gender': '',
        'orderdate': '2022/06/08 00:00:00',
        'orderid': '1591175815775',
        'status': 'C',
        'totalcount': 140,
        '$state': 'd'
      });
    }));
  });
  describe('個別條件測試', () => {
    describe('當執行this.doc.list', () => {
      beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
          imports: [
            DocumentOrderModule,
            NoopAnimationsModule,
            NzIconTestModule,
            RouterTestingModule,
            DwActionTestingModule,
            TranslateTestingModule
          ],
          providers: [
            {
              provide: NzModalService, useValue: {
                error: (options: any) => null
              }
            }
          ],
          declarations: [
            DocumentOrderListComponent,
          ],
        })
          .overrideProvider(DwDocument, {
            useValue: {
              list: (queryInfo: object): Observable<any> => {
                return throwError({ error: { errorMessage: 'bad reqeuest' } });
              }
            }
          })
          .compileComponents();
      }));

      beforeEach(() => {
        fixture = TestBed.createComponent(DocumentOrderListComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        doc = de.injector.get(DwDocument);
        spyDocList = spyOn(doc, 'list').and.callThrough();
        // fixture.detectChanges(); // 觸發ngOnInit
      });

      it('取資料錯誤時, 需執行dwModalService.error彈出錯誤訊息', fakeAsync(() => {
        const dwModalService = de.injector.get(NzModalService);
        const spyModalError = spyOn(dwModalService, 'error').and.callThrough();
        fixture.detectChanges(); // 觸發ngOnInit
        tick();
        expect(spyModalError).toHaveBeenCalled();
      }));
    });
  });
});

// @Pipe({
//   name: 'translate'
// })
// export class TranslatePipeMock implements PipeTransform {
//   public name = 'translate';

//   public transform(query: string, ...args: any[]): any {
//     return query;
//   }
// }

// @Injectable()
// export class TranslateServiceStub {
//   public instant(key: string, interpolateParams?: Object): string {
//     return key;
//   }
//   public get<T>(key: T): Observable<T> {
//     return of(key);
//   }
//   public onTranslationChange = of({ lang: 'TW' });
//   public onLangChange = of({ translations: null });
//   public onDefaultLangChange = of(true);
//   public currentLang = 'zh_TW';
// }

// @Directive({
//   selector: '[dwActionAuthorized]'
// })
// export class MockDwActionAuthorizedDirective implements AfterViewInit, OnDestroy {
//   @Input() dwAuthorizedId: string;
//   @Input() dwActionId: string;
//   @Input() dwDefaultAuthorized: string;
//   @Output() dwClick = new EventEmitter();
//   private clicks = new Subject();
//   private clicksSubscription: Subscription;
//   // 攔截宿主元素的 click 事件
//   @HostListener('click', ['$event', '$event.target']) clickEvent(event: any, elt: any): void {
//     // 阻止瀏覽器的默認行為和事件冒泡
//     event.preventDefault();
//     event.stopPropagation();

//     this.clicks.next(event); // 觸發clickFn <a dwActionAuthorized  (dwClick)="clickFn(data)>"

//   }
//   ngAfterViewInit(): void {
//     this.clicksSubscription = this.clicks.subscribe(
//       e => this.dwClick.emit(e) // 調用 EventEmitter 實例上的 emit() 方法，發出事件回父節點
//     );
//   }
//   ngOnDestroy(): void {
//     if (this.clicksSubscription) {
//       this.clicksSubscription.unsubscribe(); // 取消訂閱
//     }
//   }
// }
