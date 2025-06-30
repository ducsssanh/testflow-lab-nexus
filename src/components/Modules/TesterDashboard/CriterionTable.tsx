
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    
    const resultColumn = criterion.tableData.columns.find(col => col.header.toLowerCase().includes('result'));
    if (!resultColumn) return 'N/A';
    
    const results = criterion.tableData.rows.map(row => row.values[resultColumn.id]);
    const hasValues = results.some(result => result && result.trim() !== '' && result !== 'N/A');
    
    if (!hasValues) return 'N/A';
    
    const hasFailure = results.some(result => result === 'Fail');
    if (hasFailure) return 'Fail';
    
    const allPass = results.every(result => result === 'Pass' || result === '' || result === 'N/A');
    return allPass ? 'Pass' : 'N/A';
  };

  const result = calculateResult(criterion);

  if (!criterion.tableData) {
    return (
      <div className="text-center py-4 text-gray-500">
        <p>No table data available for this criterion</p>
      </div>
    );
  }

  return (
    <div className={`${level > 0 ? 'ml-6 border-l-2 border-gray-200 pl-4' : ''} mb-6`}>
      <div className="border rounded-lg overflow-hidden">
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
                  {criterion.tableData.sectionNumber}
                </h4>
                <p className="text-sm text-blue-600 mt-1">
                  TABLE: {criterion.tableData.title}
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
              {criterion.tableData.columns.map((column) => (
                <TableHead key={column.id} className="border-r font-semibold text-center">
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {criterion.tableData.rows.map((row) => (
              <TableRow key={row.id} className="border-b">
                <TableCell className="border-r text-center font-medium">
                  {row.model}
                </TableCell>
                {criterion.tableData.columns.slice(1).map((column) => (
                  <TableCell key={column.id} className="border-r p-1">
                    {column.type === 'select' ? (
                      <Select
                        value={row.values[column.id] || ''}
                        onValueChange={(value) => onUpdateTableData(standardId, criterion.id, row.id, column.id, value)}
                      >
                        <SelectTrigger className="border-0 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {column.options?.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : column.type === 'readonly' ? (
                      <div className="text-center h-8 flex items-center justify-center">
                        {row.values[column.id] || ''}
                      </div>
                    ) : (
                      <Input
                        className="border-0 text-center h-8"
                        placeholder=""
                        value={row.values[column.id] || ''}
                        onChange={(e) => onUpdateTableData(standardId, criterion.id, row.id, column.id, e.target.value)}
                      />
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
        <div className="ml-4 mt-4">
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
