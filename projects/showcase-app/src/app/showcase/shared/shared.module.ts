import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DwExceptionModule } from '@webdpt/components/exception';



/**
 * 共享模組
 *
 * @export
 * @class ShowcaseSharedModule
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    FormsModule,
    DwExceptionModule,
    ReactiveFormsModule
  ]
})
export class ShowcaseSharedModule { }
