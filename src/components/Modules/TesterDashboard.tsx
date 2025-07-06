/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Assignment } from '@/types/lims';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { mapApiToAssignment } from '@/utils/assignmentMappers';
import AssignmentList from './TesterDashboard/AssignmentList';
import InspectionDashboard from './TesterDashboard/InspectionDashboard';
import TestingLogHistory from './TesterDashboard/TestingLogHistory';

type ViewMode = 'assignments' | 'inspection' | 'history';

// Type cho API response theo schema thực tế
interface ApiResponse {
  status: string;
  data: {
    assignments: any[];
  };
}

const TesterDashboard: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('assignments');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('User object:', user);
        
        if (!user) {
          console.warn('No user found');
          setIsLoading(false);
          return;
        }

        // Lấy team IDs và xử lý consistent
        let teamIds = user?.teams || [];
        
        // Logic cho development environment
        if (teamIds.length === 0 && process.env.NODE_ENV === 'development') {
          console.warn('DEV MODE: User has no teams. Defaulting to Team ID 1');
          teamIds = ['1'];
        }

        if (teamIds.length === 0) {
          console.warn('User has no teams assigned');
          setIsLoading(false);
          toast({
            title: "No Teams Assigned",
            description: "You are not assigned to any testing teams.",
            variant: "destructive",
          });
          return;
        }

        console.log('Fetching assignments for teams:', teamIds);

        // Fetch assignments cho từng team
        const fetchPromises = teamIds.map(async (teamId) => {
          try {
            const response = await fetch(`/api/assignments/by-team/${teamId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('limsToken')}`,
              },
            });

            console.log(`Team ${teamId} response status:`, response.status);
            
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data: ApiResponse = await response.json();
            console.log(`Team ${teamId} data:`, data);
            
            return data;
          } catch (error) {
            console.error(`Failed to fetch assignments for team ${teamId}:`, error);
            throw error;
          }
        });

        const results = await Promise.all(fetchPromises);
        console.log('All API results:', results);

        // Xử lý kết quả với cấu trúc API response đúng
        const allAssignments = results
          .flatMap(result => {
            console.log('Processing API result:', result);
            
            // Kiểm tra cấu trúc response mới: { status: "success", data: { assignments: [...] } }
            if (result.status === 'success' && result.data && Array.isArray(result.data.assignments)) {
              return result.data.assignments;
            }
            // Fallback cho cấu trúc khác
            else if (result.data.assignments && Array.isArray(result.data.assignments)) {
              return result.data.assignments;
            } else if (Array.isArray(result)) {
              return result;
            } else {
              console.warn('Unexpected response structure:', result);
              return [];
            }
          })
          .map(assignment => {
            try {
              console.log('Mapping assignment:', assignment);
              const mappedAssignment = mapApiToAssignment(assignment);
              console.log('Mapped assignment:', mappedAssignment);
              return mappedAssignment;
            } catch (error) {
              console.error('Failed to map assignment:', assignment, error);
              return null;
            }
          })
          .filter(assignment => assignment !== null) as Assignment[];

        console.log('Final processed assignments:', allAssignments);
        setAssignments(allAssignments);

        if (allAssignments.length === 0) {
          toast({
            title: "No Assignments",
            description: "No assignments found for your teams.",
          });
        } else {
          toast({
            title: "Assignments Loaded",
            description: `Found ${allAssignments.length} assignments.`,
          });
        }

      } catch (error) {
        console.error('Failed to fetch assignments:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
        toast({
          title: "Error",
          description: "Failed to load assignments from the server.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignments();
  }, [user, toast]);

  const handleSelectAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setViewMode('inspection');
  };

  const handleUpdateAssignment = async (updatedAssignment: Assignment) => {
    try {
      const response = await fetch(`/api/v1/assignments/${updatedAssignment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: updatedAssignment.status,
          updatedAt: updatedAssignment.updatedAt
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();
      
      if (apiResponse.success) {
        setAssignments(prev => prev.map(a => 
          a.id === apiResponse.data.id ? apiResponse.data : a
        ));
        setSelectedAssignment(apiResponse.data);
        
        if (apiResponse.data.status === 'Done') {
          toast({
            title: "Assignment Completed",
            description: `Assignment ${apiResponse.data.sampleCode} has been marked as Done`,
          });
        }
      } else {
        throw new Error(apiResponse.error?.message || 'Failed to update assignment');
      }
    } catch (error) {
      console.error('Failed to update assignment:', error);
      toast({ 
        title: "Error", 
        description: "Failed to update assignment. Changes saved locally.",
        variant: "destructive"
      });
      
      // Fallback to local update
      setAssignments(prev => prev.map(a => 
        a.id === updatedAssignment.id ? updatedAssignment : a
      ));
      setSelectedAssignment(updatedAssignment);
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

  // Hiển thị error state
  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="text-red-600 mb-2">Error loading assignments</div>
        <div className="text-sm text-gray-600">{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  // Hiển thị loading state
  if (isLoading) {
    return <div className="p-4 text-center">Loading assignments...</div>;
  }

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