
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { TestingRequirementSection } from '@/types/lims';
import CriterionTable from './CriterionTable';

interface TestingCriteriaSectionProps {
  requirementSections: TestingRequirementSection[];
  onUpdateRequirementSections: (sections: TestingRequirementSection[]) => void;
}

const TestingCriteriaSection: React.FC<TestingCriteriaSectionProps> = ({
  requirementSections,
  onUpdateRequirementSections,
}) => {
  const [expandedCriteria, setExpandedCriteria] = useState<Set<string>>(new Set());

  const toggleCriteriaExpanded = (criteriaId: string) => {
    const newExpanded = new Set(expandedCriteria);
    if (newExpanded.has(criteriaId)) {
      newExpanded.delete(criteriaId);
    } else {
      newExpanded.add(criteriaId);
    }
    setExpandedCriteria(newExpanded);
  };

  const updateTableData = (requirementId: string, criterionId: string, rowId: string, columnId: string, value: string) => {
    // TODO: REPLACE WITH REAL API CALL
    // API_INTEGRATION: Replace with actual table data update endpoint
    // PUT /api/v1/testing-criteria/${requirementId}/criteria/${criterionId}/table-data
    
    const updateCriterion = (c: any): any => {
      if (c.id === criterionId) {
        if (!c.tableData) return c;
        
        const updatedRows = c.tableData.rows.map((row: any) => {
          if (row.id === rowId) {
            return {
              ...row,
              values: {
                ...row.values,
                [columnId]: value
              }
            };
          }
          return row;
        });
        
        return {
          ...c,
          tableData: {
            ...c.tableData,
            rows: updatedRows
          }
        };
      }
      if (c.children) {
        return { ...c, children: c.children.map(updateCriterion) };
      }
      return c;
    };

    const updatedSections = requirementSections.map(section => {
      if (section.id === requirementId) {
        return {
          ...section,
          criteria: section.criteria.map(updateCriterion)
        };
      }
      return section;
    });

    onUpdateRequirementSections(updatedSections);
  };

  // Flatten all criteria from all requirement sections
  const allCriteria = requirementSections.flatMap(section => 
    section.criteria.map(criterion => ({
      ...criterion,
      requirementId: section.id
    }))
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Section 3: Testing Criteria</CardTitle>
        <p className="text-sm text-gray-600">
          Testing criteria for the assigned sample. Each criterion contains specific test procedures and requirements.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {allCriteria.map(criterion => (
            <CriterionTable
              key={criterion.id}
              standardId={criterion.requirementId}
              criterion={criterion}
              level={0}
              isExpanded={expandedCriteria.has(criterion.id)}
              onToggleExpanded={toggleCriteriaExpanded}
              onUpdateTableData={updateTableData}
            />
          ))}
          
          {allCriteria.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No testing criteria loaded yet.</p>
              <p className="text-sm">Criteria will be loaded based on assignment and sample type.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TestingCriteriaSection;
