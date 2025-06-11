import { fakeAsync, tick } from '@angular/core/testing';
import { DocumentOrderDistributionStatusModel, DocumentOrderEnumModel,
  DocumentOrderGenderModel, DocumentOrderStatusModel } from '../enum.model';

describe('DocumentOrderEnumModel ', ()=>{
  let srv: DocumentOrderEnumModel ;
  beforeEach(()=>{
    srv = new DocumentOrderEnumModel ();
  });
  it('should be created', ()=>{
    expect(srv).toBeTruthy();
  });
  it('DocumentOrderEnumModel.gender需有資料', ()=>{
    expect(Array.isArray(DocumentOrderEnumModel.gender)).toBeTrue();
  });
  it('DocumentOrderEnumModel.orderStatusr需有資料', ()=>{
    expect(Array.isArray(DocumentOrderEnumModel.orderStatus)).toBeTrue();
  });
});
describe('DocumentOrderStatusModel ', ()=>{
  let srv: DocumentOrderStatusModel ;
  describe('共用條件測試', ()=>{
    beforeEach(()=>{
      srv = new DocumentOrderStatusModel ();
    });
    it('should be created', ()=>{
      expect(srv).toBeTruthy();
    });
    it('DocumentOrderStatusModel.getList需取得列舉資料', fakeAsync(()=>{
      DocumentOrderStatusModel.getList().subscribe(result=>{
        expect(Array.isArray(result)).toBeTrue();
        tick();
      });
    }));
    it('value值預設需為"Y"', ()=>{
      expect(srv.value).toEqual('Y');
    });
    it('label值預設需為"有效"', ()=>{
      expect(srv.label).toEqual('有效');
    });
  });
  describe('個別條件測試', ()=>{
    beforeEach(()=>{
      srv = new DocumentOrderStatusModel ('N', '無效');
    });
    it('value值需與constructor入參一致', ()=>{
      expect(srv.value).toEqual('N');
    });
    it('label值需與constructor入參一致', ()=>{
      expect(srv.label).toEqual('無效');
    });
  });
});
describe('DocumentOrderDistributionStatusModel ', ()=>{
  let srv: DocumentOrderDistributionStatusModel ;
  describe('共用條件測試', ()=>{
    beforeEach(()=>{
      srv = new DocumentOrderDistributionStatusModel ('99', '純金');
    });
    it('should be created', ()=>{
      expect(srv).toBeTruthy();
    });
    it('DocumentOrderDistributionStatusModel.getList需取得列舉資料', fakeAsync(()=>{
      DocumentOrderDistributionStatusModel.getList().subscribe(result=>{
        expect(Array.isArray(result)).toBeTrue();
        tick();
      });
    }));
    it('key值需與constructor入參一致', ()=>{
      expect(srv.key).toEqual('99');
    });
    it('label值需與constructor入參一致', ()=>{
      expect(srv.lable).toEqual('純金');
    });
  });
  describe('個別條件測試', ()=>{
    beforeEach(()=>{
      srv = new DocumentOrderDistributionStatusModel (null, null);
    });
    it('constructor入參無key值,取值需為空字串', ()=>{
      expect(srv.key).toEqual('');
    });
    it('constructor入參無lable值,取值需為空字串', ()=>{
      expect(srv.lable).toEqual('');
    });
  });
});
describe('DocumentOrderGenderModel', ()=>{
  let srv: DocumentOrderGenderModel;
  describe('共用條件測試', ()=>{
    beforeEach(()=>{
      srv = new DocumentOrderGenderModel('99', '純金', true);
    });
    it('should be created', ()=>{
      expect(srv).toBeTruthy();
    });
    it('value值需與constructor入參一致', ()=>{
      expect(srv.value).toEqual('99');
    });
    it('label值需與constructor入參一致', ()=>{
      expect(srv.label).toEqual('純金');
    });
    it('checked值需與constructor入參一致', ()=>{
      expect(srv.checked).toEqual(true);
    });
    it('需可設定value值', ()=>{
      srv.value = '888';
      expect(srv.value).toEqual('888');
    });
    it('需可設定checked值', ()=>{
      srv.checked = false;
      expect(srv.checked).toEqual(false);
    });
    it('DocumentOrderDistributionStatusModel.getList需取得列舉資料', fakeAsync(()=>{
      DocumentOrderGenderModel.getList().subscribe(result=>{
        expect(Array.isArray(result)).toBeTrue();
        tick();
      });
    }));
    it('DocumentOrderDistributionStatusModel.resetList需重設checked為false', ()=>{
      const list = [
        new DocumentOrderGenderModel('male', '男', false),
        new DocumentOrderGenderModel('female', '女', false)
      ];
      DocumentOrderGenderModel.resetList(list);
      expect(list[0].checked).toBeFalse();
      expect(list[1].checked).toBeFalse();
    });
    it('DocumentOrderDistributionStatusModel.setChecked,對應入參相等, 需重設checked為true', ()=>{
      const list = [
        new DocumentOrderGenderModel('male', '男', false),
        new DocumentOrderGenderModel('female', '女', false)
      ];
      DocumentOrderGenderModel.setChecked(list, ['female']);
      expect(list[0].checked).toBeFalse();
      expect(list[1].checked).toBeTrue();
    });
    it('DocumentOrderDistributionStatusModel.setChecked,第二入參length為0, 需不執行比對', ()=>{
      const list = [
        new DocumentOrderGenderModel('male', '男', false),
        new DocumentOrderGenderModel('female', '女', false)
      ];
      DocumentOrderGenderModel.setChecked(list, []);
      expect(list[0].checked).toBeFalse();
      expect(list[0].checked).toBeFalse();
    });
  });

});
