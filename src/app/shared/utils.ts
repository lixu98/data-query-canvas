import { FormArray, FormGroup } from '@angular/forms';

// 生成随机id
export function generateId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 深度克隆对象（支持循环引用）
 */
export function cloneDeep(source, hash = new WeakMap()) {
  // 处理基本类型和null
  if (source === null || typeof source !== 'object') {
    return source;
  }

  // 处理循环引用
  if (hash.has(source)) {
    return hash.get(source);
  }

  // 处理日期对象
  if (source instanceof Date) {
    return new Date(source.getTime()) as any;
  }

  // 处理正则表达式
  if (source instanceof RegExp) {
    return new RegExp(source.source, source.flags) as any;
  }

  // 处理数组
  if (Array.isArray(source)) {
    const clonedArr: any[] = [];
    hash.set(source, clonedArr);
    source.forEach((item) => {
      clonedArr.push(cloneDeep(item, hash));
    });
    return clonedArr as any;
  }

  // 处理普通对象
  const clonedObj = Object.create(Object.getPrototypeOf(source));
  hash.set(source, clonedObj);
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      clonedObj[key] = cloneDeep(source[key], hash);
    }
  }

  return clonedObj;
}

// 表单校验检测
export function markAllControlsAsDirty(control): void {
  if (control instanceof FormGroup || control instanceof FormArray) {
    Object.values(control.controls).forEach(childControl => {
      markAllControlsAsDirty(childControl);
    });
  } else {
    control.markAsDirty();
    control.updateValueAndValidity();
  }
}

// 递归生成渲染树结构 hasField为false时不显示fields且child只显示type=1的节点
export function convertToTree(nodes, hasField = true, key = 'flag', title = 'domainObjectName', children = 'child') {
  return nodes.map(node => ({
    ...node,
    key: node[key],
    title: node[title],
    isField: false,
    disabled: hasField,
    isLeaf: hasField ? (node[children]?.length === 0 && node?.fields?.length === 0) : (node[children] || []).filter(child => child.type == '1').length === 0,
    children: [
      ...(hasField && node.fields?.length ? node.fields.filter(d => !['tenantsid', `${node.domainObjectCode}_id`].includes(d.fieldCode) && d.fieldName !== '主键ID').map(field => ({
        ...field,
        isField: true,
        key: field.fieldId,
        title: field.fieldName,
        isLeaf: true,
        children: [],
        column: field.fieldCode,
        columnName: field.fieldName,
        domainObjectCode: node?.domainObjectCode,
        flag: node?.flag,
        desc: false,
        alias: field.alias ? field.alias : field.fieldCode
      })) : []),
      ...convertToTree(node[children].filter(child => hasField || child.type == '1'), hasField, key, title, children)
    ]
  }));
}

// 递归过滤匹配关键字的树
function recursiveFilter(node, keyword): boolean {
  const isMatch = node.title.toLowerCase().includes(keyword.toLowerCase());
  if (node.children) {
    node.children = node.children.filter(child =>
        recursiveFilter(child, keyword)
    );
    return isMatch || node.children.length > 0;
  }
  return isMatch;
}
export function recursiveFilterTree(tree, keyword) {
  const data = cloneDeep(tree);
  return !!keyword ? data.filter(node => recursiveFilter(node, keyword)) : data;
}

// 表单校验规则表达式和函数
export const formValidators = {
  enCode: /^[a-z][a-z0-9_]*$/, // 由小写字母下划线数字组成，只能以字母开头
  repeat(control, name) { // 重复校验
    const value = control?.value;
    const current = control?.parent || {};
    const parent = current?.parent || {};
    if (!value || !current || !parent || !parent?.controls) {return null;}
    const siblings = parent.controls.filter(d => d !== current).map(d => d.get(name));
    // setTimeout(() => {
    //   siblings.forEach(s => s.updateValueAndValidity());
    // }, 0);
    return siblings.map(s => s?.value).includes(value) ? { repeat: true } : null;
  }
};

// 树结构数据节点增删改
export function _updateTreeNode(node, id: string, data, idKey = 'id', childrenKey = 'children') {
  if (node[idKey] === id) {
    return { ...node, ...data };
  }
  return _processTreeChildren(node, child =>
    _updateTreeNode(child, id, data, idKey),
    childrenKey);
}

export function _deleteTreeNode(node, id: string, idKey = 'id', childrenKey = 'children') {
  return _processTreeChildren(node, child => {
    if (child[idKey] === id) {
      return null;
    }
    return _deleteTreeNode(child, id, idKey);
  }, childrenKey);
}

export function _addTreeChild(node, id: string, children, idKey = 'id', childrenKey = 'children') {
  if (node[idKey] === id) {
    const data = { ...node };
    data[childrenKey] = (node.children || []).concat(children);
    return { ...data };
  }
  return _processTreeChildren(node, child => _addTreeChild(child, id, children, idKey, childrenKey), childrenKey);
}

export function _deselectAllTreeNodes(node, childrenKey = 'children') {
  if (!node) { return; }
  node.selected = false;
  if (node[childrenKey]) {
    node[childrenKey].forEach(child => _deselectAllTreeNodes(child));
  }
}

export function _processTreeChildren(node, processor, childrenKey = 'children') {
  if (!node[childrenKey]) { return node; }

  const newChildren = node[childrenKey]
    .map(processor)
    .filter(child => child !== null);

  const data = { ...node };
  data[childrenKey] = newChildren;
  return { ...data };
}

export const store = JSON.parse(localStorage.getItem('store')) || null

export const storage = {
  store,
  userId: store?.userinfo?.userId || '',
  tenantSid: store?.tentDetail?.sid || '',
  // 是否只读权限
  isReadonly() {
    const adminIds = new Set(['100100', 'superadmin']); // 管理员和超级管理员
    return !store.userPermission.roles.some(role => adminIds.has(role.id));
  },
  // 获取当前租户类型 1-零部件 2-业务中台2.0 3-其它
  tenantType() {
    if (store) {
      if (this.tenantSid == '1064751793044480' || this.tenantSid == '1064700052676608') {
        return 1;
      } else if (this.tenantSid == '776276554516480' || this.tenantSid == '1006222069809152') {
        return 2;
      }
    }
    return 3;
  }
}