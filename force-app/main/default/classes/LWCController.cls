public with sharing class LWCController {
    
    @AuraEnabled
    public static void handleBatchAssessmentResponses(String assessmentRecordId) {
        // Call the method from the AssesmentBatchHandler class
        AssesmentBatchHandler.handleBatchAssessmentResponses(assessmentRecordId);
    }
    
    
}