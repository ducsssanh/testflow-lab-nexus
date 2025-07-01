
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight, FileText } from 'lucide-react';
import { TestingRequirementSection } from '@/types/lims';
import CriterionTable from './CriterionTable';

interface RequirementSectionProps {
  section: TestingRequirementSection;
  isExpanded: boolean;
  expandedCriteria: Set<string>;
  onToggleRequirementExpanded: (requirementId: string) => void;
  onToggleCriteriaExpanded: (criteriaId: string) => void;
  onUpdateTableData: (requirementId: string, criterionId: string, rowId: string, columnId: string, value: string) => void;
}

const RequirementSection: React.FC<RequirementSectionProps> = ({
  section,
  isExpanded,
  expandedCriteria,
  onToggleRequirementExpanded,
  onToggleCriteriaExpanded,
  onUpdateTableData,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader 
        className="cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => onToggleRequirementExpanded(section.id)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            <FileText className="h-5 w-5 text-blue-600" />
            <div>
              <CardTitle className="text-lg text-blue-800">
                Requirement: {section.requirementName}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {section.sectionTitle} • {section.criteria.length} test criteria
              </p>
            </div>
          </div>
          <Badge variant="outline" className="bg-blue-50">
            {section.criteria.length} Tests
          </Badge>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent>
          <div className="space-y-6">
            {section.criteria.map(criterion => (
              <CriterionTable
                key={criterion.id}
                standardId={section.id}
                criterion={criterion}
                level={0}
                isExpanded={expandedCriteria.has(criterion.id)}
                onToggleExpanded={onToggleCriteriaExpanded}
                onUpdateTableData={onUpdateTableData}
              />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default RequirementSection;
