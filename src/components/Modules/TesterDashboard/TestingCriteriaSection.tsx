
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { TestingCriterion, TestingAttempt } from '@/types/lims';

interface TestingCriteriaSectionProps {
  criteria: TestingCriterion[];
  onUpdateCriteria: (criteria: TestingCriterion[]) => void;
}

const TestingCriteriaSection: React.FC<TestingCriteriaSectionProps> = ({
  criteria,
  onUpdateCriteria,
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
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

  const updateAttempt = (criterionId: string, attemptIndex: number, field: keyof TestingAttempt, value: any) => {
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

    onUpdateCriteria(criteria.map(updateCriterion));
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

  const renderCriterionTable = (criterion: TestingCriterion, level: number = 0) => {
    const hasChildren = criterion.children && criterion.children.length > 0;
    const isExpanded = expandedItems.has(criterion.id);
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
                    onClick={() => toggleExpanded(criterion.id)}
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
                      onChange={(e) => updateAttempt(criterion.id, index, 'value', e.target.value)}
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
                      onValueChange={(value) => updateAttempt(criterion.id, index, 'result', value as any)}
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
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <strong>Tester:</strong>
                    <Input 
                      className="mt-1 h-8" 
                      placeholder="Tester name"
                    />
                  </div>
                  <div>
                    <strong>Equipment:</strong>
                    <Input 
                      className="mt-1 h-8" 
                      placeholder="Equipment ID"
                      defaultValue="PSI.TB-"
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
            {criterion.children!.map(child => renderCriterionTable(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Section 3: Testing Criteria</CardTitle>
        <p className="text-sm text-gray-600">
          Testing criteria with fixed number of test attempts. Each table represents a specific test procedure.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {criteria.map(criterion => renderCriterionTable(criterion))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TestingCriteriaSection;
