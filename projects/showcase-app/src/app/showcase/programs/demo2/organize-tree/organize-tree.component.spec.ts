import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { DwOrganizeTreeModalService } from '@webdpt/components/modals/organize-tree';
import { DwOrganizeTreeService, IDwOrgTreeDataMode, IDwOrgTreeDefault, IDwOrgTreeNode } from '@webdpt/framework/organize-tree-core';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { NzIconTestModule } from 'ng-zorro-antd/icon/testing';
import { NzTreeNode } from 'ng-zorro-antd/tree';
import { Observable, of } from 'rxjs';
import { OrganizeTreeComponent } from './organize-tree.component';
import { OrganizeTreeModule } from './organize-tree.module';

describe('OrganizeTreeComponent', () => {
  let component: OrganizeTreeComponent;
  let fixture: ComponentFixture<OrganizeTreeComponent>;
  let de: DebugElement;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslateTestingModule,
        NzIconTestModule,
        NoopAnimationsModule,
        OrganizeTreeModule
      ],
      declarations: [OrganizeTreeComponent],
      providers: [
        {
          provide: DwOrganizeTreeModalService, useValue: {
            open: (selected: IDwOrgTreeNode[], config?: IDwOrgTreeDefault<NzTreeNode>): Observable<any> => {
              if (config) {
                if(config.treeKeyType === 'sid'){
                  if (config.treeDataType === 'org') {
                    return of([
                      {
                        'type': 'org',
                        'key': '70341034070592',
                        'title': '平台一組',
                        'id': 'BE0821',
                        'sid': '70341034070592',
                        'parentKey': '70340962898496',
                        'parentTitle': '微服務平台',
                        'parentSid': '70340962898496'
                      }
                    ]);
                  }
                  return of([
                    {
                      'type': 'user',
                      'key': '325060266263104',
                      'title': 'steve',
                      'id': 'cloudent$steve',
                      'sid': '325060266263104',
                      'parentKey': '70339010859584',
                      'parentTitle': 'DAP平台',
                      'parentSid': '70339010859584'
                    },
                    {
                      'type': 'user',
                      'key': '28204605665856',
                      'title': 'cloudent',
                      'id': 'cloudent',
                      'sid': '28204605665856',
                      'parentKey': '70339010859584',
                      'parentTitle': 'DAP平台',
                      'parentSid': '70339010859584'
                    }
                  ]);
                }
                if (config.treeDataType === 'org') {
                  return of([
                    {
                      'type': 'org',
                      'key': 'BE0821',
                      'title': '平台一組',
                      'id': 'BE0821',
                      'sid': '70341034070592',
                      'parentKey': 'BE0820',
                      'parentTitle': '微服務平台',
                      'parentSid': '70340962898496'
                    }
                  ]);
                }
                if( config.treeSelectType === 'user'){
                  return of([
                    {
                      'type': 'user',
                      'key': '325060266263104',
                      'title': 'steve',
                      'id': 'cloudent$steve',
                      'sid': '325060266263104',
                      'parentKey': '70339010859584',
                      'parentTitle': 'DAP平台',
                      'parentSid': '70339010859584'
                    }
                  ]);
                }
              }
              return of([
                {
                  'type': 'user',
                  'key': 'cloudent',
                  'title': 'cloudent',
                  'id': 'cloudent',
                  'sid': '28204605665856',
                  'parentKey': 'BE0800',
                  'parentTitle': 'DAP平台',
                  'parentSid': '70339010859584'
                },
                {
                  'type': 'user',
                  'key': 'cloudent$steve',
                  'title': 'steve',
                  'id': 'cloudent$steve',
                  'sid': '325060266263104',
                  'parentKey': 'BE0800',
                  'parentTitle': 'DAP平台',
                  'parentSid': '70339010859584'
                }
              ]);
            }
          }
        },
        {
          provide: DwOrganizeTreeService, useValue: {
            getNodeLists: (datas: IDwOrgTreeNode[], config?: IDwOrgTreeDataMode): Observable<any> => {
              if (config) {
                if(config.keyType==='sid'){
                  if(config.dataType==='org'){
                    return of([
                      {
                        'type': 'org',
                        'key': '70341034070592',
                        'title': '平台一組',
                        'id': 'BE0821',
                        'sid': '70341034070592',
                        'parentKey': '70340962898496',
                        'parentTitle': '微服務平台',
                        'parentSid': '70340962898496'
                      }
                    ]);
                  }
                  if(config.selectType==='user'){
                    return of([
                      {
                        'type': 'user',
                        'key': '325060266263104',
                        'title': 'steve',
                        'id': 'cloudent$steve',
                        'sid': '325060266263104',
                        'parentKey': '70339010859584',
                        'parentTitle': 'DAP平台',
                        'parentSid': '70339010859584'
                      }
                    ]);
                  }
                  return of([
                    {
                      'type': 'user',
                      'key': '28204605665856',
                      'title': 'cloudent',
                      'id': 'cloudent',
                      'sid': '28204605665856',
                      'parentKey': '70339010859584',
                      'parentTitle': 'DAP平台',
                      'parentSid': '70339010859584'
                    },
                    {
                      'type': 'user',
                      'key': '325060266263104',
                      'title': 'steve',
                      'id': 'cloudent$steve',
                      'sid': '325060266263104',
                      'parentKey': '70339010859584',
                      'parentTitle': 'DAP平台',
                      'parentSid': '70339010859584'
                    }
                  ]);
                }
                if (config.dataType === 'org') {
                  return of([
                    {
                      'type': 'org',
                      'key': 'BE0821',
                      'title': '平台一組',
                      'id': 'BE0821',
                      'sid': '70341034070592',
                      'parentKey': 'BE0820',
                      'parentTitle': '微服務平台',
                      'parentSid': '70340962898496'
                    }
                  ]);
                }
              }
              return of([
                {
                  'type': 'user',
                  'key': 'cloudent',
                  'title': 'cloudent',
                  'id': 'cloudent',
                  'sid': '28204605665856',
                  'parentKey': 'BE0800',
                  'parentTitle': 'DAP平台',
                  'parentSid': '70339010859584'
                },
                {
                  'type': 'user',
                  'key': 'cloudent$steve',
                  'title': 'steve',
                  'id': 'cloudent$steve',
                  'sid': '325060266263104',
                  'parentKey': 'BE0800',
                  'parentTitle': 'DAP平台',
                  'parentSid': '70339010859584'
                }
              ]);
            },
            convertedTotree: (datas: IDwOrgTreeNode[]): IDwOrgTreeNode[] => {
              return [
                {
                  'type': 'user',
                  'key': 'cloudent',
                  'title': 'cloudent',
                  'id': 'cloudent',
                  'sid': '28204605665856',
                  'parentKey': 'BE0800',
                  'parentTitle': 'DAP平台',
                  'parentSid': '70339010859584'
                },
                {
                  'type': 'user',
                  'key': 'cloudent$steve',
                  'title': 'steve',
                  'id': 'cloudent$steve',
                  'sid': '325060266263104',
                  'parentKey': 'BE0800',
                  'parentTitle': 'DAP平台',
                  'parentSid': '70339010859584'
                }
              ];
            }
          }
        }
      ]
    })
      // .overrideModule(OrganizeTreeRoutingModule, { // 單元測試,只專注於當前component,故將原路由設置清空, 改用RouterTestingModule.withRoutes(routes)的配置
      //   set: {
      //     imports: [],
      //     exports: []
      //   }
      // })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizeTreeComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('按下「多選用戶ID與組織ID」, 開窗後需返回所選資料', fakeAsync(() => {
    const spyOpenMultiple = spyOn(component, 'openMultiple').and.callThrough();
    const bt = de.query(By.css('form div:nth-child(1) div:nth-child(1) button')).nativeElement;
    bt.click();
    fixture.detectChanges();
    tick(1000);
    expect(spyOpenMultiple).toHaveBeenCalled();
    expect(component.multiple.length).toEqual(2);
  }));
  it('按下取得 「取得組織結構清單 - 用戶ID與租戶ID」, 需返回資料', fakeAsync(() => {
    const bt = de.query(By.css('form>div:nth-child(2) button')).nativeElement;
    bt.click();
    fixture.detectChanges();
    tick(1000);
    expect(component.multipleLists.length).toEqual(2);
  }));
  it('按下「單選-組織ID」, 開窗後需返回所選資料', fakeAsync(() => {
    const spyOpenSingle = spyOn(component, 'openSingle').and.callThrough();
    const bt = de.query(By.css('form div:nth-child(1) div:nth-child(2) button')).nativeElement;
    bt.click();
    fixture.detectChanges();
    tick(1000);
    expect(spyOpenSingle).toHaveBeenCalled();
    expect(component.single.length).toBeGreaterThan(0);
  }));
  it('按下取得 「取得組織結構清單 - 租戶ID」, 需返回資料', fakeAsync(() => {
    const bt = de.query(By.css('form>div:nth-child(2)>div:nth-child(2) button')).nativeElement;
    bt.click();
    fixture.detectChanges();
    tick(1000);
    expect(component.singleLists.length).toBeGreaterThan(0);
  }));
  it('按下「多選-用戶Sid與組織Sid」, 開窗後需返回所選資料', fakeAsync(() => {
    const spyOpenSidMultiple = spyOn(component, 'openSidMultiple').and.callThrough();
    const bt = de.query(By.css('form>div:nth-child(3)>div:nth-child(1) button')).nativeElement;
    bt.click();
    fixture.detectChanges();
    tick(1000);
    expect(spyOpenSidMultiple).toHaveBeenCalled();
    expect(component.sidMultiple.length).toEqual(2);
  }));
  it('按下取得 「取得組織結構清單 - 用戶Sid與租戶Sid」, 需返回資料', fakeAsync(() => {
    const bt = de.query(By.css('form>div:nth-child(4)>div:nth-child(1) button')).nativeElement;
    bt.click();
    fixture.detectChanges();
    tick(1000);
    expect(component.sidMultipleLists.length).toBeGreaterThan(0);
  }));
  it('按下「單選 - 租戶Sid」, 開窗後需返回所選資料', fakeAsync(() => {
    const spyOpenSidSingle = spyOn(component, 'openSidSingle').and.callThrough();
    const bt = de.query(By.css('form>div:nth-child(3)>div:nth-child(2) button')).nativeElement;
    bt.click();
    fixture.detectChanges();
    tick(1000);
    expect(spyOpenSidSingle).toHaveBeenCalled();
    expect(component.sidSingle.length).toEqual(1);
  }));
  it('按下取得 「取得組織結構清單 - 租戶Sid」, 需返回資料', fakeAsync(() => {
    const bt = de.query(By.css('form>div:nth-child(4)>div:nth-child(2) button')).nativeElement;
    bt.click();
    fixture.detectChanges();
    tick(1000);
    expect(component.sidSingleLists.length).toBeGreaterThan(0);
  }));
  it('按下「單選 - 組織Sid-只選人員」, 開窗後需返回所選資料', fakeAsync(() => {
    const spyOpenSidSingleOnlyuser = spyOn(component, 'openSidSingleOnlyuser').and.callThrough();
    const bt = de.query(By.css('form>div:nth-child(5) div button')).nativeElement;
    bt.click();
    fixture.detectChanges();
    tick(1000);
    expect(spyOpenSidSingleOnlyuser).toHaveBeenCalled();
    expect(component.sidSingleOnlyuser.length).toEqual(2);
  }));
  it('按下取得 「 取得組織結構清單 - 用戶Sid與租戶Sid - 只選人員」, 需返回資料', fakeAsync(() => {
    const bt = de.query(By.css('form>div:nth-child(6) div button')).nativeElement;
    bt.click();
    fixture.detectChanges();
    tick(1000);
    expect(component.sidSingleListsOnlyuser.length).toBeGreaterThan(0);
  }));
});
