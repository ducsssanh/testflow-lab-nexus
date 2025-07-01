import { useState, useEffect } from 'react';
import { Assignment, InspectionLog } from '@/types/lims';

interface UseInspectionLogReturn {
  inspectionLog: InspectionLog | null;
  setInspectionLog: (log: InspectionLog) => void;
  loadExistingLog: () => Promise<void>;
}

// Filter function to remove manufacturer field from sample info
const filterSampleInfo = (sampleInfo: Record<string, any>): Record<string, any> => {
  const { manufacturer, ...filteredInfo } = sampleInfo;
  return filteredInfo;
};

export const useInspectionLog = (assignment: Assignment): UseInspectionLogReturn => {
  const [inspectionLog, setInspectionLog] = useState<InspectionLog | null>(null);

  const loadExistingLog = async () => {
    // TODO: REPLACE WITH REAL API CALL
    // API_INTEGRATION: Replace with actual inspection log loading
    // GET /api/v1/inspection-logs?assignmentId=${assignment.id}
    // const response = await fetch(`/api/v1/inspection-logs?assignmentId=${assignment.id}`);
    // if (response.ok) {
    //   const existingLog = await response.json();
    //   // Filter out manufacturer information for testers
    //   existingLog.sampleInfo = filterSampleInfo(existingLog.sampleInfo);
    //   setInspectionLog(existingLog);
    // } else {
    //   // Create new log if none exists
    //   const newLog = { ... };
    //   setInspectionLog(newLog);
    // }

    // For now, create a new one if none exists
    if (!inspectionLog) {
      const newLog: InspectionLog = {
        id: Date.now().toString(),
        assignmentId: assignment.id,
        sampleSymbol: assignment.sampleCode,
        testingRequirements: assignment.testingRequirements, // Using consistent naming
        testSample: assignment.testSample,
        testingDate: new Date().toISOString().split('T')[0],
        sampleInfo: {}, // Initialize with empty object - no manufacturer info
        testingCriteria: [], // Legacy field - will be migrated to requirementSections
        requirementSections: [], // NEW: Will be populated from API based on testingRequirements
        status: 'Draft',
        createdBy: 'current-user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setInspectionLog(newLog);
    }
  };

  // Override setInspectionLog to filter manufacturer info
  const setFilteredInspectionLog = (log: InspectionLog) => {
    const filteredLog = {
      ...log,
      sampleInfo: filterSampleInfo(log.sampleInfo)
    };
    setInspectionLog(filteredLog);
  };

  useEffect(() => {
    loadExistingLog();
  }, [assignment]);

  return {
    inspectionLog,
    setInspectionLog: setFilteredInspectionLog,
    loadExistingLog,
  };
};
