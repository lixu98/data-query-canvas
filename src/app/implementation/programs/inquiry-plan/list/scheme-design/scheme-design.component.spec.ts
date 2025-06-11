import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeDesignComponent } from './scheme-design.component';

describe('SchemeDesignComponent', () => {
  let component: SchemeDesignComponent;
  let fixture: ComponentFixture<SchemeDesignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchemeDesignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemeDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
