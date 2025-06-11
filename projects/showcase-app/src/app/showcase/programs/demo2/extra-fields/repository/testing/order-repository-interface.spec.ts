import { IExtraFieldsOrderSearchField } from '../order-repository-interface';

describe('IExtraFieldsOrderSearchField', () => {
  let iExtraFieldsOrderSearchField: IExtraFieldsOrderSearchField;
  it('should be created', () => {
    iExtraFieldsOrderSearchField = new IExtraFieldsOrderSearchField();
    expect(iExtraFieldsOrderSearchField).toBeTruthy();
    iExtraFieldsOrderSearchField.gender = null;
    iExtraFieldsOrderSearchField.status = null;
    expect(iExtraFieldsOrderSearchField.gender).toEqual(null);
    expect(iExtraFieldsOrderSearchField.status).toEqual(null);
    iExtraFieldsOrderSearchField.gender = ['male'];
    iExtraFieldsOrderSearchField.status = ['Y'];
    expect(iExtraFieldsOrderSearchField.gender).toEqual(['male']);
    expect(iExtraFieldsOrderSearchField.status).toEqual(['Y']);
  });
});
