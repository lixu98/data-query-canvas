import { Component, Injectable, Input, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DwForgetModule } from '@webdpt/components/user/forget-block';
import { Logo_Path } from '@webdpt/framework/config';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { ForgetComponent } from './forget.component';
import { ForgetModule } from './forget.module';

describe('ForgetComponent', () => {
  let component: ForgetComponent;
  let fixture: ComponentFixture<ForgetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ForgetModule,
        RouterTestingModule
      ],
      providers: [
        { provide: TranslateService, useClass: TranslateServiceStub },
        { provide: TranslatePipe, useClass: TranslatePipeMock },
        { provide: Logo_Path, useValue: '/mock-logo-path' }
      ],
      declarations: [ForgetComponent]
    })
      .overrideModule(DwForgetModule,
        {
          set: {
            imports: [],
            declarations: [MockDwForgetBlockComponent],
            exports: [MockDwForgetBlockComponent]
          }
        })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
@Pipe({
  name: 'translate'
})
export class TranslatePipeMock implements PipeTransform {
  public name = 'translate';

  public transform(query: string, ...args: any[]): any {
    return query;
  }
}

@Injectable()
export class TranslateServiceStub {
  public instant(key: string, interpolateParams?: Object): string {
    return key;
  }
  public get<T>(key: T): Observable<T> {
    return of(key);
  }
  public onTranslationChange = of({ lang: 'TW' });
  public onLangChange = of({ translations: null });
  public onDefaultLangChange = of(true);
  public currentLang = 'zh_TW';
}
@Component({
  selector: 'dw-forget-block',
  template: `
     <div>MockDwForgetBlockComponent</div>
    `
})
export class MockDwForgetBlockComponent {
  @Input() verificationType: any;
}
