
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TestingCriterion } from '@/types/lims';
import InputFieldRenderer from './InputFieldRenderer';

interface CriterionTableBodyProps {
  criterion: TestingCriterion;
  onUpdateTableData: (standardId: string, criterionId: string, rowId: string, columnId: string, value: string) => void;
  standardId: string;
}

const CriterionTableBody: React.FC<CriterionTableBodyProps> = ({
  criterion,
  onUpdateTableData,
  standardId,
}) => {
  return (
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
        {criterion.tableData?.rows.map((row) => (
          <TableRow key={row.id} className="border-b">
            {criterion.tableStructure.columns.map((column, index) => (
              <TableCell key={column.id} className="border-r p-1">
                {index === 0 ? (
                  <div className="text-center font-medium h-8 flex items-center justify-center">
                    {row.model}
                  </div>
                ) : (
                  <InputFieldRenderer
                    column={column}
                    row={row}
                    onUpdateValue={(value) => onUpdateTableData(standardId, criterion.id, row.id, column.id, value)}
                  />
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CriterionTableBody;
