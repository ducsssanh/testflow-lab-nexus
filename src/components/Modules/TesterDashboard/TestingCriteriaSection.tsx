
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { TestingRequirementSection } from '@/types/lims';
import RequirementSection from './StandardSection';

interface TestingCriteriaSectionProps {
  requirementSections: TestingRequirementSection[];
  onUpdateRequirementSections: (sections: TestingRequirementSection[]) => void;
}

const TestingCriteriaSection: React.FC<TestingCriteriaSectionProps> = ({
  requirementSections,
  onUpdateRequirementSections,
}) => {
  const [expandedRequirements, setExpandedRequirements] = useState<Set<string>>(new Set());
  const [expandedCriteria, setExpandedCriteria] = useState<Set<string>>(new Set());

  const toggleRequirementExpanded = (requirementId: string) => {
    const newExpanded = new Set(expandedRequirements);
    if (newExpanded.has(requirementId)) {
      newExpanded.delete(requirementId);
    } else {
      newExpanded.add(requirementId);
    }
    setExpandedRequirements(newExpanded);
  };

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Section 3: Testing Criteria by Requirements</CardTitle>
        <p className="text-sm text-gray-600">
          Testing criteria organized by testing requirements. Each requirement contains specific test procedures based on sample type.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requirementSections.map(section => (
            <RequirementSection
              key={section.id}
              section={section}
              isExpanded={expandedRequirements.has(section.id)}
              expandedCriteria={expandedCriteria}
              onToggleRequirementExpanded={toggleRequirementExpanded}
              onToggleCriteriaExpanded={toggleCriteriaExpanded}
              onUpdateTableData={updateTableData}
            />
          ))}
          
          {requirementSections.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No testing requirements loaded yet.</p>
              <p className="text-sm">Requirements will be loaded based on assignment and sample type.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TestingCriteriaSection;
