import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class PermissionService {
    // 获取localStorage中的权限列表
    private get buttonCodeList(): any[] {
        let permisListBtn = JSON.parse(localStorage.getItem('store'));
        let buttonList = []
        let list = [
            {
                'bm-dqt_model-design-search': "allow",
                'bm-dqt_model-design-reset': "allow",
                'bm-dqt_model-design-add': "allow",
                'bm-dqt_model-design-publish': "allow",
                'bm-dqt_model-design-publishDev': "allow",
                'bm-dqt_model-design-publishTest': "allow",
                'bm-dqt_model-design-publishProd': "allow",
                'bm-dqt_model-design-planList': "allow",
                'bm-dqt_model-design-createPlan': "allow",
                'bm-dqt_model-design-createModel': "allow",
            },
            {
                'bm-dqt_inquiry-plan-search': "allow",
                'bm-dqt_inquiry-plan-reset': "allow",
                'bm-dqt_inquiry-plan-add': "allow",
                'bm-dqt_inquiry-plan-publish': "allow",
                'bm-dqt_inquiry-plan-publishDev': "allow",
                'bm-dqt_inquiry-plan-publishTest': "allow",
                'bm-dqt_inquiry-plan-publishProd': "allow",
                'bm-dqt_inquiry-plan-planDesign': "allow",
                'bm-dqt_inquiry-plan-fieldMapping': "allow",
                'bm-dqt_inquiry-plan-parameter': "allow",
                'bm-dqt_inquiry-plan-calColumn': "allow",
                'bm-dqt_inquiry-plan-operation': "allow",
                'bm-dqt_inquiry-plan-genInvoke': "allow",
            }
        ]
        buttonList = permisListBtn ? permisListBtn.buttonCodeList : list
        try {
            return buttonList || [];
        } catch (e) {
            return [];
        }
    }
    // 检查按钮权限
    hasPermission(buttonCode: string): boolean {
        return this.buttonCodeList.some(group => group[buttonCode] === 'allow');
    }
}