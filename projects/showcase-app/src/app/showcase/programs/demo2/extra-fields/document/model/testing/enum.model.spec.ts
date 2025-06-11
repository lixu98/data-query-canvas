import { fakeAsync, tick } from '@angular/core/testing';
import { ExtraFieldsDocumentOrderDistributionStatusModel, ExtraFieldsDocumentOrderEnumModel,
  ExtraFieldsDocumentOrderGenderModel, ExtraFieldsDocumentOrderStatusModel } from '../enum.model';

describe('ExtraFieldsDocumentOrderEnumModel ', ()=>{
  let srv: ExtraFieldsDocumentOrderEnumModel ;
  beforeEach(()=>{
    srv = new ExtraFieldsDocumentOrderEnumModel ();
  });
  it('should be created', ()=>{
    expect(srv).toBeTruthy();
  });
  it('ExtraFieldsDocumentOrderEnumModel.gender需有資料', ()=>{
    expect(Array.isArray(ExtraFieldsDocumentOrderEnumModel.gender)).toBeTrue();
  });
  it('ExtraFieldsDocumentOrderEnumModel.orderStatusr需有資料', ()=>{
    expect(Array.isArray(ExtraFieldsDocumentOrderEnumModel.orderStatus)).toBeTrue();
  });
});
describe('ExtraFieldsDocumentOrderStatusModel ', ()=>{
  let srv: ExtraFieldsDocumentOrderStatusModel ;
  describe('共用條件測試', ()=>{
    beforeEach(()=>{
      srv = new ExtraFieldsDocumentOrderStatusModel ();
    });
    it('should be created', ()=>{
      expect(srv).toBeTruthy();
    });
    it('ExtraFieldsDocumentOrderStatusModel.getList需取得列舉資料', fakeAsync(()=>{
      ExtraFieldsDocumentOrderStatusModel.getList().subscribe(result=>{
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
      srv = new ExtraFieldsDocumentOrderStatusModel ('N', '無效');
    });
    it('value值需與constructor入參一致', ()=>{
      expect(srv.value).toEqual('N');
    });
    it('label值需與constructor入參一致', ()=>{
      expect(srv.label).toEqual('無效');
    });
  });
});
describe('ExtraFieldsDocumentOrderDistributionStatusModel ', ()=>{
  let srv: ExtraFieldsDocumentOrderDistributionStatusModel ;
  describe('共用條件測試', ()=>{
    beforeEach(()=>{
      srv = new ExtraFieldsDocumentOrderDistributionStatusModel ('99', '純金');
    });
    it('should be created', ()=>{
      expect(srv).toBeTruthy();
    });
    it('ExtraFieldsDocumentOrderDistributionStatusModel.getList需取得列舉資料', fakeAsync(()=>{
      ExtraFieldsDocumentOrderDistributionStatusModel.getList().subscribe(result=>{
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
      srv = new ExtraFieldsDocumentOrderDistributionStatusModel (null, null);
    });
    it('constructor入參無key值,取值需為空字串', ()=>{
      expect(srv.key).toEqual('');
    });
    it('constructor入參無lable值,取值需為空字串', ()=>{
      expect(srv.lable).toEqual('');
    });
  });
});
describe('ExtraFieldsDocumentOrderGenderModel', ()=>{
  let srv: ExtraFieldsDocumentOrderGenderModel;
  describe('共用條件測試', ()=>{
    beforeEach(()=>{
      srv = new ExtraFieldsDocumentOrderGenderModel('99', '純金', true);
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
    it('ExtraFieldsDocumentOrderDistributionStatusModel.getList需取得列舉資料', fakeAsync(()=>{
      ExtraFieldsDocumentOrderGenderModel.getList().subscribe(result=>{
        expect(Array.isArray(result)).toBeTrue();
        tick();
      });
    }));
    it('ExtraFieldsDocumentOrderDistributionStatusModel.resetList需重設checked為false', ()=>{
      const list = [
        new ExtraFieldsDocumentOrderGenderModel('male', '男', false),
        new ExtraFieldsDocumentOrderGenderModel('female', '女', false)
      ];
      ExtraFieldsDocumentOrderGenderModel.resetList(list);
      expect(list[0].checked).toBeFalse();
      expect(list[1].checked).toBeFalse();
    });
    it('ExtraFieldsDocumentOrderDistributionStatusModel.setChecked,對應入參相等, 需重設checked為true', ()=>{
      const list = [
        new ExtraFieldsDocumentOrderGenderModel('male', '男', false),
        new ExtraFieldsDocumentOrderGenderModel('female', '女', false)
      ];
      ExtraFieldsDocumentOrderGenderModel.setChecked(list, ['female']);
      expect(list[0].checked).toBeFalse();
      expect(list[1].checked).toBeTrue();
    });
    it('ExtraFieldsDocumentOrderDistributionStatusModel.setChecked,第二入參length為0, 需不執行比對', ()=>{
      const list = [
        new ExtraFieldsDocumentOrderGenderModel('male', '男', false),
        new ExtraFieldsDocumentOrderGenderModel('female', '女', false)
      ];
      ExtraFieldsDocumentOrderGenderModel.setChecked(list, []);
      expect(list[0].checked).toBeFalse();
      expect(list[0].checked).toBeFalse();
    });
  });

});
