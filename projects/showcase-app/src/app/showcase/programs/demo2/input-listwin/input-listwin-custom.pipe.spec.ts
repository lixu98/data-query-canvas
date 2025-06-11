import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { InputListwinCustomPipe } from './input-listwin-custom.pipe';

describe('InputListwinCustomPipe', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let de: DebugElement;
  let srv: InputListwinCustomPipe;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, InputListwinCustomPipe],
      providers: [
        InputListwinCustomPipe
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });
  it('should be created', () => {
    expect(component).toBeTruthy();
    const divs = de.queryAll(By.css('div'));
    expect((divs[0].nativeElement as HTMLDivElement).innerHTML).toEqual('<span style="color: red;">C01</span>');
    expect((divs[1].nativeElement as HTMLDivElement).innerHTML).toEqual('<span style="font-size: 24px;">C01</span>');
    expect((divs[2].nativeElement as HTMLDivElement).innerHTML).toEqual('<span style="font-size: red;">C01</span>');
    expect((divs[3].nativeElement as HTMLDivElement).innerHTML).toEqual('<span style="color: green;">C01</span>');
    expect((divs[4].nativeElement as HTMLDivElement).innerHTML).toEqual('<span style="color: blue;">C02</span>');
  });

});


@Component({
  template: `
      <div [innerHtml]="value|InputListwinCustomPipe"></div>
      <div [innerHtml]="value|InputListwinCustomPipe:'font-size':'24px'"></div>
      <div [innerHtml]="value|InputListwinCustomPipe:'font-size'"></div>
      <div [innerHtml]="value|InputListwinCustomPipe:'color':'green'"></div>
      <div [innerHtml]="'C02'|InputListwinCustomPipe"></div>
    `
})
class TestComponent {
  value = 'C01';
}
