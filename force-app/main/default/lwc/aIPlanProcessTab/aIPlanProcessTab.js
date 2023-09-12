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
import setOtherAction from '@salesforce/apex/PlanRelatedListHandler.setOtherAction';

import ACTION_OBJECT from '@salesforce/schema/Recommended_Action__c';
import ACTION_FEILD_ID from '@salesforce/schema/Recommended_Action__c.Action_ID__c';
import ACTION_FEILD_NAME from '@salesforce/schema/Recommended_Action__c.Name';
import ACTION_FEILD_RECORD_ID from '@salesforce/schema/Recommended_Action__c.Id';
import setActionIsSelected from '@salesforce/apex/PlanRelatedListHandler.setActionIsSelected';
import getOtherActionList from '@salesforce/apex/PlanRelatedListHandler.getOtherActionList';

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

    // @track otherActions = [];
    // @track selectedAction;

    // columns = [
    //     { label: 'Action Name', fieldName: 'ymcaswo_k2__Action__c', type: 'text' },
    //     {
    //         type: 'button', label: 'Select', initialWidth: 135,
    //         typeAttributes: {
    //             label: 'Select',
    //             name: 'select_action',
    //             title: 'Click to select this action',
    //             disabled: false,
    //             value: 'select',
    //             iconName: 'utility:check',
    //             variant: 'border-filled',
    //         }
    //     }
    // ];

    @track otherActions = [];
    @track otherActionsOptions = [];
    @track selectedAction;
    // You might need to declare item and inner if they're not declared elsewhere
    item;
    inner;

    handleMenuFocus(event) {
        // Fetch the data for the combobox
        this.item = event.target.dataset.item;
        // console.log(`Selected value is: ${this.item}`);
        this.inner = event.target.dataset.inner;
        // console.log(`Selected value is: ${this.inner}`);
        // console.log('STAAAAAAAAAAAAAAARRRRRRRRRRRRRTTTT');
        getOtherActionList({ category: this.item, indicator: this.inner })
            .then(data => {
                this.otherActions = data;
                this.otherActionsOptions = this.otherActions.map(action => {
                    return {
                        label: action.ymcaswo_k2__Action__c,
                        value: action.ymcaswo_k2__Action__c  // Adjust based on your data structure
                    };
                });
                // console.log(this.otherActionsOptions);
                // console.log(this.otherActions);
                this.hasLoadedData = true;
            })
            .catch(error => {
                // console.log('BUGGGGGGGGGGGGG');
                // console.log('ERROR Other Actions:', error);
                this.error = error;
            });
    }
    
    handleSelect(event) {
        this.selectedAction = event.detail.value;
        // console.log(this.selectedAction);
        // Do further processing if needed
    }

    @track selectedValues = [];

    handleSelect(event) {
        const uniqueId = event.target.dataset.id;
        this.selectedValues[uniqueId] = event.detail.value;
        // console.log(event.detail.value);
        // console.log(this.treees);
        const mainCategorys = event.target.dataset.item;
        const categorys = event.target.dataset.inner;
        const subCategorys = event.target.dataset.subs;
        for (let mainCategory in this.treees) {
            if(mainCategory == mainCategorys){            
                for (let category in this.treees[mainCategory]) {
                    if(category == categorys){
                    for (let name in this.treees[mainCategory][category]) {
                        if(name == subCategorys){
                        for (let actions of this.treees[mainCategory][category][name]) {
                            for (let action of actions) {
                                if(action.label.startsWith('Other')){
                                    // console.log(action.label);
                                    // console.log(action.id);
                                    setOtherAction({ ActionRecordId: action.id, otherAction: event.detail.value})
            .then(() => {
                // Update successful
                // console.log('otherAction updated to successfully!!');
            }
            )   
            .catch(error => {
                // Error occurred
                console.error(error);
                // console.log('otherAction update failed!');
            }
            );
                                }
                            }
                        }
                    }
                }
                }
            }
            }
        }
    }

    // handleMenuFocus(event) {
    //     // Fetch the data for the menu
    //     this.item = event.target.dataset.item;
    //     console.log(`Selected value is: ${this.item}`);
    //     this.inner = event.target.dataset.inner;
    //     console.log(`Selected value is: ${this.inner}`);
    //     console.log('STAAAAAAAAAAAAAAARRRRRRRRRRRRRTTTT');
    //     getOtherActionList({ category: this.item, indicator: this.inner })
    //         .then(data => {
    //             this.otherActions = data;
    //             this.otherActionsOptions = this.otherActions.map(action => {
    //                 return {
    //                     label: action.Id,
    //                     value: action.ymcaswo_k2__Action__c  // Adjust based on your data structure
    //                 };
    //             });
    //             console.log(getOtherActionList);
    //             console.log(this.otherActionsOptions);
    //             console.log(this.otherActions);
    //             this.hasLoadedData = true;
    //         })
    //         .catch(error => {
    //             console.log('BUGGGGGGGGGGGGG');
    //             console.log('ERROR Other Actions:', error);
    //             this.error = error;
    //         });
    // }
    
    // @track otherActions = [];
    // @track selectedAction;
    // handleSelect(event) {
    //     debugger;
    //     this.selectedAction = event.detail.value;
    //     console.log(this.selectedAction);
    //     // Do further processing if needed
    // }

    // @track hasLoadedData = false;
    // handleMouseOver(event) {
    //     // Only fetch data if it hasn't been fetched before
    //     this.item = event.target.dataset.item;
    //     console.log(`Selected value is: ${this.item}`);
    //     this.inner = event.target.dataset.inner;
    //     console.log(`Selected value is: ${this.inner}`);
    //     // Only fetch data if it hasn't been fetched before
    //     // if (!this.hasLoadedData) {
    //         console.log('STAAAAAAAAAAAAAAARRRRRRRRRRRRRTTTT');
    //         getOtherActionList({ category: this.item, indicator: this.inner })
    //         .then(data => {
    //             this.otherActions = data;
    //             this.otherActionsOptions = this.otherActions.map(action => {
    //                 return {
    //                     label: action.Id,
    //                     value: action.ymcaswo_k2__Action__c  // Adjust based on your data structure
    //                 };
    //             });
    //             console.log(getOtherActionList);
    //             console.log(this.otherActionsOptions);
    //             console.log(this.otherActions);
    //             this.hasLoadedData = true;
    //         })
    //         .catch(error => {
    //             console.log('BUGGGGGGGGGGGGG');
    //             console.log('ERROR Other Actions:', error);
    //             this.error = error;
    //         });
    //     // }
    // }

    // @track hasLoadedData = false;
    // handleMouseOver(event) {
    //     // Only fetch data if it hasn't been fetched before
    //     if (!this.hasLoadedData) {
    //         getOtherActionList({ category: this.category, indicator: this.indicator })
    //         .then(data => {
    //             this.otherActions = data;
    //             this.otherActionsOptions = this.otherActions.map(action => {
    //                 return {
    //                     label: action.label,
    //                     value: action.label  // Adjust based on your data structure
    //                 };
    //             });
    //             this.hasLoadedData = true;
    //         })
    //         .catch(error => {
    //             console.log('ERROR Other Actions:', error);
    //             this.error = error;
    //         });
    //     }
    // }


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

    // @track childToSubChildMap;
    // @track errorx;
    // @wire(getPlanRelatedLists, { parentId: '$recordId' })
    // wiredResult({ error, data }) {
    //     console.log('wiredResult');
    //     if (data) {
    //         console.log('HAS DATA getPlanRelatedLists');
    //         this.childToSubChildMap = data;
    //         console.log(this.childToSubChildMap);
    //     } else if (error) {
    //         console.log('ERROR getPlanRelatedLists');
    //         this.errorx = error;
    //     }
    // }


    

    @track childToSubChildMap;
    @track errorx;
    @track main_category;
    @track sub_category;
    @track name;
    @track info = [];
    @track mainCategoryData = {};
    @track treees;

    @wire(getPlanRelatedLists, { planId: '$recordId' })
wiredResult({ error, data }) {
    console.log('wiredResult');
    if (data) {
        // debugger;
        // console.log(data);
        // console.log('HAS DATA getPlanRelatedLists');
        this.childToSubChildMap = data;

        console.log(this.childToSubChildMap);

        if (this.childToSubChildMap && typeof this.childToSubChildMap === 'object') {

            let tree = {};

            for (let child in this.childToSubChildMap) {


                console.log(child);

                let mainCategory, category, name, actions = [];


                let mainCategoryMatch = child.match(/(?<=Statement_Main_Catergory__c:)(.*?)(?=, Status__c:)/);
                let categoryMatch = child.match(/(?<=Statement_Category__c:)(.*?)(?=, Statement_Main_Catergory__c:)/);
                let nameMatch = child.match(/(?<=Statement__c:)(.*?)(?=, Statement_Category__c:)/);



                if (mainCategoryMatch && mainCategoryMatch.length > 1) {
                    mainCategory = mainCategoryMatch[1].trim();
                }
                if (categoryMatch && categoryMatch.length > 1) {
                    category = categoryMatch[1].trim();
                }
                if (nameMatch && nameMatch.length > 1) {
                    name = nameMatch[1].trim();
                }
                let actionObjects = this.childToSubChildMap[child];
                for (let actionObject of actionObjects) {
                    debugger;
                    actions.push({label: actionObject.Action__c, id: actionObject.Id, checked:actionObject.isSelected__c});
                }

                if (mainCategory && category && name && actions.length > 0) {
                    if (!tree[mainCategory]) {
                        tree[mainCategory] = {};
                    }
                    if (!tree[mainCategory][category]) {
                        tree[mainCategory][category] = {};
                    }
                    if (!tree[mainCategory][category][name]) {
                        tree[mainCategory][category][name] = [];
                    }
                    tree[mainCategory][category][name].push(actions);
                }
            }

            this.treees=tree;
            let tempInfo = [];
for (let mainCategory in tree) {
let mainCategoryItem = {
    label: mainCategory,
    innerData: []
    };
    for (let category in tree[mainCategory]) {
        let categoryItem = {
            label: category,
            innerInnerData: []
        };
        for (let name in tree[mainCategory][category]) {
            let nameItem = {
                label: name,
                innerInnerInnerData: []
            };
            for (let actions of tree[mainCategory][category][name]) {
                for (let action of actions) {
                    debugger;
                    nameItem.innerInnerInnerData.push({ 
                        label: action.label, 
                        id: action.id,
                        checked: action.checked 
                    });
                }
            }
            categoryItem.innerInnerData.push(nameItem);
        }
        mainCategoryItem.innerData.push(categoryItem);
    }
    tempInfo.push(mainCategoryItem);
}
this.info = tempInfo;

            for (let mainCategory in tree) {
                console.log(mainCategory);
                let categories = tree[mainCategory];
                this.mainCategoryData[mainCategory] = categories;
                this.main_category = mainCategory;
                for (let category in tree[mainCategory]) {
                    console.log("  " + category);
                    this.sub_category = category;
                    for (let name in tree[mainCategory][category]) {
                        console.log("    " + name);
                        this.name = name;
                        for (let actions of tree[mainCategory][category][name]) {
                            console.log("      " + actions.join(', '));
                        }
                    }
                }
            }
        } else {
            console.log('this.childToSubChildMap is not an object');
        }
    }

}

// handleChange(event) {
//     let checkboxValue = event.target.checked;
//     let checkboxLabel = event.target.dataset.label;
//     alert(`Value: ${checkboxValue}, Label: ${checkboxLabel}`);
// }


handleChange(event) {
    let checkboxValue = event.target.checked ? 1 : 0; // Convert to integer
    let recordId = event.target.dataset.id;
    debugger;
    console.log(recordId);


    setActionIsSelected({ActionRecordId: recordId, isSelected: checkboxValue})
        .then(result => {
            //alert(`Record updated successfully.`);
        })
        .catch(error => {
            debugger;
            console.log('Error updating record: ' + error);
            //alert('Error updating record: ' + error);
        });
}

// Add these properties to your existing JavaScript code
@track value = '';  // Holds the selected combobox value

// Dummy options for the combobox
@track options = [
    { label: 'First', value: 'first' },
    { label: 'Second', value: 'second' },
    { label: 'Third', value: 'third' },
    { label: 'Fourth', value: 'fourth' },
    { label: 'Fifth', value: 'fifth' }
];

// handleComboboxChange(event) {
//     this.value = event.detail.value;
//     // Implement any logic here when the combobox value changes
// }

@track selectedValue = 'Rand1';
@track selectedinner = '101'; // You can set a default value or leave it undefined

handleComboboxChange(event) {
    this.selectedValue = event.detail.value;
    // console.log(`Selected value is: ${event.detail.value}`);
    this.selectedinner = event.target.dataset.id;
    console.log(`Selected value is: ${this.selectedinner}`);
}



// previousChecked = null;

//  toggleDropdown() {
//         const dropdown = document.getElementById('dropdownContent');
//         dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
// }

// selectOption(element) {
//         if (previousChecked && previousChecked !== element) {
//             previousChecked.checked = false;
//         }

//         previousChecked = element;

//         alert(element.value);
// }


// handleChange(event) {
//     let checkboxValue = event.target.checked;
//     let recordId = event.target.dataset.recordid;
//     let checkboxLabel = event.target.dataset.label;

//     setActionIsSelected({ActionRecordId: recordId, isSelected: checkboxValue})
//         .then(result => {
//             alert(`Record updated successfully.`);
//         })
//         .catch(error => {
//             debugger;
//             console.log('Error updating record: ' + error);
//             alert('Error updating record: ' + error);
//         });
// }


    // @wire(getPlanRelatedLists, { planId: '$recordId' })
    // wiredResult({ error, data }) {
    //     console.log('wiredResult');
    //     if (data) {
    //         console.log('HAS DATA getPlanRelatedLists');
    //         this.childToSubChildMap = data;
    //         console.log(this.childToSubChildMap);
    
    //         // Print object names and features
    //         console.log('------------------------');

    
    //         for (let child of Object.keys(this.childToSubChildMap)) {
    //             let childObject = child;
    //             console.log('Child Objec: ' + childObject);
    //             let Statement_Main_Catergory_match = childObject.match(/Statement_Main_Catergory__c:([^,]+)/);
    //             if (Statement_Main_Catergory_match && Statement_Main_Catergory_match.length > 1) {
    //                let main_category = Statement_Main_Catergory_match[1].trim();
    //                console.log('statemet Block_main cat: ' + main_category);
    //                this.main_category = main_category;


    //             //    let mainCategoryTitleElement = document.getElementById("mainCategoryTitle");
    //             //    if (mainCategoryTitleElement) {
    //             //     mainCategoryTitleElement.textContent = main_category;
    //             //   }
    //             }
    //             let Statement_Category_match = childObject.match(/Statement_Category__c:([^,]+)/);
    //              if (Statement_Category_match && Statement_Category_match.length > 1) {
    //                 let category = Statement_Category_match[1].trim();
    //                 console.log('statement Block_category: ' + category);
    //                 this.sub_category = category;

    //              }
    //             let nameMatch = childObject.match(/Name:([^,]+)/);
    //             if (nameMatch && nameMatch.length > 1) {
    //                let name = nameMatch[1].trim();
    //                console.log('statement Block_name: ' + name);
    //                this.name = name;
    //             }
    
    //             // Actions
    //             let subChildList = this.childToSubChildMap[child];
    //             for (let subChild of subChildList) {
    //                 console.log('Action list element: ' + subChild.Action__c);
    //             }
    //         }
    
    //         console.log('------------------------');
    //     } else if (error) {
    //         console.log('ERROR getPlanRelatedLists');
    //         this.errorx = error;
    //     }
    // }
    
    
    
        // Other component code goes here
    
    
    


  
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
