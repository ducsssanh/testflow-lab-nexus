
import { useState, useEffect } from 'react';
import { Assignment, TestingRequirementSection, TestingCriterion, TableData, TableRowData, TableColumnDefinition } from '@/types/lims';

interface UseRequirementsDataReturn {
  requirementSections: TestingRequirementSection[];
  setRequirementSections: (sections: TestingRequirementSection[]) => void;
  loadRequirementsData: () => Promise<void>;
}

export const useRequirementsData = (assignment: Assignment): UseRequirementsDataReturn => {
  const [requirementSections, setRequirementSections] = useState<TestingRequirementSection[]>([]);

  // Helper function to map sampleType to productTypeId
  const getProductTypeId = (sampleType: string): number => {
    const mapping: Record<string, number> = {
      'Lithium Battery': 1,
      'ITAV Adapter': 2,
      'ITAV Desktop': 3,
      'ITAV Laptop+Tablet': 4,
      'ITAV TV': 5,
    };
    return mapping[sampleType] || 1;
  };

  // Helper function to map testingRequirement to requirementId
  const getRequirementId = (requirement: string): number => {
    const mapping: Record<string, number> = {
      'QCVN101:2020': 1,
      'QCVN101:2020+IEC': 2,
      'IEC62133': 3,
    };
    return mapping[requirement] || 1;
  };

  const loadRequirementsData = async () => {
    try {
      console.log('Loading requirements data for assignment:', assignment);
      
      // Gọi API thật để lấy testing criteria templates
      const productTypeId = getProductTypeId(assignment.sampleType);
      const requirementIds = assignment.testingRequirements.map(req => getRequirementId(req));
      
      console.log('API params:', { productTypeId, requirementIds, sampleType: assignment.sampleType });
      
      // Fetch data cho từng requirement
      const fetchPromises = requirementIds.map(async (requirementId) => {
        const url = `/api/templates/by-product-type-and-requirement?productTypeId=${productTypeId}&requirementId=${requirementId}`;
        console.log('Fetching from URL:', url);
        
        const response = await fetch(url, {
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
        console.log('API response for requirement', requirementId, ':', apiResponse);
        
        return { requirementId, apiResponse };
      });

      const results = await Promise.all(fetchPromises);
      
      // Process all results
      const allSections: TestingRequirementSection[] = [];
      
        results.forEach(({ requirementId, apiResponse }) => {
        if (apiResponse.status === 'success' && apiResponse.data.templates) {
          apiResponse.data.templates.forEach((template: any) => {
            const section: TestingRequirementSection = {
              id: `${requirementId}-${template.id}`,
              requirementName: template.name || template.code,
              sectionTitle: template.description || template.name,
              criteria: template.sections?.map((section: any) => {
                // Parse rows structure - first row contains headers, subsequent rows contain data
                const headerRow = section.rows?.find((row: any) => row.orderIndex === 1);
                const dataRows = section.rows?.filter((row: any) => row.orderIndex > 1) || [];
                
                // Build columns from header row values
                const columns = headerRow?.values?.map((val: any) => ({
                  id: val.collumnId.toString(),
                  header: val.value,
                  type: val.value === 'Model' ? 'readonly' as const : 'text' as const,
                  width: val.value === 'Model' ? '120px' : '150px'
                })) || [];
                
                // Build table data from data rows
                const tableRows = dataRows.map((row: any) => {
                  const rowValues: Record<string, string> = {};
                  let model = '';
                  
                  row.values?.forEach((val: any) => {
                    const columnId = val.collumnId.toString();
                    if (columns.find(col => col.id === columnId && col.header === 'Model')) {
                      model = val.value;
                    } else {
                      rowValues[columnId] = val.value;
                    }
                  });
                  
                  return {
                    id: row.id.toString(),
                    model: model,
                    values: rowValues
                  };
                });

                return {
                  id: section.id.toString(),
                  name: section.name,
                  sectionNumber: `${section.level}.${section.orderIndex}.1/${section.level + 1}.${section.orderIndex}.1`, // HARDCODED: Updated format to match image
                  result: section.passed === true ? 'Pass' as const : section.passed === false ? 'Fail' as const : null,
                  tableStructure: {
                    columns: columns,
                    rowTemplate: {
                      modelPrefix: 'C#',
                      modelCount: dataRows.length || 1
                    }
                  },
                  tableData: {
                    rows: tableRows
                  },
                  supplementaryInfo: {
                    notes: ['No fire, no explosion, no leakage'], // HARDCODED: API không có trường này
                    defaultNotes: [],
                    testingTime: '', // HARDCODED: API không có trường này
                    tester: '', // HARDCODED: API không có trường này  
                    equipment: 'PSI.TB-' // HARDCODED: API không có trường này
                  }
                };
              }) || []
            };
            allSections.push(section);
          });
        }
      });
      
      console.log('Final processed sections:', allSections);
      setRequirementSections(allSections);
      
    } catch (error) {
      console.error('Failed to load testing criteria:', error);
      setRequirementSections([]);
    }
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
