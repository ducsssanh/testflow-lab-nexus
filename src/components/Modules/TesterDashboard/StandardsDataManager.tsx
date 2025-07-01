
import { useState, useEffect } from 'react';
import { Assignment, TestingRequirementSection, TestingCriterion, TableData, TableRowData, TableColumnDefinition } from '@/types/lims';

interface UseRequirementsDataReturn {
  requirementSections: TestingRequirementSection[];
  setRequirementSections: (sections: TestingRequirementSection[]) => void;
  loadRequirementsData: () => Promise<void>;
}

export const useRequirementsData = (assignment: Assignment): UseRequirementsDataReturn => {
  const [requirementSections, setRequirementSections] = useState<TestingRequirementSection[]>([]);

  const generateTableData = (criterion: TestingCriterion): TableData => {
    const { rowTemplate } = criterion.tableStructure;
    const rows: TableRowData[] = [];

    if (rowTemplate.customModels) {
      // Use custom model names
      rowTemplate.customModels.forEach((model, index) => {
        rows.push({
          id: `row-${index + 1}`,
          model: model,
          values: {}
        });
      });
    } else {
      // Use prefix pattern
      for (let i = 1; i <= rowTemplate.modelCount; i++) {
        const modelNumber = i.toString().padStart(2, '0');
        rows.push({
          id: `row-${i}`,
          model: `${rowTemplate.modelPrefix}${modelNumber}`,
          values: {}
        });
      }
    }

    return { rows };
  };

  const loadRequirementsData = async () => {
    // TODO: REPLACE WITH REAL API CALL
    // API_INTEGRATION: Replace with actual testing criteria loading
    // GET /api/v1/testing-criteria?sampleType=${assignment.sampleType}&requirements=${assignment.testingRequirements.join(',')}&sampleSubType=${assignment.sampleSubType}
    
    try {
      const subTypeParam = assignment.sampleSubType ? `&sampleSubType=${assignment.sampleSubType}` : '';
      // const response = await fetch(`/api/v1/testing-criteria?sampleType=${assignment.sampleType}&requirements=${assignment.testingRequirements.join(',')}${subTypeParam}`);
      // const apiData = await response.json();
      // setRequirementSections(apiData.testingCriteria);

      // Mock API response structure - organized by testing requirements
      const mockApiResponse = {
        testingCriteria: assignment.testingRequirements.map((requirement, index) => ({
          id: `requirement-${index}`,
          requirementName: requirement, // This is the testing requirement name
          sectionTitle: getRequirementTitle(requirement),
          criteria: getCriteriaForRequirement(requirement, assignment.sampleType, assignment.sampleSubType)
        }))
      };

      // Generate table data for each criterion
      const processedSections = mockApiResponse.testingCriteria.map(section => ({
        ...section,
        criteria: section.criteria.map(criterion => ({
          ...criterion,
          tableData: generateTableData(criterion)
        }))
      }));

      setRequirementSections(processedSections);
    } catch (error) {
      console.error('Failed to load testing criteria:', error);
    }
  };

  const getRequirementTitle = (requirement: string): string => {
    // TODO: REPLACE WITH REAL API CALL
    // API_INTEGRATION: Get requirement titles from database
    const requirementTitles: Record<string, string> = {
      'QCVN101:2020': 'National Technical Regulation on Safety Requirements for Information Technology Equipment',
      'QCVN101:2020+IEC': 'QCVN101:2020 with IEC 62133-2:2017 Battery Safety Requirements',
      'IEC62133': 'IEC 62133 - Secondary cells and batteries safety requirements',
    };
    
    return requirementTitles[requirement] || `${requirement} Testing Requirements`;
  };

  const getCriteriaForRequirement = (requirement: string, sampleType: string, sampleSubType?: string): TestingCriterion[] => {
    // TODO: REPLACE WITH REAL API CALL
    // API_INTEGRATION: Get criteria based on requirement, sample type, and sample sub type from database
    
    // Mock criteria based on requirement, sample type, and sample sub type
    const baseCriteria = [
      {
        id: `${requirement}-continuous-charge`,
        name: 'Continuous charge at constant voltage',
        sectionNumber: '2.6.1.1/7.2.1',
        tableStructure: {
          columns: [
            { 
              id: 'model', 
              header: 'Model', 
              type: 'readonly' as const
            },
            { 
              id: 'voltage', 
              header: 'Recommended charging voltage Vcc (Vdc)', 
              type: 'number' as const,
              unit: 'V',
              placeholder: 'Enter voltage'
            },
            { 
              id: 'current', 
              header: 'Recommended charging current Irec (mA)', 
              type: 'number' as const,
              unit: 'mA',
              placeholder: 'Enter current'
            },
            { 
              id: 'ocv', 
              header: 'OCV at start of test, (Vdc)', 
              type: 'number' as const,
              unit: 'V',
              placeholder: 'Enter OCV'
            },
            { 
              id: 'results', 
              header: 'Results', 
              type: 'select' as const, 
              options: ['Pass', 'Fail', 'N/A'],
              default: 'N/A'
            }
          ] as TableColumnDefinition[],
          rowTemplate: {
            modelPrefix: 'C#',
            modelCount: 5
          }
        },
        result: null,
        supplementaryInfo: {
          defaultNotes: ['No fire, no explosion, no leakage'],
          notes: ['No fire, no explosion, no leakage'],
          testingTime: '',
          tester: '',
          equipment: 'PSI.TB-'
        }
      }
    ];

    // Add sample-type and sub-type specific criteria
    if (sampleType === 'Lithium Battery') {
      if (sampleSubType === 'Cell') {
        baseCriteria.push({
          id: `${requirement}-cell-capacity-test`,
          name: 'Cell capacity discharge test',
          sectionNumber: '2.6.1.2/7.2.2',
          tableStructure: {
            columns: [
              { 
                id: 'model', 
                header: 'Model', 
                type: 'readonly' as const
              },
              { 
                id: 'capacity', 
                header: 'Measured Capacity (mAh)', 
                type: 'number' as const,
                unit: 'mAh',
                placeholder: 'Enter capacity'
              },
              { 
                id: 'discharge_time', 
                header: 'Discharge Time (hrs)', 
                type: 'number' as const,
                unit: 'hrs',
                placeholder: 'Enter time'
              },
              { 
                id: 'results', 
                header: 'Results', 
                type: 'select' as const, 
                options: ['Pass', 'Fail', 'N/A'],
                default: 'N/A'
              }
            ] as TableColumnDefinition[],
            rowTemplate: {
              modelPrefix: 'C#',
              modelCount: 5
            }
          },
          result: null,
          supplementaryInfo: {
            defaultNotes: ['No fire, no explosion, no leakage'],
            notes: ['No fire, no explosion, no leakage'],
            testingTime: '',
            tester: '',
            equipment: 'PSI.TB-'
          }
        });
      } else if (sampleSubType === 'Pack') {
        baseCriteria.push({
          id: `${requirement}-pack-integration-test`,
          name: 'Pack integration and BMS test',
          sectionNumber: '2.6.1.3/7.2.3',
          tableStructure: {
            columns: [
              { 
                id: 'model', 
                header: 'Model', 
                type: 'readonly' as const
              },
              { 
                id: 'pack_voltage', 
                header: 'Pack Voltage (V)', 
                type: 'number' as const,
                unit: 'V',
                placeholder: 'Enter pack voltage'
              },
              { 
                id: 'bms_status', 
                header: 'BMS Status', 
                type: 'select' as const,
                options: ['Normal', 'Alert', 'Fault'],
                default: 'Normal'
              },
              { 
                id: 'results', 
                header: 'Results', 
                type: 'select' as const, 
                options: ['Pass', 'Fail', 'N/A'],
                default: 'N/A'
              }
            ] as TableColumnDefinition[],
            rowTemplate: {
              modelPrefix: 'P#',
              modelCount: 3
            }
          },
          result: null,
          supplementaryInfo: {
            defaultNotes: ['BMS functioning properly', 'No pack imbalance'],
            notes: ['BMS functioning properly', 'No pack imbalance'],
            testingTime: '',
            tester: '',
            equipment: 'PSI.TB-'
          }
        });
      }
    }

    return baseCriteria as TestingCriterion[];
  };

  useEffect(() => {
    loadRequirementsData();
  }, [assignment]);

  return {
    requirementSections,
    setRequirementSections,
    loadRequirementsData,
  };
};
