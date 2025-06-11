import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DwActionModule } from '@webdpt/components/action';
import { MockDwActionAuthorizedDirective } from '@webdpt/components/action/testing';
import { DwLanguageService } from '@webdpt/framework/language';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { of } from 'rxjs';

import { GridsterComponent } from './gridster.component';
import { ShowcaseGridsterModule } from './gridster.module';
const createBubbledEvent = (type, props = {}) => {
  const event = new Event(type, { bubbles: true });
  Object.assign(event, props);
  return event;
};
describe('GridsterComponent', () => {
  let component: GridsterComponent;
  let fixture: ComponentFixture<GridsterComponent>;
  let httpMocker: HttpTestingController;
  let de: DebugElement;
  let commonGetGridsterReq: () => void;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ShowcaseGridsterModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        TranslateTestingModule,
      ],
      providers: [
        { provide: DwLanguageService, useValue: { language$: of('zh_TW') } }
      ],
      declarations: [
        GridsterComponent
      ]
    })
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
    fixture = TestBed.createComponent(GridsterComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;

    httpMocker = TestBed.inject(HttpTestingController);
    commonGetGridsterReq = () => {
      fixture.detectChanges(); // 觸發ngOnInit
      tick(1000);
      const getGridsterReq = httpMocker.expectOne('showcase/demo1/getGridster');
      getGridsterReq.flush(JSON.parse(JSON.stringify(getGridsterResponse))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料
      fixture.detectChanges();
      tick(1000);
    };
    // fixture.detectChanges(); // 觸發ngOnInit
  });
  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpMocker.verify();
  });

  it('should create', fakeAsync(() => {
    commonGetGridsterReq();
    expect(component).toBeTruthy();
  }));
  it('拖拉需觸發draggtStartEvent,draggStopEvent', fakeAsync(() => {
    const spyDraggtStartEvent = spyOn(component, 'draggtStartEvent').and.callThrough();
    const spyDraggStopEvent = spyOn(component, 'draggStopEvent').and.callThrough();
    commonGetGridsterReq();
    const targetNode = de.query(By.css('gridster-item .item-buttons')).nativeElement;
    targetNode.dispatchEvent(
      createBubbledEvent('mousedown', { clientX: 0, clientY: 0 })
    );
    targetNode.dispatchEvent(
      createBubbledEvent('mousemove', { clientX: 100, clientY: 100 })
    );
    targetNode.dispatchEvent(
      createBubbledEvent('dragstart', { clientX: 100, clientY: 100 })
    );
    targetNode.dispatchEvent(
      createBubbledEvent('drop', { clientX: 100, clientY: 100 })
    );
    targetNode.dispatchEvent(
      createBubbledEvent('dragend', { clientX: 100, clientY: 100 })
    );
    targetNode.dispatchEvent(
      createBubbledEvent('mouseup', { clientX: 100, clientY: 100 })
    );

    fixture.detectChanges();
    tick(1000);
    expect(spyDraggtStartEvent).toHaveBeenCalled();
    expect(spyDraggStopEvent).toHaveBeenCalled();
  }));
  it('resize需觸發resizeStartEvent,resizeStopEvent', fakeAsync(() => {
    const spyResizeStartEvent = spyOn(component, 'resizeStartEvent').and.callThrough();
    const spyResizeStopEvent = spyOn(component, 'resizeStopEvent').and.callThrough();
    commonGetGridsterReq();
    component.isSave = false; // 只是為了覆蓋率
    fixture.detectChanges();
    tick(1000);
    const targetNode = de.query(By.css('gridster-item .gridster-item-resizable-handler')).nativeElement;
    targetNode.dispatchEvent(
      createBubbledEvent('mousedown', { clientX: 0, clientY: 0 })
    );
    targetNode.dispatchEvent(
      createBubbledEvent('mousemove', { clientX: 100, clientY: 100 })
    );
    targetNode.dispatchEvent(
      createBubbledEvent('dragstart', { clientX: 100, clientY: 100 })
    );
    targetNode.dispatchEvent(
      createBubbledEvent('drop', { clientX: 100, clientY: 100 })
    );
    targetNode.dispatchEvent(
      createBubbledEvent('dragend', { clientX: 100, clientY: 100 })
    );
    targetNode.dispatchEvent(
      createBubbledEvent('mouseup', { clientX: 100, clientY: 100 })
    );

    fixture.detectChanges();
    tick(1000);
    expect(spyResizeStartEvent).toHaveBeenCalled();
    expect(spyResizeStopEvent).toHaveBeenCalled();
  }));
  it('刪除按鈕mousedown, 需觸發onMousedown', fakeAsync(() => {
    const spyOnMousedown = spyOn(component, 'onMousedown').and.callThrough();
    commonGetGridsterReq();
    fixture.detectChanges();
    tick(1000);
    const targetNode = de.query(By.css('gridster-item .remove-button')).nativeElement;
    targetNode.dispatchEvent(
      new Event('mousedown')
    );
    targetNode.dispatchEvent(
      new Event('mouseup')
    );

    fixture.detectChanges();
    tick(1000);
    expect(spyOnMousedown).toHaveBeenCalled();
  }));
  it('按下刪除按鈕, 需觸發removeItem', fakeAsync(() => {
    const spyRemoveItem = spyOn(component, 'removeItem').and.callThrough();
    commonGetGridsterReq();
    fixture.detectChanges();
    tick(1000);
    const targetNode = de.query(By.css('gridster-item .remove-button')).nativeElement;
    targetNode.dispatchEvent(
      new Event('click')
    );

    fixture.detectChanges();
    tick(1000);
    expect(spyRemoveItem).toHaveBeenCalled();
  }));
});
export const getGridsterResponse = [
  {
    'cols': 2,
    'rows': 2,
    'x': 0,
    'y': 6,
    'label': 'fineReport',
    'minItemCols': 2,
    'minItemRows': 2,
    'type': 'fineReport',
    'url': 'https://1234{{lang_code}}'
  },
  {
    'cols': 2,
    'rows': 2,
    'x': 2,
    'y': 6,
    'label': 'google map',
    'minItemCols': 2,
    'minItemRows': 2,
    'type': '',
    'url': 'https://1234'
  },
  {
    'cols': 2,
    'rows': 2,
    'x': 4,
    'y': 6,
    'label': 'google map',
    'minItemCols': 2,
    'minItemRows': 2,
    'type': '',
    'url': 'https://1234'
  }
];
