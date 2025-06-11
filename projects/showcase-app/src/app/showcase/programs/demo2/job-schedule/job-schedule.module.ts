import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DwAuthGuardService } from '@webdpt/framework/auth';
import { DwLanguageService } from '@webdpt/framework/language';
import { NzAnchorModule } from 'ng-zorro-antd/anchor';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { ShowcaseSharedModule } from '../../../shared/shared.module';

import { ReactiveFormsModule } from '@angular/forms';
import { DwCronJobsModule } from '@webdpt/components/cron-jobs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { HighlightModule } from 'ngx-highlightjs';
import { DwSimpleJobScheduleInModalDocComponent } from './components/modals/simple-schedule-doc.component';
import { DwSimpleJobScheduleInModalComponent } from './components/modals/simple-schedule.component';
import { DwReactiveFormDocComponent } from './components/reactive-form/reactive-form-doc.component';
import { DwJobScheduleInReactiveFormComponent } from './components/reactive-form/reactive-form.component';
import { DwJobScheduleComponent } from './job-schedule.component';

const JOB_SCHEDULE_ROUTES = [{
  path: '',
  component: DwJobScheduleComponent,
  canActivate: [DwAuthGuardService],
  data: {
    dwRouteData: {
      programId: 'dw-job-schedule',
      dwAuthId: 'dw-job-schedule'
    }
  },
  resolve: {
    transaction: DwLanguageService
  }
}];

const JOB_SCHEDULE_COMPONENTS = [
  DwJobScheduleInReactiveFormComponent,
  DwSimpleJobScheduleInModalComponent,
  DwReactiveFormDocComponent,
  DwSimpleJobScheduleInModalDocComponent
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(JOB_SCHEDULE_ROUTES),
    ShowcaseSharedModule,
    NzLayoutModule,
    NzGridModule,
    NzDividerModule,
    NzTabsModule,
    NzFormModule,
    NzAnchorModule,
    NzTableModule,
    HighlightModule.forRoot({ theme: 'agate' }),
    NzButtonModule,
    NzModalModule,
    DwCronJobsModule,
    ReactiveFormsModule,
    NzCardModule
  ],
  declarations: [
    DwJobScheduleComponent,
    ...JOB_SCHEDULE_COMPONENTS
  ],
  entryComponents: [
    ...JOB_SCHEDULE_COMPONENTS
  ],
  exports: [
    RouterModule
  ]
})
export class DwJobScheduleModule {}
