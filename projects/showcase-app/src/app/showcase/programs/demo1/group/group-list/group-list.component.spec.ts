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
import { MasterModel } from '../model';
import { Demo1RepositoryModule } from '../../repository';
import { By } from '@angular/platform-browser';

import { DwTabClose, DwTabEvent, DwTabOpen, DwTabRoutingService } from '@webdpt/framework/routing-tabset';
import { GroupListComponent } from './group-list.component';
import { GroupService } from '../service/group.service';
import { GroupModule } from '../group.module';
import { GroupRoutingModule } from '../group-routing.module';
import { Subject } from 'rxjs';

describe('GroupListComponent', () => {
  let component: GroupListComponent;
  let fixture: ComponentFixture<GroupListComponent>;
  let de: DebugElement;
  let router: Router;
  let groupService: GroupService;
  let httpMocker: HttpTestingController;
  let commonGetGroupListReq: () => void;
  let spyGetGroupList: jasmine.Spy;
  let spyNavigateOrCreate: jasmine.Spy;
  let tabRoutingService: DwTabRoutingService;
  const eventSubject: Subject<DwTabEvent> = new Subject();

  const commonConfig = {
    imports: [
      HttpClientTestingModule,
      GroupModule,
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
          events: eventSubject.asObservable(), // 模擬新增及關閉頁籤事件訊息
          close: () => { },
          navigateOrCreate: (commands: any[], extras?: NavigationExtras, tabId?: string, title?: string) => void {},
          navigateToOpenerOrCreate: (commands: any[], extras?: NavigationExtras, tabId?: string, title?: string) => void {}
        }
      }
    ],
    declarations: [
      GroupListComponent,
    ]
  };
  describe('共用條件測試', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule(commonConfig)
        .overrideModule(GroupRoutingModule, { // 單元測試,只專注於當前component,故將原路由設置清空, 改用RouterTestingModule.withRoutes(routes)的配置
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
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(GroupListComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      router = fixture.debugElement.injector.get(Router);
      groupService = fixture.debugElement.injector.get(GroupService);
      tabRoutingService = fixture.debugElement.injector.get(DwTabRoutingService);
      spyGetGroupList = spyOn(groupService, 'getGroupList').and.callThrough();
      spyNavigateOrCreate = spyOn(tabRoutingService, 'navigateOrCreate').and.callThrough();
      httpMocker = TestBed.inject(HttpTestingController);
      commonGetGroupListReq = () => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const getGroupListReq = httpMocker.expectOne('showcase/demo1/getGroupList');
        getGroupListReq.flush(JSON.parse(JSON.stringify(getGroupListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
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
    describe('監聽多頁籤的事件', ()=>{
      it('如果是關閉的事件，且為從此作業開啟的新增，需刷新數據', fakeAsync(()=>{
        const spySearchData = spyOn(component, 'searchData').and.callThrough();
        commonGetGroupListReq();
        expect(spySearchData).toHaveBeenCalledTimes(1);
        eventSubject.next(new DwTabClose(
          'group-add-tab',
          'tabState.item.currentUrl',
          'dw-group',
          'dw-group',
          'program'
        ));
        commonGetGroupListReq();
        expect(spySearchData).toHaveBeenCalledTimes(2);
      }));
      it('如果是關閉的事件,event.tabId === this.viewDataTabId,需刷新數據', fakeAsync(()=>{
        const spySearchData = spyOn(component, 'searchData').and.callThrough();
        commonGetGroupListReq();
        expect(spySearchData).toHaveBeenCalledTimes(1);
        (component as any).viewDataTabId = 'mockViewDataTabId1234'; // 模擬開啟頁籤
        eventSubject.next(new DwTabClose(
          'mockViewDataTabId1234',
          'tabState.item.currentUrl',
          'dw-group',
          'dw-group',
          'program'
        ));
        commonGetGroupListReq();
        expect(spySearchData).toHaveBeenCalledTimes(2);
      }));
      it('如果不是關閉的事件,需不刷新數據', fakeAsync(()=>{
        const spySearchData = spyOn(component, 'searchData').and.callThrough();
        commonGetGroupListReq();
        expect(spySearchData).toHaveBeenCalledTimes(1);
        eventSubject.next(new DwTabOpen(
          'group-add-tab',
          'tabState.item.currentUrl',
          'dw-group',
          'dw-group',
          'program'
        ));
        expect(spySearchData).toHaveBeenCalledTimes(1);
      }));
    });

    it('當執行searchData時 需取得列表資料', fakeAsync(() => {
      commonGetGroupListReq();
      expect(spyGetGroupList).toHaveBeenCalled();
    }));
    describe('當執行sortBy時', () => {
      it('需送出排序資料', fakeAsync(() => {
        commonGetGroupListReq();
        const downIcon = de.query(By.css('i[nztype="caret-down"]')).nativeElement;
        downIcon.click();
        commonGetGroupListReq();
        expect(spyGetGroupList.calls.mostRecent().args[3][0]).toEqual({
          sortExpression: 'ascend',
          sortName: 'currencyId'
        });
      }));
      it('sortMap沒有對應的key值,需為null值', fakeAsync(() => {
        commonGetGroupListReq();
        const downIcon = de.query(By.css('i[nztype="caret-down"]')).nativeElement;
        downIcon.click();
        commonGetGroupListReq();
        expect(component.sortMap).toEqual({
          currencyId: 'ascend'
        });
        component.sortBy('groupName', 'ascend');
        commonGetGroupListReq();
        expect(component.sortMap).toEqual({
          currencyId: null
        });
      }));
      it('sortExpression為null值, 需不送出', fakeAsync(() => {
        commonGetGroupListReq();
        component.sortBy('groupId', null);
        commonGetGroupListReq();
        expect(component.sortMap).toEqual({
          currencyId: null
        });
        expect(spyGetGroupList.calls.mostRecent().args[3].length).toEqual(0);
      }));
    });
    describe('查詢條件', () => {
      it('resetForm需初始查詢條件', fakeAsync(() => {
        commonGetGroupListReq(); // 初始
        const queryBT = de.queryAll(By.css('button'))[0].nativeElement;
        const clearBT = de.queryAll(By.css('button'))[1].nativeElement;
        const idCtr = component.searchForm.get('groupId');
        idCtr.setValue('mockId123');
        fixture.detectChanges();
        tick(1000);
        queryBT.click();
        commonGetGroupListReq(); // 第一次查詢
        expect(spyGetGroupList.calls.mostRecent().args[2].groupId).toEqual('mockId123');
        clearBT.click(); // 清除
        queryBT.click();
        commonGetGroupListReq(); // 第二次查詢
        expect(spyGetGroupList.calls.mostRecent().args[2].groupId).toEqual('');
      }));
      it('onPageSizeChange每頁筆數改變, 需重新查詢資料', fakeAsync(() => {
        commonGetGroupListReq(); // 初始
        component.search.pageSize = 3;
        component.onPageSizeChange();
        commonGetGroupListReq();
        expect(spyGetGroupList.calls.mostRecent().args[1]).withContext('入參pageSize').toEqual(3);
      }));
      it('onPageIndexChange當前頁碼改變, 需重新查詢資料', fakeAsync(() => {
        commonGetGroupListReq(); // 初始
        component.search.pageIndex = 3;
        component.onPageIndexChange();
        commonGetGroupListReq();
        expect(spyGetGroupList.calls.mostRecent().args[0]).withContext('入參pageIndex').toEqual(3);
      }));
      it('當執行onPageIndexChange(換頁), onPageSizeChange執行中時,需不執行searchData', fakeAsync(() => {
        const spySearchData = spyOn(component, 'searchData').and.callThrough();
        commonGetGroupListReq(); // 初始
        expect(spySearchData).toHaveBeenCalledTimes(1);
        component.onPageSizeChange(); // this.pageSizeChanging = true;
        component.onPageIndexChange();
        commonGetGroupListReq();
        tick();
        expect(spySearchData).toHaveBeenCalledTimes(2);
        expect(spySearchData.calls.mostRecent().args[0]).toEqual(true);
      }));
    });
    it('按下編號檢視時(view)時, usingTab為true, 需以tabRoutingService.navigateOrCreate開啟路由', fakeAsync(() => {
      commonGetGroupListReq(); // 初始
      const viewTag = de.query(By.css('tbody tr td:nth-child(3) a')).nativeElement;
      viewTag.click();
      fixture.detectChanges();
      tick(1000);
      expect(spyNavigateOrCreate).toHaveBeenCalled();
    }));
    it('按下新增時(addDataModal)時, usingTab為true, 需以tabRoutingService.navigateOrCreate開啟路由', fakeAsync(() => {
      commonGetGroupListReq(); // 初始
      const addBT = de.queryAll(By.css('button'))[2].nativeElement;
      addBT.click();
      fixture.detectChanges();
      tick(1000);
      expect(spyNavigateOrCreate).toHaveBeenCalled();
    }));

    it('清單項目按下刪除時, showConfirm需被執行', fakeAsync(() => {
      const spyShowConfirm = spyOn(component, 'showConfirm').and.callThrough();
      commonGetGroupListReq(); // 初始
      const delBT = de.query(By.css('tbody tr td:nth-last-child(1) a')).nativeElement;
      delBT.click();
      fixture.detectChanges();
      tick(1000);
      const confirmBT = (document.querySelector('nz-modal-confirm-container .ant-modal-confirm-btns button:nth-child(2)'));
      expect(confirmBT).toBeTruthy();
    }));
    it('清單項目按下刪除時且確認, 項目需被刪除', fakeAsync(() => {
      // const spyShowConfirm = spyOn(component, 'showConfirm').and.callThrough();
      const spyDeleteGroups = spyOn(component, 'deleteGroups').and.callThrough();
      commonGetGroupListReq(); // 初始
      const delBT = de.query(By.css('tbody tr td:nth-last-child(1) a')).nativeElement;
      delBT.click();
      fixture.detectChanges();
      tick(1000);
      const confirmBT = (document.querySelector('nz-modal-confirm-container .ant-modal-confirm-btns button:nth-child(2)')) as HTMLButtonElement;
      confirmBT.click();
      commonGetGroupListReq(); // 重新查詢
      const getGroupListDeleteReq = httpMocker.expectOne('showcase/demo1/deleteGroupList');
      getGroupListDeleteReq.flush({
        'status': true,
        'description': '刪除成功'
      });
      commonGetGroupListReq(); // 重新查詢
      fixture.detectChanges();
      tick(1000);
      expect(spyDeleteGroups).toHaveBeenCalled();
    }));
    it('清單項目按下刪除時,按下取消, 項目需不被刪除', fakeAsync(() => {
      // const spyShowConfirm = spyOn(component, 'showConfirm').and.callThrough();
      const spyDeleteGroups = spyOn(component, 'deleteGroups').and.callThrough();
      commonGetGroupListReq(); // 初始
      const delBT = de.query(By.css('tbody tr td:nth-last-child(1) a')).nativeElement;
      delBT.click();
      fixture.detectChanges();
      tick(1000);
      const cancelBT = (document.querySelector('nz-modal-confirm-container .ant-modal-confirm-btns button:nth-child(1)')) as HTMLButtonElement;
      cancelBT.click();
      fixture.detectChanges();
      tick(1000);
      expect(spyDeleteGroups).not.toHaveBeenCalled();
    }));
    it('按下勾選全部(checkAll), dataSet資料需全部checked或不選取', fakeAsync(() => {
      commonGetGroupListReq(); // 初始
      expect((component.dataSet.filter(item => item?.checked && item.checked === true)).length).toEqual(0);
      const checkBT = de.query(By.css('thead tr th:nth-child(1) input')).nativeElement; // 勾選
      checkBT.click(); // 按下勾選全部
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      expect((component.dataSet.filter(item => item?.checked && item.checked === true)).length).toEqual(2);
      checkBT.click(); // 再按下不勾選全部
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      expect((component.dataSet.filter(item => item?.checked && item.checked === true)).length).toEqual(0);
    }));
    it('執行刪deleteOriginItem, 有比對到groupId,需刪除dataSet資料', fakeAsync(() => {
      commonGetGroupListReq(); // 初始
      const masterModel = new MasterModel({
        groupId: 'No_000001',
        groupName: 'mockname',
        status: 'Y',
      });
      expect(component.dataSet.findIndex(item => item.groupId === 'No_000001')).not.toEqual(-1);
      component.deleteOriginItem(masterModel);
      fixture.detectChanges();
      tick(1000);
      expect(component.dataSet.findIndex(item => item.groupId === 'No_000001')).toEqual(-1);
    }));
    it('執行刪deleteOriginItem, 沒有比對到groupId, 需不刪除dataSet資料', fakeAsync(() => {
      const masterModel = new MasterModel({
        groupId: 'No_99999',
        groupName: 'mockname',
        status: 'Y',
      });
      commonGetGroupListReq(); // 初始
      expect(component.dataSet.length).toEqual(2);
      component.deleteOriginItem(masterModel);
      fixture.detectChanges();
      tick(1000);
      expect(component.dataSet.length).toEqual(2);
    }));
    describe('按下最上層刪除(刪除勾選operateData)', () => {
      it('需刪除勾選項目', fakeAsync(() => {
        commonGetGroupListReq(); // 初始
        const spyDeleteGroup = spyOn(component, 'deleteGroups').and.callThrough();
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
        const getGroupListDeleteReq = httpMocker.expectOne('showcase/demo1/deleteGroupList');
        getGroupListDeleteReq.flush({
          'status': true,
          'description': '刪除成功'
        });
        const getGroupLisReq = httpMocker.expectOne('showcase/demo1/getGroupList');
        getGroupLisReq.flush({
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
        expect(spyDeleteGroup).toHaveBeenCalled();

      }));
      it('command !== "delete",需不執行刪除勾選項目', fakeAsync(() => {
        const spyDeleteGroup = spyOn(component, 'deleteGroups').and.callThrough();

        commonGetGroupListReq(); // 初始
        const checkBT = de.query(By.css('tbody tr td:nth-child(1) input')).nativeElement; // 勾選
        checkBT.click();
        fixture.detectChanges();
        tick(1000);
        component.operateData('add');
        fixture.detectChanges();
        tick(1000);

        expect(spyDeleteGroup).not.toHaveBeenCalled();

      }));
    });
  });
  describe('個別條件測試', ()=>{
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule(commonConfig)
        .overrideModule(GroupRoutingModule, { // 單元測試,只專注於當前component,故將原路由設置清空, 改用RouterTestingModule.withRoutes(routes)的配置
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
      fixture = TestBed.createComponent(GroupListComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      router = fixture.debugElement.injector.get(Router);
      groupService = fixture.debugElement.injector.get(GroupService);
      tabRoutingService = fixture.debugElement.injector.get(DwTabRoutingService);
      spyGetGroupList = spyOn(groupService, 'getGroupList').and.callThrough();
      spyNavigateOrCreate = spyOn(tabRoutingService, 'navigateOrCreate').and.callThrough();
      httpMocker = TestBed.inject(HttpTestingController);
      commonGetGroupListReq = () => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const getGroupListReq = httpMocker.expectOne('showcase/demo1/getGroupList');
        getGroupListReq.flush(JSON.parse(JSON.stringify(getGroupListResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
        fixture.detectChanges();
        tick(1000);
      };
      // fixture.detectChanges(); // 觸發ngOnInit
    });
    afterEach(() => {
      // After every test, assert that there are no more pending requests.
      httpMocker.verify();
    });
    it('非頁籤模式, 需不監聽多頁籤的事件', fakeAsync(()=>{
      commonGetGroupListReq();
      expect((component as any).tabEventSubscription).not.toBeTruthy();
    }));

  });
});

export const getGroupListResponse = {
  'currentPage': 1,
  'rowCount': 2,
  'pageCount': 1,
  'datas': [
    {
      'groupId': 'No_000001',
      'groupName': '欣欣',
      'currencyId': 'CNY',
      'currencyName': '人民幣',
      'sourceId': '123',
      'exchangeWay': 'auto',
      'exchangeSource': '1',
      'exchangeClass': '1',
      'status': 'Y',
      'groupDate': '2017/12/23',
      'statusDesc': '有效'
    },
    {
      'groupId': 'No_000002',
      'groupName': '嘉嘉',
      'currencyId': 'NTD',
      'currencyName': '新台幣',
      'sourceId': '456',
      'exchangeWay': 'custom',
      'exchangeSource': '2',
      'exchangeClass': '2',
      'status': 'Y',
      'groupDate': '2017/12/31',
      'statusDesc': '有效'
    }
  ]
};

