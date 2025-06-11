import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { APP_DATE_FORMAT, APP_TIME_FORMAT } from '@webdpt/framework/config';
import { TranslateTestingModule } from '@webdpt/framework/sharedTest';
import { DwModalRefTest } from '@webdpt/framework/sharedTest/common-test-service';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Demo1RepositoryModule } from '../../repository';
import { AsisModule } from '../asis.module';

import { AsisDetailChildEditComponent } from './asis-detail-child-edit.component';

describe('AsisDetailChildEditComponent', () => {
  let component: AsisDetailChildEditComponent;
  let fixture: ComponentFixture<AsisDetailChildEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        AsisModule,
        Demo1RepositoryModule,
        HttpClientTestingModule,
        TranslateTestingModule
      ],
      providers: [
        { provide: APP_DATE_FORMAT, useValue: 'yyyy/MM/dd' },
        { provide: APP_TIME_FORMAT, useValue: 'hh:mm:ss' },
        { provide: NzModalRef, useValue: DwModalRefTest }],
      declarations: [AsisDetailChildEditComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsisDetailChildEditComponent);
    component = fixture.componentInstance;
    component.cmd = 'add';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
