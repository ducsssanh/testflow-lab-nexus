/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from 'react';
import { Assignment, InspectionLog } from '@/types/lims';

interface UseInspectionLogReturn {
  inspectionLog: InspectionLog | null;
  setInspectionLog: (log: InspectionLog) => void;
  loadExistingLog: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

// Filter function to remove manufacturer field from sample info
const filterSampleInfo = (sampleInfo: Record<string, any>): Record<string, any> => {
  const { manufacturer, ...filteredInfo } = sampleInfo;
  return filteredInfo;
};

export const useInspectionLog = (assignment: Assignment): UseInspectionLogReturn => {
  const [inspectionLog, setInspectionLog] = useState<InspectionLog | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadExistingLog = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/inspection-logs?assignmentId=${assignment.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('limsToken')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const apiResponse = await response.json();
      
      if (apiResponse.success) {
        // Filter out manufacturer information for testers
        const existingLog = {
          ...apiResponse.data,
          sampleInfo: filterSampleInfo(apiResponse.data.sampleInfo || {})
        };
        setInspectionLog(existingLog);
      } else {
        throw new Error(apiResponse.error?.message || 'Failed to load inspection log');
      }
    } catch (error) {
      console.error('Failed to load existing log:', error);
      setError(error instanceof Error ? error.message : 'Failed to load inspection log');
      
      // Create new log if none exists or failed to load
      const newLog: InspectionLog = {
        id: Date.now().toString(),
        assignmentId: assignment.id,
        sampleSymbol: assignment.sampleCode,
        testingRequirements: assignment.testingRequirements,
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
    } finally {
      setLoading(false);
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
    loading,
    error,
  };
};
