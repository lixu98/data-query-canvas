import { Injectable, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { DetailsInfoModel, MasterModel } from '../model';
import { GroupService } from '../service/group.service';

@Injectable()
export abstract class AbstractGroupView implements OnInit {

  public groupId: string;
  public master: MasterModel = new MasterModel({});
  public detail: DetailsInfoModel[] = <DetailsInfoModel[]>[];

  constructor(public groupService: GroupService) { }

  // eslint-disable-next-line @angular-eslint/contextual-lifecycle
  ngOnInit(): void {
    this.onBeforeGetGroup();
    this.groupService.getGroupDetail(this.groupId).pipe(first()).subscribe(
      (data: any) => {
        this.master = new MasterModel(data.master);
        this.master.groupDate = new Date(this.master.groupDate);
        this.detail = DetailsInfoModel.parseToArray(data.detail);
        this.onAfterGetGroup();
      }
    );
  }


  /**
   * 新增明細
   *
   * @memberof GroupViewComponent
   */
  public addDetail(detail: DetailsInfoModel): void {
    // this.detail.push(detail);
    this.detail = [...this.detail, Object.assign({}, detail)];
    this.save();
  }
  /**
   * 保存
   *
   * @memberof GroupViewComponent
   */
  public save(): void {
    this.onBeforeSaveGroup();
    this.groupService.modifyGroup(this.master, this.detail).subscribe(
      (response: any) => {
        this.onAfterSaveGroup(response);
      }
    );
  }

  /**
   * 取得資料前
   */
  abstract onBeforeGetGroup(): void;

  /**
   * 取得資料後
   */
  abstract onAfterGetGroup(): void;

  /**
   * 保存資料前
   */
  abstract onBeforeSaveGroup(): void;

  /**
   * 保存資料後
   * @param result
   */
  abstract onAfterSaveGroup(result: any): void;
}
