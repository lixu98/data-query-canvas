import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ExtraFieldsEmployeeRepository } from '../employee';

describe('ExtraFieldsEmployeeRepository', () => {
  const _configureTestingModule = {
    imports: [
      CommonModule,
      HttpClientTestingModule
    ],
    declarations: [
    ],
    providers: [
      HttpClient,
      ExtraFieldsEmployeeRepository,
    ]
  };

  let httpMocker: HttpTestingController;
  let extraFieldsEmployeeRepository: ExtraFieldsEmployeeRepository;

  beforeEach(async () => {
    TestBed.configureTestingModule(_configureTestingModule)
      .compileComponents().then(() => {
        httpMocker = TestBed.inject(HttpTestingController);
        extraFieldsEmployeeRepository = TestBed.inject(ExtraFieldsEmployeeRepository);
      });
  });
  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpMocker.verify();
  });
  it('getEmployees', fakeAsync(() => {
    tick();
    extraFieldsEmployeeRepository.getEmployees().subscribe(res => {
      expect(res.data[0].hasOwnProperty('name')).toBeTruthy();
    });
    httpMocker.expectOne('showcase/demo1/getEmployee').flush({
      data: [{ name: 'mockName', id: 'mockId' }]
    });
    tick(1000);
  }));
});
