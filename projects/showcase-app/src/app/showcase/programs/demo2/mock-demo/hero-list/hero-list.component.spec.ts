import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import zh from '@angular/common/locales/zh';
registerLocaleData(zh);

import { registerLocaleData } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ShowcaseHeroListComponent } from './hero-list.component';
import { ShowcaseMockDemoModule } from '../mock-demo.module';
import { HttpClient } from '@angular/common/http';

describe('ShowcaseHeroListComponent', () => {
  let component: ShowcaseHeroListComponent;
  let fixture: ComponentFixture<ShowcaseHeroListComponent>;
  let de: DebugElement;
  let httpMocker: HttpTestingController;
  let httpClient: HttpClient;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ShowcaseMockDemoModule,
        TranslateTestingModule,
        HttpClientTestingModule
      ],
      providers: [

      ],
      declarations: [ShowcaseHeroListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowcaseHeroListComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    httpMocker = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    // fixture.detectChanges();
  });
  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpMocker.verify();
  });
  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('執行getHeroes, http.post需被執行', fakeAsync(()=>{
    fixture.detectChanges();
    const spyPost = spyOn(httpClient, 'post').and.callThrough();
    const button = de.query(By.css('button')).nativeElement;
    button.click();
    fixture.detectChanges();
    tick(1000);
    const getHeroesReq = httpMocker.expectOne('showcase/Hero/getHeroes');
    getHeroesReq.flush(JSON.parse(JSON.stringify({datas: [    {
      'orderId': 'No_000001',
      'status': 'Y',
      'orderDate': '2017/12/22',
      'customerId': 'C01',
      'customerName': '櫃櫃傢俱股份有限公司',
      'orderAddr': '台中市大里區中興路一段1號',
      'total': 3903000,
      'salesmanId': '1',
      'salesmanName': '孙品品',
      'gender': 'female',
      'genderDesc': '女',
      'statusDesc': '有效'
    }]}))); // colne deep,避免getOrderList裏JSON.parse(row.cust_field)後影嚮原始資料

    fixture.detectChanges();
    tick(1000);
    expect(spyPost).toHaveBeenCalled();
  }));

});

