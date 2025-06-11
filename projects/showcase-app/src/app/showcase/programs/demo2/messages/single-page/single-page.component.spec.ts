import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { NzIconTestModule } from 'ng-zorro-antd/icon/testing';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ShowcaseMessagesRoutingModule } from '../messages-routing.module';
import { ShowcaseMessagesModule } from '../messages.module';

import { ShowcaseSinglePageComponent } from './single-page.component';

describe('ShowcaseSinglePageComponent', () => {
  let component: ShowcaseSinglePageComponent;
  let fixture: ComponentFixture<ShowcaseSinglePageComponent>;
  let dwMessageService: NzMessageService;
  let de: DebugElement;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslateTestingModule,
        NzIconTestModule,
        NoopAnimationsModule,
        ShowcaseMessagesModule
      ],
      declarations: [ShowcaseSinglePageComponent]
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
    fixture = TestBed.createComponent(ShowcaseSinglePageComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    dwMessageService = TestBed.inject(NzMessageService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('輸入訊息,按下發送,需顯示訊息', fakeAsync(()=>{
    const spyInfo = spyOn(dwMessageService, 'info').and.callThrough();
    const input = de.query(By.css('input')).nativeElement;
    input.value = 'mockMsg';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    tick(1000);
    de.query(By.css('button')).nativeElement.click(); // 發送
    fixture.detectChanges();
    flush();
    expect(spyInfo.calls.mostRecent().args[0]).toEqual('mockMsg');
  }));
});
