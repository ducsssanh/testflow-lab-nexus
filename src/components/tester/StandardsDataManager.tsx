
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

  // Helper function to map API response to TestingRequirementSection structure
  const mapApiResponseToRequirementSections = (templates: any[]): TestingRequirementSection[] => {
    return templates.map((template, index) => ({
      id: template.id.toString(),
      requirementName: template.code,
      sectionTitle: template.description || template.name,
      criteria: mapSectionsToTestingCriteria(template.sections)
    }));
  };

  // Helper function to map API sections to TestingCriterion structure
  const mapSectionsToTestingCriteria = (sections: any[]): TestingCriterion[] => {
    return sections.map(section => ({
      id: section.id.toString(),
      name: `Section ${section.orderIndex}`,
      sectionNumber: `${section.level}.${section.orderIndex}`,
      tableStructure: {
        columns: mapColumnsToTableColumnDefinition(section.columns),
        rowTemplate: {
          modelPrefix: 'S#',
          modelCount: section.rows.length || 1
        }
      },
      tableData: {
        rows: section.rows.map((row: any, index: number) => ({
          id: row.id.toString(),
          model: `S#${(index + 1).toString().padStart(2, '0')}`,
          values: mapRowValuesToRecord(row.values, section.columns)
        }))
      },
      result: section.passed,
      supplementaryInfo: {
        notes: section.supplementaryInfo ? [section.supplementaryInfo] : [],
        testingTime: '',
        tester: '',
        equipment: ''
      }
    }));
  };

  // Helper function to map API columns to TableColumnDefinition
  const mapColumnsToTableColumnDefinition = (columns: any[]): TableColumnDefinition[] => {
    const baseColumns: TableColumnDefinition[] = [
      { 
        id: 'model', 
        header: 'Model', 
        type: 'readonly' as const
      }
    ];

    const dataColumns = columns.map((col, index) => ({
      id: `col_${col.id}`,
      header: `Column ${col.orderIndex || index + 1}`,
      type: 'text' as const,
      placeholder: 'Enter value'
    }));

    return [...baseColumns, ...dataColumns];
  };

  // Helper function to map row values to Record format
  const mapRowValuesToRecord = (values: any[], columns: any[]): Record<string, string> => {
    const result: Record<string, string> = {};
    
    values.forEach((val, index) => {
      const columnId = `col_${columns[index]?.id || index}`;
      result[columnId] = val.value || '';
    });
    
    return result;
  };

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
    try {
      // Gọi API thật để lấy testing criteria templates
      // Sử dụng sampleType làm productTypeId và testingRequirements[0] làm requirementId
      const productTypeId = getProductTypeId(assignment.sampleType);
      const requirementId = getRequirementId(assignment.testingRequirements[0]);
      
      const response = await fetch(`/api/templates/by-product-type-and-requirement?productTypeId=${productTypeId}&requirementId=${requirementId}`, {
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
      
      if (apiResponse.status === 'success') {
        // Map API response structure sang TestingRequirementSection structure
        const mappedSections = mapApiResponseToRequirementSections(apiResponse.data.templates);
        setRequirementSections(mappedSections);
      } else {
        throw new Error('API response status not success');
      }
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
