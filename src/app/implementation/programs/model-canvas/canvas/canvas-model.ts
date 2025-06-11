import { generateId } from '../../../../shared/utils'
// 模型详情
export class ModelInfo {
    id: string;
    dbCode: string; // 数据库编码
    domainCode: string;
    domainName: string;
    mainBusinessModelCode: string;
    mainBusinessModelName: string;
    virtualBusinessModelCode: string;
    virtualBusinessModelName: string;
    modelTreeVO: ModelTree;
}

// 模型树
export class ModelTree {
    canOperate?: boolean;
    isHide?: boolean;
    id?: string;
    referenceId?: string;
    parentId?: string;
    index?: number;
    domainObjectCode: string;
    domainObjectName: string;
    path: string;
    originalPath: string;
    type: string;
    level: number;
    flag: string;
    x?: number;
    y?: number;
    children?: ModelTree[];
    relations?: Relation[];
    constructor(data?, parent?) {
      if (!data) {return;}
      const index = data?.index || parent?.children?.length || 0;
      const level = data?.level || (parent?.level + 1) || null;
      const path = `${parent?.path ? `${parent?.path}.` : ''}${data?.domainObjectCode}`;
      const id = data?.flag || generateId();
      return {
        ...data,
        canOperate: data?.canOperate || false,
        id: data?.id || id,
        flag: data?.flag || id,
        level,
        index,
        path,
        referenceId: data?.referenceId || '',
        parentId: data?.parentId || parent?.id || parent?.flag,
        domainObjectCode: data?.domainObjectCode || data?.referenceDomainCode || '',
        domainObjectName: data?.domainObjectName || data?.referenceDomainName || '',
        originalPath: data?.originalPath || data?.path || '',
        type: data?.type || '3',
        x: data?.x || null,
        y: data?.y || null,
        children: data?.children || [],
        relations: data?.relations || data?.referenceShip || [],
      };
    }
}

// 保存操作类型
export enum SaveTypeEnum {
    SAVE_DRAFT = '1', // 保存草稿
    SAVE = '2' // 保存
}

// 关联字段类型
export enum FieldTypeEnum {
    FIELD = '1', // 字段
    CONST = '2', // 常量
}

// 关联关系
export class Relation {
    error?: boolean;
    leftDataType?: string;
    rightDataType?: string;
    leftCode?: string;
    leftName: string;
    rightCode?: string;
    rightName: string;
    sort?: number;
    mainField?: boolean; // 是否主关联
    rightType?: FieldTypeEnum; // field-字段 const-常量
    constructor(data?) {
      return {
        error: data?.error || false,
        leftDataType: data?.leftDataType || null,
        rightDataType: data?.rightDataType || null,
        leftCode: data?.leftCode || '',
        leftName: data?.leftName || '',
        rightCode: data?.rightCode || '',
        rightName: data?.rightName || '',
        sort: data?.sort || 0,
        mainField: data?.mainField || false,
        rightType: data?.rightType || '1',
      };
    }
}

// 领域对象字段列表
export class FieldOption {
    fieldCode: string;
    fieldName: string;
    businessDataType: string;
}

// 领域对象列表
export class DomainObjectList {
    id?: string;
    path: string;
    leftDomainName?: string;
    rightDomainName?: string;
    businessModelCode?: string;
    businessModelName?: string;
    domainObjectCode?: string;
    domainObjectName?: string;
    referenceBusinessModelCode?: string;
    referenceBusinessModelName?: string;
    referenceDomainCode?: string;
    referenceDomainName?: string;
    referenceDomainPath?: string;
    referenceId?: string;
    originalPath?: string;
    referenceShip?: Relation[];
    relations?: Relation[];
}