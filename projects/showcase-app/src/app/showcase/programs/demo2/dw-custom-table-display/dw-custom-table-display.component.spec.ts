import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DwCommonRouterTestingModule } from '@webdpt/framework/sharedTest/common-router-test';
import { DwCustomTableDisplayComponent } from './dw-custom-table-display.component';
import { DwCustomTableDisplaySearchConditionModel } from './model';
import { DwCustomTableDisplayService } from './service/dw-custom-table-display.service';


describe('DwCustomTableDisplayComponent', () => {
  let component: DwCustomTableDisplayComponent;
  let fixture: ComponentFixture<DwCustomTableDisplayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        DwCommonRouterTestingModule,
      ],
      providers: [
        DwCustomTableDisplaySearchConditionModel,
        { provide: DwCustomTableDisplayService, useValue:{}}
      ],
      declarations: [ DwCustomTableDisplayComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DwCustomTableDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

