import { LightningElement, wire, api } from 'lwc';

import { getFieldValue, getRecord } from 'lightning/uiRecordApi';

import SETTLEMENT_PLAN_OBJECT from '@salesforce/schema/Auto_Settlement_Plan__c';
import SETTLEMENT_PLAN_FEILD_ID from '@salesforce/schema/Auto_Settlement_Plan__c.Settlement_Plan_ID__c';
import SETTLEMENT_PLAN_FEILD_Name from '@salesforce/schema/Auto_Settlement_Plan__c.Name';
import SETTLEMENT_PLAN_FEILD_Assesment from '@salesforce/schema/Auto_Settlement_Plan__c.Assessment__c';
import SETTLEMENT_PLAN_FEILD_Owner from '@salesforce/schema/Auto_Settlement_Plan__c.OwnerId';
import SETTLEMENT_PLAN_FEILD_Creator from '@salesforce/schema/Auto_Settlement_Plan__c.CreatedById';
import SETTLEMENT_PLAN_FEILD_Modifier from '@salesforce/schema/Auto_Settlement_Plan__c.LastModifiedById';

const settlementPlanFields = [
    SETTLEMENT_PLAN_FEILD_ID,
    SETTLEMENT_PLAN_FEILD_Name,
    SETTLEMENT_PLAN_FEILD_Assesment,
    SETTLEMENT_PLAN_FEILD_Owner,
    SETTLEMENT_PLAN_FEILD_Creator,
    SETTLEMENT_PLAN_FEILD_Modifier];

export default class AIPlanHeader extends LightningElement {
    
    // @api planId;
    @api planId = 'a33Aw0000000QVZIA2'; 

    // @wire(getRecord, { recordId: '$planId', fields: [SETTLEMENT_PLAN_FEILD_ID, SETTLEMENT_PLAN_FEILD_NAME] })
    @wire(getRecord, { recordId: '$planId', fields: settlementPlanFields })
    plan;

    get planID(){
        return this.plan.data ? getFieldValue(this.plan.data, SETTLEMENT_PLAN_FEILD_ID) : 'null';
    } 

    get planName(){
        return this.plan.data ? getFieldValue(this.plan.data, SETTLEMENT_PLAN_FEILD_Name) : 'null';
    } 

    get planAssesment(){
        return this.plan.data ? getFieldValue(this.plan.data, SETTLEMENT_PLAN_FEILD_Assesment) : 'null';
    } 

    get planOwner(){
        return this.plan.data ? getFieldValue(this.plan.data, SETTLEMENT_PLAN_FEILD_Owner) : 'null';
    } 

    get planCreator(){
        return this.plan.data ? getFieldValue(this.plan.data, SETTLEMENT_PLAN_FEILD_Creator) : 'null';
    } 

    get planModifier(){
        return this.plan.data ? getFieldValue(this.plan.data, SETTLEMENT_PLAN_FEILD_Modifier) : 'null';
    } 


}
