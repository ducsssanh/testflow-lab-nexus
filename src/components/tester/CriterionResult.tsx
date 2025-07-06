
import { TestingCriterion } from '@/types/lims';

export const calculateResult = (criterion: TestingCriterion): 'Pass' | 'Fail' | 'N/A' => {
  if (!criterion.tableData?.rows) return 'N/A';
  
  const resultColumn = criterion.tableStructure.columns.find(col => 
    col.header.toLowerCase().includes('result') || col.id === 'results'
  );
  if (!resultColumn) return 'N/A';
  
  const results = criterion.tableData.rows.map(row => row.values[resultColumn.id]);
  const hasValues = results.some(result => result && result.trim() !== '' && result !== 'N/A');
  
  if (!hasValues) return 'N/A';
  
  const hasFailure = results.some(result => result === 'Fail');
  if (hasFailure) return 'Fail';
  
  const allPass = results.every(result => result === 'Pass' || result === '' || result === 'N/A');
  return allPass ? 'Pass' : 'N/A';
};
