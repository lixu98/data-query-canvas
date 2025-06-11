import { Location } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DW_USING_TAB } from '@webdpt/framework/config';
import { DwTabRoutingService } from '@webdpt/framework/routing-tabset'; // 訊息傳遞
import fnsFormat from 'date-fns/format';
import { Observable } from 'rxjs';
import { CurrencyModel, ExchangeClassModel, ExchangeSourceModel, ExchangeWayModel, StatusModel } from '../model';
import { GroupService } from '../service/group.service';
import { GroupDetailEditComponent } from './../group-detail-edit/group-detail-edit.component';
import { DetailsInfoModel } from './../model';
import { SaveService } from './../service/save.service';
import { AbstractGroupAdd } from './group-add';
@Component({
  selector: 'app-dw-group-add',
  templateUrl: './group-add.component.html',
  styleUrls: ['./group-add.component.css', '../group.component.css']
})
export class GroupAddComponent extends AbstractGroupAdd implements OnInit, AfterViewInit {

  // 是否顯示加載中
  public searchLoading: boolean;
  public validateForm: FormGroup;
  public isSaving: boolean = false;
  public isDeleting: boolean = false;
  // 狀態碼列舉
  public searchStatusOptions: Observable<StatusModel[]>;
  public currencyOptions: Observable<CurrencyModel[]>;
  // public getCurrencyOptionsFirst:CurrencyModel[];
  public exchangeSourceOptions: Observable<ExchangeSourceModel[]>;
  public exchangeClassOptions: Observable<ExchangeClassModel[]>;
  public exchangeWayOptions: Observable<ExchangeWayModel[]>;
  public currencyObj: any = {};
  @ViewChild('detailDiv', { static: true }) detailDiv: ElementRef;
  @ViewChild('maskDiv') maskDiv: ElementRef;
  // 訂單明細開窗用，僅為了展示開窗標題可以使用template
  @ViewChild('modifyDetailTitle', { static: true }) modifyDetailTitle: TemplateRef<any>;
  @ViewChild('addDetailTitle', { static: true }) addDetailTitle: TemplateRef<any>;

  constructor(public route: ActivatedRoute,
    public router: Router,
    public fb: FormBuilder,
    public dwModalService: NzModalService,
    public groupService: GroupService,
    public dwMessage: NzMessageService,
    public location: Location,
    public saveService: SaveService,
    private tabRoutingService: DwTabRoutingService,
    @Inject(DW_USING_TAB) private USING_TAB: boolean,
  ) {
    super(groupService);
  }

  get dwDateTimeFormat(): string {
    return this.groupService.getDateTimeFormat();
  }

  ngOnInit(): void {

    // 透過Http
    this.searchStatusOptions = StatusModel.getList(); // 狀態碼列舉初始化
    this.currencyOptions = CurrencyModel.getList();
    // CurrencyModel.getList().subscribe((result) => {
    //   this.getCurrencyOptionsFirst = result;
    // });
    this.exchangeClassOptions = ExchangeClassModel.getList();
    this.exchangeWayOptions = ExchangeWayModel.getList();
    this.exchangeSourceOptions = ExchangeSourceModel.getList();
    // 單頭Form欄位
    this.validateForm = this.fb.group({
      'masterGroupId': [this.master.groupId, Validators.required],
      'masterGroupName': [this.master.groupName, Validators.required],
      'masterCurrencyId': [this.master.currencyId],
      'masterSourceId': [this.master.sourceId],
      'masterExchangeWay': [this.master.exchangeWay],
      'masterExchangeClass': [this.master.exchangeClass],
      'masterExchangeSource': [this.master.exchangeSource],
      'masterStatus': [this.master.status, Validators.required],
      'masterGroupDate': fnsFormat(new Date(), this.dwDateTimeFormat)
    });
    this.master.status = 'Y';
    this.master.groupDate = this.validateForm.get('masterGroupDate').value;
    this.validateForm.get('masterStatus').setValue(this.master.status);
    this.validateForm.get('masterCurrencyId').valueChanges.subscribe((val) => {
      this.master.currencyId = val;
    });
    this.validateForm.get('masterSourceId').valueChanges.subscribe((val) => {
      this.master.sourceId = val;
    });
    this.validateForm.get('masterExchangeWay').valueChanges.subscribe((val) => {
      this.master.exchangeWay = val;
    });
    this.validateForm.get('masterExchangeClass').valueChanges.subscribe((val) => {
      this.master.exchangeClass = val;
    });
    this.validateForm.get('masterExchangeSource').valueChanges.subscribe((val) => {
      this.master.exchangeSource = val;
    });
    this.validateForm.get('masterStatus').valueChanges.subscribe((val) => {
      this.master.status = val;
    });
    super.ngOnInit();
  }
  ngAfterViewInit(): void {
    // console.log(this.maskDiv);
  }

  public detailDelete(idx: number): void {
    this.detail.splice(idx, 1);
  }

  /**
   * 修改公司明細
   *
   * @param idx
   * @memberof GroupAddComponent
   */
  public detailModify(idx: number): void {
    let detailInfo: DetailsInfoModel;

    const viewFn = (): void => {
      this.detail[idx] = detailInfo;
    };
    this.dwModalService.create({
      nzTitle: this.modifyDetailTitle,
      nzContent: GroupDetailEditComponent,
      nzOnOk: (data: any): void => {
        const result = this.saveService.get();
        detailInfo = result;
        viewFn();
      },
      nzOnCancel(): void { },
      nzFooter: null,
      nzComponentParams: {
        cmd: 'view',
        groupDetail: new DetailsInfoModel(this.detail[idx])
      }
    });

  }
  public detailAdd(): void {
    let newCompnayInfo: any;

    const addDetailFn = (): void => {
      newCompnayInfo.seq = this.groupService.groupDetailMaxSeq(this.detail) + 1;
      super.addDetail(newCompnayInfo);
    };

    this.dwModalService.create({
      nzTitle: this.addDetailTitle,
      nzContent: GroupDetailEditComponent,
      nzOnOk: (data: any): void => {
        newCompnayInfo = this.saveService.get();
        addDetailFn();
      },
      nzOnCancel(): void { },
      nzFooter: null,
      nzComponentParams: { cmd: 'add' }
    });
  }

  public cancel(): void {
    this.tabRoutingService.navigateToOpenerOrCreate(['../'], { relativeTo: this.route }, true);
  }
  public msgAccess(result: any): void {
    const msg = result.description;
    if (result.status) {
      if (msg) {
        this.dwMessage.success(msg);
      }
      this.tabRoutingService.navigateToOpenerOrCreate(['../'], { relativeTo: this.route }, true);
    } else {
      if (msg) {
        this.dwMessage.error(msg); // 單一訊息顯示
      }
    }
  }

  showLabel(id: string, modelName: string): Observable<any> {
    return new Observable(observer => {
      this[modelName].subscribe((result) => {
        const filteredOption = result.filter((option) => {
          return option.value === id;
        });
        if (filteredOption.length) {
          observer.next(filteredOption[0].label);
          observer.complete();
        } else {
          observer.next('');
          observer.complete();
        }
      });
    });
  }


  onBeforeSaveGroup(): void {
    this.isSaving = true;
    const currencyId = this.validateForm.controls['masterCurrencyId'].value;
    const option = CurrencyModel.staticLists.filter((_option) => {
      return _option.value === currencyId;
    });
    if (option.length) {
      this.master.currencyName = option[0].label;
    }
  }

  onAfterSaveGroup(result: any): void {
    this.isSaving = false;
    this.msgAccess(result);
  }

}
