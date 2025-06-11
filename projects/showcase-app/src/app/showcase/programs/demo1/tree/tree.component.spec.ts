/* eslint-disable max-len */
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { NzIconTestModule } from 'ng-zorro-antd/icon/testing';
import { DwActionModule } from '@webdpt/components/action';
import { DwActionTestingModule, MockDwActionAuthorizedDirective } from '@webdpt/components/action/testing';
import { DwCommonRouterTestingModule } from '@webdpt/framework/sharedTest/common-router-test';
import { APP_DATE_FORMAT, APP_TIME_FORMAT, DW_LOAD_MASK_DELAY, DW_LOAD_MASK_HTTP } from '@webdpt/framework/config';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { ShowcaseTreeComponent } from './tree.component';
import { DwLoadingMaskService } from '@webdpt/components/loading';
import { ShowcaseTreeModule } from './tree.module';
import { Overlay } from '@angular/cdk/overlay';
import { DwLanguageService } from '@webdpt/framework/language';

describe('ShowcaseTreeComponent', () => {
  let component: ShowcaseTreeComponent;
  let fixture: ComponentFixture<ShowcaseTreeComponent>;
  let de: DebugElement;
  let router: Router;
  let dwLoadingMaskService: DwLoadingMaskService;

  const commonConfig = {
    imports: [
      HttpClientTestingModule,
      ShowcaseTreeModule,
      NoopAnimationsModule,
      NzIconTestModule,
      DwActionTestingModule,
      TranslateTestingModule,
      DwCommonRouterTestingModule,  // 所有路由都導到這裏設定
    ],
    providers: [
      { provide: DwLanguageService, useValue: { language$: of('zh_TW') } }, // DwLanguageStylePipe(dwLanguage)使用到
      Overlay,
      { provide: DW_LOAD_MASK_HTTP, useValue: true },
      { provide: DW_LOAD_MASK_DELAY, useValue: 100 },
      DwLoadingMaskService,
      { provide: APP_DATE_FORMAT, useValue: 'yyyy/MM/dd' },
      { provide: APP_TIME_FORMAT, useValue: 'hh:mm:ss' },
    ],
    declarations: [
      ShowcaseTreeComponent,
    ]
  };
  describe('共用條件測試', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule(commonConfig)
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
      fixture = TestBed.createComponent(ShowcaseTreeComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      router = fixture.debugElement.injector.get(Router);
      dwLoadingMaskService = fixture.debugElement.injector.get(DwLoadingMaskService);

      // fixture.detectChanges(); // 觸發ngOnInit
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
    describe('ngOnInit', () => {
      it('需將原始資料轉換為DataModel類型, convertTreeToList需被執行', fakeAsync(() => {
        const spyConvertTreeToList = spyOn(component, 'convertTreeToList').and.callThrough();
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        expect(spyConvertTreeToList).toHaveBeenCalled();
        expect(component.expandDataCache['1'][0].hasOwnProperty('expand')).toBeTrue();
        expect(component.expandDataCache['1'][0].hasOwnProperty('checked')).toBeTrue();
      }));
      it('需將expandDataCache資料加入checkData, checkDataChange需被執行', fakeAsync(() => {
        const spyCheckDataChange = spyOn(component, 'checkDataChange').and.callThrough();
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        expect(spyCheckDataChange).toHaveBeenCalled();
        expect(component.checkData.length).toEqual(9);
      }));
    });
    it('搜尋框需可過濾組織資料', fakeAsync(() => {
      fixture.detectChanges(); // 觸發ngOnInit
      tick(1000);
      const searchInput = de.query(By.css('input[type="search"]')).nativeElement;
      searchInput.value = 'Joe';
      searchInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      expect(de.queryAll(By.css('tr')).length).toEqual(2);
    }));
    describe('新建(組織)', () => {
      it('按下, 需開窗', fakeAsync(() => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const addItem = de.query(By.css('i[nztype="plus"]')).nativeElement;
        addItem.click();
        fixture.detectChanges();
        tick(1000);
        expect(document.querySelector('app-dw-showcase-data-modal')).toBeTruthy();
      }));
      it('按下保存, 需關窗', fakeAsync(() => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const addItem = de.query(By.css('i[nztype="plus"]')).nativeElement;
        addItem.click();
        fixture.detectChanges();
        tick(1000);
        const inputs = document.querySelectorAll('app-dw-showcase-data-modal input');
        (inputs[3] as HTMLInputElement).value = '1';
        inputs[3].dispatchEvent(new Event('input'));
        (inputs[4] as HTMLInputElement).value = '2';
        inputs[4].dispatchEvent(new Event('input'));
        (inputs[5] as HTMLInputElement).value = '3';
        inputs[5].dispatchEvent(new Event('input'));
        fixture.detectChanges();
        tick(1000);
        const saveBT = document.querySelector('app-dw-showcase-data-modal button[ng-reflect-nz-type="primary"]');
        (saveBT as HTMLButtonElement).click();
        fixture.detectChanges();
        tick(1000);
        expect(document.querySelector('app-dw-showcase-data-modal')).toBeNull();
      }));
      it('按下取消, 需關窗', fakeAsync(() => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const addItem = de.query(By.css('i[nztype="plus"]')).nativeElement;
        addItem.click();
        fixture.detectChanges();
        tick(1000);
        const cancelBT = document.querySelector('app-dw-showcase-data-modal button[ng-reflect-nz-type="default"]');
        (cancelBT as HTMLButtonElement).click();
        fixture.detectChanges();
        tick(1000);
        expect(document.querySelector('app-dw-showcase-data-modal')).toBeNull();
      }));
      it('新建新組織, 需可新增', fakeAsync(() => {
        spyOn((component as any).dwModalService, 'create').and.callFake((config: any) => {
          config.nzOnOk({
            validateForm: {
              value: {
                type: 1,
                parent: [],
                name: 'mockName',
                address: 'mockAddress',
                amount: 100,
                status: true
              }
            }
          });
        });
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        expect(Object.keys(component.expandDataCache).length).toEqual(2);
        const addItem = de.query(By.css('i[nztype="plus"]')).nativeElement;
        addItem.click();
        fixture.detectChanges();
        tick(1000);
        expect(Object.keys(component.expandDataCache).length).toEqual(3);
      }));
      it('子分支, 需可新增至父分支下', fakeAsync(() => {
        const spyCreate = spyOn((component as any).dwModalService, 'create').and.callFake((config: any) => {
          config.nzOnOk({
            validateForm: {
              value: {
                type: 2,
                parent: [2],
                name: 'mockName',
                address: 'mockAddress',
                amount: 100,
                status: true
              }
            }
          });
        });
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const addItem = de.query(By.css('i[nztype="plus"]')).nativeElement;
        addItem.click();
        fixture.detectChanges();
        tick(1000);
        expect(component.expandDataCache['2'][0].children[0].name).toEqual('mockName');
      }));
    });
    describe('展開收合', () => {
      it('按下展開, 需顯示子項', fakeAsync(() => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const expendBT = de.query(By.css('tr:nth-child(1) td:nth-child(1) button')).nativeElement;
        expendBT.click();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(component.expandDataCache['1'][0].expand).toBeTrue();
      }));
      it('按下收合, 需不顯示子項', fakeAsync(() => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const expendBT = de.query(By.css('tr:nth-child(1) td:nth-child(1) button')).nativeElement;
        expendBT.click();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(component.expandDataCache['1'][0].expand).toBeTrue();
        const closeBT = de.query(By.css('tr:nth-child(1) td:nth-child(1) button')).nativeElement;
        closeBT.click();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(component.expandDataCache['1'][0].expand).toBeFalse();
      }));
    });
    describe('勾選', () => {
      it('主項目按下勾選, 子項目需一同被勾選', fakeAsync(() => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const checkInput = de.query(By.css('tr:nth-child(1) td:nth-child(1) input')).nativeElement;
        checkInput.click();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(component.expandDataCache['1'][0].checked).toBeTrue();
        expect(component.expandDataCache['1'][1].checked).toBeTrue();
      }));
      it('子項目取消勾選, 主項目需不被勾選', fakeAsync(() => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        // 先展開
        const expendBT = de.query(By.css('tr:nth-child(1) td:nth-child(1) button')).nativeElement;
        expendBT.click();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        // 先勾選主項目
        const checkInput = de.query(By.css('tr:nth-child(1) td:nth-child(1) input')).nativeElement;
        checkInput.click();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        // 再取消勾選子項目
        const uncheckInput = de.query(By.css('tr:nth-child(2) td:nth-child(1) input')).nativeElement;
        uncheckInput.click();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(component.expandDataCache['1'][0].checked).toBeFalse();
        expect(component.expandDataCache['1'][1].checked).toBeFalse();
      }));
      it('孫項目取消勾選, 父項目及主項目需不被勾選', fakeAsync(() => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        // 先展開
        const expendBT = de.query(By.css('tr:nth-child(1) td:nth-child(1) button')).nativeElement;
        expendBT.click();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        // 再展開次項
        const expendBT2 = de.query(By.css('tr:nth-child(3) td:nth-child(1) button')).nativeElement;
        expendBT2.click();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        // 先勾選主項目
        const checkInput = de.query(By.css('tr:nth-child(1) td:nth-child(1) input')).nativeElement;
        checkInput.click();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        // 再取消勾選孫項目
        const uncheckInput = de.query(By.css('tr:nth-child(4) td:nth-child(1) input')).nativeElement;
        uncheckInput.click();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(component.expandDataCache['1'][0].checked).toBeFalse();
        expect(component.expandDataCache['1'][2].checked).toBeFalse();
      }));
    });
    describe('編輯(組織)', () => {
      it('按下, 需開窗', fakeAsync(() => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const editItem = de.query(By.css('tr:nth-child(1) td:last-child a:nth-child(1)')).nativeElement;
        editItem.click();
        fixture.detectChanges();
        tick(1000);
        expect(document.querySelector('app-dw-showcase-edit-data-modal')).toBeTruthy();
      }));
      it('按下保存, 需關窗', fakeAsync(() => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const editItem = de.query(By.css('tr:nth-child(1) td:last-child a:nth-child(1)')).nativeElement;
        editItem.click();
        fixture.detectChanges();
        tick(1000);
        const saveBT = document.querySelector('app-dw-showcase-edit-data-modal button[ng-reflect-nz-type="primary"]');
        (saveBT as HTMLButtonElement).click();
        fixture.detectChanges();
        tick(1000);
        expect(document.querySelector('app-dw-showcase-edit-data-modal')).toBeNull();
      }));
      it('按下保存, 找不到originData對應的節點, 需不重整', fakeAsync(() => {
        spyOn((component as any).dwModalService, 'create').and.callFake((config: any) => {
          config.nzOnOk({
            validateForm: {
              value: {
                key: 456, // 不存在節點
                type: 2,
                parent: [2],
                name: 'mockName',
                address: 'mockAddress',
                amount: 100,
                status: true
              }
            }
          });
        });
        const spyOninit = spyOn(component, 'ngOnInit').and.callThrough();
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const editItem = de.query(By.css('tr:nth-child(1) td:last-child a:nth-child(1)')).nativeElement;
        editItem.click();
        fixture.detectChanges();
        tick(1000);

        expect(spyOninit).not.toHaveBeenCalled();
      }));
      it('按下取消, 需關窗', fakeAsync(() => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const editItem = de.query(By.css('tr:nth-child(1) td:last-child a:nth-child(1)')).nativeElement;
        editItem.click();
        fixture.detectChanges();
        tick(1000);
        const cancelBT = document.querySelector('app-dw-showcase-edit-data-modal button[ng-reflect-nz-type="default"]');
        (cancelBT as HTMLButtonElement).click();
        fixture.detectChanges();
        tick(1000);
        expect(document.querySelector('app-dw-showcase-edit-data-modal')).toBeNull();
      }));
    });
    describe('刪除', () => {
      it('按下, 需開啟確認窗', fakeAsync(() => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const editItem = de.query(By.css('tr:nth-child(1) td:last-child a:nth-child(2)')).nativeElement;
        editItem.click();
        fixture.detectChanges();
        tick(1000);
        const delElem = (document.querySelector('.cdk-overlay-container .ant-dropdown ul li a'));
        (delElem as HTMLAnchorElement).click();
        fixture.detectChanges();
        tick(1000);
        expect(document.querySelector('nz-modal-confirm-container')).toBeTruthy();
      }));
      it('按下確認刪除, 需刪除節點', fakeAsync(() => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const editItem = de.query(By.css('tr:nth-child(1) td:last-child a:nth-child(2)')).nativeElement;
        editItem.click();
        fixture.detectChanges();
        tick(1000);
        const delElem = (document.querySelector('.cdk-overlay-container .ant-dropdown ul li a'));
        (delElem as HTMLAnchorElement).click();
        fixture.detectChanges();
        tick(1000);
        const confirmBT = document.querySelector('nz-modal-confirm-container button[ng-reflect-nz-type="primary"]');
        (confirmBT as HTMLButtonElement).click();
        fixture.detectChanges();
        tick(1000);
        expect(component.originData.length).toEqual(1);
      }));
      it('按下確認刪除子項目, 需刪除originData.children節點資料', fakeAsync(() => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        // 先展開
        const expendBT = de.query(By.css('tr:nth-child(1) td:nth-child(1) button')).nativeElement;
        expendBT.click();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(component.originData[0].children.length).toEqual(3);
        // 編輯子項目
        const editItem = de.query(By.css('tr:nth-child(2) td:last-child a:nth-child(2)')).nativeElement;
        editItem.click();
        fixture.detectChanges();
        tick(1000);
        const delElem = (document.querySelector('.cdk-overlay-container .ant-dropdown ul li a'));
        (delElem as HTMLAnchorElement).click();
        fixture.detectChanges();
        tick(1000);
        const confirmBT = document.querySelector('nz-modal-confirm-container button[ng-reflect-nz-type="primary"]');
        (confirmBT as HTMLButtonElement).click();
        fixture.detectChanges();
        tick(1000);
        expect(component.originData[0].children.length).toEqual(2);
      }));
      it('按下確認刪除子項目, 需刪除originData.children節點資料, 如果為最後一筆, 需刪除父節點parent屬性', fakeAsync(() => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        // 先展開
        const expendBT = de.query(By.css('tr:nth-child(1) td:nth-child(1) button')).nativeElement;
        expendBT.click();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(component.originData[0].children.length).toEqual(3);
        // 再展開次項
        const expendBT2 = de.query(By.css('tr:nth-child(3) td:nth-child(1) button')).nativeElement;
        expendBT2.click();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        // // 編輯子項目
        const editItem = de.query(By.css('tr:nth-child(4) td:last-child a:nth-child(2)')).nativeElement;
        editItem.click();
        fixture.detectChanges();
        tick(1000);
        // 刪除
        const delElem = (document.querySelector('.cdk-overlay-container .ant-dropdown ul li a'));
        (delElem as HTMLAnchorElement).click();
        fixture.detectChanges();
        tick(1000);
        const confirmBT = document.querySelector('nz-modal-confirm-container button[ng-reflect-nz-type="primary"]');
        (confirmBT as HTMLButtonElement).click();
        fixture.detectChanges();
        tick(1000);
        expect(component.originData[0].children[1].hasOwnProperty('children')).toBeFalse();
      }));
      it('按下取消刪除, 需關閉確認窗', fakeAsync(() => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const editItem = de.query(By.css('tr:nth-child(1) td:last-child a:nth-child(2)')).nativeElement;
        editItem.click();
        fixture.detectChanges();
        tick(1000);
        const delElem = (document.querySelector('.cdk-overlay-container .ant-dropdown ul li a'));
        (delElem as HTMLAnchorElement).click();
        fixture.detectChanges();
        tick(1000);
        const cancelBT = document.querySelector('.ant-modal-confirm-btns button:nth-child(1)');
        (cancelBT as HTMLButtonElement).click();
        fixture.detectChanges();
        tick(1000);
        expect(document.querySelector('nz-modal-confirm-container')).toBeNull();
        expect(component.originData.length).toEqual(2);
      }));
    });
    describe('批量操作', () => {
      it('按下組織勾選, 需全選', fakeAsync(() => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const checkItem = de.query(By.css('th input')).nativeElement;
        checkItem.click();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(component.expandDataCache['1'][0].checked).toBeTrue();
        expect(component.expandDataCache['2'][0].checked).toBeTrue();
      }));
      it('取消組織勾選, 需取消全選', fakeAsync(() => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        // 勾選
        const checkItem = de.query(By.css('th input')).nativeElement;
        checkItem.click();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        // 再按一次取消勾選
        const unCheckItem = de.query(By.css('th input')).nativeElement;
        unCheckItem.click();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(component.expandDataCache['1'][0].checked).toBeFalse();
        expect(component.expandDataCache['2'][0].checked).toBeFalse();
      }));
      it('按下組織勾選, 按下批量需跳出選項', fakeAsync(() => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const checkItem = de.query(By.css('th input')).nativeElement;
        checkItem.click();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        const handleBT = de.query(By.css('.dw-f-btn-bar-action button:nth-child(2)')).nativeElement;
        handleBT.click();
        fixture.detectChanges();
        tick(1000);
        expect(document.querySelector('.cdk-overlay-container ul li')).toBeTruthy();
      }));
      it('按下刪除選項, 需跳出確認視窗', fakeAsync(() => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const checkItem = de.query(By.css('th input')).nativeElement;
        checkItem.click();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        const handleBT = de.query(By.css('.dw-f-btn-bar-action button:nth-child(2)')).nativeElement;
        handleBT.click();
        fixture.detectChanges();
        tick(1000);
        const delAllItem = document.querySelector('.cdk-overlay-container ul li');
        (delAllItem as HTMLLIElement).click();
        fixture.detectChanges();
        tick(1000);
        expect(document.querySelector('nz-modal-confirm-container')).toBeTruthy();
      }));
      it('按下加載遮罩選項, 需跳出加載', fakeAsync(() => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const checkItem = de.query(By.css('th input')).nativeElement;
        checkItem.click();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        const handleBT = de.query(By.css('.dw-f-btn-bar-action button:nth-child(2)')).nativeElement;
        handleBT.click();
        fixture.detectChanges();
        tick(1000);
        const maskItem = document.querySelector('.cdk-overlay-container ul li:nth-child(2) div');
        (maskItem as HTMLDivElement).click();
        fixture.detectChanges();
        tick(10000);
        expect(document.querySelector('dw-loading-http')).toBeTruthy();
      }));
      it('按下確認刪除, 需刪除資料', fakeAsync(() => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const checkItem = de.query(By.css('th input')).nativeElement;
        checkItem.click();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        const handleBT = de.query(By.css('.dw-f-btn-bar-action button:nth-child(2)')).nativeElement;
        handleBT.click();
        fixture.detectChanges();
        tick(1000);
        const delAllItem = document.querySelector('.cdk-overlay-container ul li');
        (delAllItem as HTMLLIElement).click();
        fixture.detectChanges();
        tick(1000);
        const confirmBT = document.querySelector('nz-modal-confirm-container button[ng-reflect-nz-type="primary"]');
        (confirmBT as HTMLButtonElement).click();
        fixture.detectChanges();
        tick(10000);
        fixture.detectChanges();
        tick(1000);
        expect(component.originData.length).toEqual(0);
      }));
      it('按下取消刪除, 需不刪除資料', fakeAsync(() => {
        fixture.detectChanges(); // 觸發ngOnInit
        tick(1000);
        const checkItem = de.query(By.css('th input')).nativeElement;
        checkItem.click();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        const handleBT = de.query(By.css('.dw-f-btn-bar-action button:nth-child(2)')).nativeElement;
        handleBT.click();
        fixture.detectChanges();
        tick(1000);
        const delAllItem = document.querySelector('.cdk-overlay-container ul li');
        (delAllItem as HTMLLIElement).click();
        fixture.detectChanges();
        tick(1000);
        const cancelBT = document.querySelector('nz-modal-confirm-container button:nth-child(1)');
        (cancelBT as HTMLButtonElement).click();
        fixture.detectChanges();
        tick(10000);
        fixture.detectChanges();
        tick(1000);
        expect(component.originData.length).toEqual(2);
      }));
    });
  });

});
