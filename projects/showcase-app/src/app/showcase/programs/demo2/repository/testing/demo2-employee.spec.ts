import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Demo2EmployeeRepository } from '../demo2-employee';

describe('Demo2EmployeeRepository', () => {
  const _configureTestingModule = {
    imports: [
      CommonModule,
      HttpClientTestingModule
    ],
    declarations: [
    ],
    providers: [
      HttpClient,
      Demo2EmployeeRepository,
    ]
  };

  let httpMocker: HttpTestingController;
  let demo2EmployeeRepository: Demo2EmployeeRepository;

  beforeEach(async () => {
    TestBed.configureTestingModule(_configureTestingModule)
      .compileComponents().then(() => {
        httpMocker = TestBed.inject(HttpTestingController);
        demo2EmployeeRepository = TestBed.inject(Demo2EmployeeRepository);
      });
  });
  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpMocker.verify();
  });
  it('getEmployees', fakeAsync(() => {
    tick();
    demo2EmployeeRepository.getEmployees().subscribe(res => {
      expect(res.data[0].hasOwnProperty('name')).toBeTruthy();
    });
    httpMocker.expectOne('showcase/demo1/getEmployee').flush({
      data: [{ name: 'mockName', id: 'mockId' }]
    });
    tick(1000);
  }));
});
