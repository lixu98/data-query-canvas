import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ExtraFieldsCustomerRepository } from '../customer';
describe('ExtraFieldsCustomerRepository', () => {
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
      ExtraFieldsCustomerRepository,
    ]
  };

  let httpMocker: HttpTestingController;
  let mockHttpClient: HttpClient;
  let extraFieldsCustomerRepository: ExtraFieldsCustomerRepository;

  beforeEach(async () => {
    TestBed.configureTestingModule(_configureTestingModule)
      .compileComponents().then(() => {
        httpMocker = TestBed.inject(HttpTestingController);
        mockHttpClient = TestBed.inject(HttpClient);
        extraFieldsCustomerRepository = TestBed.inject(ExtraFieldsCustomerRepository);
      });
  });
  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpMocker.verify();
  });
  it('getCustomers', fakeAsync(() => {
    tick();
    extraFieldsCustomerRepository.getCustomers().subscribe(res => {
      expect(res.data[0].hasOwnProperty('name')).toBeTruthy();
    });
    httpMocker.expectOne('showcase/demo1/getCustomers').flush({
      data: [{ name: 'mockName', id: 'mockId' }]
    });
    tick(1000);
  }));
});
