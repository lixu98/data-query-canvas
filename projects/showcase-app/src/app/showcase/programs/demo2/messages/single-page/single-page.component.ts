import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-dw-showcase-single-page',
  templateUrl: './single-page.component.html',
  styleUrls: ['./single-page.component.css']
})
export class ShowcaseSinglePageComponent implements OnInit {

  validateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private DwMessage: NzMessageService
  ) { }

  submitForm(): void {
    // this.dwMessage.info(this.validateForm.controls.message.value);
    this.DwMessage.info(this.validateForm.controls.message.value);
    this.validateForm.controls.message.setValue('');
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      message: [null, [Validators.required]]
    });
  }

  getFormControl(name: string): any {
    return this.validateForm.controls[name];
  }

}
