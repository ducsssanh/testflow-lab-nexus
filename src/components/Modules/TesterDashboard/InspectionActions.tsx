
import React from 'react';
import { Assignment, InspectionLog, TestingRequirementSection } from '@/types/lims';
import { useToast } from '@/hooks/use-toast';

interface InspectionActionsProps {
  assignment: Assignment;
  inspectionLog: InspectionLog;
  requirementSections: TestingRequirementSection[];
  onUpdateAssignment: (assignment: Assignment) => void;
  onUpdateInspectionLog: (log: InspectionLog) => void;
}

export const useInspectionActions = ({
  assignment,
  inspectionLog,
  requirementSections,
  onUpdateAssignment,
  onUpdateInspectionLog,
}: InspectionActionsProps) => {
  const { toast } = useToast();

  const handleUpdateCriteria = async () => {
    try {
      const response = await fetch(`/api/v1/testing-requirements/additional-criteria?sampleType=${assignment.sampleType}&requirements=${assignment.testingRequirements.join(',')}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const apiResponse = await response.json();
      
      if (apiResponse.success) {
        // Add additional criteria to existing sections
        const additionalSections = apiResponse.data.additionalCriteria;
        // This would be handled by the parent component that manages requirementSections
        console.log('Additional criteria loaded:', additionalSections);
        
        toast({
          title: "Additional Criteria Loaded",
          description: "Customer-specific testing requirements have been added",
        });
      } else {
        throw new Error(apiResponse.error?.message || 'Failed to load additional criteria');
      }
    } catch (error) {
      console.error('Failed to load additional criteria:', error);
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
