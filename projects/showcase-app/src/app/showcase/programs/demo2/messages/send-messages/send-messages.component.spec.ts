import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { NzIconTestModule } from 'ng-zorro-antd/icon/testing';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ShowcaseMessagesRoutingModule } from '../messages-routing.module';
import { ShowcaseMessagesModule } from '../messages.module';
import { ShowcaseSendMessagesComponent } from './send-messages.component';
import { Location } from '@angular/common';

@Component({
  template: `
       <div>TestComponent</div>
      `
})
export class TestComponent {

}
export const routes: Routes = [
  {
    path: 'dw-route-back-page',
    component: TestComponent,
  }
];

describe('ShowcaseSendMessagesComponent', () => {
  let component: ShowcaseSendMessagesComponent;
  let fixture: ComponentFixture<ShowcaseSendMessagesComponent>;
  let dwMessageService: NzMessageService;
  let de: DebugElement;
  let location: Location;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        TranslateTestingModule,
        NzIconTestModule,
        NoopAnimationsModule,
        ShowcaseMessagesModule
      ],
      declarations: [ShowcaseSendMessagesComponent]
    })
      .overrideModule(ShowcaseMessagesRoutingModule, { // 單元測試,只專注於當前component,故將原路由設置清空, 改用RouterTestingModule.withRoutes(routes)的配置
        set: {
          imports: [],
          exports: []
        }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowcaseSendMessagesComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    dwMessageService = TestBed.inject(NzMessageService);
    location = TestBed.inject(Location);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('app-dw-showcase-single-page輸入訊息,按下發送,需顯示訊息', fakeAsync(()=>{
    const spyMsg= spyOn(dwMessageService, 'info').and.callThrough();
    const input = de.query(By.css('app-dw-showcase-single-page input')).nativeElement;
    const addBt = de.query(By.css('app-dw-showcase-single-page button')).nativeElement;
    input.value = 'mockMsg1';
    input.dispatchEvent(new Event('input'));
    addBt.click();
    fixture.detectChanges();
    tick(1000);
    de.query(By.css('app-dw-showcase-single-page button[ng-reflect-nz-type="primary"]')).nativeElement.click(); // 發送
    fixture.detectChanges();
    flush();
    expect(spyMsg).toHaveBeenCalledTimes(1);
  }));
  it('app-dw-showcase-single-page-batch輸入多筆訊息,按下發送,需顯示多筆訊息', fakeAsync(()=>{
    const spyMsg= spyOn(dwMessageService, 'success').and.callThrough();
    const input = de.query(By.css('app-dw-showcase-single-page-batch input')).nativeElement;
    const addBt = de.query(By.css('app-dw-showcase-single-page-batch button')).nativeElement;
    input.value = 'mockMsg1';
    input.dispatchEvent(new Event('input'));
    addBt.click();
    fixture.detectChanges();
    tick(1000);
    input.value = 'mockMsg2';
    input.dispatchEvent(new Event('input'));
    addBt.click();
    fixture.detectChanges();
    tick(1000);
    de.query(By.css('app-dw-showcase-single-page-batch button[ng-reflect-nz-type="primary"]')).nativeElement.click(); // 發送
    fixture.detectChanges();
    flush();
    expect(spyMsg).toHaveBeenCalledTimes(2);
  }));
  it('app-dw-showcase-routed-message輸入多筆訊息,按下發送,需顯示多筆訊息且跳轉路由', fakeAsync(()=>{
    const spyMsg= spyOn(dwMessageService, 'success').and.callThrough();
    const input = de.query(By.css('app-dw-showcase-routed-message input')).nativeElement;
    const addBt = de.query(By.css('app-dw-showcase-routed-message button')).nativeElement;
    input.value = 'mockMsg1';
    input.dispatchEvent(new Event('input'));
    addBt.click();
    fixture.detectChanges();
    tick(1000);
    input.value = 'mockMsg2';
    input.dispatchEvent(new Event('input'));
    addBt.click();
    fixture.detectChanges();
    tick(1000);
    de.query(By.css('app-dw-showcase-routed-message button[ng-reflect-nz-type="primary"]')).nativeElement.click(); // 發送
    fixture.detectChanges();
    flush();
    expect(location.path()).toBe('/dw-route-back-page');
    expect(spyMsg).toHaveBeenCalledTimes(2);
  }));
});
