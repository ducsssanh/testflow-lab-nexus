
import React from 'react';
import { TestLog } from '@/types/lims';

interface TestLogEntryProps {
  log: TestLog;
}

const TestLogEntry: React.FC<TestLogEntryProps> = ({ log }) => {
  return (
    <div className="bg-gray-50 p-3 rounded text-sm">
      <div className="flex justify-between items-center mb-1">
        <span className="font-medium">{log.testerName}</span>
        <span className="text-gray-500">
          {new Date(log.timestamp).toLocaleString('vi-VN')}
        </span>
      </div>
      <p>Kết quả: {log.result}</p>
      {log.notes && <p className="text-gray-600">Ghi chú: {log.notes}</p>}
    </div>
  );
};

export default TestLogEntry;
