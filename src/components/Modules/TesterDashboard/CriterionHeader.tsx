
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { TestingCriterion } from '@/types/lims';

interface CriterionHeaderProps {
  criterion: TestingCriterion;
  result: 'Pass' | 'Fail' | 'N/A';
  hasChildren: boolean;
  isExpanded: boolean;
  onToggleExpanded: (criteriaId: string) => void;
}

const CriterionHeader: React.FC<CriterionHeaderProps> = ({
  criterion,
  result,
  hasChildren,
  isExpanded,
  onToggleExpanded,
}) => {
  return (
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
  );
};

export default CriterionHeader;
