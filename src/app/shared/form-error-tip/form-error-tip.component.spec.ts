import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormErrorTipComponent } from './form-error-tip.component';

describe('FormErrorTipComponent', () => {
  let component: FormErrorTipComponent;
  let fixture: ComponentFixture<FormErrorTipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormErrorTipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormErrorTipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
