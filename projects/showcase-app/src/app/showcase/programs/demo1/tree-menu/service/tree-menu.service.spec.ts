import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { APP_DATE_FORMAT } from '@webdpt/framework/config';
import { TreeMenuService } from './tree-menu.service';


describe('TreeMenuService', () => {
  let httpMocker: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        TreeMenuService,
        { provide: APP_DATE_FORMAT, useValue: 'yyyy/MM/dd' }
      ]
    });
    httpMocker = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpMocker.verify();
  });
  it('should be created', inject([TreeMenuService], (service: TreeMenuService) => {
    expect(service).toBeTruthy();
  }));
  describe('showLabel', () => {
    it('需依列舉value值返回label值', fakeAsync(inject([TreeMenuService], (service: TreeMenuService) => {
      service.showLabel('Y', 'searchStatusOptions').subscribe(result => {
        expect(result).toEqual('有效');
      });
      tick(1000);
    })));
    it('需依列舉value值返回label值, 無對應值需返回空字串', fakeAsync(inject([TreeMenuService], (service: TreeMenuService) => {
      service.showLabel('A', 'searchStatusOptions').subscribe(result => {
        expect(result).toEqual('');
      });
      tick(1000);
    })));
  });
  it('getDateFormat需返回時間格式', inject([TreeMenuService], (service: TreeMenuService) => {
    expect(service.getDateFormat()).toEqual('yyyy/MM/dd');
  }));
  describe('deleteTreeList', () => {
    it('成功, description需為true', fakeAsync(inject([TreeMenuService], (service: TreeMenuService) => {
      service.deleteTreeList({ groupIds: ['mockGroupId1'] }).subscribe(result => {
        expect(result.status).toBeTrue();
      });
      tick(1000);
      const deleteTreeListReq = httpMocker.expectOne('showcase/demo1/tree-menu/deleteTreeList');
      deleteTreeListReq.flush({
        status: true,
        description: '刪除成功'
      });
      tick(1000);
    })));
  });
  describe('getTreeDetail', () => {
    it('成功, description需為true', fakeAsync(inject([TreeMenuService], (service: TreeMenuService) => {
      service.getTreeDetail('mockGroupId').subscribe(result => {
        expect(result.master).toBeTruthy();
      });
      tick(1000);
      const getTreeDetailReq = httpMocker.expectOne('showcase/demo1/tree-menu/getTreeDetail');
      getTreeDetailReq.flush(treeDetail);
      tick(1000);
    })));
  });
  describe('modifyTree', () => {
    it('成功, description需為true', fakeAsync(inject([TreeMenuService], (service: TreeMenuService) => {
      service.modifyTree(treeDetail.master, treeDetail.detail).subscribe(result => {
        expect(result.status).toBeTrue();
      });
      tick(1000);
      const modifyTreeReq = httpMocker.expectOne('showcase/demo1/tree-menu/modifyTree');
      modifyTreeReq.flush({
        status: true,
        description: '編輯成功'
      });
      tick(1000);
    })));
    it('groupDate不為Date格式, 需直接返回原值', fakeAsync(inject([TreeMenuService, HttpClient], (service: TreeMenuService, http: HttpClient) => {
      const spyHttpPost = spyOn(http, 'post').and.callThrough();
      service.modifyTree({ ...treeDetail.master, ...{ groupDate: null } }, treeDetail.detail).subscribe(result => {
        expect(result.status).toBeTrue();
      });
      tick(1000);
      const modifyTreeReq = httpMocker.expectOne('showcase/demo1/tree-menu/modifyTree');
      modifyTreeReq.flush({
        status: true,
        description: '編輯成功'
      });
      tick(1000);
      expect(spyHttpPost.calls.mostRecent().args[1].master.groupDate).toEqual(null);
    })));
  });
  describe('addTree', () => {
    it('成功, description需為true', fakeAsync(inject([TreeMenuService], (service: TreeMenuService) => {
      service.addTree(treeDetail.master, treeDetail.detail).subscribe(result => {
        expect(result.status).toBeTrue();
      });
      tick(1000);
      const addTreeReq = httpMocker.expectOne('showcase/demo1/tree-menu/addTree');
      addTreeReq.flush({
        status: true,
        description: '刪除成功'
      });
      tick(1000);
    })));
    it('groupDate不為Date格式, 需直接返回原值', fakeAsync(inject([TreeMenuService, HttpClient], (service: TreeMenuService, http: HttpClient) => {
      const spyHttpPost = spyOn(http, 'post').and.callThrough();
      service.addTree({ ...treeDetail.master, ...{ groupDate: null } }, treeDetail.detail).subscribe(result => {
        expect(result.status).toBeTrue();
      });
      tick(1000);
      const addTreeReq = httpMocker.expectOne('showcase/demo1/tree-menu/addTree');
      addTreeReq.flush({
        status: true,
        description: '編輯成功'
      });
      tick(1000);
      expect(spyHttpPost.calls.mostRecent().args[1].master.groupDate).toEqual(null);
    })));
  });
  describe('treeDetailMaxSeq', () => {
    it('需取單身的最的序號', inject([TreeMenuService], (service: TreeMenuService) => {
      expect(service.treeDetailMaxSeq(treeDetail.detail)).toEqual(2);
    }));
  });
  describe('getTreeMenu', () => {
    it('需取得樹狀階層', fakeAsync(inject([TreeMenuService], (service: TreeMenuService) => {
      service.getTreeMenu().subscribe(result => {
        expect(result.length).toEqual(2);
      });
      tick(1000);
      const addTreeReq = httpMocker.expectOne('showcase/demo1/tree-menu/getTreeMenu');
      addTreeReq.flush(treeMenuOriginData);
      tick(1000);
    })));
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
    'groupDate': new Date('2017/12/23')
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
