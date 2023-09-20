import { LightningElement, api, wire, track } from 'lwc';

import handleBatchAssessmentResponses from '@salesforce/apex/LWCController.handleBatchAssessmentResponses';

import { NavigationMixin } from 'lightning/navigation';

export default class AIBatchButton extends NavigationMixin (LightningElement) {

    @api recordId;
    @track AIPlanRecordId;

    // // Wire the method and get the result
    // @wire(handleBatchAssessmentResponses, { assessmentRecordId: '$recordId' })
    // wiredResult({ data, error }) {
    //     if (data) {
    //         // Handle the data returned from the Apex method
    //         console.log('Result:', data);
    //     } else if (error) {
    //         // Handle any errors
    //         console.error('Error:', error);
    //     }
    // }

    handleButtonClick() {
        
        handleBatchAssessmentResponses({ assessmentRecordId :this.recordId })
            .then(result => {
                console.log('Success calling handleBatchAssessmentResponses 7');
                console.log(this.recordId);
                console.log(result);

                this.AIPlanRecordId = result;

                // Navigate to the Account record page with the given ID
                // this[NavigationMixin.Navigate]({
                //     type: 'standard__recordPage',
                //     attributes: {
                //         recordId: '001Aw000001AJlZIAW',
                //         objectApiName: 'Account', // Replace with your object's API name
                //         actionName: 'view'
                //     }
                // });

                if (this.AIPlanRecordId == null) {
                    onsole.log('Error handleBatchAssessmentResponses - Null plan ID');
                } 
                else {

                    this[NavigationMixin.GenerateUrl]({
                        type: 'standard__recordPage',
                        attributes: {
                            recordId: this.AIPlanRecordId,
                            objectApiName: 'Auto_Settlement_Plan__c', // Replace with your object's API name
                            actionName: 'view'
                        }
                    }).then(url => {
                        window.open(url, "_blank");
                    });

                    console.log('Navigating handleBatchAssessmentResponses');
            }})
            .catch(error => {
                console.log('Error calling handleBatchAssessmentResponses');
            });
    }

}