import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Demo2CustomerRepository } from '../demo2-customer';

describe('Demo2CustomerRepository', () => {
  const datas = [];
  const _configureTestingModule = {
    imports: [
      CommonModule,
      HttpClientTestingModule
    ],
    declarations: [
    ],
    providers: [
      HttpClient,
      Demo2CustomerRepository,
    ]
  };

  let httpMocker: HttpTestingController;
  let mockHttpClient: HttpClient;
  let demo2CustomerRepository: Demo2CustomerRepository;

  beforeEach(async () => {
    TestBed.configureTestingModule(_configureTestingModule)
      .compileComponents().then(() => {
        httpMocker = TestBed.inject(HttpTestingController);
        mockHttpClient = TestBed.inject(HttpClient);
        demo2CustomerRepository = TestBed.inject(Demo2CustomerRepository);
      });
  });
  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpMocker.verify();
  });
  it('getCustomers', fakeAsync(() => {
    tick();
    demo2CustomerRepository.getCustomers().subscribe(res => {
      expect(res.data[0].hasOwnProperty('name')).toBeTruthy();
    });
    httpMocker.expectOne('showcase/demo1/getCustomers').flush({
      data: [{ name: 'mockName', id: 'mockId' }]
    });
    tick(1000);
  }));
});
