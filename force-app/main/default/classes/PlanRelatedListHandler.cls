public with sharing class PlanRelatedListHandler {
    public PlanRelatedListHandler() 
    {

    }

    @AuraEnabled(cacheable=true)
    public static Map<Auto_Recomandation__c, List<Recommended_Action__c>> getPlanRelatedLists(String planId) 
    {
        //console.log('getPlanRelatedLists called');

        Map<Auto_Recomandation__c, List<Recommended_Action__c>> childToSubChildMap = new Map<Auto_Recomandation__c, List<Recommended_Action__c>>();

        List<Auto_Recomandation__c> childRecords = [SELECT Id,Name,Statement_Category__c, Statement_Main_Catergory__c, Status__c, (SELECT Id, Name, Action__c, Other_Data__c, Chosen__c FROM Recommended_Actions__r) FROM Auto_Recomandation__c WHERE Auto_Settlement_Plan__c = 'a33Aw0000000QVZIA2'];

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
}