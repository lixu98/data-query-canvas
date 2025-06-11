import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasViewRelationComponent } from './canvas-view-relation.component';

describe('CanvasViewRelationComponent', () => {
  let component: CanvasViewRelationComponent;
  let fixture: ComponentFixture<CanvasViewRelationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanvasViewRelationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasViewRelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
