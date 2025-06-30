
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText } from 'lucide-react';
import { InspectionLog } from '@/types/lims';

interface TestingLogHistoryProps {
  onBack: () => void;
}

const TestingLogHistory: React.FC<TestingLogHistoryProps> = ({ onBack }) => {
  const [logs, setLogs] = useState<InspectionLog[]>([]);

  useEffect(() => {
    // TODO: REPLACE WITH REAL API CALL
    // API_INTEGRATION: Replace mock data with actual API call
    // GET /api/v1/inspection-logs?testerId=current-user&status=completed
    // const fetchTestingHistory = async () => {
    //   try {
    //     const response = await fetch('/api/v1/inspection-logs?testerId=current-user');
    //     const logs = await response.json();
    //     setLogs(logs);
    //   } catch (error) {
    //     console.error('Failed to fetch testing history:', error);
    //   }
    // };
    // fetchTestingHistory();

    const mockLogs: InspectionLog[] = [
      {
        id: '1',
        assignmentId: 'a1',
        sampleSymbol: 'LT-001',
        testingStandards: ['QCVN101:2020+IEC'],
        testSample: 'Battery Model XYZ',
        testingDate: '2024-01-15',
        sampleInfo: { voltage: '3.7V', capacity: '2000mAh' },
        testingCriteria: [],
        standardSections: [
          {
            id: 'standard-0',
            standardName: 'QCVN101:2020+IEC',
            sectionTitle: 'QCVN101:2020 with IEC 62133-2:2017 Battery Safety Standards',
            isExpanded: false,
            criteria: []
          }
        ],
        status: 'Completed',
        createdBy: 'current-user',
        createdAt: '2024-01-15T09:00:00Z',
        updatedAt: '2024-01-15T15:00:00Z',
      },
      {
        id: '2',
        assignmentId: 'a2',
        sampleSymbol: 'DT-002',
        testingStandards: ['QCVN101:2020'],
        testSample: 'Desktop Computer ABC',
        testingDate: '2024-01-16',
        sampleInfo: { powerRating: '300W', inputVoltage: '100-240VAC' },
        testingCriteria: [],
        standardSections: [
          {
            id: 'standard-0',
            standardName: 'QCVN101:2020',
            sectionTitle: 'National Technical Regulation on Safety Requirements for Information Technology Equipment',
            isExpanded: false,
            criteria: []
          }
        ],
        status: 'Draft',
        createdBy: 'current-user',
        createdAt: '2024-01-16T10:00:00Z',
        updatedAt: '2024-01-16T14:00:00Z',
      },
    ];
    setLogs(mockLogs);
  }, []);

  const handleViewDetails = async (logId: string) => {
    // TODO: REPLACE WITH REAL API CALL
    // API_INTEGRATION: Replace with actual log detail viewing
    // This could navigate to a detailed view or open a modal
    // const response = await fetch(`/api/v1/inspection-logs/${logId}/details`);
    // const logDetails = await response.json();
    // Navigate to detail view or open modal with logDetails
    console.log('View log details for:', logId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Assignments</span>
        </Button>
        <h2 className="text-2xl font-bold">Testing Log History</h2>
      </div>

      <div className="space-y-4">
        {logs.map((log) => (
          <Card key={log.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-4">
                    <h3 className="font-semibold text-lg">{log.sampleSymbol}</h3>
                    <Badge variant={log.status === 'Completed' ? 'default' : 'secondary'}>
                      {log.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Test Sample:</span> {log.testSample}
                    </div>
                    <div>
                      <span className="font-medium">Testing Date:</span> {log.testingDate}
                    </div>
                    <div>
                      <span className="font-medium">Last Updated:</span>{' '}
                      {new Date(log.updatedAt).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-sm text-gray-600 mb-2">Testing Standards:</p>
                    <div className="flex flex-wrap gap-2">
                      {log.testingStandards.map((standard, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {standard}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="ml-4"
                  onClick={() => handleViewDetails(log.id)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {logs.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500 text-lg">No testing logs found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TestingLogHistory;
