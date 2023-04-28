import { LightningElement, wire, api } from 'lwc';
import { getListUi } from 'lightning/uiListApi';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';

import { getObjectInfo } from 'lightning/uiObjectInfoApi';


import SETTLEMENT_PLAN_OBJECT from '@salesforce/schema/Auto_Settlement_Plan__c';
import SETTLEMENT_PLAN_FEILD_ID from '@salesforce/schema/Auto_Settlement_Plan__c.Settlement_Plan_ID__c';

import AUTO_REC_OBJECT from '@salesforce/schema/Auto_Recomandation__c';
import AUTO_REC_FEILD_ID from '@salesforce/schema/Auto_Recomandation__c.Action_ID__c';
import AUTO_REC_FEILD_NAME from '@salesforce/schema/Auto_Recomandation__c.Name';

export default class AIPlanProcessTab extends LightningElement {

    planId = 'a33Aw0000000QVZIA2'; 

    // @wire(getRecord, { recordId: '$planId', fields: [SETTLEMENT_PLAN_FEILD_ID, SETTLEMENT_PLAN_FEILD_NAME] })
    @wire(getRecord, { recordId: '$planId', fields: [SETTLEMENT_PLAN_FEILD_ID] })
    plan;

    get parentPlanID(){
        return this.plan.data ? getFieldValue(this.plan.data, SETTLEMENT_PLAN_FEILD_ID) : 'null';
    } 

    error;
    records;
    recordCount;
    @wire(getRelatedListRecords, {
        parentRecordId: '$planId',
        relatedListId: 'Auto_Recomandations',
        fields: [AUTO_REC_FEILD_ID, AUTO_REC_FEILD_NAME]
    })listInfo({ error, data }) {
        if (data) {
            this.records = data.records;
            this.error = undefined;
            this.recordCount = data.count;
        } else if (error) {
            this.error = error;
            this.records = undefined;
        }
    }



    @wire(getObjectInfo, { objectApiName: AUTO_REC_OBJECT })
    childObjectInfo;

    erroNewr;
    childRecords;
    childRecordCount;
    @wire(getRelatedListRecords, {
        recordId: 'a33Aw0000000QVZIA2',
        relatedListId: 'Auto_Recomandations__r',
        fields: [AUTO_REC_FEILD_ID, AUTO_REC_FEILD_NAME]
    })listInfo({ error, data }) {
        if (data) {
            this.childRecords = data.records;
            this.error = undefined;
            this.childRecordsCount = data.count;
        } else if (error) {
            this.error = error;
            this.childRecords = undefined;
        }
    }


}

