import { IDemo2OrderSearchField } from '../demo2-order-repository-interface';

describe('IDemo2OrderSearchField', () => {
  let iDemo2OrderSearchField: IDemo2OrderSearchField;

  beforeEach(async () => {
    iDemo2OrderSearchField = new IDemo2OrderSearchField();
  });
  it('設定gender,有陣列值', ()=>{
    iDemo2OrderSearchField.gender = ['male', 'female'];
    expect(iDemo2OrderSearchField.gender).toEqual(['male', 'female']);
  });
  it('gender,無值需為空陣列', ()=>{
    iDemo2OrderSearchField.gender = null;
    expect(iDemo2OrderSearchField.gender).toEqual([]);
  });
  it('設定status有陣列值', ()=>{
    iDemo2OrderSearchField.status = ['Y', 'N'];
    expect(iDemo2OrderSearchField.status).toEqual(['Y', 'N']);
  });
  it('設定status,無值需為空陣列', ()=>{
    iDemo2OrderSearchField.status = null;
    expect(iDemo2OrderSearchField.status).toEqual([]);
  });
});
