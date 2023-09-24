import { LightningElement, api, wire, track } from 'lwc';

import handleAIIntergration from '@salesforce/apex/LWCController.handleAIIntergration';

import { NavigationMixin } from 'lightning/navigation';

export default class AIIntergrationButton extends NavigationMixin (LightningElement) {

    @api recordId;
    //@track AIPlanRecordId;


    handleButtonClick() {
        
        handleAIIntergration({ assessmentRecordId :this.recordId })
            .then(result => {
                console.log('Success calling handleAIIntergration');
                console.log(this.recordId);
                console.log(result);

            //     this.AIPlanRecordId = result;


            //     if (this.AIPlanRecordId == null) {
            //         onsole.log('Error handleBatchAssessmentResponses - Null plan ID');
            //     } 
            //     else {

            //         this[NavigationMixin.GenerateUrl]({
            //             type: 'standard__recordPage',
            //             attributes: {
            //                 recordId: this.AIPlanRecordId,
            //                 objectApiName: 'Auto_Settlement_Plan__c', // Replace with your object's API name
            //                 actionName: 'view'
            //             }
            //         }).then(url => {
            //             window.open(url, "_blank");
            //         });

            //         console.log('Navigating handleBatchAssessmentResponses');
            // }
            }
            )
            .catch(error => {
                console.log('Error calling handleAIIntergration');
                console.log(error);
            });
    }


}