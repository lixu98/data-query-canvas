/* eslint-disable max-len */
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { NzIconTestModule } from 'ng-zorro-antd/icon/testing';
import { DwActionModule } from '@webdpt/components/action';
import { DwActionTestingModule, MockDwActionAuthorizedDirective } from '@webdpt/components/action/testing';
import { DwCommonRouterTestingModule } from '@webdpt/framework/sharedTest/common-router-test';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DwDemoImageViewerModule } from './dw-demo-image-viewer.module';
import { DwImageViewerListService, DwImageViewerService, IDwImageViewerAction, IDwImageViewerChangeData, IDwImageViewerFile, IDwImageViewerListAction } from '@webdpt/components/image-viewer';
import { Observable, of, Subject } from 'rxjs';
import { DwUploadFileMangementService } from '@webdpt/framework/dmc';
import { IDWUploadMangMessage } from '@webdpt/framework/config/interface/upload-file.interface';
import { DwDemoImageViewerComponent } from './dw-demo-image-viewer.component';

describe('DwDemoImageViewerComponent', () => {
  let component: DwDemoImageViewerComponent;
  let fixture: ComponentFixture<DwDemoImageViewerComponent>;
  const mockUploadEventSubject: Subject<IDWUploadMangMessage> = new Subject();
  const mockDeleteFileSubject: Subject<any> = new Subject();

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
      DwDemoImageViewerComponent,
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
      fixture = TestBed.createComponent(DwDemoImageViewerComponent);
      component = fixture.componentInstance;
      fixture.detectChanges(); // 觸發ngOnInit
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

});
