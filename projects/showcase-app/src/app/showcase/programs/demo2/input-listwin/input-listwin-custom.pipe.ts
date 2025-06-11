import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'InputListwinCustomPipe'
})
export class InputListwinCustomPipe implements PipeTransform {
  constructor(
    private sanitized: DomSanitizer
  ) {
  }

  transform(datas: any, styleProperty:string = 'color', styleValue: string = 'red'): any {
    styleValue = (datas === 'C01') ? styleValue : 'blue';
    return this.sanitized.bypassSecurityTrustHtml(`<span style="${styleProperty}: ${styleValue};">${datas}</span>`);
  }

}
