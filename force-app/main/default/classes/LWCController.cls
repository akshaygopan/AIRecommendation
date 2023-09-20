public with sharing class LWCController {
    
    @AuraEnabled
    public static String handleBatchAssessmentResponses(String assessmentRecordId) {
        // Call the method from the AssesmentBatchHandler class
        return AssesmentBatchHandler.handleBatchAssessmentResponses(assessmentRecordId);
        //return AssesmentBatchHandler.handleBatchAssessmentResponses('a1qAw0000005W7JIAU');
    }

    @AuraEnabled
    public static String handleAIIntergration(String assessmentRecordId) {
        // Call the method from the AIIntergration class
        return AIIntergration.handleAIIntergration(assessmentRecordId);
        //return AssesmentBatchHandler.handleBatchAssessmentResponses('a1qAw0000005W7JIAU');
    }
    
    
}