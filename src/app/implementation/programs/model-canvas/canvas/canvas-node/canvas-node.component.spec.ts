import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasNodeComponent } from './canvas-node.component';

describe('CanvasNodeComponent', () => {
  let component: CanvasNodeComponent;
  let fixture: ComponentFixture<CanvasNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanvasNodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
