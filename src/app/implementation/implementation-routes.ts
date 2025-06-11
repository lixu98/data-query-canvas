import { Routes } from '@angular/router';

export const IMPLEMENTATION_ROUTES: Routes = [
  // 設定應用開發應用模組路由
  {
    path: '', // 首頁
    pathMatch: 'prefix',
    loadChildren: (): Promise<any> => import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'model-design', // 新的路由
    pathMatch: 'prefix',
    loadChildren: (): any => import('./programs/model-design/model-design.module').then(m => m.ModelDesignModule)
  },
  {
    path: 'model-canvas', // 新的路由
    pathMatch: 'prefix',
    loadChildren: (): any => import('./programs/model-canvas/model-canvas.module').then(m => m.ModelCanvasModule)
  },
  {
    path: 'inquiry-plan', // 新的路由
    pathMatch: 'prefix',
    loadChildren: (): any => import('./programs/inquiry-plan/inquiry-plan.module').then(m => m.InquiryPlanModule)
  }
];
