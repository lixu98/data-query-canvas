import {Component, Input, OnInit, ViewChild, TemplateRef} from '@angular/core';

@Component({
  selector: 'app-form-error-tip',
  template: `
    <ng-template #globalErrorTip let-control>
      <div *ngIf="control.hasError('required')">{{ name }}不能为空</div>
      <div *ngIf="control.hasError('maxlength')">{{ name }}不能超过{{ control?.errors?.maxlength?.requiredLength }}个字符</div>
      <div *ngIf="control.hasError('pattern')">{{ name }}由小写字母下划线数字组成，只能以小写字母开头</div>
      <div *ngIf="control.hasError('repeat')">{{ name }}不能重复</div>
    </ng-template>
  `
})
export class FormErrorTipComponent implements OnInit {
  @ViewChild('globalErrorTip', { static: true }) globalErrorTip!: TemplateRef<any>;
  @Input() name = '';

  constructor() { }

  ngOnInit(): void { }

}