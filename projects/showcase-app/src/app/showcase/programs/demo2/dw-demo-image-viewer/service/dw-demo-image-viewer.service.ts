import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IDwImageViewerFile } from '@webdpt/components/image-viewer';

@Injectable()
export class DwDemoImageViewerService {

  constructor() { }

  public getThumbnailList2(): Observable<IDwImageViewerFile[]> {
    return new Observable(
      (observer: any) => {
        const responseData: IDwImageViewerFile[] = [
          {
            uid: 'pk002',
            size: 291407,
            name: 'dw-demo-Knowledge.jpg',
            status: 'done',
            url: './assets/file/dw-demo-image-viewer/dw-demo-Knowledge.jpg',
            thumbUrl: './assets/file/dw-demo-image-viewer/dw-demo-Knowledge.jpg',
            type: 'image/jpeg',
            title: '知識學院'
          },
          {
            uid: 'pk006', // 檔案唯一識別碼
            size: 889542,
            name: 'dw-demo-No46.png', // 檔案名
            status: 'error', // 狀態：uploading done error removed
            url: '', // 檔案URL
            thumbUrl: '', // 檔案縮圖URL
            type: 'image/png',
            title: 'dw-demo-No46.png'
          },
        ];

        observer.next(responseData);
        observer.complete();
      }
    );
  }
}
