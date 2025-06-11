import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { Router, RouterOutlet } from '@angular/router';
import { Location } from '@angular/common';
import { ExtraFieldsDocumentOrderModule } from './document/order.module';
import { ExtraFieldsOrderModule } from './order/order.module';
import { routes } from './extra-fields-routing.module';
import { RouterTestingModule } from '@angular/router/testing';

@Component({
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {
  @ViewChild(RouterOutlet)
  routerOutlet: RouterOutlet;
  constructor() { }
}
describe('ExtraFieldsRoutingModule', () => {
  describe('Router', () => {
    let location: Location;
    let router: Router;
    let fixture: ComponentFixture<AppComponent>;
    let testComponent: AppComponent;
    let de: DebugElement;
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes(routes)
        ],
        declarations: [
          AppComponent
        ]
      })
        .overrideModule(ExtraFieldsDocumentOrderModule, {
          set: {
            imports: [],
            exports: []
          }
        })
        .overrideModule(ExtraFieldsOrderModule, {
          set: {
            imports: [],
            exports: []
          }
        })
        .compileComponents();
    }));
    beforeEach(() => {
      router = TestBed.inject(Router);
      location = TestBed.inject(Location);
      fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
      de = fixture.debugElement;

      fixture.ngZone.run(() => {
        router.initialNavigation();
      });
    });

    it('navigate to "" redirects to /document', fakeAsync(async () => {
      tick(1000);
      fixture.ngZone.run(() => {
        router.navigate(['']).then(() => {
          expect(location.path()).toContain('/document');
          fixture.detectChanges();
          tick(1000);
        });
      });
    }));
    it('navigate to "order" redirects to /order', fakeAsync(async () => {
      tick(1000);
      fixture.ngZone.run(() => {
        router.navigate(['/order']).then(() => {
          expect(location.path()).toContain('/order');
          fixture.detectChanges();
          tick(1000);
        });
      });
    }));
  });
});


