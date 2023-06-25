public with sharing class PlanRelatedListHandler {
    public PlanRelatedListHandler() 
    {

    }

    @AuraEnabled(cacheable=true)
    public static Map<Auto_Recomandation__c, List<Recommended_Action__c>> getPlanRelatedLists(String planId) 
    {
        //console.log('getPlanRelatedLists called');

        Map<Auto_Recomandation__c, List<Recommended_Action__c>> childToSubChildMap = new Map<Auto_Recomandation__c, List<Recommended_Action__c>>();

        List<Auto_Recomandation__c> childRecords = [SELECT Id,Name,Statement_Category__c, Statement_Main_Catergory__c, Status__c, (SELECT Id, Name, Action__c, Other_Data__c, Chosen__c FROM Recommended_Actions__r) FROM Auto_Recomandation__c WHERE Auto_Settlement_Plan__c = :planId];

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
        List<ymcaswo_k2__Action__c> actionList = [SELECT Name, ymcaswo_k2__Action__c, ymcaswo_k2__Assessment_Category__c,ymcaswo_k2__Assessment_Indicator__c FROM ymcaswo_k2__Action__c WHERE ymcaswo_k2__Assessment_Category__c = :category AND ymcaswo_k2__Assessment_Indicator__c = :indicator];
        
        // for (ymcaswo_k2__Action__c action : actionList) 
        // {
        //     System.debug('Action Object: ' + action.Name);
        // }
        return actionList;

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
        Recommended_Action__c recAction = [SELECT Id, Name, Other_Data__c FROM Recommended_Action__c WHERE Id = :ActionRecordId  LIMIT 1];
        //System.debug('recAction - '+recAction);
        recAction.Other_Data__c = otherAction;
        update recAction;
    }


    @AuraEnabled(cacheable=true)
    public static Map<Auto_Recomandation__c, List<Recommended_Action__c>> getPlanRelatedSummaryLists(String planId) 
    {
        //console.log('getPlanRelatedLists called');

        Map<Auto_Recomandation__c, List<Recommended_Action__c>> childToSubChildMap = new Map<Auto_Recomandation__c, List<Recommended_Action__c>>();

        List<Auto_Recomandation__c> childRecords = [SELECT Id,Name,Statement_Category__c, Statement_Main_Catergory__c, Status__c, 
        (SELECT Id, Name, Action__c, Other_Data__c, Chosen__c FROM Recommended_Actions__r WHERE isSelected__c = 1) 
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