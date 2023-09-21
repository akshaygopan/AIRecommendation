public with sharing class PlanRelatedListHandler {
    public PlanRelatedListHandler() 
    {

    }

    @AuraEnabled(cacheable=true)
    public static Map<Auto_Recomandation__c, List<Recommended_Action__c>> getPlanRelatedLists(String planId) 
    {
        //console.log('getPlanRelatedLists called');

        Map<Auto_Recomandation__c, List<Recommended_Action__c>> childToSubChildMap = new Map<Auto_Recomandation__c, List<Recommended_Action__c>>();

        List<Auto_Recomandation__c> childRecords = [SELECT Id,Name, Statement__c, Statement_Category__c, Statement_Main_Catergory__c, Status__c, (SELECT Id, Name, Action__c, Other_Data__c, Chosen__c, isSelected__c, Order__c FROM Recommended_Actions__r ORDER BY Order__c) FROM Auto_Recomandation__c WHERE Auto_Settlement_Plan__c = :planId];

        for (Auto_Recomandation__c child : childRecords) 
        {
            List<Recommended_Action__c> subChildRecords = child.Recommended_Actions__r;
            childToSubChildMap.put(child, subChildRecords);
        }
        
        System.debug(childToSubChildMap);
        //console.log(childToSubChildMap);
        
        for(Auto_Recomandation__c child : childToSubChildMap.keySet())
        {
            System.debug('Child Object: ' + child.Name);
            List<Recommended_Action__c> subChildList = childToSubChildMap.get(child);
            for(Recommended_Action__c subChild : subChildList)
            {
               System.debug('Sub-Child Object: ' + subChild.Action__c);
        	}
		}

        return childToSubChildMap;

    }

    @AuraEnabled(cacheable=true)
    public static List<Auto_Recomandation__c> getStatementList(string text)
    {
        List<Auto_Recomandation__c> recomList = [SELECT Id, Name, Auto_Settlement_Plan__c FROM Auto_Recomandation__c WHERE Auto_Settlement_Plan__c = 'a33Aw0000000QVZIA2'];
    	System.debug('Recom list - '+recomList);

        return recomList;
    }

    @AuraEnabled(cacheable=true)
    public static Map<Auto_Recomandation__c, List<Recommended_Action__c>> getTest(String planId) 
    {
        //console.log('getPlanRelatedLists called');

        Map<Auto_Recomandation__c, List<Recommended_Action__c>> childToSubChildMap = new Map<Auto_Recomandation__c, List<Recommended_Action__c>>();

        List<Auto_Recomandation__c> childRecords = [SELECT Id,Name,Statement_Category__c, Statement_Main_Catergory__c, Status__c, (SELECT Id, Name, Action__c, Other_Data__c, isSelected__c FROM Recommended_Actions__r) FROM Auto_Recomandation__c WHERE Auto_Settlement_Plan__c = :planId];

        for (Auto_Recomandation__c child : childRecords) 
        {
            List<Recommended_Action__c> subChildRecords = child.Recommended_Actions__r;
            childToSubChildMap.put(child, subChildRecords);
        }
        
        System.debug(childToSubChildMap);
        //console.log(childToSubChildMap);
        
        for(Auto_Recomandation__c child : childToSubChildMap.keySet())
        {
            System.debug('Child Object: ' + child.Name);
            List<Recommended_Action__c> subChildList = childToSubChildMap.get(child);
            for(Recommended_Action__c subChild : subChildList)
            {
               System.debug('Sub-Child Object: ' + subChild.Action__c);
        	}
		}

        return childToSubChildMap;

    }

    @AuraEnabled
    public static void setActionIsSelected(String ActionRecordId, integer isSelected)
    {
        //System.debug('ActionRecordId - '+ActionRecordId);
        //System.debug('isSelected - '+isSelected);
        Recommended_Action__c recAction = [SELECT Id, Name, Action__c, Other_Data__c, isSelected__c FROM Recommended_Action__c WHERE Id = :ActionRecordId  LIMIT 1];
        //System.debug('recAction - '+recAction);
        recAction.isSelected__c = isSelected;
        update recAction;
    }

    @AuraEnabled(cacheable=true)
    public static List<ymcaswo_k2__Action__c> getOtherActionList(String category, String indicator){
        // List<ymcaswo_k2__Action__c> actionList = [SELECT Name, ymcaswo_k2__Action__c, ymcaswo_k2__Assessment_Category__c,ymcaswo_k2__Assessment_Indicator__c FROM ymcaswo_k2__Action__c WHERE 
        //                                           (ymcaswo_k2__Assessment_Category__c = :category AND ymcaswo_k2__Assessment_Indicator__c = :indicator) OR
        //                                          (ymcaswo_k2__Assessment_Category__c = :category AND ymcaswo_k2__Assessment_Indicator__c = null)];

        List<ymcaswo_k2__Action__c> actionList = [SELECT Name, ymcaswo_k2__Custom__c, ymcaswo_k2__Action__c, ymcaswo_k2__Assessment_Category__c,ymcaswo_k2__Assessment_Indicator__c, Import_ID__c FROM ymcaswo_k2__Action__c WHERE 
                                                  (ymcaswo_k2__Custom__c = false AND ymcaswo_k2__Assessment_Category__c INCLUDES (:category) AND ymcaswo_k2__Assessment_Indicator__c INCLUDES (:indicator)) OR
                                                 (ymcaswo_k2__Custom__c = false AND ymcaswo_k2__Assessment_Category__c INCLUDES (:category) AND ymcaswo_k2__Assessment_Indicator__c = null) ORDER BY ymcaswo_k2__Action__c];

        // for (ymcaswo_k2__Action__c action : actionList) 
        // {
        //     System.debug('Action Object: ' + action.Name);
        // }
        //return actionList;

        Set<String> uniqueActionNames = new Set<String>();
        List<ymcaswo_k2__Action__c> uniqueActions = new List<ymcaswo_k2__Action__c>();
    
        for (ymcaswo_k2__Action__c action : actionList) {
            if (!uniqueActionNames.contains(action.ymcaswo_k2__Action__c)) {
                uniqueActionNames.add(action.ymcaswo_k2__Action__c);
                uniqueActions.add(action);
            }
        }



        return uniqueActions;

    }

    @AuraEnabled(cacheable=true)
    public static List<ymcaswo_k2__Action__c> getOtherActionListbyCatergoty(String category){
        List<ymcaswo_k2__Action__c> actionList = [SELECT Name, ymcaswo_k2__Action__c, ymcaswo_k2__Assessment_Category__c,ymcaswo_k2__Assessment_Indicator__c FROM ymcaswo_k2__Action__c WHERE ymcaswo_k2__Assessment_Category__c = :category];
        
        // for (ymcaswo_k2__Action__c action : actionList) 
        // {
        //     System.debug('Action Object: ' + action.Name);
        // }
        return actionList;

    }



    @AuraEnabled
    public static void setOtherAction (String ActionRecordId, String otherAction){
        //System.debug('ActionRecordId - '+ActionRecordId);
        //System.debug('otherAction - '+otherAction);
        Recommended_Action__c recAction = [SELECT Id, Name, Action__c, Other_Data__c FROM Recommended_Action__c WHERE Id = :ActionRecordId  LIMIT 1];
        //System.debug('recAction - '+recAction);
        // recAction.Action__c = otherAction;

        // System.debug('Other updated: ' + recAction.Action__c);
        
        // update recAction;

        if (recAction != null && otherAction != null)  {
            recAction.Action__c = 'Other - ' + otherAction;
    
            System.debug('Other updated: ' + recAction.Action__c);
    
            update recAction;
        } else {
            System.debug('No record found with the given Id: ' + ActionRecordId);
        }
    }

    @AuraEnabled
    public static void setOtherActionNew (String ActionRecordId, String otherAction, String unquieId){
        //System.debug('ActionRecordId - '+ActionRecordId);
        //System.debug('otherAction - '+otherAction);
        Recommended_Action__c recAction = [SELECT Id, Name, Action__c, Other_Data__c, Other_Unquie_ID__c FROM Recommended_Action__c WHERE Id = :ActionRecordId  LIMIT 1];

        if (recAction != null && otherAction != null)  {
            recAction.Action__c = 'Other - ' + otherAction;
            recAction.Other_Unquie_ID__c = unquieId;
    
            System.debug('Other updated: ' + recAction.Action__c);
    
            update recAction;
        } else {
            System.debug('No record found with the given Id: ' + ActionRecordId);
        }
    }  
    
    @AuraEnabled
    public static void setOtherActionMutiple (String ActionRecordId, List<String> otherActions, List<String> unquieIds){
        //System.debug('ActionRecordId - '+ActionRecordId);
        //System.debug('otherAction - '+otherAction);
        Recommended_Action__c recAction = [SELECT Id, Name, Action__c, Other_Data__c, Other_Unquie_ID__c FROM Recommended_Action__c WHERE Id = :ActionRecordId  LIMIT 1];

        if (recAction != null && otherActions != null)  {
            String concatenatedString = String.join(otherActions, ' | ');
            recAction.Action__c = 'Other - ' + concatenatedString;

            String unquieIdString = String.join(unquieIds, ' | ');
            recAction.Other_Unquie_ID__c = unquieIdString;
    
            System.debug('Other updated: ' + recAction.Action__c);
    
            update recAction;
        } else {
            System.debug('No record found with the given Id: ' + ActionRecordId);
        }
    }       


    @AuraEnabled(cacheable=true)
    public static Map<Auto_Recomandation__c, List<Recommended_Action__c>> getPlanRelatedSummaryLists(String planId) 
    {
        //console.log('getPlanRelatedLists called');

        Map<Auto_Recomandation__c, List<Recommended_Action__c>> childToSubChildMap = new Map<Auto_Recomandation__c, List<Recommended_Action__c>>();

        List<Auto_Recomandation__c> childRecords = [SELECT Id,Name, Statement__c, Statement_Category__c, Statement_Main_Catergory__c, Status__c, 
        (SELECT Id, Name, Action__c, Other_Data__c, Chosen__c, Order__c FROM Recommended_Actions__r WHERE isSelected__c = 1 ORDER BY Order__c) 
        FROM Auto_Recomandation__c WHERE Auto_Settlement_Plan__c = :planId];

        for (Auto_Recomandation__c child : childRecords) 
        {
            List<Recommended_Action__c> subChildRecords = child.Recommended_Actions__r;
            childToSubChildMap.put(child, subChildRecords);
        }
        
        System.debug(childToSubChildMap);
        //console.log(childToSubChildMap);
        
        for(Auto_Recomandation__c child : childToSubChildMap.keySet())
        {
            System.debug('Child Object: ' + child.Name);
            List<Recommended_Action__c> subChildList = childToSubChildMap.get(child);
            for(Recommended_Action__c subChild : subChildList)
            {
               System.debug('Sub-Child Object: ' + subChild.Action__c);
        	}
		}

        return childToSubChildMap;

    }
}