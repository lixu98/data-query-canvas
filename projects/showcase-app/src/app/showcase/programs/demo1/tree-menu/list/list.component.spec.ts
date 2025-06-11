import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { DwActionModule } from '@webdpt/components/action';
import { MockDwActionAuthorizedDirective } from '@webdpt/components/action/testing';
import { APP_DATE_FORMAT } from '@webdpt/framework/config';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { NzIconTestModule } from 'ng-zorro-antd/icon/testing';
import { NzTreeNode } from 'ng-zorro-antd/tree';
import { BehaviorSubject } from 'rxjs';
import { TreeMenuService } from '../service/tree-menu.service';
import { TreeMenuModule } from '../tree-menu.module';
import { ListComponent } from './list.component';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { DwRoutingMessageService } from '@webdpt/components/routing-message';
registerLocaleData(zh);
@Component({
  template: `
  <app-dw-demo-list [treeItemObserve]="treeItemSubject" 
  (deleteTreeMenu)="doDeleteTreeMenu($event)" 
  (isViewEvent)="doIsViewEvent($event)">
  </app-dw-demo-list>
    `
})
class TestComponent {
  treeItemSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  @ViewChild(ListComponent, { static: true }) comp: ListComponent;
  public doDeleteTreeMenu($event: boolean): void {
  }
  public doIsViewEvent($event: boolean): void {
  }
}
describe('ListComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let de: DebugElement;
  let treeMenuService: TreeMenuService;
  let dwMessage: DwRoutingMessageService;
  let commonGetTreeDetailReq: () => void;
  let commonModifyTreelReq: () => void;
  let httpMocker: HttpTestingController;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TreeMenuModule,
        RouterTestingModule,
        TranslateTestingModule,
        NoopAnimationsModule,
        NzIconTestModule
      ],
      providers: [
        { provide: APP_DATE_FORMAT, useValue: 'yyyy/MM/dd' },
      ],
      declarations: [
        TestComponent,
        ListComponent
      ]
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
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    treeMenuService = TestBed.inject(TreeMenuService);
    dwMessage = TestBed.inject(DwRoutingMessageService);
    httpMocker = TestBed.inject(HttpTestingController);
    commonGetTreeDetailReq = () => {
      const getTreeDetailReq = httpMocker.expectOne('showcase/demo1/tree-menu/getTreeDetail');
      getTreeDetailReq.flush(JSON.parse(JSON.stringify(treeDetail))); // colne deep,避免個別測試後影嚮原始資料
      fixture.detectChanges();
      tick(1000);
    };
    commonModifyTreelReq = () => {
      const modifyTreelReq = httpMocker.expectOne('showcase/demo1/tree-menu/modifyTree');
      modifyTreelReq.flush({
        status: true,
        description: 'OK'
      });
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
    };
    // fixture.detectChanges();
  });
  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpMocker.verify();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('treeItemObserve', ()=>{
    it('入參變化時, 需改變顯示內容', fakeAsync(()=>{
      const spyGetTreeDetail = spyOn(treeMenuService, 'getTreeDetail').and.callThrough();
      fixture.detectChanges();
      tick(1000);
      component.treeItemSubject.next(new NzTreeNode(  {
        'key': '2',
        'title': 'Layer-2'
      }));
      fixture.detectChanges();
      tick(1000);
      commonGetTreeDetailReq();
      expect(spyGetTreeDetail).toHaveBeenCalledTimes(1);
      expect(spyGetTreeDetail.calls.mostRecent().args[0]).toEqual('2');
    }));
    it('入參為子節點, 需顯示可刪除整筆', fakeAsync(()=>{
      const nodes = new NzTreeNode(  {
        'key': '1',
        'title': 'Layer-1',
        'children': [
          {
            'key': '11',
            'title': 'Layer-1-1'
          }
        ]
      });
      const spyGetTreeDetail = spyOn(treeMenuService, 'getTreeDetail').and.callThrough();
      fixture.detectChanges();
      tick(1000);
      component.treeItemSubject.next(nodes.children[0]);
      fixture.detectChanges();
      tick(1000);
      commonGetTreeDetailReq();
      expect(spyGetTreeDetail).toHaveBeenCalledTimes(1);
      expect(spyGetTreeDetail.calls.mostRecent().args[0]).toEqual('11');
      expect(nodes.children[0].level).toEqual(1);
      expect(de.query(By.css('button i[ng-reflect-nz-type="delete"]'))).toBeTruthy();
    }));
    it('返回為error, 需不顯示內容', fakeAsync(()=>{
      const spyGetTreeDetail = spyOn(treeMenuService, 'getTreeDetail').and.callThrough();
      fixture.detectChanges();
      tick(1000);
      component.treeItemSubject.error({error: 'bad request'});
      fixture.detectChanges();
      tick(1000);
      expect(spyGetTreeDetail).not.toHaveBeenCalled();
    }));
  });
  describe('按下編輯', ()=>{
    it('需改為可編輯模式', fakeAsync(()=>{
      fixture.detectChanges();
      tick(1000);
      component.treeItemSubject.next(new NzTreeNode(  {
        'key': '2',
        'title': 'Layer-2'
      }));
      fixture.detectChanges();
      tick(1000);
      commonGetTreeDetailReq();
      // 編輯
      const editTag = de.query(By.css('i[nztype="edit"]')).nativeElement;
      editTag.click();
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      expect(de.queryAll(By.css('form input')).length).toEqual(8);
      expect(component.comp.isView).toBeFalse();
    }));
    it('按下保存,status為true, description有值需顯示成功訊息', fakeAsync(()=>{
      const spySuccess = spyOn(dwMessage, 'success').and.callThrough();
      fixture.detectChanges();
      tick(1000);
      component.treeItemSubject.next(new NzTreeNode(  {
        'key': '2',
        'title': 'Layer-2'
      }));
      fixture.detectChanges();
      tick(1000);
      commonGetTreeDetailReq();
      // 編輯
      const editTag = de.query(By.css('i[nztype="edit"]')).nativeElement;
      editTag.click();
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      const saveBT =  de.query(By.css('button[ng-reflect-nz-type="primary"]')).nativeElement;
      saveBT.click();
      fixture.detectChanges();
      tick(1000);
      const deleteTreeListReq = httpMocker.expectOne('showcase/demo1/tree-menu/modifyTree');
      deleteTreeListReq.flush({
        status: true,
        description: '儲存成功'
      });
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      expect(spySuccess).toHaveBeenCalled();
    }));
    it('按下保存,status為true, description無值需不顯示成功訊息', fakeAsync(()=>{
      const spySuccess = spyOn(dwMessage, 'success').and.callThrough();
      fixture.detectChanges();
      tick(1000);
      component.treeItemSubject.next(new NzTreeNode(  {
        'key': '2',
        'title': 'Layer-2'
      }));
      fixture.detectChanges();
      tick(1000);
      commonGetTreeDetailReq();
      // 編輯
      const editTag = de.query(By.css('i[nztype="edit"]')).nativeElement;
      editTag.click();
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      const saveBT =  de.query(By.css('button[ng-reflect-nz-type="primary"]')).nativeElement;
      saveBT.click();
      fixture.detectChanges();
      tick(1000);
      const deleteTreeListReq = httpMocker.expectOne('showcase/demo1/tree-menu/modifyTree');
      deleteTreeListReq.flush({
        status: true,
        description: ''
      });
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      expect(spySuccess).not.toHaveBeenCalled();
    }));
    it('按下保存,status為false, description有值需顯示錯誤訊息', fakeAsync(()=>{
      const spyError = spyOn(dwMessage, 'error').and.callThrough();
      fixture.detectChanges();
      tick(1000);
      component.treeItemSubject.next(new NzTreeNode(  {
        'key': '2',
        'title': 'Layer-2'
      }));
      fixture.detectChanges();
      tick(1000);
      commonGetTreeDetailReq();
      // 編輯
      const editTag = de.query(By.css('i[nztype="edit"]')).nativeElement;
      editTag.click();
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      const saveBT =  de.query(By.css('button[ng-reflect-nz-type="primary"]')).nativeElement;
      saveBT.click();
      fixture.detectChanges();
      tick(1000);
      const deleteTreeListReq = httpMocker.expectOne('showcase/demo1/tree-menu/modifyTree');
      deleteTreeListReq.flush({
        status: false,
        description: '儲存錯誤'
      });
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      expect(spyError).toHaveBeenCalled();
    }));
    it('按下保存,status為false, description無值需不顯示錯誤訊息', fakeAsync(()=>{
      const spyError = spyOn(dwMessage, 'error').and.callThrough();
      fixture.detectChanges();
      tick(1000);
      component.treeItemSubject.next(new NzTreeNode(  {
        'key': '2',
        'title': 'Layer-2'
      }));
      fixture.detectChanges();
      tick(1000);
      commonGetTreeDetailReq();
      // 編輯
      const editTag = de.query(By.css('i[nztype="edit"]')).nativeElement;
      editTag.click();
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      const saveBT =  de.query(By.css('button[ng-reflect-nz-type="primary"]')).nativeElement;
      saveBT.click();
      fixture.detectChanges();
      tick(1000);
      const deleteTreeListReq = httpMocker.expectOne('showcase/demo1/tree-menu/modifyTree');
      deleteTreeListReq.flush({
        status: false,
        description: ''
      });
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      expect(spyError).not.toHaveBeenCalled();
    }));
    it('按下取消, 需改為檢視模式', fakeAsync(()=>{
      fixture.detectChanges();
      tick(1000);
      component.treeItemSubject.next(new NzTreeNode(  {
        'key': '2',
        'title': 'Layer-2'
      }));
      fixture.detectChanges();
      tick(1000);
      commonGetTreeDetailReq();
      // 編輯
      const editTag = de.query(By.css('i[nztype="edit"]')).nativeElement;
      editTag.click();
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      const cancelBT =  de.query(By.css('button')).nativeElement;
      cancelBT.click();
      fixture.detectChanges();
      tick(1000);
      expect(component.comp.isView).toEqual(true);
    }));
  });
  describe('detailDelete', ()=>{
    it('按下刪除明細, 需跳出confirm視窗', fakeAsync(()=>{
      fixture.detectChanges();
      tick(1000);
      component.treeItemSubject.next(new NzTreeNode(  {
        'key': '2',
        'title': 'Layer-2'
      }));
      fixture.detectChanges();
      tick(1000);
      commonGetTreeDetailReq();
      const delTag = de.query(By.css('tr td:last-child a[ng-reflect-dw-action-id="delete"]')).nativeElement;
      delTag.click();
      fixture.detectChanges();
      tick(1000);
      expect(document.querySelector('.ant-popover-content')).toBeTruthy();
    }));
    it('按下確認, 需保除刪除後資料', fakeAsync(()=>{
      const spyModifyTree = spyOn(treeMenuService, 'modifyTree').and.callThrough();

      fixture.detectChanges();
      tick(1000);
      component.treeItemSubject.next(new NzTreeNode(  {
        'key': '2',
        'title': 'Layer-2'
      }));
      fixture.detectChanges();
      tick(1000);
      commonGetTreeDetailReq();
      const delTag = de.query(By.css('tr td:last-child a[ng-reflect-dw-action-id="delete"]')).nativeElement;
      delTag.click();
      fixture.detectChanges();
      tick(1000);
      const confirmBt = document.querySelector('.ant-popover-content button[ng-reflect-nz-type="primary"]');
      (confirmBt as HTMLButtonElement).click();
      fixture.detectChanges();
      tick(1000);
      commonModifyTreelReq();
      expect(spyModifyTree).toHaveBeenCalled();
    }));
  });
  describe('detailModify', ()=>{
    it('按下編輯明細, 需跳出編輯視窗', fakeAsync(()=>{
      fixture.detectChanges();
      tick(1000);
      component.treeItemSubject.next(new NzTreeNode(  {
        'key': '2',
        'title': 'Layer-2'
      }));
      fixture.detectChanges();
      tick(1000);
      commonGetTreeDetailReq();
      const editTag = de.query(By.css('tr td:last-child a[ng-reflect-dw-action-id="modify"]')).nativeElement;
      editTag.click();
      fixture.detectChanges();
      tick(1000);
      expect(document.querySelector('nz-modal-container')).toBeTruthy();
    }));
    it('編輯明細, 按下關閉, 需關閉視窗', fakeAsync(()=>{
      fixture.detectChanges();
      tick(1000);
      component.treeItemSubject.next(new NzTreeNode(  {
        'key': '2',
        'title': 'Layer-2'
      }));
      fixture.detectChanges();
      tick(1000);
      commonGetTreeDetailReq();
      const editTag = de.query(By.css('tr td:last-child a[ng-reflect-dw-action-id="modify"]')).nativeElement;
      editTag.click();
      fixture.detectChanges();
      tick(1000);
      const closeBT = document.querySelector('nz-modal-container button');
      (closeBT as HTMLButtonElement).click();
      fixture.detectChanges();
      tick(1000);
      expect(document.querySelector('nz-modal-container')).toBeFalsy();
    }));
    it('編輯明細, 按下確認, 需傳回明細資料', fakeAsync(()=>{
      fixture.detectChanges();
      tick(1000);
      component.treeItemSubject.next(new NzTreeNode(  {
        'key': '2',
        'title': 'Layer-2'
      }));
      fixture.detectChanges();
      tick(1000);
      commonGetTreeDetailReq();
      const editTag = de.query(By.css('tr td:last-child a[ng-reflect-dw-action-id="modify"]')).nativeElement;
      editTag.click();
      fixture.detectChanges();
      tick(1000);
      // const inputCompanyId = document.querySelector('nz-modal-container input');
      // (inputCompanyId as HTMLInputElement).value = '3333';
      // inputCompanyId.dispatchEvent(new Event('input'));
      // fixture.detectChanges();
      // tick(1000);
      const confirmBT = document.querySelector('nz-modal-container button[type="submit"]');
      (confirmBT as HTMLButtonElement).click();
      fixture.detectChanges();
      tick(1000);
      expect(document.querySelector('nz-modal-container')).toBeFalsy();
    }));
  });
  describe('detailAdd', ()=>{
    it('按下新增明細, 需跳出新增視窗', fakeAsync(()=>{
      fixture.detectChanges();
      tick(1000);
      component.treeItemSubject.next(new NzTreeNode(  {
        'key': '2',
        'title': 'Layer-2'
      }));
      fixture.detectChanges();
      tick(1000);
      commonGetTreeDetailReq();
      const addTag = de.query(By.css('button i[nztype="plus"]')).nativeElement;
      addTag.click();
      fixture.detectChanges();
      tick(1000);
      expect(document.querySelector('nz-modal-container')).toBeTruthy();
    }));
    it('新增明細, 按下關閉, 需關閉視窗', fakeAsync(()=>{
      fixture.detectChanges();
      tick(1000);
      component.treeItemSubject.next(new NzTreeNode(  {
        'key': '2',
        'title': 'Layer-2'
      }));
      fixture.detectChanges();
      tick(1000);
      commonGetTreeDetailReq();
      const addTag = de.query(By.css('button i[nztype="plus"]')).nativeElement;
      addTag.click();
      fixture.detectChanges();
      tick(1000);
      const closeBT = document.querySelector('nz-modal-container button');
      (closeBT as HTMLButtonElement).click();
      fixture.detectChanges();
      tick(1000);
      expect(document.querySelector('nz-modal-container')).toBeFalsy();
    }));
    it('新增明細, 通過驗證, 需可按下確認', fakeAsync(()=>{
      const spyModifyTree = spyOn(treeMenuService, 'modifyTree').and.callThrough();

      fixture.detectChanges();
      tick(1000);
      component.treeItemSubject.next(new NzTreeNode(  {
        'key': '2',
        'title': 'Layer-2'
      }));
      fixture.detectChanges();
      tick(1000);
      commonGetTreeDetailReq();
      const addTag = de.query(By.css('button i[nztype="plus"]')).nativeElement;
      addTag.click();
      fixture.detectChanges();
      tick(1000);
      const inputs = document.querySelectorAll('nz-modal-container input');
      const inputCompanyId = inputs[0];
      (inputCompanyId as HTMLInputElement).value = '3333';
      inputCompanyId.dispatchEvent(new Event('input'));
      const inputCompanyName = inputs[1];
      (inputCompanyName as HTMLInputElement).value = 'mockCompanyName';
      inputCompanyName.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      tick(1000);
      const confirmBT = document.querySelector('nz-modal-container button[type="submit"]');
      (confirmBT as HTMLButtonElement).click();
      fixture.detectChanges();
      tick(1000);
      expect(document.querySelector('nz-modal-container')).toBeFalsy();
      commonModifyTreelReq();
      expect(spyModifyTree).toHaveBeenCalled();
    }));
  });
  describe('deleteMaster', ()=>{
    it('按下刪除整筆, 需顯示確認視窗', fakeAsync(()=>{
      const nodes = new NzTreeNode(  {
        'key': '1',
        'title': 'Layer-1',
        'children': [
          {
            'key': '11',
            'title': 'Layer-1-1'
          }
        ]
      });
      fixture.detectChanges();
      tick(1000);
      component.treeItemSubject.next(nodes.children[0]);
      fixture.detectChanges();
      tick(1000);
      commonGetTreeDetailReq();
      const deletBT = de.query(By.css('button i[ng-reflect-nz-type="delete"]')).nativeElement;
      deletBT.click();
      fixture.detectChanges();
      tick(1000);
      expect(document.querySelector('nz-modal-confirm-container')).toBeTruthy();
    }));
    it('按下取消, 需取消刪除', fakeAsync(()=>{
      const nodes = new NzTreeNode(  {
        'key': '1',
        'title': 'Layer-1',
        'children': [
          {
            'key': '11',
            'title': 'Layer-1-1'
          }
        ]
      });
      fixture.detectChanges();
      tick(1000);
      component.treeItemSubject.next(nodes.children[0]);
      fixture.detectChanges();
      tick(1000);
      commonGetTreeDetailReq();
      const deletBT = de.query(By.css('button i[ng-reflect-nz-type="delete"]')).nativeElement;
      deletBT.click();
      fixture.detectChanges();
      tick(1000);
      const cancelBT = document.querySelector('.ant-modal-confirm-btns button:nth-child(1)');
      (cancelBT as HTMLButtonElement).click();
      fixture.detectChanges();
      tick(1000);
      expect(document.querySelector('nz-modal-confirm-container')).toBeFalsy();
    }));
    it('按下確認, 需刪除整筆', fakeAsync(()=>{
      const spyDeleteTreeList = spyOn(treeMenuService, 'deleteTreeList').and.callThrough();
      const nodes = new NzTreeNode(  {
        'key': '1',
        'title': 'Layer-1',
        'children': [
          {
            'key': '11',
            'title': 'Layer-1-1'
          }
        ]
      });
      fixture.detectChanges();
      tick(1000);
      component.treeItemSubject.next(nodes.children[0]);
      fixture.detectChanges();
      tick(1000);
      commonGetTreeDetailReq();
      const deletBT = de.query(By.css('button i[ng-reflect-nz-type="delete"]')).nativeElement;
      deletBT.click();
      fixture.detectChanges();
      tick(1000);
      const confirmBT = document.querySelector('nz-modal-confirm-container button[ng-reflect-nz-type="primary"]');
      (confirmBT as HTMLButtonElement).click();
      fixture.detectChanges();
      tick(1000);
      const deleteTreeListReq = httpMocker.expectOne('showcase/demo1/tree-menu/deleteTreeList');
      deleteTreeListReq.flush({
        status: true,
        description: 'OK'
      });
      fixture.detectChanges();
      tick(1000);
      expect(spyDeleteTreeList).toHaveBeenCalled();
    }));
  });
});
export const treeMenuOriginData = [
  {
    'key': 1,
    'title': 'Layer-1',
    'children': [
      {
        'key': 11,
        'title': 'Layer-1-1'
      },
      {
        'key': 12,
        'title': 'Layer-1-2',
        'children': [
          {
            'key': 121,
            'title': 'Layer-1-2-1'
          }
        ]
      },
      {
        'key': 13,
        'title': 'Layer-1-3',
        'children': [
          {
            'key': 131,
            'title': 'Layer-1-3-1',
            'children': [
              {
                'key': 1311,
                'title': 'Layer-1-3-1-1'
              },
              {
                'key': 1312,
                'title': 'Layer-1-3-1-2'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    'key': 2,
    'title': 'Layer-2'
  }
];
export const treeDetail = {
  'master': {
    'groupId': '1',
    'groupName': 'Layer-1',
    'currencyId': 'CNY',
    'currencyName': '人民幣',
    'sourceId': '123',
    'exchangeWay': 'auto',
    'exchangeSource': '1',
    'exchangeClass': '1',
    'status': 'Y',
    'groupDate': '2017/12/23'
  },
  'detail': [
    {
      'seq': 1,
      'companyId': '1111',
      'companyName': '鼎新電腦',
      'currencyId': 'NTD',
      'currencyName': '新台幣',
      'status': 'N',
      'startDate': '2017/10/31',
      'endDate': '2017/12/31'
    },
    {
      'seq': 2,
      'companyId': '2222',
      'companyName': '鼎新電腦2',
      'currencyId': 'NTD',
      'currencyName': '新台幣',
      'status': 'Y',
      'startDate': '2016/10/31',
      'endDate': '2016/12/31'
    }
  ]
};
