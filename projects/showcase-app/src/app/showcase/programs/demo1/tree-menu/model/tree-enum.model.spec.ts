import { TreeCurrencyModel, TreeExchangeClassModel,
  TreeExchangeSourceModel, TreeExchangeWayModel, TreeStatusModel } from './tree-enum.model';

describe('TreeStatusModel', () => {
  it('取value無值, 需返回"Y"', () => {
    const srv = new TreeStatusModel();
    expect(srv.value).toEqual('Y');
  });
  it('取label無值, 需返回"有效"', () => {
    const srv = new TreeStatusModel();
    expect(srv.label).toEqual('有效');
  });
});
describe('TreeCurrencyModel', () => {
  it('取value無值, 需返回"CNY"', () => {
    const srv = new TreeCurrencyModel();
    expect(srv.value).toEqual('CNY');
  });
  it('取label無值, 需返回"人民幣"', () => {
    const srv = new TreeCurrencyModel();
    expect(srv.label).toEqual('人民幣');
  });
});
describe('TreeExchangeWayModel', () => {
  it('取value無值, 需返回"auto"', () => {
    const srv = new TreeExchangeWayModel();
    expect(srv.value).toEqual('auto');
  });
  it('取label無值, 需返回"自動複製"', () => {
    const srv = new TreeExchangeWayModel();
    expect(srv.label).toEqual('自動複製');
  });
});
describe('TreeExchangeClassModel', () => {
  it('取value無值, 需返回"1"', () => {
    const srv = new TreeExchangeClassModel();
    expect(srv.value).toEqual('1');
  });
  it('取label無值, 需返回"銀行買入匯率"', () => {
    const srv = new TreeExchangeClassModel();
    expect(srv.label).toEqual('銀行買入匯率');
  });
});
describe('TreeExchangeSourceModel', () => {
  it('取value無值, 需返回"1"', () => {
    const srv = new TreeExchangeSourceModel();
    expect(srv.value).toEqual('1');
  });
  it('取label無值, 需返回"鼎捷南京"', () => {
    const srv = new TreeExchangeSourceModel();
    expect(srv.label).toEqual('鼎捷南京');
  });
});
