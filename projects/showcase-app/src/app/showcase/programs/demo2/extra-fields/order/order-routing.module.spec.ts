// import { Component, DebugElement, ViewChild } from '@angular/core';
// import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
// import { Router, RouterOutlet } from '@angular/router';
// import { Location } from '@angular/common';
// import { ExtraFieldsOrderRoutingModule, routes } from './order-routing.module';
// import { RouterTestingModule } from '@angular/router/testing';
// import { DwAuthGuardService } from '@webdpt/framework/auth';
// import { of } from 'rxjs';
// import { DwLanguageService } from '@webdpt/framework/language';
// import { ExtraFieldsOrderListComponent } from './order-list/order-list.component';
// // import { MockComponent} from 'ng-mocks';
// import { ExtraFieldsOrderModifyComponent } from './order-modify/order-modify.component';

// @Component({
//   template: `<router-outlet></router-outlet>`
// })
// export class AppComponent {
//   @ViewChild(RouterOutlet)
//   routerOutlet: RouterOutlet;
//   constructor() { }
// }
// describe('ExtraFieldsOrderRoutingModule', () => {
//   describe('Router', () => {
//     let location: Location;
//     let router: Router;
//     let fixture: ComponentFixture<AppComponent>;
//     let testComponent: AppComponent;
//     let de: DebugElement;
//     beforeEach(waitForAsync(() => {
//       TestBed.configureTestingModule({
//         imports: [
//           RouterTestingModule.withRoutes(routes)
//         ],
//         declarations: [
//           AppComponent,
//           // MockExtraFieldsOrderListComponent,
//           // MockExtraFieldsOrderModifyComponent
//           MockComponent(ExtraFieldsOrderListComponent),
//           MockComponent(ExtraFieldsOrderModifyComponent)
//         ],
//         providers: [
//           {
//             provide: DwAuthGuardService, useValue: {
//               canLoad: () => of(true),
//               canActivateChild: () => of(true),
//               canActivate: () => of(true)
//             }
//           },
//           {
//             provide: DwLanguageService, useValue: {
//               resolve: () => of({})
//             }
//           }
//         ]
//       })
//         .compileComponents();
//     }));
//     beforeEach(() => {
//       router = TestBed.inject(Router);
//       location = TestBed.inject(Location);
//       fixture = TestBed.createComponent(AppComponent);
//       fixture.detectChanges();
//       testComponent = fixture.componentInstance;
//       de = fixture.debugElement;

//       fixture.ngZone.run(() => {
//         router.initialNavigation();
//       });
//     });

//     it('navigate to "" redirects to "/"', fakeAsync(async () => {
//       tick(1000);
//       fixture.ngZone.run(() => {
//         router.navigate(['']).then(() => {
//           expect(location.path()).toContain('/');
//           fixture.detectChanges();
//           tick(1000);
//         });
//       });
//     }));
//     it('navigate to "modify" redirects to /modify', fakeAsync(async () => {
//       tick(1000);
//       fixture.ngZone.run(() => {
//         router.navigate(['/modify']).then(() => {
//           expect(location.path()).toContain('/modify');
//           fixture.detectChanges();
//           tick(1000);
//         });
//       });
//     }));
//   });
// });


// @Component({
//   selector: 'app-dw-order-list',
//   template: `<div>MockExtraFieldsOrderListComponent</div>`
// })
// export class MockExtraFieldsOrderListComponent { }
// @Component({
//   selector: 'app-dw-order-modify',
//   template: `<div>ExtraFieldsOrderModifyComponent</div>`
// })
// export class MockExtraFieldsOrderModifyComponent { }
