import { DocumentOrderSearchConditionModel } from '../search-condition.model';


describe('DocumentOrderSearchConditionModel ', () => {
  let srv: DocumentOrderSearchConditionModel;
  beforeEach(()=>{
    srv = new DocumentOrderSearchConditionModel();
  });
  it('should be created', () => {
    expect(srv).toBeTruthy();
  });
  it('set pageIndex', () => {
    srv.pageIndex = 2;
    expect(srv.pageIndex).toEqual(2);
  });
  it('set pageSize', () => {
    srv.pageSize = 2;
    expect(srv.pageSize).toEqual(2);
  });
  it('set fields', () => {
    const filds = srv._initFields();
    filds.gender = ['male', 'female'];
    srv.fields = filds;
    expect(srv.fields.gender[0]).toEqual('male');
  });
  it('set sortSet', () => {
    srv.sortSet = [{sortName: 'gender', sortExpression: 'desc'}];
    expect(srv.sortSet[0].sortExpression).toEqual('desc');
  });
  it('clear', () => {
    expect(srv.clear().gender).toEqual([]);
  });
  it('clearSortSet', () => {
    srv.sortSet = [{sortName: 'gender', sortExpression: 'desc'}];
    expect(srv.sortSet[0].sortExpression).toEqual('desc');
    srv.clearSortSet();
    expect(srv.sortSet).toEqual([]);
  });
  it('addSortSet', () => {
    srv.sortSet = [{sortName: 'gender', sortExpression: 'desc'}];
    expect(srv.sortSet[0].sortExpression).toEqual('desc');
    srv.addSortSet({sortName: 'sex', sortExpression: 'desc'});
    expect(srv.sortSet[1].sortName).toEqual('sex');
  });
});

