import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '', loadChildren: () => import('./list/mode-list.module').then(m => m.ListModule)
  },
];

// 定义一个模块，该模块包含路由配置
@NgModule({
  // 导入路由模块
  imports: [RouterModule.forChild(routes)],
  // 导出路由模块
  exports: [RouterModule]
})
// 导出模块
export class ModelDesignRoutingModule { }
