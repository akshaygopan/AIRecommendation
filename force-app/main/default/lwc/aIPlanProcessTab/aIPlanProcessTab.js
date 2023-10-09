import { LightningElement, wire, api, track } from 'lwc';
import { getListUi } from 'lightning/uiListApi';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { getRelatedListRecords, getRelatedListsInfo } from 'lightning/uiRelatedListApi';

import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import getAllPlanOtherActionLists from '@salesforce/apex/PlanRelatedListHandler.getAllPlanOtherActionLists';

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

import setActionIsSelected from '@salesforce/apex/PlanRelatedListHandler.setActionIsSelected';
import getOtherActionList from '@salesforce/apex/PlanRelatedListHandler.getOtherActionList';
import setOtherAction from '@salesforce/apex/PlanRelatedListHandler.setOtherAction';
import setOtherActionNew from '@salesforce/apex/PlanRelatedListHandler.setOtherActionNew';
import setOtherActionMutiple from '@salesforce/apex/PlanRelatedListHandler.setOtherActionMutiple';


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
        // console.log('Is ACTION_FEILD_NAME a list?', isList);
        return fieldValue;
    }


    @track rawData;
    @track secondTypeData;
    @track trees = [];
    @api category;
    @api indicator;
    
    connectedCallback() {
        this.fetchData();
    }
    
    treekeys = [];
    async fetchData() {
        try {
            const firstData = await getPlanRelatedLists({ planId: this.recordId });
            this.rawData = firstData;
            // console.log(this.rawData)
    
            const secondData = await getAllPlanOtherActionLists({ planId: this.recordId});
            this.secondTypeData = secondData;
            // console.log(this.secondTypeData)
    
            const transformedData = this.transformData(this.rawData, this.secondTypeData);
            this.trees = transformedData;
            // console.log('This is the treeeeeeeeeeeeeeeeeeee!!!!!');
            // console.log(this.trees)
            // console.log(transformedData);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    }

    transformData (data, secondTypeData) {
    let result = [];

    for (const key in data) {
        const mainCategory = key.match(/Statement_Main_Catergory__c:(.+?),/)[1].trim();
        const category = key.match(/Statement_Category__c:(.+?),/)[1].trim();
        const statement = key.match(/Statement__c:(.+?), Statement_Category__c/)[1].trim();

        let mainCategoryObj = result.find(item => item.name === mainCategory);
        if (!mainCategoryObj) {
            mainCategoryObj = {
                id: String(Math.floor(100000 + Math.random() * 900000)),
                name: mainCategory,
                children: []
            };
            result.push(mainCategoryObj);
        }

        let categoryObj = mainCategoryObj.children.find(item => item.name === category);
        if (!categoryObj) {
            categoryObj = {
                id: String(Math.floor(100000 + Math.random() * 900000)),
                name: category,
                children: []
            };
            mainCategoryObj.children.push(categoryObj);
        }

        let statementObj = {
            id: String(Math.floor(100000 + Math.random() * 900000)),
            name: statement,
            Recommended_Actions__r: data[key],
            OtherActions: []
        };
        categoryObj.children.push(statementObj);
    }

    for (const action of secondTypeData) {
        const categories = action["ymcaswo_k2__Assessment_Category__c"].split(";");

        for (const mainCategoryObj of result) {
            if (categories.includes(mainCategoryObj.name)) {
                for (const categoryObj of mainCategoryObj.children) {
                    for (const statementObj of categoryObj.children) {
                        let isSelected = false;
                        let parent_id = null;

                        for (const recommendedAction of statementObj["Recommended_Actions__r"]) {
                            if (recommendedAction["Action__c"].startsWith("Other")) {
                                parent_id = recommendedAction["Id"];
                            }
                            if (recommendedAction["Action__c"].startsWith("Other -") && recommendedAction["Action__c"].includes(action["ymcaswo_k2__Action__c"])) {
                                isSelected = true;
                                break;
                            }
                        }

                        statementObj["OtherActions"].push({
                            ...action,
                            selected: isSelected,
                            label: action["ymcaswo_k2__Action__c"],
                            value: action["Import_ID__c"],
                            parent_id: parent_id
                        });
                    }
                }
            }
        }
    }

    for (const mainCategoryObj of result) {
        for (const categoryObj of mainCategoryObj.children) {
            for (const statementObj of categoryObj.children) {
                const uniqueMap = new Map();

                statementObj["OtherActions"] = statementObj["OtherActions"].filter(action => {
                    if (uniqueMap.has(action.label)) {
                        return false;
                    } else {
                        uniqueMap.set(action.label, true);
                        return true;
                    }
                });

                statementObj["OtherActions"].sort((a, b) => a.label.localeCompare(b.label));
            }
        }
    }
    result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
};
    
    
    category = 'Employment';
    indicator = 'Skills';

    @track otherActions = [];
    @track selectedAction;

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
            // console.log('Has error 2');
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
            // console.log('some data exist');
            //console.log(statementRecords);
            this.error = undefined;
            this.statementRecords.forEach(record => {
                this.statementIds.push(record.fields.Id.value);
            })
            // console.log('VVVVVVVV');
            // console.log(this.statementIds);

            this.statementIds.forEach(id => {
                this.currentId = id
            })

        } else if (error) {
            this.error = error;
            // console.log('error exist 3');
            // console.log(error);
            this.statementRecords = undefined;
        }
    }


    @track childToSubChildMap;
    @track errorx;
    @track main_category;
    @track sub_category;
    @track name;
    @track info = [];
    @track mainCategoryData = {};



@track value = ''; 


@track selectedItems = '';
@track isDropdownOpen = false;

get dropdownClass() {
    return this.isDropdownOpen ? 'myComboBox' : 'hidden-combo-box';
}

toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
}

handleSelection(event) {
    let selectedOptions = this.template.querySelectorAll('input[type="checkbox"]:checked');
    let values = Array.from(selectedOptions).map(ele => ele.value);
    let labels = this.options.filter(option => values.includes(option.value)).map(option => option.label);
    this.selectedItems = labels.join(', ');
}

handleSelection() {
    let selectedOptions = this.template.querySelectorAll('input[type="checkbox"]:checked');
    let values = Array.from(selectedOptions).map(ele => ele.value);
    let labels = this.options.filter(option => values.includes(option.value)).map(option => option.label);
    this.selectedItems = labels.join(', ');
}

   

  selectedOptions = [];
  

  handleChange(event) {
    this.selectedOptions = event.detail;

    if (!Array.isArray(this.selectedOptions) || this.selectedOptions.length === 0) {
       console.error("No valid options received");
       return;
    }

    let otherActionList = [];
    let uniqueIds = [];
    
    for (let i = 0; i < this.selectedOptions.length; i++) {
        otherActionList[i] = this.selectedOptions[i].label;
        uniqueIds[i] = this.selectedOptions[i].value;
    }

    let actionRecordId = (this.selectedOptions[0] && this.selectedOptions[0].parent_id) ? this.selectedOptions[0].parent_id : null;

    // alert("Other Actions: " + otherActionList);
    // alert("Unique IDs: " + uniqueIds);
    // alert("Action Record ID: " + actionRecordId);

    if (actionRecordId) {
        setOtherActionMutiple({ ActionRecordId: actionRecordId, otherAction: otherActionList, uniqueId: uniqueIds})
            .then(() => {
                // alert('OtherAction updated successfully!');
            })
            .catch(error => {
                alert('OtherAction update failed! ' + error);
            });
    }

  }
  
  changeActionStatus(event) {
    let checkboxValue = event.target.checked ? 1 : 0;
    let recordId = event.target.dataset.id;
    // console.log(recordId);


    setActionIsSelected({ActionRecordId: recordId, isSelected: checkboxValue})
        .then(result => {
            // alert(`Record updated successfully.`);
        })
        .catch(error => {
            debugger;
            // console.log('Error updating record: ' + error);
            // alert('Error updating record: ' + error);
        });
}

}
