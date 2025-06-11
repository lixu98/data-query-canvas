// 查询方案
export class SchemeDesign {
    id?: string;
    querySchemaName?: string; // 方案名称
    querySchemaCode?: string; // 方案编码
    ownerApp?: string; // 所属产品
    businessModelCode?: string; // 模型编码
    modelCode?: string; // 模型编码
    modelName?: string; // 模型名称
    modelType?: string; // 模型类型
    sourceType?: string; // 来源
    plan?: 'create' | 'query'; // 模型设计跳转查询方案 create-创建方案 query-方案列表
    constructor(data?) {
        return {
            ...data,
            querySchemaName: data?.querySchemaName || '',
            querySchemaCode: data?.querySchemaCode || '',
            ownerApp: data?.ownerApp || null,
            businessModelCode: data?.businessModelCode || '',
            modelCode: data?.modelCode || '',
            modelName: data?.modelName || '',
            modelType: data?.modelType || '',
        }
    }
}

// P参数
export class Parameter {
    column?: string;
    columnName?: string;
    paramColType: 'int' | 'float' | 'string' | 'date'; // int：整型，float：浮点型，string：字符型，date：日期
    isRequired: boolean;
    sort?: number;
    path?: string;
    pathName?: string;
    flag?: string;
    type?: 1 | 2; // 1：原始字段，2：计算字段
    paramType?: string;
    constructor(data?) {
        return {
            column: data?.column || '',
            columnName: data?.columnName || '',
            isRequired: data?.isRequired || false,
            paramColType: data?.paramColType || null,
            sort: data?.isRequired || 1,
        }
    }
}

// 运算列
export class CalculateColumn {
    ownerPath: string;
    column: string;
    columnName: string;
    columnType: string;
    calFormulas: string;
    calFormulasDisplay: string;
    sort: number;
    key?: string;
    fieldId?: string;
}

// 运算列 所属领域对象树、引用字段树
export class ModelTree {
    domainObjectCode?: string;
    domainObjectName?: string;
    path?: string;
    parentPath?: string;
    flag?: string;
    fields?: {
        fieldCode?: string;
        fieldName?: string;
    }[];
    child?: ModelTree[];
    constructor(data?) {
    }
}

// 运算列 引用函数
export interface FunctionNode {
    type: string;
    title: string;
    key: string; // e.g. "（S1 + S2）" for addition
    describe?: string;
    children?: FunctionNode[];
}

// 运算列 表达式节点
export class ExpressionNode {
    id: string;
    title?: string;
    type: 'operator' | 'field' | 'variable';
    value?: string;
    display?: string;
    children?: ExpressionNode[];
    key?: string;
    selected?: boolean;
    canInput?: boolean | string; // 是否可以输入变量
    canOperate?: boolean; // 是否可以新增删除
    canAdd?: boolean; // 是否可以增加
    canDelete?: boolean; // 是否可以删除
    addValue?: ExpressionNode[]; // 增加节点内容
    displayOptions?: string[]; // 下拉框选择内容
}



// 参数类型
export const paramTypeOptions = [{
    value: 'int',
    label: '整数'
}, {
    value: 'float',
    label: '小数'
}, {
    value: 'string',
    label: '字符串'
}, {
    value: 'date',
    label: '日期'
}]

// 引用函数
export const functionTree = [
    {
        title: '运算函数',
        key: '00',
        disabled: true,
        children: [
            {
                title: '运算加',
                key: '(S1+S2)',
                describe: 'S1 + S2 返回S1，S2的和。例如：select (english_score + math_score) as total_score from table_score。',
                isLeaf: true,
            },
            {
                title: '运算减',
                key: '(S1-S2)',
                describe: 'S1 - S2 返回S1，S2的差。例如：select (total_score - math_score) as english_score from table_score。',
                isLeaf: true,
            },
            {
                title: '运算乘',
                key: '(S1*S2)',
                describe: 'S1 * S2 返回S1，S2的乘积。例如：select (avg_score * course_count) as total_score from table_score。',
                isLeaf: true,
            },
            {
                title: '运算除',
                key: '(S1/S2)',
                describe: 'S1 / S2 返回S1，S2的商。例如：select (total_score / course_count) as avg_score from table_score。',
                isLeaf: true,
            },
        ]
    },
    {
        title: '数值函数',
        key: '01',
        disabled: true,
        children: [
            {
                title: '进位取整',
                key: 'ceiling(X)',
                describe: 'ceiling(X) 返回大于X的最小整数值。例如：ceiling(1.4) 值为2。',
                isLeaf: true,
            },
            {
                title: '四舍五入',
                key: 'round(X,Y)',
                describe: 'round(X, Y) 返回参数X的四舍五入的有Y位小数的值。例如：round(1.46，1) 值为1.5。',
                isLeaf: true,
                canInput: { Y: 'number' },
            }
        ]
    },
    {
        title: '聚合函数',
        key: '03',
        disabled: true,
        children: [
            {
                title: '求和',
                key: 'sum(S1)',
                describe: '求和函数',
                isLeaf: true,
            },
            {
                title: '计数',
                key: 'count(S1)',
                describe: '计数函数',
                isLeaf: true,
            },
            {
                title: '最大值',
                key: 'max(S1)',
                describe: '取最大值',
                isLeaf: true,
            },
            {
                title: '最小值',
                key: 'min(S1)',
                describe: '取最小值',
                isLeaf: true,
            }
        ]
    },
    {
        title: '控制流函数',
        key: '04',
        disabled: true,
        children: [
            {
                title: 'null值',
                key: 'ifnull(S1,S2)',
                describe: 'S1为null时，取S2',
                isLeaf: true,
            },
            {
                title: 'case when',
                key: 'case when FIELD = VALUE then RESULT else DEFAULT_RESULT end',
                describe: 'FIELD 值为 VALUE 时返回 RESULT 否则返回 DEFAULT_RESULT',
                addValue: 'when FIELD = VALUE then RESULT',
                canInput: true,
                isLeaf: true,
            },
        ]
    },
    {
        title: '字符串函数',
        key: '05',
        disabled: true,
        children: [
            {
                title: 'concat',
                key: 'concat(FIELD,CONCAT_FIELD)',
                describe: '拼接FIELD、CONCAT_FIELD...',
                addValue: ',CONCAT_FIELD',
                isLeaf: true,
            },
        ]
    },
]