import { TestingCriterion, TableColumnDefinition, TableRowData } from '@/types/lims';

interface ApiSection {
  id: number;
  name: string;
  templateId: number;
  parentId: number | null;
  level: number;
  orderIndex: number;
  passed: boolean | null;
  supplementaryInfo: string | null;
  isActive: boolean;
  rows: Array<{
    id: number;
    subHeader: string | null;
    orderIndex: number;
    values: Array<{
      id: number;
      value: string;
      collumnId: number;
    }>;
  }>;
  values: Array<{
    id: number;
    value: string;
  }>;
}

/**
 * Transforms a single API section into a TestingCriterion object
 */
export const transformSectionToCriterion = (section: ApiSection): TestingCriterion => {
  // Conditionally define table columns based on section name
  const columns = getColumnsForSection(section.name);
  
  // Process rows
  const processedRows = processRows(section.rows, section.name);
  
  return {
    id: section.id.toString(),
    name: section.name,
    sectionNumber: `Ref: ${section.level}.${section.orderIndex}`,
    result: section.passed === true ? 'Pass' as const : section.passed === false ? 'Fail' as const : null,
    tableStructure: {
      columns: columns,
      rowTemplate: {
        modelPrefix: getModelPrefix(section.name),
        modelCount: processedRows.length || 1
      }
    },
    tableData: {
      rows: processedRows
    },
    supplementaryInfo: {
      notes: section.supplementaryInfo ? [section.supplementaryInfo] : ['No fire, no explosion, no leakage.'],
      defaultNotes: [],
      testingTime: '',
      tester: '',
      equipment: 'PSI.TB-'
    }
  };
};

/**
 * Get column definitions based on section name
 */
const getColumnsForSection = (sectionName: string): TableColumnDefinition[] => {
  if (sectionName.includes('Continuous charge')) {
    return [
      { id: '16', header: 'Model', type: 'readonly', width: '120px' },
      { id: '17', header: 'Recommended charging voltage Vc, (Vdc)', type: 'text', width: '180px' },
      { id: '18', header: 'Recommended charging current Irec, (mA)', type: 'text', width: '180px' },
      { id: '19', header: 'OCV at start of test, (Vdc)', type: 'text', width: '160px' },
      { id: '20', header: 'Results', type: 'text', width: '100px' }
    ];
  }
  
  if (sectionName.includes('External short circuit')) {
    return [
      { id: '22', header: 'Sample', type: 'readonly', width: '120px' },
      { id: '23', header: 'Ambient temperature (°C)', type: 'text', width: '160px' },
      { id: '24', header: 'OCV before test (V)', type: 'text', width: '150px' },
      { id: '25', header: 'Resistance of external circuit (mΩ)', type: 'text', width: '180px' },
      { id: '26', header: 'Maximum case temperature (°C)', type: 'text', width: '180px' },
      { id: '27', header: 'Results', type: 'text', width: '100px' }
    ];
  }
  
  if (sectionName.includes('Thermal abuse')) {
    return [
      { id: '31', header: 'Model', type: 'readonly', width: '120px' },
      { id: '32', header: 'Results', type: 'text', width: '150px' },
      { id: '33', header: 'Model', type: 'readonly', width: '120px' },
      { id: '34', header: 'Results', type: 'text', width: '150px' }
    ];
  }
  
  // Default fallback - use first row as headers if available
  return [
    { id: '1', header: 'Model', type: 'readonly', width: '120px' },
    { id: '2', header: 'Value', type: 'text', width: '150px' }
  ];
};

/**
 * Process API rows into TableRowData objects
 */
const processRows = (apiRows: ApiSection['rows'], sectionName: string): TableRowData[] => {
  if (!apiRows || apiRows.length === 0) return [];
  
  const processedRows: TableRowData[] = [];
  
  // Skip the first row if it contains headers (orderIndex = 1)
  const dataRows = apiRows.filter(row => row.orderIndex > 1);
  
  dataRows.forEach(row => {
    // Check for sub-headers
    const firstValue = row.values[0]?.value || '';
    if (isSubheader(firstValue)) {
      processedRows.push({
        id: `subheader-${row.id}`,
        model: firstValue,
        values: {},
        isSubheader: true
      } as TableRowData & { isSubheader: boolean });
      return;
    }
    
    // Handle special Thermal Abuse rows
    if (sectionName.includes('Thermal abuse')) {
      const rowValues: Record<string, string> = {};
      let model = '';
      
      row.values.forEach((val, index) => {
        const columnId = val.collumnId?.toString() || (index + 31).toString();
        if (index === 0) {
          model = val.value;
        }
        rowValues[columnId] = val.value;
      });
      
      processedRows.push({
        id: row.id.toString(),
        model: model,
        values: rowValues
      });
      return;
    }
    
    // Process normal data rows
    const rowValues: Record<string, string> = {};
    let model = '';
    
    row.values.forEach((val) => {
      const columnId = val.collumnId?.toString() || val.id.toString();
      if (val.collumnId === 16 || val.collumnId === 22 || val.collumnId === 31) { // Model columns
        model = val.value;
      }
      rowValues[columnId] = val.value;
    });
    
    processedRows.push({
      id: row.id.toString(),
      model: model || `${getModelPrefix(sectionName)}${row.orderIndex.toString().padStart(2, '0')}`,
      values: rowValues
    });
  });
  
  return processedRows;
};

/**
 * Check if a value represents a sub-header
 */
const isSubheader = (value: string): boolean => {
  const subheaderPatterns = [
    'Samples charged at',
    'Test conditions',
    'Temperature',
    'Procedure'
  ];
  
  return subheaderPatterns.some(pattern => value.includes(pattern));
};

/**
 * Get model prefix based on section name
 */
const getModelPrefix = (sectionName: string): string => {
  if (sectionName.includes('Continuous charge')) return 'C#';
  if (sectionName.includes('External short circuit')) return 'S#';
  if (sectionName.includes('Thermal abuse')) return 'T#';
  return 'R#';
};