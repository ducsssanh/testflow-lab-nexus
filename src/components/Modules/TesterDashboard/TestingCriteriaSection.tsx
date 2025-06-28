
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
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

  const addAttempt = (criterionId: string) => {
    const newAttempt: TestingAttempt = {
      id: Date.now().toString(),
      value: '',
      result: 'N/A',
      timestamp: new Date().toISOString(),
      testerId: 'current-user',
    };

    const updateCriterion = (c: TestingCriterion): TestingCriterion => {
      if (c.id === criterionId) {
        return { ...c, attempts: [...c.attempts, newAttempt] };
      }
      if (c.children) {
        return { ...c, children: c.children.map(updateCriterion) };
      }
      return c;
    };

    onUpdateCriteria(criteria.map(updateCriterion));
  };

  const updateAttempt = (criterionId: string, attemptId: string, field: keyof TestingAttempt, value: any) => {
    const updateCriterion = (c: TestingCriterion): TestingCriterion => {
      if (c.id === criterionId) {
        return {
          ...c,
          attempts: c.attempts.map(a => 
            a.id === attemptId ? { ...a, [field]: value } : a
          ),
        };
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
    
    // All attempts must pass for the criterion to pass
    const allPass = criterion.attempts.every(a => a.result === 'Pass');
    if (allPass) return 'Pass';
    
    const anyFail = criterion.attempts.some(a => a.result === 'Fail');
    if (anyFail) return 'Fail';
    
    return 'N/A';
  };

  const renderCriterion = (criterion: TestingCriterion, level: number = 0) => {
    const hasChildren = criterion.children && criterion.children.length > 0;
    const isExpanded = expandedItems.has(criterion.id);
    const result = calculateResult(criterion);

    return (
      <div key={criterion.id} className={`${level > 0 ? 'ml-6 border-l-2 border-gray-200 pl-4' : ''}`}>
        <div className="border rounded-lg p-4 mb-2">
          <div className="flex items-center justify-between mb-3">
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
              <h4 className="font-medium">{criterion.name}</h4>
              {criterion.unit && <Badge variant="outline">{criterion.unit}</Badge>}
            </div>
            <div className="flex items-center space-x-2">
              <Badge 
                variant={result === 'Pass' ? 'default' : result === 'Fail' ? 'destructive' : 'secondary'}
              >
                {result}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addAttempt(criterion.id)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Test
              </Button>
            </div>
          </div>

          {/* Attempts */}
          {criterion.attempts.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-600">Test Attempts:</h5>
              {criterion.attempts.map((attempt) => (
                <div key={attempt.id} className="grid grid-cols-3 gap-2">
                  <Input
                    placeholder={`Value${criterion.unit ? ` (${criterion.unit})` : ''}`}
                    value={attempt.value}
                    onChange={(e) => updateAttempt(criterion.id, attempt.id, 'value', e.target.value)}
                  />
                  <Select
                    value={attempt.result}
                    onValueChange={(value) => updateAttempt(criterion.id, attempt.id, 'result', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pass">Pass</SelectItem>
                      <SelectItem value="Fail">Fail</SelectItem>
                      <SelectItem value="N/A">N/A</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="text-xs text-gray-500 flex items-center">
                    {new Date(attempt.timestamp).toLocaleString('vi-VN')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Children criteria */}
        {hasChildren && isExpanded && (
          <div className="ml-4">
            {criterion.children!.map(child => renderCriterion(child, level + 1))}
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
          Hierarchical testing criteria with pass/fail logic. All attempts must pass for a criterion to pass.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {criteria.map(criterion => renderCriterion(criterion))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TestingCriteriaSection;
