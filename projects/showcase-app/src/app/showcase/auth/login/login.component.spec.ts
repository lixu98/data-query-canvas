import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { DwLoginModule } from '@webdpt/components/login';
import { Logo_Path } from '@webdpt/framework/config';
import { TranslateServiceStub } from '@webdpt/framework/sharedTest';
import { ShowcaseLoginModule } from '../login.module';
import { ShowcaseLoginComponent } from './login.component';

describe('ShowcaseLoginComponent', () => {
  let component: ShowcaseLoginComponent;
  let fixture: ComponentFixture<ShowcaseLoginComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ShowcaseLoginModule
      ],
      providers: [
        { provide: TranslateService, useClass: TranslateServiceStub },
        { provide: Logo_Path, useValue: '/mock-logo-path' }
      ],
      declarations: [ShowcaseLoginComponent]
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
    fixture = TestBed.createComponent(ShowcaseLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'dw-login-block',
  template: `
     <div>mockLoginComponent</div>
    `
})
export class MockLoginComponent {
  @Input() showRemember;
  @Input() showLanguage;
  @Input() showLoginTabSet;
}

