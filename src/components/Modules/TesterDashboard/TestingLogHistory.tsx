
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText } from 'lucide-react';
import { InspectionLog } from '@/types/lims';
import { useToast } from '@/hooks/use-toast';

interface TestingLogHistoryProps {
  onBack: () => void;
}

const TestingLogHistory: React.FC<TestingLogHistoryProps> = ({ onBack }) => {
  const [logs, setLogs] = useState<InspectionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTestingHistory = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/v1/inspection-logs?testerId=current-user');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const apiResponse = await response.json();
        
        if (apiResponse.success) {
          setLogs(apiResponse.data);
        } else {
          throw new Error(apiResponse.error?.message || 'Failed to fetch testing history');
        }
      } catch (error) {
        console.error('Failed to fetch testing history:', error);
        toast({
          title: "Error",
          description: "Failed to load testing history. Using offline data.",
          variant: "destructive"
        });
        
        // Fallback to mock data
        const mockLogs: InspectionLog[] = [
          {
            id: '1',
            assignmentId: 'a1',
            sampleSymbol: 'LT-001',
            testingRequirements: ['QCVN101:2020+IEC'],
            testSample: 'Battery Model XYZ',
            testingDate: '2024-01-15',
            sampleInfo: { voltage: '3.7V', capacity: '2000mAh' },
            testingCriteria: [],
            requirementSections: [
              {
                id: 'requirement-0',
                requirementName: 'QCVN101:2020+IEC',
                sectionTitle: 'QCVN101:2020 with IEC 62133-2:2017 Battery Safety Requirements',
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
            testingRequirements: ['QCVN101:2020'],
            testSample: 'Desktop Computer ABC',
            testingDate: '2024-01-16',
            sampleInfo: { powerRating: '300W', inputVoltage: '100-240VAC' },
            testingCriteria: [],
            requirementSections: [
              {
                id: 'requirement-0',
                requirementName: 'QCVN101:2020',
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
      } finally {
        setLoading(false);
      }
    };

    fetchTestingHistory();
  }, [toast]);

  const handleViewDetails = async (logId: string) => {
    try {
      const response = await fetch(`/api/v1/inspection-logs/${logId}/details`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const apiResponse = await response.json();
      
      if (apiResponse.success) {
        // Navigate to detail view or open modal with apiResponse.data
        console.log('Log details:', apiResponse.data);
        toast({
          title: "Log Details",
          description: "Opening detailed view for inspection log",
        });
      } else {
        throw new Error(apiResponse.error?.message || 'Failed to load log details');
      }
    } catch (error) {
      console.error('Failed to load log details:', error);
      toast({
        title: "Error",
        description: "Failed to load log details",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading testing history...</p>
        </div>
      </div>
    );
  }

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
                    <p className="text-sm text-gray-600 mb-2">Testing Requirements:</p>
                    <div className="flex flex-wrap gap-2">
                      {log.testingRequirements.map((requirement, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {requirement}
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
