import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router, Routes } from '@angular/router';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { ShowcaseRouteBackPageComponent } from './route-back-page.component';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
@Component({
  template: `
       <div>TestComponent</div>
      `
})
export class TestComponent {

}
export const routes: Routes = [
  {
    path: 'dw-send-message',
    component: TestComponent,
  }
];
describe('ShowcaseRouteBackPageComponent', () => {
  let component: ShowcaseRouteBackPageComponent;
  let fixture: ComponentFixture<ShowcaseRouteBackPageComponent>;
  let de: DebugElement;
  let router: Router;
  let location: Location;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        TranslateTestingModule,
        NoopAnimationsModule,
      ],
      declarations: [
        TestComponent,
        ShowcaseRouteBackPageComponent
      ]
    })
      // .overrideModule(ShowcaseMessagesRoutingModule, { // 單元測試,只專注於當前component,故將原路由設置清空, 改用RouterTestingModule.withRoutes(routes)的配置
      //   set: {
      //     imports: [],
      //     exports: []
      //   }
      // })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowcaseRouteBackPageComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('按下返回鍵, 需跳轉路由', fakeAsync(()=>{
    const backBT = de.query(By.css('button'));
    backBT.nativeElement.click();
    fixture.detectChanges();
    tick(1000);
    expect(location.path()).toBe('/dw-send-message');
  }));
});



