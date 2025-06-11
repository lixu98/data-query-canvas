import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ComponentFactoryResolver,
  Injector,
} from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CanvasService } from './canvas.service';
import { CanvasApiService } from './canvas-api.service';
import { ModelInfo, SaveTypeEnum } from './canvas-model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.less']
})
export class CanvasComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('container', { static: false }) container!: ElementRef;
  protected readonly SaveTypeEnum = SaveTypeEnum;
  private destroy$ = new Subject<void>();
  title: string;
  canOperate = false; // 可进行增删子节点、编辑关联关系、保存编辑模型操作
  isSaved = false; // 已进行保存操作
  showModelEdit = false; // 显示编辑模型modal
  data: ModelInfo;
  deleteLoading = false;
  saveLoading = false;
  saveDraftLoading = false;

  constructor(
    private message: NzMessageService,
    private modal: NzModalService,
    private injector: Injector,
    public canvasService: CanvasService,
    private canvasApiService: CanvasApiService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private location: Location,
    private route: ActivatedRoute,
  ) {
    this.canvasService.tree$.pipe(takeUntil(this.destroy$)).subscribe((tree) => {
      this.data = { ...this.data, modelTreeVO: tree};
    });
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      let modelType: 'real' | 'virtual' = 'real'; // 查询模型类型
      let modelParams = {}; // 查询模型params
      if (params.source === 'add') {
        this.canOperate = true;
        this.data = JSON.parse(JSON.stringify(params));
        this.title = params?.virtualBusinessModelName;
        modelType = 'real';
        modelParams = {
          modelCode: params.mainBusinessModelCode,
          virtualModelCode: params.virtualBusinessModelCode,
          virtualModelName: params.virtualBusinessModelName,
        };
      } else if (params.source === 'list') {
        this.canOperate = params?.type === 'virtual';
        this.title = params?.modelName;
        modelType = params?.type;
        modelParams = {
          modelCode: params.modelCode,
        };
      }
      this.fetchData(modelParams, modelType);
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.canvasService.initGraph(this.container.nativeElement, this.injector, this.componentFactoryResolver, this.canOperate);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchData(params, modelType: 'real' | 'virtual' = 'virtual') {
    this.canvasApiService.getModelDetail(params, modelType)
      .subscribe(res => {
        if (res.code === '200') {
          if (modelType === 'real') {
            this.data = { ...this.data, modelTreeVO: res.data };
          } else if (modelType === 'virtual') {
            this.data = res.data;
          }
          this.initTreeData();
        } else {
          this.message.error(res?.message);
        }
      });
  }

  initTreeData() {
    this.canvasService.initGraphComplete$.subscribe((init) => {
      if (init) {
        this.canvasService.initTreeData({...this.data?.modelTreeVO, level: 1}, { ...this.data, modelTreeVO: null });
      }
    });
  }

  goBack() {
    this.location.back();
  }

  // 自动布局
  autoLayout() {
    this.canvasService.autoLayout();
  }

  handleEdit(data = null) {
    this.showModelEdit = !this.showModelEdit;
    if (!data) { return; }
    this.data = { ...this.data, ...data };
    this.title = this.data?.virtualBusinessModelName;
    this.data.modelTreeVO.domainObjectCode = this.data?.virtualBusinessModelCode;
    this.data.modelTreeVO.domainObjectName = this.data?.virtualBusinessModelName;
    this.initTreeData();
  }

  handleBack() {
    if (this.canOperate && !this.data?.id && !this.isSaved) {
      this.modal.confirm({
        nzTitle: '您还未保存当前虚拟模型，是否确认返回？',
        nzOnOk: () => this.goBack(),
      });
    } else {
      this.goBack();
    }
  }

  handleDelete() {
    this.modal.confirm({
      nzTitle: '是否确认删除当前虚拟模型？',
      nzOnOk: () => {
        this.deleteLoading = true;
        this.canvasApiService.deleteVirtualModel(this.data?.virtualBusinessModelCode)
          .pipe(finalize(() => (this.deleteLoading = false)))
          .subscribe(res => {
            if (res.code === '200') {
              this.message.success('删除成功！');
              this.goBack();
            } else {
              this.message.error(res?.message);
            }
          });
      }
    });
  }

  handleSave(saveType: SaveTypeEnum) {
    if (saveType === SaveTypeEnum.SAVE_DRAFT) {
      this.saveDraftLoading = true;
    } else if (saveType === SaveTypeEnum.SAVE) {
      this.saveLoading = true;
    }
    this.canvasApiService.saveVirtualModel({ ...this.data, saveType }, this.data?.id ? 'put' : 'post')
      .pipe(finalize(() => (this.saveLoading = this.saveDraftLoading = false)))
      .subscribe(res => {
        if (res.code === '200') {
          this.message.success('保存成功！');
          this.isSaved = true;
          this.fetchData({ modelCode: this.data?.virtualBusinessModelCode });
        } else {
          this.message.error(res?.message);
        }
      });
  }
}
