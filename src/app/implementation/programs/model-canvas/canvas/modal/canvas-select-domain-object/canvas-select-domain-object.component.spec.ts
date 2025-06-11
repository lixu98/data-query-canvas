import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasSelectDomainObjectComponent } from './canvas-select-domain-object.component';

describe('CanvasSelectDomainObjectComponent', () => {
  let component: CanvasSelectDomainObjectComponent;
  let fixture: ComponentFixture<CanvasSelectDomainObjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanvasSelectDomainObjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasSelectDomainObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
