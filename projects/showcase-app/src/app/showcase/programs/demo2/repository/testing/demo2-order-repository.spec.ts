import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Demo2OrderRepository } from '../demo2-order-repository';

describe('Demo2OrderRepository', () => {
  const _configureTestingModule = {
    imports: [
      CommonModule,
      HttpClientTestingModule
    ],
    declarations: [
    ],
    providers: [
      HttpClient,
      Demo2OrderRepository,
    ]
  };

  let httpMocker: HttpTestingController;
  let demo2OrderRepository: Demo2OrderRepository;

  beforeEach(async () => {
    TestBed.configureTestingModule(_configureTestingModule)
      .compileComponents().then(() => {
        httpMocker = TestBed.inject(HttpTestingController);
        demo2OrderRepository = TestBed.inject(Demo2OrderRepository);
      });
  });
  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpMocker.verify();
  });
  it('getOrderList', fakeAsync(() => {
    tick();
    demo2OrderRepository.getOrderList({
      pageSize: 10,
      currentPage: 1,
      param: null,
      sortSet: null
    }).subscribe(res => {
      expect(res.data[0].hasOwnProperty('name')).toBeTruthy();
    });
    httpMocker.expectOne('showcase/demo1/getOrderList').flush({
      data: [{ name: 'mockName', id: 'mockId' }]
    });
    tick(1000);
  }));
  it('getOrderDetail', fakeAsync(() => {
    tick();
    demo2OrderRepository.getOrderDetail({
      orderId: 'mockId'
    }).subscribe(res => {
      expect(res.data[0].hasOwnProperty('name')).toBeTruthy();
    });
    httpMocker.expectOne('showcase/demo1/getOrderDetail').flush({
      data: [{ name: 'mockName', id: 'mockId' }]
    });
    tick(1000);
  }));
  it('modifyOrder', fakeAsync(() => {
    tick();
    demo2OrderRepository.modifyOrder({}).subscribe(res => {
      expect(res.data).toEqual('ok');
    });
    httpMocker.expectOne('showcase/demo1/modifyOrder').flush({
      data: 'ok'
    });
    tick(1000);
  }));
});
