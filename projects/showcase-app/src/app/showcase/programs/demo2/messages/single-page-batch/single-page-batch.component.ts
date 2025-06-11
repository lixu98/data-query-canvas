import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-dw-showcase-single-page-batch',
  templateUrl: './single-page-batch.component.html',
  styleUrls: ['./single-page-batch.component.css']
})
export class ShowcaseSinglePageBatchComponent implements OnInit {

  validateForm: FormGroup;
  messages: string[] = [];

  constructor(
    private fb: FormBuilder,
    private DwMessage: NzMessageService
  ) { }

  submitForm(): void {
    for (const msg of this.messages) {
      this.DwMessage.success(msg);
    }
    this.validateForm.controls.message.setValue('');
    this.messages.splice(0);
  }

  addMessage(): void {
    if(this.validateForm.controls.message.value){
      this.messages.push(this.validateForm.controls.message.value);
    }
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
