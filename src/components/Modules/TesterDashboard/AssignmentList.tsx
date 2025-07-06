
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, FileText } from 'lucide-react';
import { Assignment } from '@/types/lims';

interface AssignmentListProps {
  assignments: Assignment[];
  onSelectAssignment: (assignment: Assignment) => void;
  onViewHistory: () => void;
}

const AssignmentList: React.FC<AssignmentListProps> = ({
  assignments,
  onSelectAssignment,
  onViewHistory,
}) => {
  const getStatusColor = (status: Assignment['status']) => {
    switch (status) {
      case 'Pending':
        return 'secondary';
      case 'In Progress':
        return 'default';
      case 'Done':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  // Map team IDs to display names
  const getTeamDisplayName = (teamId: string) => {
    const teamMap: Record<string, string> = {
      '101': 'Battery Testing Team',
      '102': 'IT Equipment Team',
      '103': 'Safety Testing Team',
    };
    return teamMap[teamId] || `Team ${teamId}`;
  };

  const groupedByTeam = assignments.reduce((acc, assignment) => {
    const teamDisplayName = getTeamDisplayName(assignment.assignedTeam);
    if (!acc[teamDisplayName]) {
      acc[teamDisplayName] = [];
    }
    acc[teamDisplayName].push(assignment);
    return acc;
  }, {} as Record<string, Assignment[]>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Assignments by Team</h2>
        <Button variant="outline" onClick={onViewHistory}>
          <FileText className="h-4 w-4 mr-2" />
          Testing Log History
        </Button>
      </div>

      {Object.entries(groupedByTeam).map(([teamDisplayName, teamAssignments]) => (
        <Card key={teamDisplayName}>
          <CardHeader>
            <CardTitle className="text-lg">Team: {teamDisplayName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-4">
                        <h3 className="font-semibold text-lg">{assignment.sampleCode}</h3>
                        <Badge variant={getStatusColor(assignment.status)}>
                          {assignment.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Sample Type:</span> {assignment.sampleType}
                          {assignment.sampleSubType && ` (${assignment.sampleSubType})`}
                        </div>
                        <div>
                          <span className="font-medium">Quantity:</span> {assignment.sampleQuantity}
                        </div>
                        <div>
                          <span className="font-medium">Received:</span>{' '}
                          {new Date(assignment.receivedTime).toLocaleDateString('vi-VN')}
                        </div>
                      </div>

                      <div className="pt-2">
                        <p className="text-sm text-gray-600 mb-2">Testing Requirements:</p>
                        <div className="flex flex-wrap gap-2">
                          {assignment.testingRequirements.map((req, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {req}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Test Sample:</span> {assignment.testSample}
                        </p>
                      </div>

                      {assignment.technicalDocumentation && assignment.technicalDocumentation.length > 0 && (
                        <div className="pt-2">
                          <p className="text-sm text-blue-600">
                            📄 {assignment.technicalDocumentation.length} technical documents available
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      onClick={() => onSelectAssignment(assignment)}
                      className="ml-4"
                      disabled={assignment.status === 'Done'}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      {assignment.status === 'Done' ? 'Completed' : 'Inspect'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {Object.keys(groupedByTeam).length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500 text-lg">No assignments found for your teams</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AssignmentList;
