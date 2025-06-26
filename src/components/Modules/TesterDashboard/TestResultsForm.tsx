
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText } from 'lucide-react';
import { TestCriterion, TestLog, Order } from '@/types/lims';
import TestLogEntry from './TestLogEntry';

interface TestResultsFormProps {
  assignedTests: TestCriterion[];
  testLogs: TestLog[];
  testResults: Record<string, string>;
  selectedOrder: Order;
  onTestResultChange: (testId: string, value: string) => void;
  onSaveTestResults: () => void;
  onGenerateDraftReport: () => void;
}

const TestResultsForm: React.FC<TestResultsFormProps> = ({
  assignedTests,
  testLogs,
  testResults,
  selectedOrder,
  onTestResultChange,
  onSaveTestResults,
  onGenerateDraftReport,
}) => {
  return (
    <div className="space-y-6">
      {assignedTests.map((test) => (
        <div key={test.id} className="border rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">{test.name}</h4>
              <p className="text-sm text-gray-500">{test.category}</p>
            </div>
            <Badge variant="outline">{test.unit || 'N/A'}</Badge>
          </div>
          
          {/* Show existing logs for this test */}
          {testLogs.filter(log => log.testId === test.id).map((log) => (
            <TestLogEntry key={log.id} log={log} />
          ))}

          {/* Input for new result */}
          <div className="space-y-2">
            <Label htmlFor={`test-${test.id}`}>Kết quả mới</Label>
            <Input
              id={`test-${test.id}`}
              value={testResults[test.id] || ''}
              onChange={(e) => onTestResultChange(test.id, e.target.value)}
              placeholder={`Nhập kết quả${test.unit ? ` (${test.unit})` : ''}`}
            />
          </div>
        </div>
      ))}

      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          onClick={onSaveTestResults}
          disabled={Object.keys(testResults).length === 0}
        >
          Lưu kết quả
        </Button>
        {selectedOrder.status === 'in-progress' && testLogs.length > 0 && (
          <Button variant="outline" onClick={onGenerateDraftReport}>
            <FileText className="h-4 w-4 mr-2" />
            Tạo bản thảo báo cáo
          </Button>
        )}
      </div>
    </div>
  );
};

export default TestResultsForm;
