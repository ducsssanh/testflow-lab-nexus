import { TestingRequirementSection } from '@/types/lims';

interface ApiTemplate {
  id: number;
  productTypeId: number;
  name: string;
  code: string;
  description: string;
  reportType: string;
  unitPrice: number;
  isActive: boolean;
  templateRequirements: Array<{
    id: number;
    templateId: number;
    requirementId: number;
  }>;
  sections: Array<{
    id: number;
    templateId: number;
    parentId: number | null;
    level: number;
    orderIndex: number;
    passed: boolean | null;
    supplementaryInfo: string | null;
    rows: Array<{
      id: number;
      subHeader: string | null;
      orderIndex: number;
      values: Array<{
        id: number;
        value: string;
      }>;
    }>;
    columns: Array<{
      id: number;
      orderIndex: number;
      values: Array<{
        id: number;
        value: string;
      }>;
    }>;
    values: Array<{
      id: number;
      value: string;
    }>;
  }>;
}

interface ApiResponse {
  status: string;
  data: {
    templates: ApiTemplate[];
  };
}

export const fetchTestingCriteria = async (productTypeId: string, requirementIds: string[]): Promise<TestingRequirementSection[]> => {
  console.log('Fetching testing criteria for:', { productTypeId, requirementIds });

  try {
    // Call API for each requirement
    const fetchPromises = requirementIds.map(async (requirementId) => {
      const response = await fetch(
        `/api/templates/by-product-type-and-requirement?productTypeId=${encodeURIComponent(productTypeId)}&requirementId=${encodeURIComponent(requirementId)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('limsToken')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const apiResponse: ApiResponse = await response.json();
      console.log(`API response for requirement ${requirementId}:`, apiResponse);

      if (apiResponse.status !== 'success' || !apiResponse.data.templates) {
        throw new Error('Invalid API response structure');
      }

      return { requirementId, templates: apiResponse.data.templates };
    });

    const results = await Promise.all(fetchPromises);
    console.log('All API results:', results);

    // Transform API response to TestingRequirementSection format
    const requirementSections: TestingRequirementSection[] = results.map(({ requirementId, templates }) => {
      // Use the first template for now (can be enhanced later)
      const template = templates[0];
      
      return {
        id: requirementId,
        requirementName: template?.name || `Requirement ${requirementId}`,
        sectionTitle: template?.description || template?.name || `Section ${requirementId}`,
        criteria: template?.sections?.flatMap(section => 
          section.rows.map(row => ({
            id: row.id.toString(),
            name: row.subHeader || `Criterion ${row.orderIndex}`,
            sectionNumber: `${section.orderIndex}.${row.orderIndex}`,
            description: row.values.map(v => v.value).join(', '),
            result: null,
            notes: '',
            subHeader: row.subHeader,
            orderIndex: row.orderIndex,
            values: row.values,
            tableStructure: {
              columns: section.columns.map(col => ({
                id: col.id.toString(),
                header: col.values.map(v => v.value).join(' '),
                type: 'text' as const,
                width: '150px'
              })),
              rowTemplate: {
                modelPrefix: 'R#',
                modelCount: section.rows.length
              }
            },
            tableData: {
              rows: [{
                id: row.id.toString(),
                model: `R#${row.orderIndex.toString().padStart(2, '0')}`,
                values: {}
              }]
            }
          }))
        ) || []
      };
    });

    console.log('Transformed requirement sections:', requirementSections);
    return requirementSections;

  } catch (error) {
    console.error('Failed to fetch testing criteria:', error);
    throw error;
  }
};