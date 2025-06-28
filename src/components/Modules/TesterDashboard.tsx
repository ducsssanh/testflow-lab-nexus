
import React, { useState, useEffect } from 'react';
import { Assignment } from '@/types/lims';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import AssignmentList from './TesterDashboard/AssignmentList';
import InspectionDashboard from './TesterDashboard/InspectionDashboard';
import TestingLogHistory from './TesterDashboard/TestingLogHistory';

type ViewMode = 'assignments' | 'inspection' | 'history';

const TesterDashboard: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('assignments');
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Mock data for assignments
  const mockAssignments: Assignment[] = [
    {
      id: '1',
      sampleCode: 'LT-001',
      sampleType: 'Lithium Battery',
      sampleSubType: 'Cell',
      sampleQuantity: 5,
      testingRequirements: ['QCVN101:2020+IEC', 'QCVN101:2020'],
      receivedTime: '2024-01-15T09:00:00Z',
      technicalDocumentation: [
        {
          id: '1',
          name: 'Battery_Specification.pdf',
          type: 'pdf',
          size: 1024000,
          uploadedAt: '2024-01-15T08:00:00Z',
          uploadedBy: 'reception1',
          url: 'uploads/battery-spec.pdf'
        }
      ],
      status: 'Pending',
      assignedTeam: 'Battery Testing Team',
      assignedBy: 'manager1',
      testSample: 'Li-ion Cell Model ABC123',
      createdAt: '2024-01-15T09:00:00Z',
      updatedAt: '2024-01-15T09:00:00Z',
    },
    {
      id: '2',
      sampleCode: 'DT-002',
      sampleType: 'ITAV Desktop',
      sampleQuantity: 2,
      testingRequirements: ['QCVN101:2020'],
      receivedTime: '2024-01-16T10:00:00Z',
      technicalDocumentation: [
        {
          id: '2',
          name: 'Desktop_Manual.pdf',
          type: 'pdf',
          size: 2048000,
          uploadedAt: '2024-01-16T09:00:00Z',
          uploadedBy: 'reception1',
          url: 'uploads/desktop-manual.pdf'
        }
      ],
      status: 'In Progress',
      assignedTeam: 'IT Equipment Team',
      assignedBy: 'manager1',
      testSample: 'Desktop Computer XYZ789',
      createdAt: '2024-01-16T10:00:00Z',
      updatedAt: '2024-01-16T14:00:00Z',
    },
    {
      id: '3',
      sampleCode: 'AD-003',
      sampleType: 'ITAV Adapter',
      sampleQuantity: 10,
      testingRequirements: ['QCVN101:2020'],
      receivedTime: '2024-01-17T11:00:00Z',
      status: 'Pending',
      assignedTeam: 'IT Equipment Team',
      assignedBy: 'manager1',
      testSample: 'Power Adapter 65W',
      createdAt: '2024-01-17T11:00:00Z',
      updatedAt: '2024-01-17T11:00:00Z',
    },
  ];

  useEffect(() => {
    // API_INTEGRATION: GET /api/v1/assignments?teams=${user.teams.join(',')}
    // Filter assignments by user's teams
    const userTeams = user?.teams || ['Battery Testing Team', 'IT Equipment Team']; // Mock user teams
    const filteredAssignments = mockAssignments.filter(assignment => 
      userTeams.includes(assignment.assignedTeam)
    );
    setAssignments(filteredAssignments);
  }, [user]);

  const handleSelectAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setViewMode('inspection');
  };

  const handleUpdateAssignment = (updatedAssignment: Assignment) => {
    setAssignments(prev => prev.map(a => 
      a.id === updatedAssignment.id ? updatedAssignment : a
    ));
    setSelectedAssignment(updatedAssignment);
    
    if (updatedAssignment.status === 'Done') {
      toast({
        title: "Assignment Completed",
        description: `Assignment ${updatedAssignment.sampleCode} has been marked as Done`,
      });
    }
  };

  const handleBackToAssignments = () => {
    setSelectedAssignment(null);
    setViewMode('assignments');
  };

  const handleViewHistory = () => {
    setViewMode('history');
  };

  const handleBackFromHistory = () => {
    setViewMode('assignments');
  };

  if (viewMode === 'history') {
    return <TestingLogHistory onBack={handleBackFromHistory} />;
  }

  if (viewMode === 'inspection' && selectedAssignment) {
    return (
      <InspectionDashboard
        assignment={selectedAssignment}
        onBack={handleBackToAssignments}
        onUpdateAssignment={handleUpdateAssignment}
      />
    );
  }

  return (
    <AssignmentList
      assignments={assignments}
      onSelectAssignment={handleSelectAssignment}
      onViewHistory={handleViewHistory}
    />
  );
};

export default TesterDashboard;
