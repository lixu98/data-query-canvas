import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'document',
    pathMatch: 'prefix'
  },
  {
    path: 'document',
    loadChildren: (): Promise<any> => import('./document/order.module').then(m => m.ExtraFieldsDocumentOrderModule)
  },
  {
    path: 'order',
    loadChildren: (): Promise<any> => import('./order/order.module').then(m => m.ExtraFieldsOrderModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExtraFieldsRoutingModule { }
