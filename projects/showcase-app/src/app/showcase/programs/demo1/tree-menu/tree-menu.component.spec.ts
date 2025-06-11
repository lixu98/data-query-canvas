import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { DwActionModule } from '@webdpt/components/action';
import { MockDwActionAuthorizedDirective } from '@webdpt/components/action/testing';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { NzIconTestModule } from 'ng-zorro-antd/icon/testing';
import { Observable, of } from 'rxjs';
import { TreeDetailsInfoModel, TreeMasterModel } from './model';
import { TreeMenuService } from './service/tree-menu.service';

import { TreeMenuComponent } from './tree-menu.component';
import { TreeMenuModule } from './tree-menu.module';

describe('TreeMenuComponent', () => {
  let component: TreeMenuComponent;
  let fixture: ComponentFixture<TreeMenuComponent>;
  let de: DebugElement;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TreeMenuModule,
        RouterTestingModule,
        TranslateTestingModule,
        NoopAnimationsModule,
        NzIconTestModule
      ],
      providers: [
        {
          provide: TreeMenuService, useValue: {
            getTreeMenu: (): Observable<any> => {
              return of(JSON.parse(JSON.stringify(treeMenuOriginData))); // 使用JSON.stringify, JSON.parse, 在每次測試時重新初始資料
            },
            getTreeDetail: (groupId: string): Observable<any> => {
              return of(JSON.parse(JSON.stringify(treeDetail)));
            },
            modifyTree: (master: TreeMasterModel, detail: TreeDetailsInfoModel[]): Observable<any> => {
              return of({
                status: true,
                description: 'OK'
              });
            },
            deleteTreeList: (params: { 'groupIds': string[] }): Observable<any> => {
              return of({
                status: true,
                description: 'OK'
              });
            },
            showLabel(id: string, modelName: string): Observable<any> {
              return of(`${id}_label`);
            }
          }
        }
      ],
      declarations: [TreeMenuComponent]
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
    fixture = TestBed.createComponent(TreeMenuComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('階層樹需建立', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000);
      const treeNodes = de.queryAll(By.css('nz-tree-node'));
      expect(treeNodes.length).toEqual(2);
    }));
  });
  describe('按下節點', () => {
    it('需呈現該節點資料', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000);
      const treeNode = de.query(By.css('nz-tree-node-title')).nativeElement;
      treeNode.click();
      fixture.detectChanges();
      tick(1000);
    }));
    it('按下編輯,isViewEvent需變為false(編輯狀態)', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000);
      const treeNode = de.query(By.css('nz-tree-node-title')).nativeElement;
      treeNode.click();
      fixture.detectChanges();
      tick(1000);
      // 編輯
      const editTag = de.query(By.css('i[nztype="edit"]')).nativeElement;
      editTag.click();
      fixture.detectChanges();
      tick(1000);
      expect(de.queryAll(By.css('form input')).length).toEqual(8);
      expect(component.isViewEvent).toBeFalse();
    }));
    it('!isViewEvent(編輯狀態),節點需不可按下', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000);
      const treeNode = de.query(By.css('nz-tree-node-title')).nativeElement;
      treeNode.click();
      fixture.detectChanges();
      tick(1000);
      // 編輯
      const editTag = de.query(By.css('i[nztype="edit"]')).nativeElement;
      editTag.click();
      fixture.detectChanges();
      tick(1000);
      // 再次按下
      const treeNode2 = de.query(By.css('nz-tree-node:nth-child(2) nz-tree-node-title')).nativeElement;
      treeNode2.click();
      fixture.detectChanges();
      tick(1000);
    }));
    describe('按下子節點', () => {
      it('需呈現可刪除整筆資料按鈕', fakeAsync(() => {
        fixture.detectChanges();
        tick(1000);
        // 先呈現子節點,按下箭頭icon
        const downTag = de.query(By.css('i[nztype="caret-down"]')).nativeElement;
        downTag.click();
        fixture.detectChanges();
        tick(1000);
        // 按下子節點
        const childTreeNode = de.query(By.css('nz-tree-node:nth-child(2) nz-tree-node-title')).nativeElement;
        childTreeNode.click();
        fixture.detectChanges();
        tick(1000);
        expect(de.query(By.css('button i[ng-reflect-nz-type="delete"]'))).toBeTruthy();
      }));
      it('按下刪除整筆資料按鈕, 需顯示confirm 視窗', fakeAsync(() => {
        fixture.detectChanges();
        tick(1000);
        // 先呈現子節點,按下箭頭icon
        const downTag = de.query(By.css('i[nztype="caret-down"]')).nativeElement;
        downTag.click();
        fixture.detectChanges();
        tick(1000);
        // 按下子節點
        const childTreeNode = de.query(By.css('nz-tree-node:nth-child(2) nz-tree-node-title')).nativeElement;
        childTreeNode.click();
        fixture.detectChanges();
        tick(1000);
        const delChildBT = de.query(By.css('button i[ng-reflect-nz-type="delete"]')).nativeElement;
        delChildBT.click();
        fixture.detectChanges();
        tick(1000);
        expect(document.querySelector('nz-modal-confirm-container')).toBeTruthy();
      }));
      it('顯示confirm視窗,按下確認需刪除節點資料', fakeAsync(() => {
        const spyDoDeleteTreeMenu = spyOn(component, 'doDeleteTreeMenu').and.callThrough();
        fixture.detectChanges();
        tick(1000);
        // 先呈現子節點,按下箭頭icon
        const downTag = de.query(By.css('i[nztype="caret-down"]')).nativeElement;
        downTag.click();
        fixture.detectChanges();
        tick(1000);
        // 按下子節點
        const childTreeNode = de.query(By.css('nz-tree-node:nth-child(2) nz-tree-node-title')).nativeElement;
        childTreeNode.click();
        fixture.detectChanges();
        tick(1000);
        const delChildBT = de.query(By.css('button i[ng-reflect-nz-type="delete"]')).nativeElement;
        delChildBT.click();
        fixture.detectChanges();
        tick(1000);
        const confirmBT = document.querySelector('nz-modal-confirm-container button[ng-reflect-nz-type="primary"]');
        (confirmBT as HTMLButtonElement).click();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(spyDoDeleteTreeMenu).toHaveBeenCalled();
      }));
    });
    it('收合展開需觸發expandDataCache', fakeAsync(() => {
      const spyExpandDataCache = spyOn(component, 'expandDataCache').and.callThrough();
      fixture.detectChanges();
      tick(1000);
      const downTag = de.query(By.css('i[nztype="caret-down"]')).nativeElement;
      // 開
      downTag.click();
      fixture.detectChanges();
      tick(1000);
      expect(spyExpandDataCache).toHaveBeenCalledTimes(1);
      // 合
      downTag.click();
      fixture.detectChanges();
      tick(1000);
      expect(spyExpandDataCache).toHaveBeenCalledTimes(2);
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
