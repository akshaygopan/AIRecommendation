public with sharing class LWCController {
    
    @AuraEnabled
    public static Integer handleBatchAssessmentResponses(String assessmentRecordId) {
        // Call the method from the AssesmentBatchHandler class
        return AssesmentBatchHandler.handleBatchAssessmentResponses(assessmentRecordId);
        //return AssesmentBatchHandler.handleBatchAssessmentResponses('a1qAw0000005W7JIAU');
    }
    
    
}