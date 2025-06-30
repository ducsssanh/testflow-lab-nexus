
import { useState, useEffect } from 'react';
import { Assignment, TestingStandardSection } from '@/types/lims';

interface UseStandardsDataReturn {
  standardSections: TestingStandardSection[];
  setStandardSections: (sections: TestingStandardSection[]) => void;
  loadStandardsData: () => Promise<void>;
}

export const useStandardsData = (assignment: Assignment): UseStandardsDataReturn => {
  const [standardSections, setStandardSections] = useState<TestingStandardSection[]>([]);

  const getStandardSectionTitle = (standard: string): string => {
    // TODO: REPLACE WITH REAL API CALL
    // API_INTEGRATION: Get section titles from database
    // GET /api/v1/testing-standards/${standard}/info
    const standardTitles: Record<string, string> = {
      'QCVN101:2020': 'National Technical Regulation on Safety Requirements for Information Technology Equipment',
      'QCVN101:2020+IEC': 'QCVN101:2020 with IEC 62133-2:2017 Battery Safety Standards',
      'IEC62133': 'IEC 62133 - Secondary cells and batteries safety requirements',
    };
    
    return standardTitles[standard] || `${standard} Testing Requirements`;
  };

  const loadStandardsData = async () => {
    // TODO: REPLACE WITH REAL API CALLS
    // API_INTEGRATION: Replace with actual standards loading
    // GET /api/v1/testing-standards?sampleType=${assignment.sampleType}&standards=${assignment.testingRequirements.join(',')}
    // const response = await fetch(`/api/v1/testing-standards?sampleType=${assignment.sampleType}&standards=${assignment.testingRequirements.join(',')}`);
    // const standardsData = await response.json();
    // setStandardSections(standardsData.sections);

    // Mock standards data based on testing requirements
    const mockStandardSections: TestingStandardSection[] = assignment.testingRequirements.map((standard, index) => ({
      id: `standard-${index}`,
      standardName: standard,
      sectionTitle: getStandardSectionTitle(standard),
      isExpanded: index === 0, // First standard expanded by default
      criteria: [
        {
          id: `${standard}-c1`,
          name: 'Voltage Test',
          unit: 'V',
          attempts: [],
          result: null,
          children: [
            {
              id: `${standard}-c1.1`,
              name: 'Open Circuit Voltage',
              unit: 'V',
              attempts: [],
              result: null,
              parentId: `${standard}-c1`,
            },
            {
              id: `${standard}-c1.2`,
              name: 'Load Voltage',
              unit: 'V',
              attempts: [],
              result: null,
              parentId: `${standard}-c1`,
            },
          ],
        },
        {
          id: `${standard}-c2`,
          name: 'Capacity Test',
          unit: 'mAh',
          attempts: [],
          result: null,
        },
      ],
    }));

    setStandardSections(mockStandardSections);
  };

  useEffect(() => {
    loadStandardsData();
  }, [assignment]);

  return {
    standardSections,
    setStandardSections,
    loadStandardsData,
  };
};
