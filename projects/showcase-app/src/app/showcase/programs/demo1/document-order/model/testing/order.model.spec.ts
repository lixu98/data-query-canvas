import { DocumentOrderMasterModel, DocumentOrderProductInfo } from '../order.model';


describe('DocumentOrderMasterModel ', () => {
  let srv: DocumentOrderMasterModel;
  it('constructor入參需可設定屬性值', () => {
    srv = new DocumentOrderMasterModel({ orderId: '12345' });
    expect(srv.orderId).toEqual('12345');
  });
});
describe('DocumentOrderProductInfo ', () => {
  let srv: DocumentOrderProductInfo;
  it('constructor入參需可設定屬性值', () => {
    srv = new DocumentOrderProductInfo({ productName: 'mockProductName', _quantity: 10 });
    expect(srv.productName).toEqual('mockProductName');
    expect(srv.quantity).toEqual(10);
  });
  it('quantity值改變, 需觸發onChange,重新計算subtotal值', () => {
    srv = new DocumentOrderProductInfo({ price: 5});
    const spyOnChange = spyOn(srv, 'onChange').and.callThrough();
    srv.quantity = 10;
    expect(spyOnChange).toHaveBeenCalled();
    expect(srv.subtotal).withContext('price * quantity').toEqual(50);
  });
  it('執行DocumentOrderProductInfo.parseToArray,需返回DocumentOrderProductInfo[]類型', () => {
    expect(DocumentOrderProductInfo.parseToArray([{ price: 5},{ price: 10}])[0] instanceof DocumentOrderProductInfo) .toBeTrue();
    expect(DocumentOrderProductInfo.parseToArray([{ price: 5},{ price: 10}])[0].price).toEqual(5);
    expect(DocumentOrderProductInfo.parseToArray([{ price: 5},{ price: 10}])[1].price).toEqual(10);
  });
});
