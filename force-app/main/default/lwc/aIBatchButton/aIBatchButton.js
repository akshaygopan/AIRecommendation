import { LightningElement, api, wire } from 'lwc';

import handleBatchAssessmentResponses from '@salesforce/apex/LWCController.handleBatchAssessmentResponses';


export default class AIBatchButton extends LightningElement {

    @api recordId;

    handleButtonClick() {
        
        handleBatchAssessmentResponses({ assessmentRecordId:'$recordId' })
            .then(result => {
                console.log('Success calling handleBatchAssessmentResponses');
            })
            .catch(error => {
                console.log('Error calling handleBatchAssessmentResponses');
            });
    }

}