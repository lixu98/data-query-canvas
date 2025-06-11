import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { DwCommonRouterTestingModule } from '@webdpt/framework/sharedTest/common-router-test';
import { NzIconTestModule } from 'ng-zorro-antd/icon/testing';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ShowcaseMessagesRoutingModule } from '../messages-routing.module';
import { ShowcaseMessagesModule } from '../messages.module';
import { ShowcaseRoutedMessageComponent } from './routed-message.component';
import { Location } from '@angular/common';


describe('ShowcaseRoutedMessageComponent', () => {
  let component: ShowcaseRoutedMessageComponent;
  let fixture: ComponentFixture<ShowcaseRoutedMessageComponent>;
  let dwMessageService: NzMessageService;
  let de: DebugElement;
  let location: Location;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        DwCommonRouterTestingModule,
        TranslateTestingModule,
        NzIconTestModule,
        NoopAnimationsModule,
        ShowcaseMessagesModule
      ],
      declarations: [ShowcaseRoutedMessageComponent]
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
    fixture = TestBed.createComponent(ShowcaseRoutedMessageComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    dwMessageService = TestBed.inject(NzMessageService);
    location = TestBed.inject(Location);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('輸入多筆訊息,按下發送,需顯示多筆訊息且跳轉路由', fakeAsync(()=>{
    const spySuccess = spyOn(dwMessageService, 'success').and.callThrough();
    const input = de.query(By.css('input')).nativeElement;
    const addBt = de.query(By.css('button')).nativeElement;
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
    de.query(By.css('button[ng-reflect-nz-type="primary"]')).nativeElement.click(); // 發送
    fixture.detectChanges();
    flush();
    expect(spySuccess).toHaveBeenCalledTimes(2);
    expect(location.path()).toBe('/dw-route-back-page');

  }));
});
