import { IDwSelectModalCustomizeConfig } from '@webdpt/components/modals/select';

export const openSelectModalDefault: IDwSelectModalCustomizeConfig = {
  modalTitle: 'default', // modal 標題.
  modalWidth: '80%', // modal 寬度.
  modalOkText: 'dw-determine', // 確認按鈕文字.
  modalCancelText: 'dw-cancel', // 取消按鈕文字.
  tableIdField: '', // 使用的 id 欄位.
  tableNameField: '', // 使用的 name 欄位.
  tableColDefs: [], // 表格欄位定義.
  tableMultiSelect: true, // 多選或單選.
  tableShowTag: true, // 是否顯示下方的 tag.
  tableIsFilter: true, // 是否提供搜尋.
  tablePageSize: 10, // 每頁展示多少數據，可雙向繫結.
  tableShowPagination: true, // 是否顯示分頁器.
  tableShowSizeChanger: true, // 是否可以改變 dwPageSize.
  tableNoResult: '', // 無數據時顯示內容, 空值則使用預設值.
  tablePageSizeOptions: [5, 10, 15, 20], // 頁數選擇器可選值.
  tableTagColor: '', // Tag標籤顏色.
  tableScroll: null, // 橫向或縱向支援滾動，也可用於指定滾動區域的寬高度：{ x: "300px", y: "300px" }
  dataSource: null, // 資料源 service.
  returnFields: [], // 設定回傳欄位
  initParams: null // 設定初始固定的條件
};
