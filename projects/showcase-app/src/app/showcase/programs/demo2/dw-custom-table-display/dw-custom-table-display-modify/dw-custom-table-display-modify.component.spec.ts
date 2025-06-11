import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { NzIconTestModule } from 'ng-zorro-antd/icon/testing';
import { BehaviorSubject, of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { DwActionModule } from '@webdpt/components/action';
import { APP_DATE_FORMAT, DW_USING_TAB } from '@webdpt/framework/config';
import { DwTabRoutingService } from '@webdpt/framework/routing-tabset';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { NzModalService } from 'ng-zorro-antd/modal';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { DwCustomTableDisplayModifyComponent } from './dw-custom-table-display-modify.component';
import { DwCustomTableDisplayModule } from '../dw-custom-table-display.module';
import { DwCustomTableDisplayRoutingModule } from '../dw-custom-table-display-routing.module';
import { DwCustomTableDisplayService } from '../service/dw-custom-table-display.service';
import { DwTableConfigRepositoryStub } from '@webdpt/components/configurable/table/testing';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { DwRoutingMessageService } from '@webdpt/components/routing-message';
import { DwActionTestingModule, MockDwActionAuthorizedDirective } from '@webdpt/components/action/testing';
import { DwTableConfigRepository } from '@webdpt/components/configurable/table';
import { DwCommonRouterTestingModule } from '@webdpt/framework/sharedTest/common-router-test';

registerLocaleData(zh);

export class DwTabRoutingServiceStub {
  tabRouterChanged$: BehaviorSubject<any> = new BehaviorSubject({
    'componentType': DwCustomTableDisplayModifyComponent,
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

describe('DwCustomTableDisplayModifyComponent', () => {
  let component: DwCustomTableDisplayModifyComponent;
  let fixture: ComponentFixture<DwCustomTableDisplayModifyComponent>;
  let de: DebugElement;
  let router: Router;
  let dwModalService: NzModalService;
  let spyNavigate: jasmine.Spy;
  let dwTabRoutingService: DwTabRoutingService;
  const mockTabChange$ = new BehaviorSubject({
    'componentType': DwCustomTableDisplayModifyComponent,
    'currentId': '1665454704062120',
    'previousId': '1665466574402212',
    'currentRouterLink': '/dw-demo2/dw-custom-table-display/dw-custom-table-display-modify',
    'tabChanged': false
  });
  const commonConfig = {
    imports: [
      NoopAnimationsModule,
      NzIconTestModule,
      DwCommonRouterTestingModule,
      DwActionTestingModule,
      TranslateTestingModule,
      DwCustomTableDisplayModule,
    ],
    providers: [
      { provide: DwTableConfigRepository, useClass: DwTableConfigRepositoryStub },
      {
        provide: ActivatedRoute, useValue: {
          // data: of({}),
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
        provide: DwTabRoutingService, useValue: {
          tabRouterChanged: mockTabChange$.asObservable()
        }
      }
    ],
    declarations: [
      DwCustomTableDisplayModifyComponent
    ],
  };

  describe('共用條件測試', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule(commonConfig)
        .overrideModule(DwCustomTableDisplayRoutingModule, { // 單元測試,只專注於當前component,故將原路由設置清空, 改用RouterTestingModule.withRoutes(routes)的配置
          set: {
            imports: [],
            exports: []
          }
        })
        .overrideModule(DwActionModule, {
          set: {
            imports: [],
            declarations: [MockDwActionAuthorizedDirective],
            exports: [MockDwActionAuthorizedDirective]
          }
        })
        .overrideProvider(DwCustomTableDisplayService, {
          useValue: {
            getDwCustomTableDisplayDetail: (
              pageIndex: number,
              pageSize: number,
              searchParam: any,
              sortSet: any[]): Observable<any> => {
              return of({
                'master': {
                  'orderId': 'No_000001',
                  'status': 'Y',
                  'orderDate': '2017/12/22',
                  'customerId': 'C01',
                  'customerName': '櫃櫃傢俱股份有限公司',
                  'orderAddr': '台中市大里區中興路一段1號',
                  'total': 3903000,
                  'salesmanId': '1',
                  'salesmanName': '孙品品',
                  'gender': 'female'
                },
                'detail': [
                  {
                    'seq': 1,
                    'distributionStatus': '1',
                    'productCode': 'Product000001',
                    'productName': '高級訂製歐式鄉村風格酒櫃',
                    'price': 230000,
                    'quantity': 3,
                    'subtotal': 690000,
                    'distributionStatusDesc': '未出貨'
                  },
                  {
                    'seq': 2,
                    'distributionStatus': '1',
                    'productCode': 'Product000002',
                    'productName': '內崁式櫥櫃',
                    'price': 45000,
                    'quantity': 45,
                    'subtotal': 2025000,
                    'distributionStatusDesc': '未出貨'
                  },
                  {
                    'seq': 3,
                    'distributionStatus': '2',
                    'productCode': 'Product000003',
                    'productName': '皇家實木鏡面鑲鑽五層十門衣櫃組',
                    'price': 1000000,
                    'quantity': 1,
                    'subtotal': 1000000,
                    'distributionStatusDesc': '已出貨'
                  },
                  {
                    'seq': 4,
                    'distributionStatus': '4',
                    'productCode': 'Product000004',
                    'productName': '牛皮沙發',
                    'price': 88000,
                    'quantity': 2,
                    'subtotal': 176000,
                    'distributionStatusDesc': '已退貨'
                  },
                  {
                    'seq': 5,
                    'distributionStatus': 'B',
                    'productCode': 'Product000005',
                    'productName': '活動曬衣架',
                    'price': 7000,
                    'quantity': 1,
                    'subtotal': 7000,
                    'distributionStatusDesc': '已出已換'
                  },
                  {
                    'seq': 6,
                    'distributionStatus': '1',
                    'productCode': 'Product000006',
                    'productName': '轉盤圓形餐桌',
                    'price': 5000,
                    'quantity': 1,
                    'subtotal': 5000,
                    'distributionStatusDesc': '未出貨'
                  }
                ]
              });
            },
            modifyDwCustomTableDisplay: () => of({
              description: '修改成功',
              status: true
            }),
            getDateFormat: (): string => 'yyyy/MM/dd',
            orderDetailMaxSeq: (): number => 99
          }
        })
        .overrideProvider(NzModalService, {
          useValue: {
            create: (option: any) => {
              const detailEditForm = new FormBuilder().group({});
              detailEditForm.addControl('productCode', new FormControl('productCode1234'));
              detailEditForm.addControl('productName', new FormControl('productName'));
              detailEditForm.addControl('price', new FormControl(10));
              detailEditForm.addControl('quantity', new FormControl(1));

              option.nzOnOk({ detailEditForm: detailEditForm }); // 手動觸發
              option.nzOnCancel(); // 手動觸發
            }
          }
        })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(DwCustomTableDisplayModifyComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      router = de.injector.get(Router);
      dwModalService = de.injector.get(NzModalService);
      dwTabRoutingService = de.injector.get(DwTabRoutingService);
      spyNavigate = spyOn(router, 'navigate').and.callThrough();

    });


    it('should create', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000);
      expect(component).toBeTruthy();
    }));
    it('getFormControl需取得formControl', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000);
      expect(component.getFormControl('formDetail') instanceof FormArray).toBeTrue();
    }));
    it('getFormControl需取得formControl', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000);
      expect(component.getFormControl('formDetail') instanceof FormArray).toBeTrue();
    }));
    it('detailDelete需刪除訂單明細', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000);
      expect(component.formDetail.controls.length).toEqual(6);
      component.detailDelete(0);
      fixture.detectChanges();
      tick(1000);
      expect(component.formDetail.controls.length).toEqual(5);
    }));
    it('detailModify, 需變更明細資料', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000);
      component.detailModify(0);
      fixture.detectChanges();
      tick(1000);
      expect(component.getFormDetailValue(0, 'productCode')).toEqual('productCode1234');
    }));
    it('detailAdd, 需新增明細資料', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000);
      component.detailAdd();
      fixture.detectChanges();
      tick(1000);
      expect(component.
        getFormDetailValue((component.getFormControl('formDetail') as FormArray).length - 1, 'productCode')).toEqual('productCode1234');
    }));
    it('cancel, 需回上一層路由', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000);
      component.cancel();
      fixture.detectChanges();
      tick(1000);
      expect(spyNavigate.calls.mostRecent().args[0]).withContext('回到上層路由').toEqual(['../']);
    }));
    describe('save', () => {
      it('onBeforeSaveDwCustomTableDisplay需被執行', fakeAsync(() => {
        const spyOnBeforeSaveDwCustomTableDisplay = spyOn(component, 'onBeforeSaveDwCustomTableDisplay').and.callThrough();
        fixture.detectChanges();
        tick(1000);
        component.save();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(spyOnBeforeSaveDwCustomTableDisplay).toHaveBeenCalled();
      }));
      it('onAfterSaveDwCustomTableDisplay需被執行', fakeAsync(() => {
        const spyOnAfterSaveDwCustomTableDisplay = spyOn(component, 'onAfterSaveDwCustomTableDisplay').and.callThrough();
        fixture.detectChanges();
        tick(1000);
        component.save();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(spyOnAfterSaveDwCustomTableDisplay).toHaveBeenCalled();
      }));
    });
    describe('tabInfoSubscription', () => {
      it('頁籤模式下,同頁籤(tabChanged為false,表示DwCustomTableDisplayModifyComponent未銷毀再次進入),需initDetail讀取資料', fakeAsync(() => {
        const spyInitDetail = spyOn(component as any, 'initDetail').and.callThrough();
        fixture.detectChanges();
        tick(1000);
        expect(spyInitDetail).toHaveBeenCalledTimes(1);
        mockTabChange$.next({
          'componentType': DwCustomTableDisplayModifyComponent,
          'currentId': '1665454704062120',
          'previousId': '1665466574402212',
          'currentRouterLink': '/dw-demo2/dw-custom-table-display/dw-custom-table-display-modify',
          'tabChanged': false
        });
        fixture.detectChanges();
        tick(1000);
        expect(spyInitDetail).toHaveBeenCalledTimes(2);
      }));
      it('onDestroy, 需取消訂閱', fakeAsync(() => {
        const spyUnsubscribe = spyOn((component as any).tabInfoSubscription, 'unsubscribe').and.callThrough();
        fixture.detectChanges();
        tick(1000);
        fixture.destroy(); // 執行ngOnDestroy
        expect(spyUnsubscribe).toHaveBeenCalled();
      }));
    });
  });
  describe('個別條件測試', () => {
    it('非頁籤, 需不訂閱tabRouterChanged', fakeAsync(() => {
      TestBed.configureTestingModule(commonConfig)
        .overrideModule(DwCustomTableDisplayRoutingModule, { // 單元測試,只專注於當前component,故將原路由設置清空, 改用RouterTestingModule.withRoutes(routes)的配置
          set: {
            imports: [],
            exports: []
          }
        })
        .overrideModule(DwActionModule, {
          set: {
            imports: [],
            declarations: [MockDwActionAuthorizedDirective],
            exports: [MockDwActionAuthorizedDirective]
          }
        })
        .overrideProvider(DwCustomTableDisplayService, {
          useValue: {
            getDwCustomTableDisplayDetail: (
              pageIndex: number,
              pageSize: number,
              searchParam: any,
              sortSet: any[]): Observable<any> => {
              return of({
                'master': {
                  'orderId': 'No_000001',
                  'status': 'Y',
                  'orderDate': '2017/12/22',
                  'customerId': 'C01',
                  'customerName': '櫃櫃傢俱股份有限公司',
                  'orderAddr': '台中市大里區中興路一段1號',
                  'total': 3903000,
                  'salesmanId': '1',
                  'salesmanName': '孙品品',
                  'gender': 'female'
                },
                'detail': [
                  {
                    'seq': 1,
                    'distributionStatus': '1',
                    'productCode': 'Product000001',
                    'productName': '高級訂製歐式鄉村風格酒櫃',
                    'price': 230000,
                    'quantity': 3,
                    'subtotal': 690000,
                    'distributionStatusDesc': '未出貨'
                  }
                ]
              });
            },
            modifyDwCustomTableDisplay: () => of({
              description: '修改成功',
              status: true
            }),
            getDateFormat: (): string => 'yyyy/MM/dd',
            orderDetailMaxSeq: (): number => 99
          }
        })
        .overrideProvider(DW_USING_TAB, { useValue: false }) // 不使用頁籤
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(DwCustomTableDisplayModifyComponent);
          component = fixture.componentInstance;
          de = fixture.debugElement;
          fixture.detectChanges();
          tick(1000);
          expect(((component as any).tabInfoSubscription)._subscriptions).toEqual(null);
          // // 以下為了onDestroy的覆蓋率
          (component as any).tabInfoSubscription = null;
          fixture.detectChanges();
          fixture.destroy();
        });
    }));
    it('modify失敗, 需顯示訊息', fakeAsync(() => {
      TestBed.configureTestingModule(commonConfig)
        .overrideModule(DwCustomTableDisplayRoutingModule, { // 單元測試,只專注於當前component,故將原路由設置清空, 改用RouterTestingModule.withRoutes(routes)的配置
          set: {
            imports: [],
            exports: []
          }
        })
        .overrideModule(DwActionModule, {
          set: {
            imports: [],
            declarations: [MockDwActionAuthorizedDirective],
            exports: [MockDwActionAuthorizedDirective]
          }
        })
        .overrideProvider(DwCustomTableDisplayService, {
          useValue: {
            getDwCustomTableDisplayDetail: (
              pageIndex: number,
              pageSize: number,
              searchParam: any,
              sortSet: any[]): Observable<any> => {
              return of({
                'master': {
                  'orderId': 'No_000001',
                  'status': 'Y',
                  'orderDate': '2017/12/22',
                  'customerId': 'C01',
                  'customerName': '櫃櫃傢俱股份有限公司',
                  'orderAddr': '台中市大里區中興路一段1號',
                  'total': 3903000,
                  'salesmanId': '1',
                  'salesmanName': '孙品品',
                  'gender': 'female'
                },
                'detail': [
                  {
                    'seq': 1,
                    'distributionStatus': '1',
                    'productCode': 'Product000001',
                    'productName': '高級訂製歐式鄉村風格酒櫃',
                    'price': 230000,
                    'quantity': 3,
                    'subtotal': 690000,
                    'distributionStatusDesc': '未出貨'
                  }
                ]
              });
            },
            modifyDwCustomTableDisplay: () => of({
              description: '修改失敗',
              status: false
            }),
            getDateFormat: (): string => 'yyyy/MM/dd',
            orderDetailMaxSeq: (): number => 99
          }
        })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(DwCustomTableDisplayModifyComponent);
          component = fixture.componentInstance;
          de = fixture.debugElement;
          const dwMessage = de.injector.get(DwRoutingMessageService);
          const spyOnAfterSaveDwCustomTableDisplay = spyOn(component, 'onAfterSaveDwCustomTableDisplay').and.callThrough();
          const spySuccess = spyOn(dwMessage, 'success').and.callThrough();
          fixture.detectChanges();
          tick(1000);
          component.save();
          fixture.detectChanges();
          tick(1000);
          fixture.detectChanges();
          tick(1000);
          fixture.detectChanges();
          tick(1000);
          expect(spyOnAfterSaveDwCustomTableDisplay).toHaveBeenCalled();
          expect(spySuccess.calls.mostRecent().args[0]).toEqual('修改失敗');
        });
    }));
  });
});

