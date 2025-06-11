import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationColumnComponent } from './operation-column.component';

describe('OperationColumnComponent', () => {
  let component: OperationColumnComponent;
  let fixture: ComponentFixture<OperationColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperationColumnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
