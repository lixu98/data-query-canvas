import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasAddNodeComponent } from './canvas-add-node.component';

describe('CanvasAddNodeComponent', () => {
  let component: CanvasAddNodeComponent;
  let fixture: ComponentFixture<CanvasAddNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanvasAddNodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasAddNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
