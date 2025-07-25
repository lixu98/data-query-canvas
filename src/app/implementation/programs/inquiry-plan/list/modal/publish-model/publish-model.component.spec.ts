import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishModelComponent } from './publish-model.component';

describe('PublishModelComponent', () => {
  let component: PublishModelComponent;
  let fixture: ComponentFixture<PublishModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublishModelComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
