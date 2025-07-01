
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { TestingCriterion } from '@/types/lims';
import SupplementaryInfo from './SupplementaryInfo';

interface CriterionTableProps {
  standardId: string;
  criterion: TestingCriterion;
  level: number;
  isExpanded: boolean;
  onToggleExpanded: (criteriaId: string) => void;
  onUpdateTableData: (standardId: string, criterionId: string, rowId: string, columnId: string, value: string) => void;
}

const CriterionTable: React.FC<CriterionTableProps> = ({
  standardId,
  criterion,
  level,
  isExpanded,
  onToggleExpanded,
  onUpdateTableData,
}) => {
  const hasChildren = criterion.children && criterion.children.length > 0;

  const calculateResult = (criterion: TestingCriterion): 'Pass' | 'Fail' | 'N/A' => {
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

  const renderInputField = (column: any, row: any) => {
    const value = row.values[column.id] || column.default || '';
    
    switch (column.type) {
      case 'select':
        return (
          <Select
            value={value}
            onValueChange={(newValue) => onUpdateTableData(standardId, criterion.id, row.id, column.id, newValue)}
          >
            <SelectTrigger className="border-0 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {column.options?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'readonly':
        return (
          <div className="text-center h-8 flex items-center justify-center">
            {value}
          </div>
        );
      
      case 'textarea':
        return (
          <Textarea
            className="border-0 text-center min-h-[32px] resize-none"
            placeholder={column.placeholder || ''}
            value={value}
            onChange={(e) => onUpdateTableData(standardId, criterion.id, row.id, column.id, e.target.value)}
          />
        );
      
      case 'number':
        return (
          <Input
            type="number"
            className="border-0 text-center h-8"
            placeholder={column.placeholder || ''}
            value={value}
            min={column.validation?.min}
            max={column.validation?.max}
            onChange={(e) => onUpdateTableData(standardId, criterion.id, row.id, column.id, e.target.value)}
          />
        );
      
      case 'date':
        return (
          <Input
            type="date"
            className="border-0 text-center h-8"
            value={value}
            onChange={(e) => onUpdateTableData(standardId, criterion.id, row.id, column.id, e.target.value)}
          />
        );
      
      default: // text
        return (
          <Input
            className="border-0 text-center h-8"
            placeholder={column.placeholder || ''}
            value={value}
            onChange={(e) => onUpdateTableData(standardId, criterion.id, row.id, column.id, e.target.value)}
          />
        );
    }
  };

  const result = calculateResult(criterion);

  if (!criterion.tableStructure || !criterion.tableData) {
    return (
      <div className="text-center py-4 text-gray-500">
        <p>No table structure or data available for this criterion</p>
      </div>
    );
  }

  return (
    <div className={`${level > 0 ? 'ml-6 border-l-2 border-gray-200 pl-4' : ''} mb-4`}>
      <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
        {/* Header */}
        <div className="bg-blue-50 p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {hasChildren && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleExpanded(criterion.id)}
                >
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              )}
              <div>
                <h4 className="font-semibold text-blue-800">
                  {criterion.sectionNumber}
                </h4>
                <p className="text-sm text-blue-600 mt-1">
                  TABLE: {criterion.name}
                </p>
              </div>
            </div>
            <Badge 
              variant={result === 'Pass' ? 'default' : result === 'Fail' ? 'destructive' : 'secondary'}
              className="text-lg px-3 py-1"
            >
              {result === 'N/A' ? 'N/A' : result === 'Pass' ? 'P' : 'F'}
            </Badge>
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              {criterion.tableStructure.columns.map((column) => (
                <TableHead 
                  key={column.id} 
                  className="border-r font-semibold text-center"
                  style={{ width: column.width || 'auto' }}
                >
                  {column.header}
                  {column.unit && <span className="text-xs text-gray-500 ml-1">({column.unit})</span>}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {criterion.tableData.rows.map((row) => (
              <TableRow key={row.id} className="border-b">
                {criterion.tableStructure.columns.map((column, index) => (
                  <TableCell key={column.id} className="border-r p-1">
                    {index === 0 ? (
                      <div className="text-center font-medium h-8 flex items-center justify-center">
                        {row.model}
                      </div>
                    ) : (
                      renderInputField(column, row)
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Supplementary Information */}
        <SupplementaryInfo 
          standardId={standardId} 
          criterionId={criterion.id}
          supplementaryInfo={criterion.supplementaryInfo}
        />
      </div>

      {/* Children criteria */}
      {hasChildren && isExpanded && (
        <div className="ml-4 mt-4 space-y-4">
          {criterion.children!.map(child => (
            <CriterionTable
              key={child.id}
              standardId={standardId}
              criterion={child}
              level={level + 1}
              isExpanded={isExpanded}
              onToggleExpanded={onToggleExpanded}
              onUpdateTableData={onUpdateTableData}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CriterionTable;
