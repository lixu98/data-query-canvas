import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DwExtraFieldsModule } from '@webdpt/components/extra-fields';
import { ExtraFieldsRoutingModule } from './extra-fields-routing.module';
import { customAsyncValidator, customValidator } from './extra-fields.validators';



@NgModule({
  imports: [
    CommonModule,
    ExtraFieldsRoutingModule,
    // 產品註冊驗證器範例(Built-in Angular Validators 不需要註冊)
    DwExtraFieldsModule.forConfig({
      validators: {
        customValidator: customValidator
      },
      asyncValidators: {
        customAsyncValidator: customAsyncValidator
      },
      errorMessages: {
        customValidator: 'customValidator - {{label}} cannot start with abc',
        customAsyncValidator: 'customAsyncValidator - {{label}} cannot start with bcde'
      }
    })
  ],
  declarations: [
  ],
  entryComponents: [],
  providers: [],
  exports: [
  ]
}
)
export class ExtraFieldsModule { }
