
import React from 'react';
import { TestingCriterion } from '@/types/lims';
import SupplementaryInfo from './SupplementaryInfo';
import CriterionHeader from './CriterionHeader';
import CriterionTableBody from './CriterionTableBody';
import { calculateResult } from './CriterionResult';

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
        <CriterionHeader
          criterion={criterion}
          result={result}
          hasChildren={hasChildren}
          isExpanded={isExpanded}
          onToggleExpanded={onToggleExpanded}
        />

        <CriterionTableBody
          criterion={criterion}
          onUpdateTableData={onUpdateTableData}
          standardId={standardId}
        />

        <SupplementaryInfo 
          standardId={standardId} 
          criterionId={criterion.id.toString()}
          supplementaryInfo={criterion.supplementaryInfo}
        />
      </div>

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
