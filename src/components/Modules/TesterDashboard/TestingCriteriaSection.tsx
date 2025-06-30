
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { TestingAttempt, TestingStandardSection } from '@/types/lims';
import StandardSection from './StandardSection';

interface TestingCriteriaSectionProps {
  standardSections: TestingStandardSection[];
  onUpdateStandardSections: (sections: TestingStandardSection[]) => void;
}

const TestingCriteriaSection: React.FC<TestingCriteriaSectionProps> = ({
  standardSections,
  onUpdateStandardSections,
}) => {
  const [expandedStandards, setExpandedStandards] = useState<Set<string>>(new Set());
  const [expandedCriteria, setExpandedCriteria] = useState<Set<string>>(new Set());

  const toggleStandardExpanded = (standardId: string) => {
    const newExpanded = new Set(expandedStandards);
    if (newExpanded.has(standardId)) {
      newExpanded.delete(standardId);
    } else {
      newExpanded.add(standardId);
    }
    setExpandedStandards(newExpanded);
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

  const updateAttempt = (standardId: string, criterionId: string, attemptIndex: number, field: keyof TestingAttempt, value: any) => {
    // TODO: REPLACE WITH REAL API CALL
    // API_INTEGRATION: Replace with actual attempt update endpoint
    // PUT /api/v1/testing-standards/${standardId}/criteria/${criterionId}/attempts/${attemptIndex}
    // const updateAttemptAPI = async (standardId, criterionId, attemptIndex, field, value) => {
    //   try {
    //     await fetch(`/api/v1/testing-standards/${standardId}/criteria/${criterionId}/attempts/${attemptIndex}`, {
    //       method: 'PUT',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({ [field]: value })
    //     });
    //   } catch (error) {
    //     console.error('Failed to update attempt:', error);
    //   }
    // };

    const updateCriterion = (c: any): any => {
      if (c.id === criterionId) {
        const updatedAttempts = [...c.attempts];
        if (updatedAttempts[attemptIndex]) {
          updatedAttempts[attemptIndex] = { ...updatedAttempts[attemptIndex], [field]: value };
        }
        return { ...c, attempts: updatedAttempts };
      }
      if (c.children) {
        return { ...c, children: c.children.map(updateCriterion) };
      }
      return c;
    };

    const updatedSections = standardSections.map(section => {
      if (section.id === standardId) {
        return {
          ...section,
          criteria: section.criteria.map(updateCriterion)
        };
      }
      return section;
    });

    onUpdateStandardSections(updatedSections);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Section 3: Testing Criteria by Standards</CardTitle>
        <p className="text-sm text-gray-600">
          Testing criteria organized by testing standards. Each standard contains specific test procedures and requirements.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {standardSections.map(section => (
            <StandardSection
              key={section.id}
              section={section}
              isExpanded={expandedStandards.has(section.id)}
              expandedCriteria={expandedCriteria}
              onToggleStandardExpanded={toggleStandardExpanded}
              onToggleCriteriaExpanded={toggleCriteriaExpanded}
              onUpdateAttempt={updateAttempt}
            />
          ))}
          
          {standardSections.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No testing standards loaded yet.</p>
              <p className="text-sm">Standards will be loaded based on assignment requirements.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TestingCriteriaSection;
