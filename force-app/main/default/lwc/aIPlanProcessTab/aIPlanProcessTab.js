import { LightningElement, wire, api, track } from 'lwc';
import { getListUi } from 'lightning/uiListApi';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { getRelatedListRecords, getRelatedListsInfo } from 'lightning/uiRelatedListApi';

import { getObjectInfo } from 'lightning/uiObjectInfoApi';

import getPlanRelatedLists from '@salesforce/apex/PlanRelatedListHandler.getPlanRelatedLists';



import SETTLEMENT_PLAN_OBJECT from '@salesforce/schema/Auto_Settlement_Plan__c';
import SETTLEMENT_PLAN_FEILD_ID from '@salesforce/schema/Auto_Settlement_Plan__c.Settlement_Plan_ID__c';

import AUTO_REC_OBJECT from '@salesforce/schema/Auto_Recomandation__c';
import AUTO_REC_FEILD_ID from '@salesforce/schema/Auto_Recomandation__c.Action_ID__c';
import AUTO_REC_FEILD_NAME from '@salesforce/schema/Auto_Recomandation__c.Name';
import AUTO_REC_FEILD_MAIN_CATEGORY from '@salesforce/schema/Auto_Recomandation__c.Statement_Main_Catergory__c';
import AUTO_REC_FEILD_CATEGORY from '@salesforce/schema/Auto_Recomandation__c.Statement_Category__c';


import ACTION_OBJECT from '@salesforce/schema/Recommended_Action__c';
import ACTION_FEILD_ID from '@salesforce/schema/Recommended_Action__c.Action_ID__c';
import ACTION_FEILD_NAME from '@salesforce/schema/Recommended_Action__c.Name';
import ACTION_FEILD_RECORD_ID from '@salesforce/schema/Recommended_Action__c.Id';

export default class AIPlanProcessTab extends LightningElement {

    planId = 'a33Aw0000000QVZIA2'; 

    @api recordId;

    @wire(getRecord, { recordId: "$recordId", fields: [SETTLEMENT_PLAN_FEILD_ID] })
    plan;

    get parentPlanID(){
        return this.plan.data ? getFieldValue(this.plan.data, SETTLEMENT_PLAN_FEILD_ID) : 'null';
    } 

    @api recoId = 'a32Aw0000000A5pIAE'; 
    @api recoId2 = 'a32Aw00000009jFIAQ'; 
    @api testIDList = ['a32Aw0000000A5pIAE', 'a32Aw00000009jFIAQ'];

    @wire(getRecord, { recordId: '$recoId', fields: [AUTO_REC_FEILD_NAME, ACTION_FEILD_RECORD_ID, AUTO_REC_FEILD_MAIN_CATEGORY, AUTO_REC_FEILD_CATEGORY, ACTION_FEILD_NAME, ] })
    planChild;

    get autoRecFieldName() {
        return getFieldValue(this.planChild.data, AUTO_REC_FEILD_NAME);
    }

    get actionFieldName() {
        return getFieldValue(this.planChild.data, ACTION_FEILD_NAME);
    }

    get checkActionFieldName() {
        const fieldValue = getFieldValue(this.planChild.data, AUTO_REC_FEILD_NAME);
        const isList = Array.isArray(fieldValue);
        console.log('Is ACTION_FEILD_NAME a list?', isList);
        return fieldValue;
    }




    get autoRecFieldMainCategory() {
        return 'General';
        // return getFieldValue(this.planChild.data,AUTO_REC_FEILD_MAIN_CATEGORY);
    }

    get autoRecFieldCategory() {
        return getFieldValue(this.planChild.data,AUTO_REC_FEILD_CATEGORY);
    }

    get parentChildID(){
        return this.planChild.data ? getFieldValue(this.planChild.data, AUTO_REC_FEILD_NAME) : 'null';
    } 

    get parentChildRecordID(){
        return this.planChild.data ? getFieldValue(this.planChild.data, ACTION_FEILD_RECORD_ID) : 'null';
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
    statementIds = [];

    myMap = new Map();

    currentId;
    
    @wire(getRelatedListRecords, {
        parentRecordId: '$recordId',
        relatedListId: 'Auto_Recomandations__r',
        fields: ['Auto_Recomandation__c.Action_ID__c','Auto_Recomandation__c.Name', 'Auto_Recomandation__c.Id']
    })listInfo({ error, data }) {
        if (data) {
            this.statementRecords = data.records;
            console.log('some data exist');
            //console.log(statementRecords);
            this.error = undefined;
            this.statementRecords.forEach(record => {
                this.statementIds.push(record.fields.Id.value);
            })
            console.log('VVVVVVVV');
            console.log(this.statementIds);

            this.statementIds.forEach(id => {
                this.currentId = id;
                this.handleChildRecords(id)
            })

        } else if (error) {
            this.error = error;
            console.log('error exist 3');
            console.log(error);
            this.statementRecords = undefined;
        }
    }


    handleChildRecords(myId) {
        // console.log('XXXXXXXX');
        // console.log(myId);

        // getRelatedListRecords({
        //     recordId: '$myId', 
        //     relationshipApiName: 'Recommended_Actions__r'
        // })
        // .then(result => {
        //     console.log('some data exist in handle class');
        //     console.log('Result:', result);
        // })
        // .catch(error => {
        //     console.log('Error exist in handle class');
        //     console.error('Error:', error);
        // });

    }

    @track childToSubChildMap;
    @track errorx;
    @wire(getPlanRelatedLists, { parentId: '$recordId' })
    wiredResult({ error, data }) {
        console.log('wiredResult');
        if (data) {
            console.log('HAS DATA getPlanRelatedLists');
            this.childToSubChildMap = data;
            console.log(this.childToSubChildMap);
        } else if (error) {
            console.log('ERROR getPlanRelatedLists');
            this.errorx = error;
        }
    }

    
    


  
    // testRecords;
    // @wire(getRelatedListRecords, {
    //     parentRecordId: '$recoId2',
    //     relatedListId: 'Recommended_Actions__r',
    //     fields: ['Recommended_Action__c.Action_ID__c','Recommended_Action__c.Name', 'Recommended_Action__c.Action__c']
    // })listInfo({ error, data }) {
    //     if (data) {
    //         this.testRecords = data.records;
    //         console.log('some data exist test records xxx');
    //         this.error = undefined;
    //     } else if (error) {
    //         this.error = error;
    //         console.log('error exist test records xxx');
    //         console.log(error);
    //         this.testRecords = undefined;
    //     }
    // }

    // connectedCallback() {
    //     if (this.statementRecords.length > 0) {
    //         this.handleChildRecords();
    //     }
    //     else
    //     {
    //         console.log('NOT CALLED');
    //     }
    // }

    // handleChildRecords() {
    //     this.statementRecords.forEach(record => {
    //         statementIds.push(record.fields.Id.value);
    //       });
    //       console.log('VVVVVVVV');
    //       console.log(statementIds);
    // }

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

    // childRecords;
    // subChildRecords;
    // @wire(getRelatedListRecords, { 
    //     parentRecordId: '$recordId', 
    //     relatedListId: 'Auto_Recomandations__r' 
    // })
    // childRecordsHandler(result) {
    //     if (result.data) {
    //         let childRecords = result.data.records;
    //         let childIds = childRecords.map(record => record.Id);
    //         console.log(childIds);
    //         this.childRecords = { data: childRecords, ids: childIds };
    //         console.log('new child method has data');
    //     } else if (result.error) {
    //         console.log('new child error');
    //         console.error(result.error);
    //     }
    // }

    // @wire(getRelatedListRecords, { 
    //     recordIds: '$childRecords.ids', 
    //     relatedListId: 'Recommended_Actions__r' 
    // })
    // subChildRecordsHandler(result) {
    //     if (result.data) {
    //         console.log('new sub child method has data');
    //         let subChildRecords = result.data.records;
    //         let subChildByChildId = subChildRecords.reduce((obj, subChild) => {
    //             obj[subChild.AUTO_REC_OBJECT] = obj[subChild.AUTO_REC_OBJECT] || [];
    //             obj[subChild.AUTO_REC_OBJECT].push(subChild);
    //             return obj;
    //         }, {});
    //         this.subChildRecords = { data: subChildByChildId };
    //     } else if (result.error) {
    //         console.error(result.error);
    //         console.log('new sub child error');
    //     }
    // } 
    
    
    // @track opportunities;

    // @wire(getRelatedListRecords, {
    //      parentRecordId: '$recordId', 
    //      relatedListId: 'Auto_Recomandations__r.Recommended_Actions__r', 
    //     })
    // opportunityRecords({ error, data }) {
    //     if (data) {
    //         this.opportunities = data.records;
    //         console.log('new sub child NEW');
    //         console.log(opportunities);
    //         this.error = undefined;
    //     } else if (error) {
    //         this.error = error;
    //         console.log('new sub child NEW error');
    //         console.log(error);
    //         this.opportunities = undefined;
    //     }
    // }

    

    


}



