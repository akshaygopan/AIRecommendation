// import { LightningElement } from 'lwc';

// export default class AIRecommenderGUI extends LightningElement {}

import { LightningElement, wire, api } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';

import SETTLEMENT_PLAN_OBJECT from '@salesforce/schema/Auto_Settlement_Plan__c';
import SETTLEMENT_PLAN_FEILD_ID from '@salesforce/schema/Auto_Settlement_Plan__c.Settlement_Plan_ID__c';
import SETTLEMENT_PLAN_FEILD_NAME from '@salesforce/schema/Auto_Settlement_Plan__c.Name';

import { getFieldValue, getRecord } from 'lightning/uiRecordApi';

import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import ACCOUNT_OBJECT_NAME from '@salesforce/schema/Account.Name';
import ACCOUNT_OBJECT_PHONE from '@salesforce/schema/Account.Phone';
import ACCOUNT_OBJECT_ACTIVE from '@salesforce/schema/Account.Avocado_Menu_Link__c';
import ACCOUNT_OBJECT_AVG from '@salesforce/schema/Account.causeview__Average_Gift__c';

import ACTION_OBJECT from '@salesforce/schema/ymcaswo_k2__Action__c';
import ACTION_OBJECT_NAME from '@salesforce/schema/ymcaswo_k2__Action__c.Name';
import ACTION_OBJECT_PHONE from '@salesforce/schema/ymcaswo_k2__Action__c.ymcaswo_k2__Action__c';


export default class AIRecommenderGUI extends LightningElement {

    // myAccountObject = ACCOUNT_OBJECT;

  greeting = 'World';
  changeHandler(event) {
    this.greeting = event.target.value;
  }

//   myAccountObject = SETTLEMENT_PLAN_OBJECT;

    // @wire(getObjectInfo, { objectApiName: SETTLEMENT_PLAN_OBJECT })
    // objectInfo;

    // @wire(getRecord, { recordId: '$recordId', fields: [SETTLEMENT_PLAN_FEILD_ID] })
    // customObjectRecord;

    // get fieldValue() {
    //     return this.customObjectRecord.data ? this.customObjectRecord.data.fields.Settlement_Plan_ID__c.value : '';
    // }

    recordId;

    @wire(getRecord, { recordId: '$recordId', fields: [ACCOUNT_OBJECT_NAME, ACCOUNT_OBJECT_PHONE] })
    record;

    get name(){
        return this.record.data ? getFieldValue(this.record.data, ACCOUNT_OBJECT_NAME) : 'null';
        //return this.record.data.Name.value;
    }

    get phone(){
        return this.record.data ? getFieldValue(this.record.data, ACCOUNT_OBJECT_PHONE) : 'null';
    }

    get active(){
      return this.record.data ? getFieldValue(this.record.data, ACCOUNT_OBJECT_ACTIVE) : 'null';
    }

    get avg(){
      return this.record.data ? getFieldValue(this.record.data, ACCOUNT_OBJECT_AVG) : 'null';
    }



    @api planId; 

    // @wire(getRecord, { recordId: '$planId', fields: [SETTLEMENT_PLAN_FEILD_ID, SETTLEMENT_PLAN_FEILD_NAME] })
    @wire(getRecord, { recordId: 'a33Aw0000000QVZIA2', fields: [SETTLEMENT_PLAN_FEILD_ID, SETTLEMENT_PLAN_FEILD_NAME] })
    plan;

    get planID(){
        return this.plan.data ? getFieldValue(this.plan.data, SETTLEMENT_PLAN_FEILD_ID) : 'null';
        //return this.record.data.Name.value;
    } 
    
    get planName(){
      return this.plan.data ? getFieldValue(this.plan.data, SETTLEMENT_PLAN_FEILD_NAME) : 'null';
      //return this.record.data.Name.value;
  }  


    // actionId

    // @wire(getRecord, { actionId: '$actionId', fields: [ACTION_OBJECT_NAME, ACTION_OBJECT_PHONE] })
    // action;

    // get actionname(){
    //     return this.record.data ? getFieldValue(this.action.data, ACTION_OBJECT_NAME) : 'null';
        
    // }

    // get actionphone(){
    //     return this.record.data ? getFieldValue(this.action.data, ACTION_OBJECT_PHONE) : 'null';
    // }

    // @wire(getObjectInfo, { objectApiName: 'SETTLEMENT_PLAN_OBJECT' })
    // positionObjectInfo;

    // @wire(getObjectInfo, { objectApiName: SETTLEMENT_PLAN_OBJECT })
    // accountObject({error, data}){
    //     if(data){
    //         console.log(data);
    //     }else{
    //         console.log(error);
    //     }
    //   }

    // @wire(getObjectInfo, {objectApiName: ACCOUNT_OBJECT})
    // positionObjectInfo;

}






