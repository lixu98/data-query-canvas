import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpressionItemComponent } from './expression-item.component';

describe('ExpressionItemComponent', () => {
  let component: ExpressionItemComponent;
  let fixture: ComponentFixture<ExpressionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpressionItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpressionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
