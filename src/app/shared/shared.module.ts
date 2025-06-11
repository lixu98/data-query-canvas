import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DwExceptionModule } from '@webdpt/components/exception';
import { EmptyDataComponent } from './empty-data/empty-data.component';
import { NgZorroAntdModule } from './ng-zorro-antd/ng-zorro-antd.module';
import { FormErrorTipComponent } from './form-error-tip/form-error-tip.component';
import { TreeNodeComponent } from './tree-node/tree-node.component'
/**
 * 共享模組
 *
 * @export
 * @class SharedModule
 */
@NgModule({
  declarations: [
    EmptyDataComponent,
    FormErrorTipComponent,
    TreeNodeComponent,
  ],
  imports: [
    NgZorroAntdModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
    exports: [
        NgZorroAntdModule,
        FormsModule,
        ReactiveFormsModule,
        DwExceptionModule,
        EmptyDataComponent,
        FormErrorTipComponent,
        TreeNodeComponent,
    ]
})
export class SharedModule { }
