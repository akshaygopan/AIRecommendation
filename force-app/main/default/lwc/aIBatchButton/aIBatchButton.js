import { LightningElement, api, wire } from 'lwc';

import handleBatchAssessmentResponses from '@salesforce/apex/LWCController.handleBatchAssessmentResponses';


export default class AIBatchButton extends LightningElement {

    @api recordId;

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
                console.log('Success calling handleBatchAssessmentResponses');
                console.log(this.recordId);
                console.log(result);
            })
            .catch(error => {
                console.log('Error calling handleBatchAssessmentResponses');
            });
    }

}