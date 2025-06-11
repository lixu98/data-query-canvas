import { Component, Input, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { DwLanguageCoreModule } from '@webdpt/components/core';
import { DwForgetModule } from '@webdpt/components/user/forget-block';
import { Logo_Path } from '@webdpt/framework/config';
import { DwLanguageService } from '@webdpt/framework/language';
import { TranslateServiceStub, TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { of } from 'rxjs/internal/observable/of';
import { ShowcaseForgetComponent } from './forget.component';
import { ShowcaseForgetModule } from './forget.module';

describe('ShowcaseForgetComponent', () => {
  let component: ShowcaseForgetComponent;
  let fixture: ComponentFixture<ShowcaseForgetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ShowcaseForgetModule,
        TranslateTestingModule
      ],
      providers: [
        // { provide: TranslateService, useClass: TranslateServiceStub },
        // { provide: DwLanguageService, useValue: {language$: of('zh_TW')}},
        { provide: Logo_Path, useValue: '/mock-logo-path' }
      ],
      declarations: [ShowcaseForgetComponent]
    })
      .overrideModule(DwLanguageCoreModule, {
        set: {
          declarations: [MockDwLanguageStylePipe], // 替換DwLanguageStylePipe
          exports: [MockDwLanguageStylePipe]
        }
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
    fixture = TestBed.createComponent(ShowcaseForgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
@Pipe({
  name: 'dwLanguage'
})
export class MockDwLanguageStylePipe implements PipeTransform {
  transform(): string {
    return 'zh_AA';
  }
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
