/* eslint-disable max-len */
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { NzIconTestModule } from 'ng-zorro-antd/icon/testing';
import { DwActionModule } from '@webdpt/components/action';
import { DwActionTestingModule, MockDwActionAuthorizedDirective } from '@webdpt/components/action/testing';
import { DwCommonRouterTestingModule } from '@webdpt/framework/sharedTest/common-router-test';
import { APP_DATE_FORMAT, APP_TIME_FORMAT, DW_USING_TAB } from '@webdpt/framework/config';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StatusModel } from '../model';
import { Demo1RepositoryModule } from '../../repository';
import { By } from '@angular/platform-browser';
import { AsisModule } from '../asis.module';
import { AsisListComponent } from './asis-list.component';
import { AsisService } from '../service/asis.service';
import { AsisRoutingModule } from '../asis-routing.module';
import { DwTabRoutingService } from '@webdpt/framework/routing-tabset';

describe('AsisListComponent', () => {
  let component: AsisListComponent;
  let fixture: ComponentFixture<AsisListComponent>;
  let de: DebugElement;
  let router: Router;
  let spyNavigate: jasmine.Spy;
  let asisService: AsisService;
  let httpMocker: HttpTestingController;
  let commonGetAsisListReq: () => void;
  let spyGetAsisList: jasmine.Spy;
  let spyNavigateOrCreate: jasmine.Spy;
  let tabRoutingService: DwTabRoutingService;
  const commonConfig = {
    imports: [
      HttpClientTestingModule,
      AsisModule,
      Demo1RepositoryModule,
      NoopAnimationsModule,
      NzIconTestModule,
      DwCommonRouterTestingModule,  // 所有路由都導到這裏設定
      DwActionTestingModule,
      TranslateTestingModule,
    ],
    providers: [
      { provide: DW_USING_TAB, useValue: true },
      { provide: APP_DATE_FORMAT, useValue: 'yyyy/MM/dd' },
      { provide: APP_TIME_FORMAT, useValue: 'hh:mm:ss' },
      {
        provide: DwTabRoutingService, useValue: {
          close: () => { },
          navigateOrCreate: (commands: any[], extras?: NavigationExtras, tabId?: string, title?: string) => void {},
          navigateToOpenerOrCreate: (commands: any[], extras?: NavigationExtras, tabId?: string, title?: string) => void {}
        }
      }
    ],
    declarations: [
      AsisListComponent,
    ]
  };
  describe('共用條件測試', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule(commonConfig)
        .overrideModule(AsisRoutingModule, { // 單元測試,只專注於當前component,故將原路由設置清空, 改用RouterTestingModule.withRoutes(routes)的配置
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
        // .overrideProvider(AsisService, {
        //   useValue: {
        //   }
        // })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(AsisListComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      router = fixture.debugElement.injector.get(Router);
      spyNavigate = spyOn(router, 'navigate').and.callThrough();
      asisService = fixture.debugElement.injector.get(AsisService);
      tabRoutingService = fixture.debugElement.injector.get(DwTabRoutingService);
      spyGetAsisList = spyOn(asisService, 'getAsisList').and.callThrough();
      spyNavigateOrCreate = spyOn(tabRoutingService, 'navigateOrCreate').and.callThrough();
      httpMocker = TestBed.inject(HttpTestingController);
      commonGetAsisListReq = () => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const getAsisListReq = httpMocker.expectOne('showcase/demo1/getAsisList');
        getAsisListReq.flush(JSON.parse(JSON.stringify(getAsisListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
        fixture.detectChanges();
        tick(1000);
      };
      // fixture.detectChanges(); // 觸發ngOnInit
    });
    afterEach(() => {
      // After every test, assert that there are no more pending requests.
      httpMocker.verify();
    });
    it('should create', () => {
      expect(component).toBeTruthy();
    });
    describe('當執行searchData時', () => {
      it('需取得列表資料', fakeAsync(() => {
        commonGetAsisListReq();
        expect(spyGetAsisList).toHaveBeenCalled();
      }));
    });
    describe('當執行sortBy時', () => {
      it('需送出排序資料', fakeAsync(() => {
        commonGetAsisListReq();
        const downIcon = de.query(By.css('i[nztype="caret-down"]')).nativeElement;
        downIcon.click();
        commonGetAsisListReq();
        expect(spyGetAsisList.calls.mostRecent().args[3][0]).toEqual({
          sortExpression:'ascend',
          sortName: 'asisId'
        });
      }));
      it('sortMap沒有對應的key值,需為null值', fakeAsync(() => {
        commonGetAsisListReq();
        const downIcon = de.query(By.css('i[nztype="caret-down"]')).nativeElement;
        downIcon.click();
        commonGetAsisListReq();
        expect(component.sortMap).toEqual({
          asisId:'ascend'
        });
        component.sortBy('asisName', 'ascend');
        commonGetAsisListReq();
        expect(component.sortMap).toEqual({
          asisId: null
        });
      }));
      it('sortExpression為null值, 需不送出', fakeAsync(() => {
        commonGetAsisListReq();
        component.sortBy('asisId', null);
        commonGetAsisListReq();
        expect(component.sortMap).toEqual({
          asisId: null
        });
        expect(spyGetAsisList.calls.mostRecent().args[3].length).toEqual(0);
      }));
    });
    describe('查詢條件', () => {
      it('resetForm需初始查詢條件', fakeAsync(() => {
        commonGetAsisListReq(); // 初始
        const queryBT = de.queryAll(By.css('button'))[0].nativeElement;
        const clearBT = de.queryAll(By.css('button'))[1].nativeElement;
        const idCtr = component.searchForm.get('asisId');
        idCtr.setValue('mockId123');
        fixture.detectChanges();
        tick(1000);
        queryBT.click();
        commonGetAsisListReq(); // 第一次查詢
        expect(spyGetAsisList.calls.mostRecent().args[2].asisId).toEqual('mockId123');
        clearBT.click(); // 清除
        queryBT.click();
        commonGetAsisListReq(); // 第二次查詢
        expect(spyGetAsisList.calls.mostRecent().args[2].asisId).toEqual('');
      }));
      it('onPageSizeChange每頁筆數改變, 需重新查詢資料', fakeAsync(() => {
        commonGetAsisListReq(); // 初始
        component.search.pageSize = 3;
        component.onPageSizeChange();
        commonGetAsisListReq();
        expect(spyGetAsisList.calls.mostRecent().args[1]).withContext('入參pageSize').toEqual(3);
      }));
      it('onPageIndexChange當前頁碼改變, 需重新查詢資料', fakeAsync(() => {
        commonGetAsisListReq(); // 初始
        component.search.pageIndex = 3;
        component.onPageIndexChange();
        commonGetAsisListReq();
        expect(spyGetAsisList.calls.mostRecent().args[0]).withContext('入參pageIndex').toEqual(3);
      }));
      it('當執行onPageIndexChange(換頁), onPageSizeChange執行中時,需不執行searchData', fakeAsync(() => {
        const spySearchData = spyOn(component, 'searchData').and.callThrough();
        commonGetAsisListReq(); // 初始
        expect(spySearchData).toHaveBeenCalledTimes(1);
        component.onPageSizeChange(); // this.pageSizeChanging = true;
        component.onPageIndexChange();
        commonGetAsisListReq();
        tick();
        expect(spySearchData).toHaveBeenCalledTimes(2);
        expect(spySearchData.calls.mostRecent().args[0]).toEqual(true);
      }));
    });
    it('按下編號檢視時(view)時, usingTab為true, 需以tabRoutingService.navigateOrCreate開啟路由', fakeAsync(()=>{
      commonGetAsisListReq(); // 初始
      const viewTag = de.query(By.css('tbody tr td:nth-child(2) a')).nativeElement;
      viewTag.click();
      fixture.detectChanges();
      tick(1000);
      expect(spyNavigateOrCreate).toHaveBeenCalled();
    }));
    it('按下新增時(addDataModal)時, usingTab為true, 需以tabRoutingService.navigateOrCreate開啟路由', fakeAsync(()=>{
      commonGetAsisListReq(); // 初始
      const addBT = de.queryAll(By.css('button'))[2].nativeElement;
      addBT.click();
      fixture.detectChanges();
      tick(1000);
      expect(spyNavigateOrCreate).toHaveBeenCalled();
    }));

    it('清單項目按下刪除時, showConfirm需被執行', fakeAsync(()=>{
      const spyShowConfirm = spyOn(component, 'showConfirm').and.callThrough();
      commonGetAsisListReq(); // 初始
      const delBT = de.query(By.css('tbody tr td:nth-child(5) a')).nativeElement;
      delBT.click();
      fixture.detectChanges();
      tick(1000);
      const confirmBT = (document.querySelector('nz-modal-confirm-container .ant-modal-confirm-btns button:nth-child(2)'));
      expect(confirmBT).toBeTruthy();
    }));
    it('清單項目按下刪除時且確認, 項目需被刪除', fakeAsync(()=>{
      // const spyShowConfirm = spyOn(component, 'showConfirm').and.callThrough();
      const spyDeleteAsiss = spyOn(component, 'deleteAsiss').and.callThrough();
      commonGetAsisListReq(); // 初始
      const delBT = de.query(By.css('tbody tr td:nth-child(5) a')).nativeElement;
      delBT.click();
      fixture.detectChanges();
      tick(1000);
      const confirmBT = (document.querySelector('nz-modal-confirm-container .ant-modal-confirm-btns button:nth-child(2)')) as HTMLButtonElement;
      confirmBT.click();
      commonGetAsisListReq(); // 重新查詢
      const getAsisListDeleteReq = httpMocker.expectOne('showcase/demo1/deleteAsisList');
      getAsisListDeleteReq.flush({
        'status': true,
        'description': '刪除成功'
      });
      commonGetAsisListReq(); // 重新查詢
      fixture.detectChanges();
      tick(1000);
      expect(spyDeleteAsiss).toHaveBeenCalled();
    }));
    it('按下勾選全部(checkAll), dataSet資料需全部checked或不選取', fakeAsync(()=>{
      commonGetAsisListReq(); // 初始
      expect((component.dataSet.filter(item=> item?.checked && item.checked=== true)).length).toEqual(0);
      const checkBT = de.query(By.css('thead tr th:nth-child(1) input')).nativeElement; // 勾選
      checkBT.click(); // 按下勾選全部
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      expect((component.dataSet.filter(item=> item?.checked && item.checked=== true)).length).toEqual(2);
      checkBT.click(); // 再按下不勾選全部
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      expect((component.dataSet.filter(item=> item?.checked && item.checked=== true)).length).toEqual(0);
    }));
    it('執行刪deleteOriginItem, 有比對到asisId,需刪除dataSet資料', fakeAsync(()=>{
      commonGetAsisListReq(); // 初始
      expect(component.dataSet.findIndex(item=> item.asisId=== 'No_000001')).not.toEqual(-1);
      component.deleteOriginItem({
        asisId: 'No_000001',
        asisName: 'mockname',
        note: 'mocknote',
        status: 'Y',
        asisDate: new Date()
      });
      fixture.detectChanges();
      tick(1000);
      expect(component.dataSet.findIndex(item=> item.asisId=== 'No_000001')).toEqual(-1);
    }));
    it('執行刪deleteOriginItem, 沒有比對到asisId, 需不刪除dataSet資料', fakeAsync(()=>{
      commonGetAsisListReq(); // 初始
      expect(component.dataSet.length).toEqual(2);
      component.deleteOriginItem({
        asisId: 'No_99999',
        asisName: 'mockname',
        note: 'mocknote',
        status: 'Y',
        asisDate: new Date()
      });
      fixture.detectChanges();
      tick(1000);
      expect(component.dataSet.length).toEqual(2);
    }));

    describe('按下最上層刪除(刪除勾選operateData)', ()=>{
      it('需刪除勾選項目', fakeAsync(()=>{
        const spyDeleteAsiss = spyOn(component, 'deleteAsiss').and.callThrough();

        commonGetAsisListReq(); // 初始
        const checkBT = de.query(By.css('tbody tr td:nth-child(1) input')).nativeElement; // 勾選
        checkBT.click();
        fixture.detectChanges();
        tick(1000);
        const delBT = de.query(By.css('.dw-f-btn-bar-action button:nth-child(2)')).nativeElement; // 刪除
        delBT.click();
        fixture.detectChanges();
        tick(1000);
        const confirmBT = (document.querySelector('nz-modal-confirm-container .ant-modal-confirm-btns button:nth-child(2)')) as HTMLButtonElement;
        confirmBT.click(); // 確認
        const getAsisListDeleteReq = httpMocker.expectOne('showcase/demo1/deleteAsisList');
        getAsisListDeleteReq.flush({
          'status': true,
          'description': '刪除成功'
        });
        const getAsisLisReq = httpMocker.expectOne('showcase/demo1/getAsisList');
        getAsisLisReq.flush({
          'currentPage': 1,
          'rowCount': 0,
          'pageCount': 1,
          'datas': []
        });
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(spyDeleteAsiss).toHaveBeenCalled();

      }));
      it('command !== "delete",需不執行刪除勾選項目', fakeAsync(()=>{
        const spyDeleteAsiss = spyOn(component, 'deleteAsiss').and.callThrough();

        commonGetAsisListReq(); // 初始
        const checkBT = de.query(By.css('tbody tr td:nth-child(1) input')).nativeElement; // 勾選
        checkBT.click();
        fixture.detectChanges();
        tick(1000);
        component.operateData('add');
        fixture.detectChanges();
        tick(1000);

        expect(spyDeleteAsiss).not.toHaveBeenCalled();

      }));
    });
  });
  describe('個別條件測試', ()=>{
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule(commonConfig)
        .overrideModule(AsisRoutingModule, { // 單元測試,只專注於當前component,故將原路由設置清空, 改用RouterTestingModule.withRoutes(routes)的配置
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
        .overrideProvider(DW_USING_TAB, { // 改為不使用頁籤
          useValue: false
        })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(AsisListComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      router = fixture.debugElement.injector.get(Router);
      spyNavigate = spyOn(router, 'navigate').and.callThrough();
      asisService = fixture.debugElement.injector.get(AsisService);
      tabRoutingService = fixture.debugElement.injector.get(DwTabRoutingService);
      spyGetAsisList = spyOn(asisService, 'getAsisList').and.callThrough();
      spyNavigateOrCreate = spyOn(tabRoutingService, 'navigateOrCreate').and.callThrough();
      httpMocker = TestBed.inject(HttpTestingController);
      commonGetAsisListReq = () => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const getAsisListReq = httpMocker.expectOne('showcase/demo1/getAsisList');
        getAsisListReq.flush(JSON.parse(JSON.stringify(getAsisListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
        fixture.detectChanges();
        tick(1000);
      };
      // fixture.detectChanges(); // 觸發ngOnInit
    });
    afterEach(() => {
      // After every test, assert that there are no more pending requests.
      httpMocker.verify();
    });
    it('按下編號檢視時(view)時, usingTab為false, 需以router.navigate開啟路由', fakeAsync(()=>{
      commonGetAsisListReq(); // 初始
      const viewTag = de.query(By.css('tbody tr td:nth-child(2) a')).nativeElement;
      viewTag.click();
      fixture.detectChanges();
      tick(1000);
      expect(spyNavigate).toHaveBeenCalled();
    }));
    it('按下新增時(addDataModal)時, usingTab為false, 需以router.navigate開啟路由', fakeAsync(()=>{
      commonGetAsisListReq(); // 初始
      const addBT = de.queryAll(By.css('button'))[2].nativeElement;
      addBT.click();
      fixture.detectChanges();
      tick(1000);
      expect(spyNavigate).toHaveBeenCalled();
    }));
  });
});

export const getAsisListResponse = {
  'currentPage': 1,
  'rowCount': 2,
  'pageCount': 2,
  'datas': [
    {
      'asisId': 'No_000001',
      'asisName': '標準資產負債分析',
      'note': '這是備註這是備註這是備註',
      'status': 'Y',
      'asisDate': '2017/12/23',
      'statusDesc': '有效'
    },
    {
      'asisId': 'No_000002',
      'asisName': '標準資產負債分析',
      'note': '這是備註這是備註這是備註',
      'status': 'N',
      'asisDate': '2017/12/23',
      'statusDesc': '無效'
    }
  ]
};

