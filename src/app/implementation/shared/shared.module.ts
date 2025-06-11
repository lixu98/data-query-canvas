import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DwExceptionModule } from '@webdpt/components/exception';

/**
 * 共享模組
 *
 * @export
 * @class SharedModule
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    DwExceptionModule
  ]
})
export class SharedModule { }
