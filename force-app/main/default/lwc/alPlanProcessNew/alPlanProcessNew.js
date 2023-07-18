


import { LightningElement, wire, api, track } from 'lwc';
import { getListUi } from 'lightning/uiListApi';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { getRelatedListRecords, getRelatedListsInfo } from 'lightning/uiRelatedListApi';

import { getObjectInfo } from 'lightning/uiObjectInfoApi';

import getPlanRelatedLists from '@salesforce/apex/PlanRelatedListHandler.getPlanRelatedLists';
import getStatementList from '@salesforce/apex/PlanRelatedListHandler.getStatementList';
import getTest from '@salesforce/apex/PlanRelatedListHandler.getTest';
import setActionIsSelected from '@salesforce/apex/PlanRelatedListHandler.setActionIsSelected';
import getOtherActionList from '@salesforce/apex/PlanRelatedListHandler.getOtherActionList';
import getOtherActionListbyCatergoty from '@salesforce/apex/PlanRelatedListHandler.getOtherActionListbyCatergoty';
import setOtherAction from '@salesforce/apex/PlanRelatedListHandler.setOtherAction';
import getPlanRelatedSummaryLists from '@salesforce/apex/PlanRelatedListHandler.getPlanRelatedSummaryLists';

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
    @wire(getTest, { planId: '$recordId' })
    wiredResult1({ error, data }) {
        console.log('wiredResult1');
        if (data) {
            console.log('HAS DATA getTest 1');
         
            this.recommendations = data;
            console.log(this.recommendations);

        } else if (error) {
            console.log('ERROR getTest');
            this.errorx = error;
        }
    }

 
   
    // @track statements;
    // @track error;
    // @wire(getStatementList, { parentId: '$recordId' })
    // wiredResult({ error, data }) {
    //     console.log('statements');
    //     if (data) {
    //         console.log('HAS DATA statements');
    //         this.statements = data;
    //         console.log(this.statements);
    //         this.statements.forEach(element => {
    //             //console.log(element.Name);
    //         });


    //     } else if (error) {
    //         console.log('ERROR statements');
    //         this.error = error;
    //     }
    // }


    get currentPlanRelatedLists() {
        return Object.entries(this.recommendations).map((key, value) => ({ key, value }));
    }


    /* ------ NEW METHODS ----- */

    //handleCheckboxClick() - to update db on checkbox click
    //actionRecordId : Provide the appropriate Recommended Action object - Id field
    //isSelected  : Provide the appropriate isSelected value - 0(unselected) / 1(selected)

    handleCheckboxClick() {
        setActionIsSelected({ ActionRecordId: 'a35Aw00000009phIAA', isSelected: 0 })
            .then(() => {
                // Update successful
                console.log('isSelected updated to successfully!!');
            })
            .catch(error => {
                // Error occurred
                console.error(error);
                console.log('isSelected update failed!');
            });
    }


    //getOtherActionList() - to get other actions list based on main_category and sub_category
    //category : Provide the appropriate main_category value
    //indicator : Provide the appropriate sub_category value

    category = 'Employment';
    indicator = 'Skills';

    @track otherActions;
    @track error;
    @wire(getOtherActionList, { category: '$category', indicator:'$indicator'})
    wiredResult2({ error, data }) {
        console.log('wiredResult1');
        if (data) {
            console.log('HAS DATA Other Actions');
         
            this.otherActions = data;
            console.log(this.otherActions);

        } else if (error) {
            console.log('ERROR Other Actions');
            this.errorx = error;
        }
    }


    //handleOtherActionSelection() - to update db on other action selection
    //ActionRecordId : Provide the appropriate Recommended Action object - Id field
    //otherAction : Provide the appropriate other action value (from dropdown)
    //otherAction is saved on field - Recommended_Action__c.Other_Action__c


    handleOtherActionSelection() {
        setOtherAction({ ActionRecordId: 'a35Aw00000009phIAA', otherAction: 'Test saving other action' })
            .then(() => {
                // Update successful
                console.log('otherAction updated to successfully!!');
            }
            )   
            .catch(error => {
                // Error occurred
                console.error(error);
                console.log('otherAction update failed!');
            }
            );
        }   
        
        
    
    //summaryRecommendations - to get summary recommendations list (only isSelected = 1 actions will be displayed)

    @track summaryRecommendations;
    @track error;
    @wire(getPlanRelatedSummaryLists, { planId: '$recordId' })
    wiredResult3({ error, data }) {
        console.log('wiredResult3');
        if (data) {
            console.log('HAS DATA getPlanRelatedSummaryLists');
            
            this.summaryRecommendations = data;
            console.log(this.summaryRecommendations);

        } else if (error) {
            console.log('ERROR getPlanRelatedSummaryLists');
            this.errorx = error;
        }
    }
        

}