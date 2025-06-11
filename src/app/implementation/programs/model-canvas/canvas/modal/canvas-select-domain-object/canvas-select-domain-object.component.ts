import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {DomainObjectList} from '../../canvas-model';
import {CanvasService} from '../../canvas.service';
import { Pagination } from 'app/shared/shared.model';
import {finalize} from "rxjs/operators";
import {CanvasApiService} from "../../canvas-api.service";
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
  selector: 'app-canvas-select-domain-object',
  templateUrl: './canvas-select-domain-object.component.html',
  styleUrls: ['./canvas-select-domain-object.component.less']
})
export class CanvasSelectDomainObjectComponent implements OnInit {
  @Input() isVisible = false;
  @Input() targetObject: DomainObjectList;
  @Output() selectChange = new EventEmitter<DomainObjectList>();
  loading = false;
  keyword: string;
  listOfData: DomainObjectList[];
  pagination: Pagination = new Pagination();

  constructor(
      private canvasService: CanvasService,
      private canvasApiService: CanvasApiService,
      private message: NzMessageService,
  ) {
    this.canvasService.showSelectDomainObjectModal.subscribe((data) => {
      this.targetObject = data;
      this.isVisible = true;
      this.pagination = new Pagination();
      this.fetchData();
    });
  }

  ngOnInit(): void {}

  onTargetObjectChange(data: DomainObjectList) {
    this.targetObject = data;
  }

  fetchData() {
    this.loading = true;
    const params = {
      ...this.pagination,
      domainInfo: this.keyword,
      mainBusinessModelCode: this.canvasService.modelData?.mainBusinessModelCode,
      dbCode: this.canvasService.modelData?.dbCode,
    }
    this.canvasApiService.getDomainObjectList(params)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe(res => {
          if (res.code === '200') {
            this.pagination = JSON.parse(JSON.stringify({
              page: this.pagination.page,
              limit: this.pagination.limit,
              total: res.data?.count || 0,
            }));
            this.listOfData = res.data?.list || [];
          } else {
            this.message.error(res?.message);
          }
        });
  }

  onPaginationChange(page = 1, key = 'page') {
    this.pagination[key] = page;
    this.fetchData();
  }

  close() {
    this.isVisible = false;
  }

  handleOk() {
    this.close();
    this.selectChange.emit(this.targetObject);
  }
}
