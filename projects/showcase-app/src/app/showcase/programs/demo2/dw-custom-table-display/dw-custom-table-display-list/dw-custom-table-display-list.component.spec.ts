import {
  Component, DebugElement
} from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { NzIconTestModule } from 'ng-zorro-antd/icon/testing';
import { of, timer } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { DwActionModule } from '@webdpt/components/action';
import { DwCustomTableDisplayListComponent } from './dw-custom-table-display-list.component';
import { DwCustomTableDisplayRoutingModule } from '../dw-custom-table-display-routing.module';
import { DwCustomTableDisplayService } from '../service/dw-custom-table-display.service';
import { DwCustomTableDisplayModule } from '../dw-custom-table-display.module';
import { DwTableConfigRepository, DwTableConfigService } from '@webdpt/components/configurable/table';
import { switchMap } from 'rxjs/operators';
import { By } from '@angular/platform-browser';
import { DwCustomTableDisplayGenderModel } from '../model/enum.model';
import { DwActionTestingModule, MockDwActionAuthorizedDirective } from '@webdpt/components/action/testing';
import { DwTableConfigRepositoryStub } from '@webdpt/components/configurable/table/testing';
import { DwCommonRouterTestingModule } from '@webdpt/framework/sharedTest/common-router-test';




describe('DwCustomTableDisplayListComponent', () => {
  let component: DwCustomTableDisplayListComponent;
  let fixture: ComponentFixture<DwCustomTableDisplayListComponent>;
  let de: DebugElement;
  let router: Router;
  let spyNavigate: jasmine.Spy;
  let dwCustomTableDisplayService: DwCustomTableDisplayService;
  describe('共用條件測試', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          DwCustomTableDisplayModule,
          NoopAnimationsModule,
          NzIconTestModule,
          DwCommonRouterTestingModule,
          DwActionTestingModule,
          TranslateTestingModule,
        ],
        providers: [
          { provide: DwTableConfigRepository, useClass: DwTableConfigRepositoryStub }
        ],
        declarations: [
          DwCustomTableDisplayListComponent
        ]
      })
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
            getDwCustomTableDisplayList: (
              pageIndex: number,
              pageSize: number,
              searchParam: any,
              sortSet: any[]): Observable<any> => {
              return of({
                'currentPage': 1,
                'rowCount': 46,
                'pageCount': 5,
                'datas': [
                  {
                    'orderId': 'No_000044',
                    'status': 'Y',
                    'orderDate': '2018/01/25',
                    'customerId': 'C03',
                    'customerName': '急速貨運有限公司',
                    'orderAddr': '台北市內湖區民政里瑞光路七段8巷168號',
                    'total': 3790,
                    'salesmanId': '29',
                    'salesmanName': '钱国柔',
                    'gender': 'female',
                    'genderDesc': '女',
                    'statusDesc': '有效'
                  },
                  {
                    'orderId': 'No_000030',
                    'status': 'Y',
                    'orderDate': '2018/01/11',
                    'customerId': 'C03',
                    'customerName': '急速貨運有限公司',
                    'orderAddr': '台北市內湖區民政里瑞光路七段8巷168號',
                    'total': 22000,
                    'salesmanId': '30',
                    'salesmanName': '钱国妤',
                    'gender': 'female',
                    'genderDesc': '女',
                    'statusDesc': '有效'
                  },
                  {
                    'orderId': 'No_000005',
                    'status': 'Y',
                    'orderDate': '2017/12/25',
                    'customerId': 'C03',
                    'customerName': '急速貨運有限公司',
                    'orderAddr': '台北市內湖區民政里瑞光路七段8巷168號',
                    'total': 130000,
                    'salesmanId': '5',
                    'salesmanName': '钱品冲',
                    'gender': 'male',
                    'genderDesc': '男',
                    'statusDesc': '有效'
                  }
                ]
              });
            }
          }
        })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(DwCustomTableDisplayListComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      router = fixture.debugElement.injector.get(Router);
      spyNavigate = spyOn(router, 'navigate').and.callThrough();
      dwCustomTableDisplayService = fixture.debugElement.injector.get(DwCustomTableDisplayService);
      // fixture.detectChanges(); // 觸發ngOnInit
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
    describe('dwTableConfigService.columnConfigSubject$取得後', () => {
      let spyGetDwCustomTableDisplayList: jasmine.Spy;
      it('getDwCustomTableDisplayList需取得列表資料', fakeAsync(() => {
        spyGetDwCustomTableDisplayList = spyOn(dwCustomTableDisplayService, 'getDwCustomTableDisplayList').and.callThrough();
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000); // 讓第一次searchData異步完成
        // 讓自定義表格異步完成
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(spyGetDwCustomTableDisplayList).toHaveBeenCalled();
      }));
      it('按下過濾性別,ExFilter及ExSearch需被執行', fakeAsync(() => {
        const spyExFilter = spyOn(component, 'ExFilter').and.callThrough();
        const spyExSearch = spyOn(component, 'ExSearch').and.callThrough();
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000); // 讓第一次searchData異步完成
        // 讓自定義表格異步完成
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(component.dataSet.length).toEqual(3);
        const filterEle = de.queryAll(By.css('th nz-table-filter nz-filter-trigger span i'))[0].nativeElement;
        filterEle.click(); // 點出彈窗
        fixture.detectChanges();
        tick(1000);
        const femaleCheckbox = document.querySelectorAll('.cdk-overlay-container input[type="checkbox"]')[1] as HTMLInputElement;
        femaleCheckbox.click(); // 勾選女
        fixture.detectChanges();
        tick(1000);
        const confirmBT = document.querySelectorAll('.cdk-overlay-container button')[1] as HTMLInputElement;
        confirmBT.click(); // 按下確認
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(spyExFilter).toHaveBeenCalled();
        expect(spyExSearch).toHaveBeenCalled();
        expect(component.dataSet.length).toEqual(2);
      }));
    });
    describe('查詢條件', () => {
      it('性別改變,DwCustomTableDisplayGenderModel.resetList及DwCustomTableDisplayGenderModel.setChecked需被執行', fakeAsync(() => {
        const spyResetList = spyOn(DwCustomTableDisplayGenderModel, 'resetList').and.callThrough();
        const spySetChecked = spyOn(DwCustomTableDisplayGenderModel, 'setChecked').and.callThrough();
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000); // 讓第一次searchData異步完成
        // 讓自定義表格異步完成
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);

        const advanceQueryTag = de.queryAll(By.css('form a'))[0].nativeElement;
        advanceQueryTag.click();
        fixture.detectChanges();
        tick(1000);
        const genderCtr = component.searchForm.get('gender');
        genderCtr.setValue(['female']);
        fixture.detectChanges();
        tick(1000);
        expect(spyResetList).toHaveBeenCalled();
        expect(spySetChecked).toHaveBeenCalled();
        // const sexSelectElem = de.queryAll(By.css('nz-select-top-control'))[0].nativeElement;
        // sexSelectElem.click();
        // fixture.detectChanges();
        // tick(1000);
      }));
      it('filterGender執行,需送出性別條件', fakeAsync(() => {
        const spyGetDwCustomTableDisplayList = spyOn(dwCustomTableDisplayService, 'getDwCustomTableDisplayList').and.callThrough();
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000); // 讓第一次searchData異步完成
        // 讓自定義表格異步完成
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);

        const advanceQueryTag = de.queryAll(By.css('form a'))[0].nativeElement;
        advanceQueryTag.click();
        fixture.detectChanges();
        tick(1000);
        const genderCtr = component.searchForm.get('gender');
        genderCtr.setValue(['female']); // 選擇女
        fixture.detectChanges();
        tick(1000);
        component.filterGender(true);
        fixture.detectChanges();
        tick(1000);
        expect(spyGetDwCustomTableDisplayList.calls.mostRecent().args[2].gender).toEqual(['female']);
      }));
      it('resetFilterGender執行,genders資料checked需為false', fakeAsync(() => {
        const spyGetDwCustomTableDisplayList = spyOn(dwCustomTableDisplayService, 'getDwCustomTableDisplayList').and.callThrough();
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000); // 讓第一次searchData異步完成
        // 讓自定義表格異步完成
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);

        const advanceQueryTag = de.queryAll(By.css('form a'))[0].nativeElement;
        advanceQueryTag.click();
        fixture.detectChanges();
        tick(1000);
        const genderCtr = component.searchForm.get('gender');
        genderCtr.setValue(['female']); // 選擇女
        fixture.detectChanges();
        tick(1000);
        component.resetFilterGender();
        fixture.detectChanges();
        tick(1000);
        expect(component.genders[1].checked).toEqual(false);
        expect(spyGetDwCustomTableDisplayList.calls.mostRecent().args[2].gender).toEqual(['female']);
      }));
      it('resetForm需初始查詢條件', fakeAsync(() => {
        const spyGetDwCustomTableDisplayList = spyOn(dwCustomTableDisplayService, 'getDwCustomTableDisplayList').and.callThrough();
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000); // 讓第一次searchData異步完成
        // 讓自定義表格異步完成
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);

        const advanceQueryTag = de.queryAll(By.css('form a'))[0].nativeElement;
        advanceQueryTag.click();
        fixture.detectChanges();
        tick(1000);
        const genderCtr = component.searchForm.get('gender');
        genderCtr.setValue(['female']);
        fixture.detectChanges();
        tick(1000);
        component.searchData(); // 第一次查詢
        fixture.detectChanges();
        tick(1000);
        expect(spyGetDwCustomTableDisplayList.calls.mostRecent().args[2].gender).toEqual(['female']);
        component.resetForm();
        component.searchData(); // resetForm後查詢
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(spyGetDwCustomTableDisplayList.calls.mostRecent().args[2].gender).toEqual([]);
      }));
      it('onPageSizeChange每頁筆數改變, 需重新查詢資料', fakeAsync(() => {
        const spyGetDwCustomTableDisplayList = spyOn(dwCustomTableDisplayService, 'getDwCustomTableDisplayList').and.callThrough();
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000); // 讓第一次searchData異步完成
        // 讓自定義表格異步完成
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        component.search.pageSize = 3;
        component.onPageSizeChange();
        fixture.detectChanges();
        tick(1000);
        expect(spyGetDwCustomTableDisplayList.calls.mostRecent().args[1]).toEqual(3);
      }));
      it('onPageIndexChange當前頁碼改變, 需重新查詢資料', fakeAsync(() => {
        const spyGetDwCustomTableDisplayList = spyOn(dwCustomTableDisplayService, 'getDwCustomTableDisplayList').and.callThrough();
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000); // 讓第一次searchData異步完成
        // 讓自定義表格異步完成
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        component.search.pageIndex = 3;
        component.onPageIndexChange();
        fixture.detectChanges();
        tick(1000);
        expect(spyGetDwCustomTableDisplayList.calls.mostRecent().args[0]).toEqual(3);
      }));
      it('modify需前往dw-custom-table-display-modify路由', fakeAsync(() => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000); // 讓第一次searchData異步完成
        // 讓自定義表格異步完成
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        component.modify('ID1234');
        tick();
        expect(spyNavigate.calls.mostRecent().args[0]).toEqual(['../dw-custom-table-display-modify']);
        expect(spyNavigate.calls.mostRecent().args[1].queryParams).toEqual({ orderId: 'ID1234' });
      }));
    });
  });
  describe('個別條件測試', () => {
    let spyGetDwCustomTableDisplayList: jasmine.Spy;
    describe('取得表單自定義設定>tableConfig.dwColumnConfig.length>0,有自定義表格設定', () => {
      it('需執行sortBy', fakeAsync(() => {
        TestBed.configureTestingModule({
          imports: [
            DwCustomTableDisplayModule,
            NoopAnimationsModule,
            NzIconTestModule,
            DwCommonRouterTestingModule,
            DwActionTestingModule,
            TranslateTestingModule,
          ],
          providers: [],
          declarations: [
            DwCustomTableDisplayListComponent
          ],
        })
          .overrideModule(DwCustomTableDisplayRoutingModule, {
            // 單元測試,只專注於當前component,故將原路由設置清空, 改用RouterTestingModule.withRoutes(routes)的配置
            set: {
              imports: [],
              exports: []
            }
          })
          .overrideProvider(DwCustomTableDisplayService, {
            useValue: {
              getDwCustomTableDisplayList: (
                pageIndex: number,
                pageSize: number,
                searchParam: any,
                sortSet: any[]): Observable<any> => {
                return of({
                  'currentPage': 1,
                  'rowCount': 46,
                  'pageCount': 5,
                  'datas': [
                    {
                      'orderId': 'No_000044',
                      'status': 'Y',
                      'orderDate': '2018/01/25',
                      'customerId': 'C03',
                      'customerName': '急速貨運有限公司',
                      'orderAddr': '台北市內湖區民政里瑞光路七段8巷168號',
                      'total': 3790,
                      'salesmanId': '29',
                      'salesmanName': '钱国柔',
                      'gender': 'female',
                      'genderDesc': '女',
                      'statusDesc': '有效'
                    },
                    {
                      'orderId': 'No_000030',
                      'status': 'Y',
                      'orderDate': '2018/01/11',
                      'customerId': 'C03',
                      'customerName': '急速貨運有限公司',
                      'orderAddr': '台北市內湖區民政里瑞光路七段8巷168號',
                      'total': 22000,
                      'salesmanId': '30',
                      'salesmanName': '钱国妤',
                      'gender': 'female',
                      'genderDesc': '女',
                      'statusDesc': '有效'
                    }
                  ]
                });
              }
            }
          })
          .overrideProvider(DwTableConfigRepository, {
            useValue: {
              getTableConfig(dwTableId: string, userId?: string): Observable<any> {
                // 不直接使用of, 才不會造成作業component測試時發生ExpressionChangedAfterItHasBeenCheckedError錯誤
                return timer(0).pipe(switchMap(val => {
                  return of({
                    'default_config': {},
                    'user_config': {
                      'config': {
                        'dwColumnConfig': [
                          {
                            'dwColumnId': 'orderId',
                            'index': 0,
                            'visible': true,
                            'filter': null
                          },
                          {
                            'dwColumnId': 'status',
                            'index': 1,
                            'visible': true,
                            'filter': null
                          },
                          {
                            'dwColumnId': 'orderDate',
                            'index': 2,
                            'visible': true,
                            'filter': null
                          },
                          {
                            'dwColumnId': 'total',
                            'index': 3,
                            'visible': true,
                            'filter': null
                          },
                          {
                            'dwColumnId': 'customerId',
                            'index': 4,
                            'visible': true,
                            'filter': null
                          },
                          {
                            'dwColumnId': 'customerName',
                            'index': 5,
                            'visible': true,
                            'filter': null
                          },
                          {
                            'dwColumnId': 'orderAddr',
                            'index': 6,
                            'visible': true,
                            'filter': null
                          },
                          {
                            'dwColumnId': 'salesmanName',
                            'index': 7,
                            'visible': true,
                            'filter': null
                          },
                          {
                            'dwColumnId': 'genderDesc',
                            'index': 8,
                            'visible': true,
                            'filter': null
                          }
                        ]
                      }
                    }
                  });
                }));
              }
            }
          })
          .compileComponents()
          .then(() => {
            fixture = TestBed.createComponent(DwCustomTableDisplayListComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            router = fixture.debugElement.injector.get(Router);
            spyNavigate = spyOn(router, 'navigate').and.callThrough();
            dwCustomTableDisplayService = fixture.debugElement.injector.get(DwCustomTableDisplayService);

            const spySortBy = spyOn(component, 'sortBy').and.callThrough();
            fixture.detectChanges(); // 觸發ngOnInit
            tick(1000); // 讓第一次searchData異步完成
            // 讓自定義表格異步完成
            fixture.detectChanges();
            tick(1000);
            fixture.detectChanges();
            tick(1000);
            expect(spySortBy).toHaveBeenCalled();
          });
      }));
      it('tableConfig.dwColumnConfig[key].sort有值, 需執行this.search.addSortSet', fakeAsync(() => {
        TestBed.configureTestingModule({
          imports: [
            DwCustomTableDisplayModule,
            NoopAnimationsModule,
            NzIconTestModule,
            DwCommonRouterTestingModule,
            DwActionTestingModule,
            TranslateTestingModule,
          ],
          providers: [
            { provide: DwTableConfigRepository, useClass: DwTableConfigRepositoryStub }
          ],
          declarations: [
            DwCustomTableDisplayListComponent
          ],
        })
          .overrideModule(DwCustomTableDisplayRoutingModule, {
            // 單元測試,只專注於當前component,故將原路由設置清空, 改用RouterTestingModule.withRoutes(routes)的配置
            set: {
              imports: [],
              exports: []
            }
          })
          .overrideProvider(DwCustomTableDisplayService, {
            useValue: {
              getDwCustomTableDisplayList: (
                pageIndex: number,
                pageSize: number,
                searchParam: any,
                sortSet: any[]): Observable<any> => {
                return of({
                  'currentPage': 1,
                  'rowCount': 46,
                  'pageCount': 5,
                  'datas': [
                    {
                      'orderId': 'No_000044',
                      'status': 'Y',
                      'orderDate': '2018/01/25',
                      'customerId': 'C03',
                      'customerName': '急速貨運有限公司',
                      'orderAddr': '台北市內湖區民政里瑞光路七段8巷168號',
                      'total': 3790,
                      'salesmanId': '29',
                      'salesmanName': '钱国柔',
                      'gender': 'female',
                      'genderDesc': '女',
                      'statusDesc': '有效'
                    },
                    {
                      'orderId': 'No_000030',
                      'status': 'Y',
                      'orderDate': '2018/01/11',
                      'customerId': 'C03',
                      'customerName': '急速貨運有限公司',
                      'orderAddr': '台北市內湖區民政里瑞光路七段8巷168號',
                      'total': 22000,
                      'salesmanId': '30',
                      'salesmanName': '钱国妤',
                      'gender': 'female',
                      'genderDesc': '女',
                      'statusDesc': '有效'
                    }
                  ]
                });
              }
            }
          })
          .overrideProvider(DwTableConfigRepository, {
            useValue: {
              getTableConfig(dwTableId: string, userId?: string): Observable<any> {
                // 不直接使用of, 才不會造成作業component測試時發生ExpressionChangedAfterItHasBeenCheckedError錯誤
                return timer(0).pipe(switchMap(val => {
                  return of({
                    'default_config': {},
                    'user_config': {
                      'config': {
                        'dwColumnConfig': [
                          {
                            'dwColumnId': 'orderId',
                            'index': 0,
                            'visible': true,
                            'filter': null
                          },
                          {
                            'dwColumnId': 'status',
                            'index': 1,
                            'visible': true,
                            'filter': null
                          },
                          {
                            'dwColumnId': 'orderDate',
                            'index': 2,
                            'visible': true,
                            'filter': null
                          },
                          {
                            'dwColumnId': 'total',
                            'index': 3,
                            'visible': true,
                            'sort': 'descend',
                            'filter': null
                          },
                          {
                            'dwColumnId': 'customerId',
                            'index': 4,
                            'visible': true,
                            'filter': null
                          },
                          {
                            'dwColumnId': 'customerName',
                            'index': 5,
                            'visible': true,
                            'filter': null
                          },
                          {
                            'dwColumnId': 'orderAddr',
                            'index': 6,
                            'visible': true,
                            'filter': null
                          },
                          {
                            'dwColumnId': 'salesmanName',
                            'index': 7,
                            'visible': true,
                            'filter': null
                          },
                          {
                            'dwColumnId': 'genderDesc',
                            'index': 8,
                            'visible': true,
                            'filter': null
                          }
                        ]
                      }
                    }
                  });
                }));
              }
            }
          })
          .compileComponents()
          .then(() => {
            fixture = TestBed.createComponent(DwCustomTableDisplayListComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            router = fixture.debugElement.injector.get(Router);
            spyNavigate = spyOn(router, 'navigate').and.callThrough();
            dwCustomTableDisplayService = fixture.debugElement.injector.get(DwCustomTableDisplayService);

            const spySortBy = spyOn(component, 'sortBy').and.callThrough();
            spyGetDwCustomTableDisplayList = spyOn(dwCustomTableDisplayService, 'getDwCustomTableDisplayList').and.callThrough();
            fixture.detectChanges(); // 觸發ngOnInit
            tick(1000); // 讓第一次searchData異步完成
            // 讓自定義表格異步完成
            fixture.detectChanges();
            tick(1000);
            fixture.detectChanges();
            tick(1000);
            expect(spyGetDwCustomTableDisplayList.calls.argsFor(0)[3]).toEqual([{ sortName: 'total', sortExpression: 'descend' }]);
            expect(spySortBy).toHaveBeenCalled();
          });
      }));
    });
  });
});

