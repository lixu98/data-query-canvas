import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent } from './page-not-found.component';
import { APP_BASE_HREF } from '@angular/common';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    loadChildren: (): Promise<any> => import('./implementation/implementation.module').then(m => m.ImplementationModule)
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];


@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      { relativeLinkResolution: 'legacy' }
      // , { enableTracing: true } // debugging purposes only
    ),
  ],
  declarations: [
    PageNotFoundComponent
  ],
  exports: [
    RouterModule
  ],
  providers: [{ provide: APP_BASE_HREF, useValue: (window as any).__POWERED_BY_QIANKUN__ ? '/bm-dqt' : '/' }]
})
export class AppRoutingModule {
}
