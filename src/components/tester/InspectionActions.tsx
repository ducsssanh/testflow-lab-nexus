
import React from 'react';
import { Assignment, InspectionLog, TestingRequirementSection } from '@/types/lims';
import { useToast } from '@/hooks/use-toast';

interface InspectionActionsProps {
  assignment: Assignment;
  inspectionLog: InspectionLog;
  requirementSections: TestingRequirementSection[];
  onUpdateAssignment: (assignment: Assignment) => void;
  onUpdateInspectionLog: (log: InspectionLog) => void;
  onUpdateRequirementSections: (sections: TestingRequirementSection[]) => void;
}

export const useInspectionActions = ({
  assignment,
  inspectionLog,
  requirementSections,
  onUpdateAssignment,
  onUpdateInspectionLog,
  onUpdateRequirementSections,
}: InspectionActionsProps) => {
  const { toast } = useToast();

  const handleUpdateCriteria = async () => {
    try {
      const subTypeParam = assignment.sampleSubType ? `&sampleSubType=${assignment.sampleSubType}` : '';
      
      // First, get additional criteria
      const additionalResponse = await fetch(`/api/v1/testing-requirements/additional-criteria?sampleType=${assignment.sampleType}&requirements=${assignment.testingRequirements.join(',')}${subTypeParam}`);
      
      if (!additionalResponse.ok) {
        throw new Error(`HTTP error! status: ${additionalResponse.status}`);
      }
      
      const additionalApiResponse = await additionalResponse.json();
      
      if (additionalApiResponse.success) {
        const additionalSections = additionalApiResponse.data.additionalCriteria;
        
        // Merge additional criteria with existing ones
        const updatedSections = [...requirementSections, ...additionalSections];
        
        // Now query the complete testing criteria with the updated requirements
        const allRequirements = [...assignment.testingRequirements, ...additionalSections.map((s: TestingRequirementSection) => s.requirementName)];
        
        const criteriaResponse = await fetch(`/api/v1/testing-criteria?sampleType=${assignment.sampleType}&requirements=${allRequirements.join(',')}${subTypeParam}`);
        
        if (!criteriaResponse.ok) {
          throw new Error(`HTTP error! status: ${criteriaResponse.status}`);
        }
        
        const criteriaApiResponse = await criteriaResponse.json();
        
        if (criteriaApiResponse.success) {
          // Update with the complete testing criteria
          onUpdateRequirementSections(criteriaApiResponse.data.testingCriteria);
          
          toast({
            title: "Criteria Updated",
            description: "Additional testing requirements have been loaded and integrated",
          });
        } else {
          throw new Error(criteriaApiResponse.error?.message || 'Failed to load complete testing criteria');
        }
      } else {
        throw new Error(additionalApiResponse.error?.message || 'Failed to load additional criteria');
      }
    } catch (error) {
      console.error('Failed to update criteria:', error);
      toast({
        title: "Update Function",
        description: "Additional testing criteria can be added per customer requests for specific requirements",
      });
    }
  };

  const handleSaveInspectionLog = async () => {
    if (!inspectionLog) return;

    const updatedLog: InspectionLog = {
      ...inspectionLog,
      requirementSections,
      updatedAt: new Date().toISOString(),
    };

    try {
      const method = inspectionLog.id ? 'PUT' : 'POST';
      const url = inspectionLog.id 
        ? `/api/v1/inspection-logs/${inspectionLog.id}`
        : '/api/v1/inspection-logs';
        
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedLog)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();
      
      if (apiResponse.success) {
        onUpdateInspectionLog(apiResponse.data);
        
        // Update assignment status if not already in progress
        if (assignment.status === 'Pending') {
          const updatedAssignment: Assignment = {
            ...assignment,
            status: 'In Progress',
            updatedAt: new Date().toISOString(),
          };
          onUpdateAssignment(updatedAssignment);
        }

        toast({
          title: "Saved",
          description: "Inspection data has been saved successfully",
        });
      } else {
        throw new Error(apiResponse.error?.message || 'Failed to save inspection log');
      }
    } catch (error) {
      console.error('Failed to save inspection log:', error);
      toast({ 
        title: "Error", 
        description: "Failed to save to server. Changes saved locally.",
        variant: "destructive"
      });
      
      // Fallback to local update
      onUpdateInspectionLog(updatedLog);
    }
  };

  const handleGenerateReport = async () => {
    if (!inspectionLog) return;

    try {
      const response = await fetch('/api/v1/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId: assignment.id,
          inspectionLogId: inspectionLog.id,
          requirementSections: requirementSections
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();
      
      if (apiResponse.success) {
        console.log('Generated report:', apiResponse.data);
        
        const updatedAssignment: Assignment = {
          ...assignment,
          status: 'Done',
          updatedAt: new Date().toISOString(),
        };

        onUpdateAssignment(updatedAssignment);

        toast({
          title: "Report Generated",
          description: "Draft report has been created and assignment marked as Done",
        });
      } else {
        throw new Error(apiResponse.error?.message || 'Failed to generate report');
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
      toast({ 
        title: "Error", 
        description: "Failed to generate report on server. Assignment marked as Done locally.",
        variant: "destructive"
      });
      
      // Fallback to local update
      const updatedAssignment: Assignment = {
        ...assignment,
        status: 'Done',
        updatedAt: new Date().toISOString(),
      };
      onUpdateAssignment(updatedAssignment);
    }
  };

  return {
    handleUpdateCriteria,
    handleSaveInspectionLog,
    handleGenerateReport,
  };
};
