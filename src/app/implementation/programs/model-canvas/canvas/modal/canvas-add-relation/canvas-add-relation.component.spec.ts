import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasAddRelationComponent } from './canvas-add-relation.component';

describe('CanvasAddRelationComponent', () => {
  let component: CanvasAddRelationComponent;
  let fixture: ComponentFixture<CanvasAddRelationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanvasAddRelationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasAddRelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
