import { LightningElement, wire, api } from 'lwc';
import { getListUi } from 'lightning/uiListApi';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { getRelatedListRecords, getRelatedListsInfo } from 'lightning/uiRelatedListApi';

import { getObjectInfo } from 'lightning/uiObjectInfoApi';


import SETTLEMENT_PLAN_OBJECT from '@salesforce/schema/Auto_Settlement_Plan__c';
import SETTLEMENT_PLAN_FEILD_ID from '@salesforce/schema/Auto_Settlement_Plan__c.Settlement_Plan_ID__c';

import AUTO_REC_OBJECT from '@salesforce/schema/Auto_Recomandation__c';
import AUTO_REC_FEILD_ID from '@salesforce/schema/Auto_Recomandation__c.Action_ID__c';
import AUTO_REC_FEILD_NAME from '@salesforce/schema/Auto_Recomandation__c.Name';

import ACTION_OBJECT from '@salesforce/schema/Recommended_Action__c';
import ACTION_FEILD_ID from '@salesforce/schema/Recommended_Action__c.Action_ID__c';
import ACTION_FEILD_NAME from '@salesforce/schema/Recommended_Action__c.Name';

export default class AIPlanProcessTab extends LightningElement {

    planId = 'a33Aw0000000QVZIA2'; 

    @api recordId;

    // @wire(getRecord, { recordId: '$planId', fields: [SETTLEMENT_PLAN_FEILD_ID, SETTLEMENT_PLAN_FEILD_NAME] })
    @wire(getRecord, { recordId: "$recordId", fields: [SETTLEMENT_PLAN_FEILD_ID] })
    plan;

    get parentPlanID(){
        return this.plan.data ? getFieldValue(this.plan.data, SETTLEMENT_PLAN_FEILD_ID) : 'null';
    } 

    @api recoId = 'a32Aw0000000A5pIAE'; 

    @wire(getRecord, { recordId: '$recoId', fields: [AUTO_REC_FEILD_NAME] })
    planChild;

    get parentChildID(){
        return this.planChild.data ? getFieldValue(this.planChild.data, AUTO_REC_FEILD_NAME) : 'null';
    } 

    error;
    relatedLists;
    @wire(getRelatedListsInfo, {
        parentObjectApiName: SETTLEMENT_PLAN_OBJECT.objectApiName
    })listInfo({ error, data }) {
        if (data) {
            this.relatedLists = data.relatedLists;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            console.log('Has error 2');
            this.relatedLists = undefined;
        }
    }


    error;
    statementRecords;
    @wire(getRelatedListRecords, {
        parentRecordId: '$recordId',
        relatedListId: 'Auto_Recomandations__r',
        fields: ['Auto_Recomandation__c.Action_ID__c','Auto_Recomandation__c.Name']
    })listInfo({ error, data }) {
        if (data) {
            this.statementRecords = data.records;
            console.log('some data exist');
            this.error = undefined;
        } else if (error) {
            this.error = error;
            console.log('error exist 3');
            console.log(error);
            this.statementRecords = undefined;
        }
    }

    // childRecords;
    // @wire(getRelatedListRecords, { 
    //     recordId: '$recordId', 
    //     field: CHILD_OBJECT_FIELD, 
    //     relatedList: 'ChildObjects__r' 
    // })
    // getChildren({ error, data }) {
    //     if (data) {
    //         this.childRecords = data.records;
    //         this.error = undefined;
    //     } else if (error) {
    //         this.error = error;
    //         this.childRecords = undefined;
    //     }
    // }

    // subChildRecords;
    // @wire(getRelatedListRecords, { 
    //     recordIds: '$statementRecords.data.ids',  
    //     relatedList: 'Recommended_Actions__r',
    //     fields: ['Recommended_Action__c.Action_ID__c','Recommended_Action__c.Name'] 
    // })
    // getSubChildren({ error, data }) {
    //     if (data) {
    //         this.subChildRecords = data.records;
    //         console.log('some data exist in sub child');
    //         this.error = undefined;
    //     } else if (error) {
    //         this.error = error;
    //         console.log('error exist in sub child');
    //         console.log(error);
    //         this.subChildRecords = undefined;
    //     }
    // }

    childRecords;
    subChildRecords;
    @wire(getRelatedListRecords, { 
        parentRecordId: '$recordId', 
        relatedListId: 'Auto_Recomandations__r' 
    })
    childRecordsHandler(result) {
        if (result.data) {
            let childRecords = result.data.records;
            let childIds = childRecords.map(record => record.Action_ID__c);
            this.childRecords = { data: childRecords, ids: childIds };
            console.log('new child method has data');
        } else if (result.error) {
            console.log('new child error');
            console.error(result.error);
        }
    }

    @wire(getRelatedListRecords, { 
        recordIds: '$childRecords.ids', 
        relatedListId: 'Recommended_Actions__r' 
    })
    subChildRecordsHandler(result) {
        if (result.data) {
            console.log('new sub child method has data');
            let subChildRecords = result.data.records;
            let subChildByChildId = subChildRecords.reduce((obj, subChild) => {
                obj[subChild.AUTO_REC_OBJECT] = obj[subChild.AUTO_REC_OBJECT] || [];
                obj[subChild.AUTO_REC_OBJECT].push(subChild);
                return obj;
            }, {});
            this.subChildRecords = { data: subChildByChildId };
        } else if (result.error) {
            console.error(result.error);
            console.log('new sub child error');
        }
    }    
 

}

