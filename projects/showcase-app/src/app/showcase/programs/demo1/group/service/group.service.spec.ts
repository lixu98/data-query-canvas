/* eslint-disable max-len */
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { APP_DATE_FORMAT, APP_TIME_FORMAT } from '@webdpt/framework/config';
import { Demo1GroupRepository, Demo1RepositoryModule } from '../../repository';
import { GroupModule } from '../group.module';
import { CurrencyModel, ExchangeClassModel, ExchangeSourceModel, ExchangeWayModel } from '../model';
import { MasterModel } from '../model/group.model';

import { GroupService } from './group.service';

describe('GroupService', () => {
  let httpMocker: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        GroupModule,
        Demo1RepositoryModule
      ],
      providers: [
        GroupService,
        { provide: APP_DATE_FORMAT, useValue: 'yyyy/MM/dd' },
        { provide: APP_TIME_FORMAT, useValue: 'hh:mm:ss' }
      ]
    });
    httpMocker = TestBed.inject(HttpTestingController);
  });

  it('should be created', inject([GroupService], (service: GroupService) => {
    expect(service).toBeTruthy();
  }));
  describe('getGroupList', () => {
    it('資料裏沒有datas屬性, 需不跑datas.forEach', fakeAsync(inject([GroupService], (service: GroupService) => {
      service.getGroupList(1, 10, null, null).subscribe(result => {
        expect(result.hasOwnProperty('datas')).toBeFalse();
      });
      tick(1000);
      const getGroupListReq = httpMocker.expectOne('showcase/demo1/getGroupList');
      getGroupListReq.flush({
        'currentPage': 1,
        'rowCount': 2,
        'pageCount': 2,
      });
      tick(1000);
    })));
    it('資料裏沒有status屬性, 需不產生statusDesc', fakeAsync(inject([GroupService], (service: GroupService) => {
      service.getGroupList(1, 10, null, null).subscribe(result => {
        expect(result.datas[0].hasOwnProperty('statusDesc')).toBeFalse();
      });
      tick(1000);
      const getGroupListReq = httpMocker.expectOne('showcase/demo1/getGroupList');
      getGroupListReq.flush(JSON.parse(JSON.stringify(getGroupListResponse)));
      tick(1000);
    })));
    it('資料裏有status屬性, 需產生statusDesc', fakeAsync(inject([GroupService], (service: GroupService) => {
      service.getGroupList(1, 10, null, null).subscribe(result => {
        expect(result.datas[1].hasOwnProperty('statusDesc')).toBeTrue();
      });
      tick(1000);
      const getGroupListReq = httpMocker.expectOne('showcase/demo1/getGroupList');
      getGroupListReq.flush(JSON.parse(JSON.stringify(getGroupListResponse)));
      tick(1000);
    })));
  });
  describe('modifyGroup', ()=>{
    it('master.groupDate instanceof Date 為 false, 直接顯示值', fakeAsync(inject([GroupService, Demo1GroupRepository], (service: GroupService, demo1GroupRepository: Demo1GroupRepository) => {
      const spyModify = spyOn(demo1GroupRepository, 'modifyGroup').and.callThrough();
      const masterData = new MasterModel({groupId: 'mockGroupId', groupName: 'mockGroupName', groupDate: '1111:1:1'});
      service.modifyGroup(masterData, null).subscribe(result => {
      });
      tick(1000);
      const saveGroupViewReq = httpMocker.expectOne('showcase/demo1/modifyGroup');
      saveGroupViewReq.flush({
        status: true,
        description: '編輯成功'
      });
      tick(1000);
      expect(spyModify.calls.mostRecent().args[0].master.groupDate).toEqual('1111:1:1');
    })));
  });
  describe('addGroup', ()=>{
    it('master.groupDate instanceof Date 為 true, 需用fnsFormat轉換時間格式', fakeAsync(inject([GroupService, Demo1GroupRepository], (service: GroupService, demo1GroupRepository: Demo1GroupRepository) => {
      const spyModify = spyOn(demo1GroupRepository, 'addGroup').and.callThrough();
      const masterData = new MasterModel({groupId: 'mockGroupId', groupName: 'mockGroupName', groupDate: new Date('1111-1-1')});
      service.addGroup(masterData, null).subscribe(result => {
      });
      tick(1000);
      const saveGroupViewReq = httpMocker.expectOne('showcase/demo1/addGroup');
      saveGroupViewReq.flush({
        status: true,
        description: '新增成功'
      });
      tick(1000);
      expect(spyModify.calls.mostRecent().args[0].master.groupDate).toEqual('1111/01/01 12:00:00');
    })));
  });

  it('CurrencyModel沒設定值, 需給預設值', fakeAsync(inject([GroupService], (service: GroupService) => {
    service.currencyOptions.subscribe((result: CurrencyModel[])=>{
      result.push(new CurrencyModel()); // 故意不給值
      const currencyModel = result.pop();
      expect(currencyModel.value).toEqual('CNY');
      expect(currencyModel.label).toEqual('人民幣');
    });
    tick(1000);
  })));
  it('ExchangeSourceModel沒設定值, 需給預設值', fakeAsync(inject([GroupService], (service: GroupService) => {
    service.exchangeSourceOptions.subscribe((result: ExchangeSourceModel[])=>{
      result.push(new ExchangeSourceModel()); // 故意不給值
      const exchangeSourceModel = result.pop();
      expect(exchangeSourceModel.value).toEqual('1');
      expect(exchangeSourceModel.label).toEqual('鼎捷南京');
    });
    tick(1000);
  })));
  it('ExchangeClassModel沒設定值, 需給預設值', fakeAsync(inject([GroupService], (service: GroupService) => {
    service.exchangeClassOptions.subscribe((result: ExchangeClassModel[])=>{
      result.push(new ExchangeClassModel()); // 故意不給值
      const exchangeClassModel = result.pop();
      expect(exchangeClassModel.value).toEqual('1');
      expect(exchangeClassModel.label).toEqual('銀行買入匯率');
    });
    tick(1000);
  })));
  it('ExchangeClassModel沒設定值, 需給預設值', fakeAsync(inject([GroupService], (service: GroupService) => {
    service.exchangeWayOptions.subscribe((result: ExchangeWayModel[])=>{
      result.push(new ExchangeWayModel()); // 故意不給值
      const exchangeWayModel = result.pop();
      expect(exchangeWayModel.value).toEqual('auto');
      expect(exchangeWayModel.label).toEqual('自動複製');
    });
    tick(1000);
  })));
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
      'groupDate': '2017/12/23',
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
