import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeDesignAddComponent } from './scheme-design-add.component';

describe('SchemeDesignAddComponent', () => {
  let component: SchemeDesignAddComponent;
  let fixture: ComponentFixture<SchemeDesignAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchemeDesignAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemeDesignAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
