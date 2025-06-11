import { ExtraFieldsDocumentOrderMasterModel, ExtraFieldsDocumentOrderProductInfo } from '../order.model';


describe('ExtraFieldsDocumentOrderMasterModel ', () => {
  let srv: ExtraFieldsDocumentOrderMasterModel;
  it('constructor入參需可設定屬性值', () => {
    srv = new ExtraFieldsDocumentOrderMasterModel({ orderId: '12345' });
    expect(srv.orderId).toEqual('12345');
  });
});
describe('ExtraFieldsDocumentOrderProductInfo ', () => {
  let srv: ExtraFieldsDocumentOrderProductInfo;
  it('constructor入參需可設定屬性值', () => {
    srv = new ExtraFieldsDocumentOrderProductInfo({ productName: 'mockProductName', _quantity: 10 });
    expect(srv.productName).toEqual('mockProductName');
    expect(srv.quantity).toEqual(10);
  });
  it('quantity值改變, 需觸發onChange,重新計算subtotal值', () => {
    srv = new ExtraFieldsDocumentOrderProductInfo({ price: 5});
    const spyOnChange = spyOn(srv, 'onChange').and.callThrough();
    srv.quantity = 10;
    expect(spyOnChange).toHaveBeenCalled();
    expect(srv.subtotal).withContext('price * quantity').toEqual(50);
  });
  it('執行ExtraFieldsDocumentOrderProductInfo.parseToArray,需返回ExtraFieldsDocumentOrderProductInfo[]類型', () => {
    // eslint-disable-next-line max-len
    expect(ExtraFieldsDocumentOrderProductInfo.parseToArray([{ price: 5},{ price: 10}])[0] instanceof ExtraFieldsDocumentOrderProductInfo) .toBeTrue();
    expect(ExtraFieldsDocumentOrderProductInfo.parseToArray([{ price: 5},{ price: 10}])[0].price).toEqual(5);
    expect(ExtraFieldsDocumentOrderProductInfo.parseToArray([{ price: 5},{ price: 10}])[1].price).toEqual(10);
  });
});
