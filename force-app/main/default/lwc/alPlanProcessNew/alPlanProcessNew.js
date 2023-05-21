


import { LightningElement, wire, api, track } from 'lwc';
import { getListUi } from 'lightning/uiListApi';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { getRelatedListRecords, getRelatedListsInfo } from 'lightning/uiRelatedListApi';

import { getObjectInfo } from 'lightning/uiObjectInfoApi';

import getPlanRelatedLists from '@salesforce/apex/PlanRelatedListHandler.getPlanRelatedLists';
import getStatementList from '@salesforce/apex/PlanRelatedListHandler.getStatementList';

import SETTLEMENT_PLAN_OBJECT from '@salesforce/schema/Auto_Settlement_Plan__c';
import SETTLEMENT_PLAN_FEILD_ID from '@salesforce/schema/Auto_Settlement_Plan__c.Settlement_Plan_ID__c';

import AUTO_REC_OBJECT from '@salesforce/schema/Auto_Recomandation__c';
import AUTO_REC_FEILD_ID from '@salesforce/schema/Auto_Recomandation__c.Action_ID__c';
import AUTO_REC_FEILD_NAME from '@salesforce/schema/Auto_Recomandation__c.Name';

import ACTION_OBJECT from '@salesforce/schema/Recommended_Action__c';
import ACTION_FEILD_ID from '@salesforce/schema/Recommended_Action__c.Action_ID__c';
import ACTION_FEILD_NAME from '@salesforce/schema/Recommended_Action__c.Name';
import ACTION_FEILD_RECORD_ID from '@salesforce/schema/Recommended_Action__c.Id';



export default class AlPlanProcessNew extends LightningElement {

    @api recordId;

    // @wire(getRecord, { recordId: "$recordId", fields: [SETTLEMENT_PLAN_FEILD_ID] })
    // plan;

    // get parentPlanID(){
    //     return this.plan.data ? getFieldValue(this.plan.data, SETTLEMENT_PLAN_FEILD_ID) : 'null';
    // } 
    

    // @api recoId = 'a32Aw0000000A5pIAE'; 

    // @wire(getRecord, { recordId: '$recoId', fields: [AUTO_REC_FEILD_NAME, ACTION_FEILD_RECORD_ID] })
    // planChild;

    // get parentChildID(){
    //     return this.planChild.data ? getFieldValue(this.planChild.data, AUTO_REC_FEILD_NAME) : 'null';
    // } 

    // get parentChildRecordID(){
    //     return this.planChild.data ? getFieldValue(this.planChild.data, ACTION_FEILD_RECORD_ID) : 'null';
    // }  

  
    @track recommendations;
    @track errorx;
    @wire(getPlanRelatedLists, { planId: '$recordId' })
    wiredResult1({ error, data }) {
        console.log('wiredResult1');
        if (data) {
            console.log('HAS DATA getPlanRelatedLists 1');
         
            this.recommendations = data;
            console.log(this.recommendations);

        } else if (error) {
            console.log('ERROR getPlanRelatedLists');
            this.errorx = error;
        }
    }

    
   
    @track statements;
    @track error;
    @wire(getStatementList, { parentId: '$recordId' })
    wiredResult({ error, data }) {
        console.log('statements');
        if (data) {
            console.log('HAS DATA statements');
            this.statements = data;
            console.log(this.statements);
            this.statements.forEach(element => {
                //console.log(element.Name);
            });


        } else if (error) {
            console.log('ERROR statements');
            this.error = error;
        }
    }


    get currentPlanRelatedLists() {
        return Object.entries(this.recommendations).map((key, value) => ({ key, value }));
    }
}