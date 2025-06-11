import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'dw-job-schedule-in-form',
  template: `
    <form [formGroup]="form">
      <dw-job-time-setting formControlName="schedule"></dw-job-time-setting>
    </form>
  `
})
export class DwJobScheduleInReactiveFormComponent {
  form: FormGroup;
  schedule = {
    schedule_id: '',
    schedule_name: '',
    schedule_type: '2',
    job_name: '',
    time_radio: '1',
    time: '',
    time1: '17,00,00,17,59,00,5,1',
    time2: '12,22,00,12,33,00,1,2',
    time3: '17,00,00,17,59,00,5,1',
    r_rule: ''
  };

  constructor(formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      schedule: [this.schedule]
    });
  }
}
