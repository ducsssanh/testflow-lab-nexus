
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronDown, ChevronRight, FileText } from 'lucide-react';
import { TestingCriterion, TestingAttempt, TestingStandardSection } from '@/types/lims';

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

  // Initialize fixed number of attempts (5 rows as shown in image)
  const initializeAttempts = (criterion: TestingCriterion): TestingCriterion => {
    const fixedAttemptCount = 5;
    const attempts: TestingAttempt[] = [];
    
    for (let i = 0; i < fixedAttemptCount; i++) {
      const existingAttempt = criterion.attempts[i];
      attempts.push(existingAttempt || {
        id: `${criterion.id}-attempt-${i + 1}`,
        value: '',
        result: 'N/A',
        timestamp: new Date().toISOString(),
        testerId: 'current-user',
      });
    }
    
    return { ...criterion, attempts };
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

    const updateCriterion = (c: TestingCriterion): TestingCriterion => {
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

  const calculateResult = (criterion: TestingCriterion): 'Pass' | 'Fail' | 'N/A' => {
    if (criterion.attempts.length === 0) return 'N/A';
    
    const hasValues = criterion.attempts.some(a => a.value.trim() !== '');
    if (!hasValues) return 'N/A';
    
    // All attempts with values must pass for the criterion to pass
    const attemptsWithValues = criterion.attempts.filter(a => a.value.trim() !== '');
    const allPass = attemptsWithValues.every(a => a.result === 'Pass');
    if (allPass && attemptsWithValues.length > 0) return 'Pass';
    
    const anyFail = attemptsWithValues.some(a => a.result === 'Fail');
    if (anyFail) return 'Fail';
    
    return 'N/A';
  };

  const renderCriterionTable = (standardId: string, criterion: TestingCriterion, level: number = 0) => {
    const hasChildren = criterion.children && criterion.children.length > 0;
    const isExpanded = expandedCriteria.has(criterion.id);
    const result = calculateResult(criterion);
    const initializedCriterion = initializeAttempts(criterion);

    return (
      <div key={criterion.id} className={`${level > 0 ? 'ml-6 border-l-2 border-gray-200 pl-4' : ''} mb-6`}>
        <div className="border rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-50 p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {hasChildren && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleCriteriaExpanded(criterion.id)}
                  >
                    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                )}
                <h4 className="font-semibold text-blue-800">
                  TABLE: {criterion.name}
                </h4>
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
                <TableHead className="border-r font-semibold text-center">Model</TableHead>
                <TableHead className="border-r font-semibold text-center">
                  Recommended charging voltage V<sub>cc</sub> (Vdc)
                </TableHead>
                <TableHead className="border-r font-semibold text-center">
                  Recommended charging current I<sub>rec</sub> (mA)
                </TableHead>
                <TableHead className="border-r font-semibold text-center">
                  OCV at start of test, (Vdc)
                </TableHead>
                <TableHead className="font-semibold text-center">Results</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initializedCriterion.attempts.map((attempt, index) => (
                <TableRow key={attempt.id} className="border-b">
                  <TableCell className="border-r text-center font-medium">
                    C#{(index + 1).toString().padStart(2, '0')}
                  </TableCell>
                  <TableCell className="border-r p-1">
                    <Input
                      className="border-0 text-center h-8"
                      placeholder=""
                      value={attempt.value}
                      onChange={(e) => updateAttempt(standardId, criterion.id, index, 'value', e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="border-r p-1">
                    <Input
                      className="border-0 text-center h-8"
                      placeholder=""
                      onChange={(e) => console.log('Current input:', e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="border-r p-1">
                    <Input
                      className="border-0 text-center h-8"
                      placeholder=""
                      onChange={(e) => console.log('OCV input:', e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="text-center p-1">
                    <Select
                      value={attempt.result}
                      onValueChange={(value) => updateAttempt(standardId, criterion.id, index, 'result', value as any)}
                    >
                      <SelectTrigger className="border-0 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pass">Pass</SelectItem>
                        <SelectItem value="Fail">Fail</SelectItem>
                        <SelectItem value="N/A">N/A</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Supplementary Information */}
          <div className="p-4 bg-gray-50 border-t">
            <div className="space-y-3">
              <div>
                <strong>Supplementary information:</strong>
                <div className="ml-4 mt-1">
                  - No fire, no explosion, no leakage
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>The testing time:</strong>
                  <Input 
                    className="mt-1 h-8" 
                    placeholder="Enter testing time"
                    onChange={(e) => {
                      // TODO: REPLACE WITH REAL API CALL
                      // API_INTEGRATION: Save testing time to database
                      // PUT /api/v1/testing-standards/${standardId}/criteria/${criterion.id}/metadata
                      console.log('Testing time updated:', e.target.value);
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <strong>Tester:</strong>
                    <Input 
                      className="mt-1 h-8" 
                      placeholder="Tester name"
                      onChange={(e) => {
                        // TODO: REPLACE WITH REAL API CALL
                        // API_INTEGRATION: Save tester info to database
                        console.log('Tester updated:', e.target.value);
                      }}
                    />
                  </div>
                  <div>
                    <strong>Equipment:</strong>
                    <Input 
                      className="mt-1 h-8" 
                      placeholder="Equipment ID"
                      defaultValue="PSI.TB-"
                      onChange={(e) => {
                        // TODO: REPLACE WITH REAL API CALL
                        // API_INTEGRATION: Save equipment info to database
                        console.log('Equipment updated:', e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Children criteria */}
        {hasChildren && isExpanded && (
          <div className="ml-4 mt-4">
            {criterion.children!.map(child => renderCriterionTable(standardId, child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderStandardSection = (section: TestingStandardSection) => {
    const isExpanded = expandedStandards.has(section.id);

    return (
      <Card key={section.id} className="mb-6">
        <CardHeader 
          className="cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => toggleStandardExpanded(section.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <CardTitle className="text-lg text-blue-800">
                  Standard: {section.standardName}
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
              {section.criteria.map(criterion => renderCriterionTable(section.id, criterion))}
            </div>
          </CardContent>
        )}
      </Card>
    );
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
          {standardSections.map(section => renderStandardSection(section))}
          
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
