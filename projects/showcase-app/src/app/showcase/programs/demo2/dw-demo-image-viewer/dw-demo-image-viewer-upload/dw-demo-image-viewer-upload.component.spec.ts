/* eslint-disable max-len */
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { NzIconTestModule } from 'ng-zorro-antd/icon/testing';
import { DwActionModule } from '@webdpt/components/action';
import { By } from '@angular/platform-browser';
import { DwActionTestingModule, MockDwActionAuthorizedDirective } from '@webdpt/components/action/testing';
import { DwCommonRouterTestingModule } from '@webdpt/framework/sharedTest/common-router-test';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DwDemoImageViewerModule } from '../dw-demo-image-viewer.module';
import { DwImageViewerListService, DwImageViewerService, IDwImageViewerAction, IDwImageViewerChangeData, IDwImageViewerFile, IDwImageViewerListAction } from '@webdpt/components/image-viewer';
import { Observable, of, Subject } from 'rxjs';
import { DwUploadFileMangementService } from '@webdpt/framework/dmc';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DwDemoImageViewerUploadComponent } from './dw-demo-image-viewer-upload.component';
import { NzUploadFile, UploadFileStatus } from 'ng-zorro-antd/upload';
import { IDWUploadMangMessage } from '@webdpt/framework/config/interface/upload-file.interface';

describe('DwDemoImageViewerUploadComponent', () => {
  let component: DwDemoImageViewerUploadComponent;
  let fixture: ComponentFixture<DwDemoImageViewerUploadComponent>;
  let de: DebugElement;
  let dwMessageService: NzMessageService;
  let dwImageViewerListService: DwImageViewerListService;
  let dwUploadFileMangementService: DwUploadFileMangementService;
  const mockUploadEventSubject: Subject<IDWUploadMangMessage> = new Subject();
  const mockDeleteFileSubject: Subject<any> = new Subject();
  const imgData = new Uint8Array([
    137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 8, 0, 0,
    0, 8, 8, 2, 0, 0, 0, 75, 109, 41, 220, 0, 0, 0, 34, 73, 68, 65, 84, 8, 215, 99, 120,
    173, 168, 135, 21, 49, 0, 241, 255, 15, 90, 104, 8, 33, 129, 83, 7, 97, 163, 136,
    214, 129, 93, 2, 43, 2, 0, 181, 31, 90, 179, 225, 252, 176, 37, 0, 0, 0, 0, 73, 69,
    78, 68, 174, 66, 96, 130]);
  const commonConfig = {
    imports: [
      HttpClientTestingModule,
      NoopAnimationsModule,
      NzIconTestModule,
      DwCommonRouterTestingModule,  // 所有路由都導到這裏設定
      DwActionTestingModule,
      TranslateTestingModule,
      DwDemoImageViewerModule
    ],
    providers: [
      {
        provide: DwUploadFileMangementService, useValue: {
          uploadFile: (file: File, isShare?: boolean, bucketName?: string, dirId?: string, imageParams?: {
            shrink?: string;
            isShareShrink?: string;
            width?: string;
            height?: string;
          }, activeSilceUplodLimit?: number): Observable<any> => {
            return mockUploadEventSubject.asObservable(); // 假請求回傳用。
          },
          getDirectorys: (): Observable<any> => {
            return of({ dirInfos: [{ name: 'demo2', id: 'mockIdDemo2' }] });
          },
          newDirectorys: (): Observable<any> => {
            return of('mockNewDirId');
          },
          getDataUrlAndBlobByFileId: (): any => {
            const data = new Uint8Array([
              137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 8, 0, 0,
              0, 8, 8, 2, 0, 0, 0, 75, 109, 41, 220, 0, 0, 0, 34, 73, 68, 65, 84, 8, 215, 99, 120,
              173, 168, 135, 21, 49, 0, 241, 255, 15, 90, 104, 8, 33, 129, 83, 7, 97, 163, 136,
              214, 129, 93, 2, 43, 2, 0, 181, 31, 90, 179, 225, 252, 176, 37, 0, 0, 0, 0, 73, 69,
              78, 68, 174, 66, 96, 130]);
            const _blob = new Blob([data], { type: 'image/png' });
            return of({ dataUri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAIklEQVQI12N4raiHFTEA8f8PWmgIIYFTB2GjiNaBXQIrAgC1H1qz4fywJQAAAABJRU5ErkJggg==', blob: _blob });
          },
          getPlayVideoUrl$: (): any => {
            return of('https://mockPlayVideoUrl');
          },
          deleteFile: (fileIds?: Array<string>, bucketName?: string): Observable<any> => {
            return mockDeleteFileSubject.asObservable(); // 模擬刪除狀態用
          },
          cancelUploading: (uid: string): void =>{}
        }
      },
      {
        provide: DwImageViewerListService, useValue: {
          actionDefault: (): IDwImageViewerListAction => {
            return {
              'dwPreview': {
                'show': true,
                'title': '先看看',
                'disabled': false
              },
              'dwRemove': {
                'show': true,
                'title': '刪除',
                'disabled': false
              },
              'dwDownload': {
                'show': true,
                'title': '下載',
                'disabled': false
              },
              'dwCheck': {
                'show': false,
                'title': '勾選',
                'disabled': false
              },
              'otherAction': []
            };
          },
          previewModal: (dwFile: IDwImageViewerFile, thumbnailList: IDwImageViewerFile[], viewerAction: IDwImageViewerAction, onPrevious: any, onNext: any, onDownload?: any): Observable<any> => {
            onPrevious(); // 假裝按下前一張
            onNext(); // 假裝按下下一張
            return of(true);
          },
          previous: (thumbnailList: IDwImageViewerFile[], uid: string, viewerAction: IDwImageViewerAction): Observable<IDwImageViewerChangeData> => {
            return of(null);
          },
          next: (thumbnailList: IDwImageViewerFile[], uid: string, viewerAction: IDwImageViewerAction): Observable<IDwImageViewerChangeData> => {
            return of(null);
          },
          listRemove: (list: IDwImageViewerFile[] | Array<any>, uid: string): any => {
            return {
              isRemove: true,
              removeItem: { name: 'mockName' }
            };
          }
        }
      },
      {
        provide: DwImageViewerService, useValue: {
          viewerActionDefault: (): IDwImageViewerAction => {
            return {
              'dwPrevious': {
                'show': true,
                'title': '前一個',
                'disabled': false
              },
              'dwNext': {
                'show': true,
                'title': '下一個',
                'disabled': false
              },
              'dwFullScreen': {
                'show': true,
                'title': '全螢幕',
                'disabled': false
              },
              'dwZoomIn': {
                'show': true,
                'title': '放大',
                'disabled': false
              },
              'dwZoomOut': {
                'show': true,
                'title': '縮小',
                'disabled': false
              },
              'dwResetZoom': {
                'show': true,
                'title': '重設大小',
                'disabled': false
              },
              'dwOriginalSize': {
                'show': true,
                'title': '實際大小',
                'disabled': false
              },
              'dwRotateRight': {
                'show': true,
                'title': '右旋轉',
                'disabled': false
              },
              'dwRotateLeft': {
                'show': true,
                'title': '左旋轉',
                'disabled': false
              },
              'dwDownload': {
                'show': true,
                'title': '下載',
                'disabled': false
              }
            };
          }
        }
      }
    ],
    declarations: [
      DwDemoImageViewerUploadComponent,
    ]
  };
  describe('共用條件測試', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule(commonConfig)
        .overrideModule(DwActionModule, {
          set: {
            imports: [],
            declarations: [MockDwActionAuthorizedDirective],
            exports: [MockDwActionAuthorizedDirective]
          }
        })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(DwDemoImageViewerUploadComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      dwMessageService = TestBed.inject(NzMessageService);
      dwImageViewerListService = TestBed.inject(DwImageViewerListService);
      dwUploadFileMangementService =  TestBed.inject(DwUploadFileMangementService);
      fixture.detectChanges(); // 觸發ngOnInit
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('圖片瀏覽列表功能鍵', () => {
      it('thumbnailList2(檔案列表)需依照uid加入listActionDefault2(功能鍵設定)', fakeAsync(() => {
        fixture.detectChanges();
        tick(1000);
        expect(component.listActionMap2['pk002']).toEqual({
          'dwPreview': {
            'show': true,
            'title': '先看看',
            'disabled': false
          },
          'dwRemove': {
            'show': true,
            'title': '刪除',
            'disabled': false
          },
          'dwDownload': {
            'show': true,
            'title': '下載',
            'disabled': false
          },
          'dwCheck': {
            'show': false,
            'title': '勾選',
            'disabled': false
          },
          'otherAction': [
            {
              'audit': {
                'show': true,
                'title': 'dw-demo-image-viewer-audit',
                'disabled': false
              }
            },
            {
              'my-action-0': {
                'show': true,
                'title': 'dw-demo-image-viewer-my-action-0',
                'disabled': false
              }
            },
            {
              'my-action-1': {
                'show': true,
                'title': 'dw-demo-image-viewer-my-action-1',
                'disabled': false
              }
            },
            {
              'my-action-2': {
                'show': true,
                'title': 'dw-demo-image-viewer-my-action-2',
                'disabled': false
              }
            }
          ]
        });
      }));
      it('按下審核功能鍵,dw-demo-image-viewer-audit(審核)文字需呈現', fakeAsync(() => {
        fixture.detectChanges();
        tick(1000);
        // const targetNode = de.queryAll(By.css('.actions-mask'))[0].nativeElement;
        // targetNode.dispatchEvent(new MouseEvent('mouseenter'));
        // fixture.detectChanges();
        // tick(1000);
        const settingBT = de.query(By.css('i[nztype="setting"]')).nativeElement;
        settingBT.dispatchEvent(new MouseEvent('mouseenter'));
        fixture.detectChanges();
        tick(1000);
        const auditTag = de.query(By.css('.dw-f-image-viewer-list-item-other-dialog div:nth-child(2) a')).nativeElement;
        auditTag.click();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect((de.query(By.css('.myTitleTag')).nativeElement as HTMLDivElement).innerText).toEqual('dw-demo-image-viewer-audit');
      }));
      it('按下dw-demo-image-viewer-my-action-0, dwMessageService.create需被執行', fakeAsync(() => {
        const spyCreate = spyOn(dwMessageService, 'create').and.callThrough();
        fixture.detectChanges();
        tick(1000);
        const settingBT = de.query(By.css('i[nztype="setting"]')).nativeElement;
        settingBT.dispatchEvent(new MouseEvent('mouseenter'));
        fixture.detectChanges();
        tick(1000);
        const auditTag = de.query(By.css('.dw-f-image-viewer-list-item-other-dialog div:nth-child(3) a')).nativeElement;
        auditTag.click();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(spyCreate.calls.mostRecent().args[0]).toEqual('success');
      }));
      it('按下dw-demo-image-viewer-my-action-1(其它), dwMessageService.create需被執行', fakeAsync(() => {
        const spyCreate = spyOn(dwMessageService, 'create').and.callThrough();
        fixture.detectChanges();
        tick(1000);
        const settingBT = de.query(By.css('i[nztype="setting"]')).nativeElement;
        settingBT.dispatchEvent(new MouseEvent('mouseenter'));
        fixture.detectChanges();
        tick(1000);
        const auditTag = de.query(By.css('.dw-f-image-viewer-list-item-other-dialog div:nth-child(4) a')).nativeElement;
        auditTag.click();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(spyCreate.calls.mostRecent().args[0]).toEqual('success');
      }));
    });
    describe('圖片按下刪除', () => {
      describe('一般狀態下',()=>{
        it('dwUploadFileMangementService.deleteFile需被執行', fakeAsync(() => {
          const spyDeleteFile = spyOn(dwUploadFileMangementService, 'deleteFile').and.callThrough();
          fixture.detectChanges();
          tick(1000);
          const delBT = de.query(By.css('i[nztype="delete"]')).nativeElement;
          delBT.dispatchEvent(new Event('click'));
          mockDeleteFileSubject.next('OK'); // 模擬刪除成功
          fixture.detectChanges();
          tick(1000);
          fixture.detectChanges();
          tick(1000);
          fixture.detectChanges();
          tick(1000);
          expect(spyDeleteFile).toHaveBeenCalled();
        }));
        it('dwUploadFileMangementService.deleteFile失敗,listRemove2不需被執行', fakeAsync(() => {
          const spyDeleteFile = spyOn(dwUploadFileMangementService, 'deleteFile').and.callThrough();
          const spyListRemove2 = spyOn(component as any, 'listRemove2').and.callThrough();
          fixture.detectChanges();
          tick(1000);
          const delBT = de.query(By.css('i[nztype="delete"]')).nativeElement;
          delBT.dispatchEvent(new Event('click'));
          mockDeleteFileSubject.error('errir'); // 模擬刪除失敗
          fixture.detectChanges();
          tick(1000);
          fixture.detectChanges();
          tick(1000);
          fixture.detectChanges();
          tick(1000);
          expect(spyDeleteFile).toHaveBeenCalled();
          expect(spyListRemove2).not.toHaveBeenCalled();
        }));
      });

      it('檔案狀態為uploading, dwUploadFileMangementService.cancelUploading(取消上傳)需被執行', fakeAsync(() => {
        const spyCancelUploading = spyOn(dwUploadFileMangementService, 'cancelUploading').and.callThrough();
        component.thumbnailList2[0].status = 'uploading';
        fixture.detectChanges();
        tick(1000);
        const delBT = de.query(By.css('i[nztype="delete"]')).nativeElement;
        delBT.dispatchEvent(new Event('click'));
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(spyCancelUploading).toHaveBeenCalled();
      }));
      it('檔案狀態為error, listRemove2(刪除上傳失敗檔案)需被執行', fakeAsync(() => {
        const spyListRemove2 = spyOn(component as any, 'listRemove2').and.callThrough();
        component.thumbnailList2[0].status = 'error';
        fixture.detectChanges();
        tick(1000);
        const delBT = de.query(By.css('i[nztype="delete"]')).nativeElement;
        delBT.dispatchEvent(new Event('click'));
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(spyListRemove2).toHaveBeenCalled();
      }));
    });
    it('按下檢視, 需執行handlePreview2', fakeAsync(() => {
      const spyPreviewModal = spyOn(dwImageViewerListService, 'previewModal').and.callThrough();
      const delElem = de.query(By.css('i[nztype="eye-o"]')).nativeElement;
      delElem.click();
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      expect(spyPreviewModal).toHaveBeenCalled();
    }));
    describe('按下批次審核', () => {
      it('需顯示勾選', fakeAsync(() => {
        const batchBT = (de.queryAll(By.css('button')))[2].nativeElement;
        batchBT.click();
        fixture.detectChanges();
        tick(1000);
        expect(de.query(By.css('.dw-f-image-viewer-list-item-checkBox'))).toBeTruthy();
      }));
      it('按下儲存, batchAuditSave需被執行', fakeAsync(() => {
        const spyBatchAuditSave = spyOn(component, 'batchAuditSave').and.callThrough();
        const batchBT = (de.queryAll(By.css('button')))[2].nativeElement;
        batchBT.click();
        fixture.detectChanges();
        tick(1000);
        const saveBT = (de.query(By.css('button[nztype="primary"]'))).nativeElement;
        saveBT.click();
        fixture.detectChanges();
        tick(1000);
        expect(spyBatchAuditSave).toHaveBeenCalled();
      }));
      it('勾選, 按下儲存, isAudit需為true, batchAuditSave需被執行', fakeAsync(() => {
        const spyBatchAuditSave = spyOn(component, 'batchAuditSave').and.callThrough();
        const batchBT = (de.queryAll(By.css('button')))[2].nativeElement;
        batchBT.click();
        fixture.detectChanges();
        tick(1000);
        const checkBT = de.query(By.css('.dw-f-image-viewer-list-item-checkBox')).nativeElement;
        checkBT.click();
        fixture.detectChanges();
        tick(1000);
        expect(component.thumbnailList2[0].check).toBeTrue();
        const saveBT = (de.query(By.css('button[nztype="primary"]'))).nativeElement;
        saveBT.click();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(spyBatchAuditSave).toHaveBeenCalled();
      }));
      it('isAudit為true, check屬性需為true(顯示已勾選)', fakeAsync(() => {
        const spyBatchAuditSave = spyOn(component, 'batchAuditSave').and.callThrough();
        const batchBT = (de.queryAll(By.css('button')))[2].nativeElement;
        batchBT.click();
        fixture.detectChanges();
        tick(1000);
        // 按下勾選
        const checkBT = de.query(By.css('.dw-f-image-viewer-list-item-checkBox')).nativeElement;
        checkBT.click();
        fixture.detectChanges();
        tick(1000);
        expect(component.thumbnailList2[0].check).toBeTrue();
        const saveBT = (de.query(By.css('button[nztype="primary"]'))).nativeElement;
        saveBT.click();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(spyBatchAuditSave).toHaveBeenCalled();
        // 再按一次批次審核
        batchBT.click();
        fixture.detectChanges();
        tick(1000);
        expect(component.thumbnailList2[0].check).toBeTrue();
      }));
    });
    describe('上傳檔案', () => {
      describe('使用customReq(自訂請求上傳)', () => {
        it('status為ongoing, 需執行onProgress回呼', fakeAsync(() => {
          const _file = new File([new Blob([imgData])], '', { type: 'image/png' });
          const params = {
            file: {
              uid: '1234567',
              name: 'mockName',
            },
            postFile: _file,
            onProgress:(e:any, file: NzUploadFile): void =>{},
            onSuccess:(ret: any, file: NzUploadFile, xhr: any): void =>{},
            onError:(err: any, file: NzUploadFile): void =>{}
          };
          const spyOnProgress = spyOn(params, 'onProgress').and.callThrough();
          component.customReq(params);
          fixture.detectChanges();
          tick(1000);
          mockUploadEventSubject.next({
            status: 'ongoing',
            percent: 88,
            fileId: 'mockFileId',
            // shareUrl : 'http://mockShareUrl', // 分享的URL
            // shrinkUrl :'http://mockShrinkUrl', // 圖檔縮圖URL
            // shrinkId : 'mockShrinkId', // 圖檔縮圖fileId
          });
          fixture.detectChanges();
          tick(1000);
          expect(spyOnProgress).toHaveBeenCalled();
          console.log(component.thumbnailList2);
        }));
        it('status為success, 需執行onSuccess回呼', fakeAsync(() => {
          const _file = new File([new Blob([imgData])], '', { type: 'image/png' });
          const params = {
            file: {
              uid: '1234567',
              name: 'mockName',
            },
            postFile: _file,
            onProgress:(e:any, file: NzUploadFile): void =>{},
            onSuccess:(ret: any, file: NzUploadFile, xhr: any): void =>{},
            onError:(err: any, file: NzUploadFile): void =>{}
          };
          const spyOnSuccess = spyOn(params, 'onSuccess').and.callThrough();
          component.customReq(params);
          fixture.detectChanges();
          tick(1000);
          mockUploadEventSubject.next({
            status: 'success',
            percent: 100,
            fileId: 'mockFileId',
            shareUrl : 'http://mockShareUrl', // 分享的URL
            shrinkUrl :'http://mockShrinkUrl', // 圖檔縮圖URL
            shrinkId : 'mockShrinkId', // 圖檔縮圖fileId
          });
          fixture.detectChanges();
          tick(1000);
          expect(spyOnSuccess).toHaveBeenCalled();
        }));
        it('status為error, 需執行onError回呼', fakeAsync(() => {
          const _file = new File([new Blob([imgData])], '', { type: 'image/png' });
          const params = {
            file: {
              uid: '1234567',
              name: 'mockName',
            },
            postFile: _file,
            onProgress:(e:any, file: NzUploadFile): void =>{},
            onSuccess:(ret: any, file: NzUploadFile, xhr: any): void =>{},
            onError:(err: any, file: NzUploadFile): void =>{}
          };
          const spyOnError = spyOn(params, 'onError').and.callThrough();
          component.customReq(params);
          fixture.detectChanges();
          tick(1000);
          mockUploadEventSubject.next({
            status: 'error',
            message: 'request error'
          });
          fixture.detectChanges();
          tick(1000);
          expect(spyOnError).toHaveBeenCalled();
        }));
        it('請求錯誤, 需執行onError回呼', fakeAsync(() => {
          const _file = new File([new Blob([imgData])], '', { type: 'image/png' });
          const params = {
            file: {
              uid: '1234567',
              name: 'mockName',
            },
            postFile: _file,
            onProgress:(e:any, file: NzUploadFile): void =>{},
            onSuccess:(ret: any, file: NzUploadFile, xhr: any): void =>{},
            onError:(err: any, file: NzUploadFile): void =>{}
          };
          const spyOnError = spyOn(params, 'onError').and.callThrough();
          component.customReq(params);
          fixture.detectChanges();
          tick(1000);
          mockUploadEventSubject.error({
            status: 'error',
            message: 'request error'
          });
          fixture.detectChanges();
          tick(1000);
          expect(spyOnError).toHaveBeenCalled();
        }));
      });
      describe('uploadChange(上傳狀態改變)', ()=>{
        it('上傳進行中info.event && info.event.hasOwnProperty("percent"), thumbnailList2需改變percent值', fakeAsync(() => {
          // const _file = new File([new Blob([imgData])], '', { type: 'image/png' });
          const info = {
            file: {
              uid: 'pk002', // 對應DwDemoImageViewerService.getThumbnailList2資料
              name: 'mockName',
              status: 'uploading' as UploadFileStatus,
            },
            fileList: [],
            event: {
              percent: 88
            }
          };
          component.uploadChange(info);
          fixture.detectChanges();
          tick(1000);
          expect(component.thumbnailList2[0].percent).toEqual(88);
        }));
        it('上傳完成, thumbnailList2需改變percent值', fakeAsync(() => {
          const info = {
            file: {
              uid: 'pk002', // 對應DwDemoImageViewerService.getThumbnailList2資料
              status: 'done'  as UploadFileStatus,
              name: 'mockName.jpg',
              response: {
                status: 'success',
                percent: 100,
                shareUrl: 'http://mockShareUrl',
                shrinkUrl: null,
                shrinkId: 'http://mockShrinkId',
                fileId: 'mockFileId'
              }
            },
            fileList: []
          };
          component.uploadChange(info);
          fixture.detectChanges();
          tick(1000);
          expect(component.thumbnailList2[0].percent).toEqual(100);
          expect(component.thumbnailList2[0].url).toEqual('http://mockShareUrl');
        }));
      });
    });
    describe('按下取消所有正在上傳檔案',()=>{
      it('檔案狀態為uploading, dwUploadFileMangementService.cancelUploading(取消上傳)需被執行', fakeAsync(() => {
        const spyCancelUploading = spyOn(dwUploadFileMangementService, 'cancelUploading').and.callThrough();
        component.thumbnailList2[0].status = 'uploading';
        fixture.detectChanges();
        tick(1000);
        const cancelAllUploadBT = de.queryAll(By.css('button'))[1].nativeElement;
        cancelAllUploadBT.dispatchEvent(new Event('click'));
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(spyCancelUploading).toHaveBeenCalled();
      }));
    });
    it('點選標題,dwMessageService.info需被執行', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000);
      const spyInfo = spyOn(dwMessageService, 'info').and.callThrough();
      const titleTag = de.query(By.css('.dw-f-image-viewer-list-item-title div a')).nativeElement;
      titleTag.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      expect(spyInfo).toHaveBeenCalled();
    }));
  });

});
