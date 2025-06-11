import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { DemoOrderServerPagingService } from '../../../shared/select-modal/demo-order/demo-order-server-paging.service';
import { EnumClientPagingService } from '../../../shared/select-modal/enum/enum-client-paging.service';
import { MockDataClientPagingService } from '../../../shared/select-modal/mock-data/mock-data-client-paging.service';
import { SpecifyMockClientPagingService } from '../../../shared/select-modal/specify-mock/specify-mock-client-paging.service';
import {
  SpecifyOrderErrorServerPagingService
} from '../../../shared/select-modal/specify-order-error/specify-order-error-server-paging.service';
import { SpecifyOrderServerPagingService } from '../../../shared/select-modal/specify-order/specify-order-server-paging.service';
import { TableMockClientPagingService } from '../../../shared/select-modal/table-mock/table-mock-client-paging.service';
import { ShowcaseSharedModule } from '../../../shared/shared.module';
import { InputListwinCustomPipe } from './input-listwin-custom.pipe';
import { InputListwinRoutingModule } from './input-listwin-routing.module';
import { InputListwinComponent } from './input-listwin.component';


const PROVIDERS = [
  DemoOrderServerPagingService,
  MockDataClientPagingService,
  EnumClientPagingService,
  SpecifyOrderServerPagingService,
  SpecifyMockClientPagingService,
  SpecifyOrderErrorServerPagingService,
  TableMockClientPagingService
];


@NgModule({
  imports: [
    CommonModule,
    InputListwinRoutingModule,
    ShowcaseSharedModule,
    NzButtonModule,
    NzLayoutModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzGridModule,
    NzIconModule,
    ReactiveFormsModule,
    TranslateModule,
    NzMessageModule
  ],
  declarations: [
    InputListwinComponent,
    InputListwinCustomPipe
  ],
  providers: [
    InputListwinCustomPipe,
    ...PROVIDERS
  ]
})
export class InputListwinModule { }
