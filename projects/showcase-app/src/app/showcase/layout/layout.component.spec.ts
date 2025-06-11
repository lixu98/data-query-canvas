import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LayoutComponent } from './layout.component';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutComponent, MockDwLayoutAppComponent, MockDwLayoutDefaultComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
@Component({
  selector: 'dw-layout-app',
  template: `
     <div>dw-layout-app</div>
    `
})
export class MockDwLayoutAppComponent {
}
@Component({
  selector: 'dw-layout-default',
  template: `
     <div>dw-layout-default</div>
    `
})
export class MockDwLayoutDefaultComponent {
}
