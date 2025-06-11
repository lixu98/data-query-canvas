import { Component, Injectable, Input, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DwLoginModule } from '@webdpt/components/login';
import { Logo_Path } from '@webdpt/framework/config';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { LoginModule } from '../login.module';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        LoginModule,
        RouterTestingModule
      ],
      providers: [
        { provide: TranslateService, useClass: TranslateServiceStub },
        { provide: TranslatePipe, useClass: TranslatePipeMock },
        { provide: Logo_Path, useValue: '/mock-logo-path' }
      ],
      declarations: [LoginComponent]
    })
      .overrideModule(DwLoginModule, {
        set: {
          imports: [],
          declarations: [MockLoginComponent],
          exports: [MockLoginComponent]
        }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
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
  selector: 'dw-login-block',
  template: `
     <div>mockLoginComponent</div>
    `
})
export class MockLoginComponent {
  @Input() showRemember;
  @Input() showLanguage;
}

