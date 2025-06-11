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
import { HttpClientTestingModule} from '@angular/common/http/testing';
import { DwDemoImageViewerModule } from '../dw-demo-image-viewer.module';
import { DwDemoImageViewerListComponent } from './dw-demo-image-viewer-list.component';
import { DwImageViewerListService, DwImageViewerService, IDwImageViewerAction, IDwImageViewerChangeData, IDwImageViewerFile, IDwImageViewerListAction } from '@webdpt/components/image-viewer';
import { Observable, of } from 'rxjs';
import { DwUploadFileMangementService } from '@webdpt/framework/dmc';
import { NzMessageService } from 'ng-zorro-antd/message';

describe('DwDemoImageViewerListComponent', () => {
  let component: DwDemoImageViewerListComponent;
  let fixture: ComponentFixture<DwDemoImageViewerListComponent>;
  let de: DebugElement;
  let dwMessageService: NzMessageService;
  let dwImageViewerListService: DwImageViewerListService;
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
          getPlayVideoUrl$: ():any =>{
            return of('https://mockPlayVideoUrl');
          }
        }
      },
      { provide: DwImageViewerListService, useValue: {
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
        previewModal:(dwFile: IDwImageViewerFile, thumbnailList: IDwImageViewerFile[], viewerAction: IDwImageViewerAction, onPrevious: any, onNext: any, onDownload?: any): Observable<any>=>{
          onPrevious(); // 假裝按下前一張
          onNext(); // 假裝按下下一張
          return of(true);
        },
        previous:(thumbnailList: IDwImageViewerFile[], uid: string, viewerAction: IDwImageViewerAction): Observable<IDwImageViewerChangeData>=>{
          return of(null);
        },
        next:(thumbnailList: IDwImageViewerFile[], uid: string, viewerAction: IDwImageViewerAction): Observable<IDwImageViewerChangeData>=>{
          return of(null);
        }
      }},
      {
        provide: DwImageViewerService, useValue: {
          viewerActionDefault:(): IDwImageViewerAction =>{
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
      DwDemoImageViewerListComponent,
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
      fixture = TestBed.createComponent(DwDemoImageViewerListComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      dwMessageService = TestBed.inject(NzMessageService);
      dwImageViewerListService = TestBed.inject(DwImageViewerListService);
      fixture.detectChanges(); // 觸發ngOnInit
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
    it('點擊slider, 需變化圖片大小', fakeAsync(()=>{
      const spyOnSizeChange = spyOn(component, 'onSizeChange').and.callThrough();
      const trackElement = de.query(By.css('.ant-slider-rail')).nativeElement;
      const dimensions = trackElement.getBoundingClientRect();
      const x = dimensions.left + dimensions.width * 0.8;
      const y = dimensions.top;

      const targetNode = de.query(By.css('.ant-slider-rail')).nativeElement;
      const createMouseEvent = (type:string, _x:number, _y:number) => {
        const event = new MouseEvent(type, {
          view: window,
          bubbles: true,
          cancelable: false,
          clientX: _x, // 获取到的是触发点相对浏览器可视区域左上角距离
          clientY: _y,
          // screenX: _x, // 获取到的是触发点相对显示器屏幕左上角的距离
          // screenY: _y,
        });
        return event;
      };
      targetNode.dispatchEvent(createMouseEvent('mouseenter', x, y));
      targetNode.dispatchEvent(createMouseEvent('mousedown', x, y));
      targetNode.dispatchEvent(createMouseEvent('mouseup', x, y));

      fixture.detectChanges();
      tick(1000);
      expect(spyOnSizeChange).toHaveBeenCalled();
      expect(component.itemImageWidth.width).toBeGreaterThan(0);
    }));
    describe('滑鼠移至圖片上', ()=>{
      it('按下刪除, 需執行handleRemove1', fakeAsync(()=>{
        // const targetNode = de.queryAll(By.css('.actions-mask img'))[0].nativeElement;
        // const dimensions = targetNode.getBoundingClientRect();
        // const x = dimensions.left + dimensions.width * 0.5;
        // const y = dimensions.top + dimensions.width * 0.5;
        // console.log(targetNode);
        // targetNode.dispatchEvent(new MouseEvent('mouseenter', {
        //   view: window,
        //   bubbles: true,
        //   cancelable: false,
        //   clientX: x, // 获取到的是触发点相对浏览器可视区域左上角距离
        //   clientY: y,
        //   // screenX: _x, // 获取到的是触发点相对显示器屏幕左上角的距离
        //   // screenY: _y,
        // }));
        // fixture.detectChanges();
        // tick(1000);
        const spyCreate = spyOn(dwMessageService, 'create').and.callThrough();
        const delElem = de.query(By.css('i[nztype="delete"]')).nativeElement;
        delElem.click();
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(spyCreate).toHaveBeenCalled();
      }));
      it('按下檢視, 需執行handlePreview1', fakeAsync(()=>{
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
    });
  });

});
