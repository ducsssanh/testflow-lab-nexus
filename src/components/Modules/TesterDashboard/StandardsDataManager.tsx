
import { useState, useEffect } from 'react';
import { Assignment, TestingStandardSection, CriterionTableData } from '@/types/lims';

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

  const createMockTableData = (criterionName: string): CriterionTableData => {
    // Mock data structure matching the image format
    return {
      sectionNumber: "2.6.1.1/7.2.1",
      title: "Continuous charge at constant voltage (cells)",
      columns: [
        { id: 'model', header: 'Model', type: 'readonly' },
        { id: 'voltage', header: 'Recommended charging voltage Vcc (Vdc)', type: 'text' },
        { id: 'current', header: 'Recommended charging current Irec (mA)', type: 'text' },
        { id: 'ocv', header: 'OCV at start of test, (Vdc)', type: 'text' },
        { id: 'results', header: 'Results', type: 'select', options: ['Pass', 'Fail', 'N/A'] }
      ],
      rows: [
        { id: 'row1', model: 'C#01', values: {} },
        { id: 'row2', model: 'C#02', values: {} },
        { id: 'row3', model: 'C#03', values: {} },
        { id: 'row4', model: 'C#04', values: {} },
        { id: 'row5', model: 'C#05', values: {} }
      ]
    };
  };

  const loadStandardsData = async () => {
    // TODO: REPLACE WITH REAL API CALLS
    // API_INTEGRATION: Replace with actual standards loading
    // GET /api/v1/testing-standards?sampleType=${assignment.sampleType}&standards=${assignment.testingRequirements.join(',')}
    // Expected API response format should match the new CriterionTableData structure

    // Mock standards data based on testing requirements with new structure
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
          tableData: createMockTableData('Voltage Test'),
          result: null,
          supplementaryInfo: {
            notes: ['No fire, no explosion, no leakage'],
            testingTime: '',
            tester: '',
            equipment: 'PSI.TB-'
          }
        },
        {
          id: `${standard}-c2`,
          name: 'Capacity Test',
          unit: 'mAh',
          tableData: {
            ...createMockTableData('Capacity Test'),
            title: 'Capacity discharge test',
            sectionNumber: "2.6.1.2/7.2.2"
          },
          result: null,
          supplementaryInfo: {
            notes: ['No fire, no explosion, no leakage'],
            testingTime: '',
            tester: '',
            equipment: 'PSI.TB-'
          }
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
