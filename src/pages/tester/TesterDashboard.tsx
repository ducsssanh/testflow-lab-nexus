import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Assignment } from '@/types/lims';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { fetchTesterAssignments } from '@/services/tester/assignmentService';
import AssignmentList from '@/components/tester/AssignmentList';
import TestingLogHistory from '@/components/tester/TestingLogHistory';
import TesterLayout from '@/components/shared/Layout/TesterLayout';

type ViewMode = 'assignments' | 'history';

const TesterDashboard: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('assignments');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadAssignments = async () => {
      if (!user) return;
      
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchTesterAssignments(user);
        setAssignments(data);

        if (data.length === 0) {
          toast({
            title: "No Assignments",
            description: "No assignments found for your teams.",
          });
        } else {
          toast({
            title: "Assignments Loaded",
            description: `Found ${data.length} assignments.`,
          });
        }
      } catch (error) {
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

    loadAssignments();
  }, [user, toast]);

  const handleSelectAssignment = (assignment: Assignment) => {
    navigate(`/tester/inspection/${assignment.id}`, { state: { assignment } });
  };

  const handleViewHistory = () => {
    setViewMode('history');
  };

  const handleBackFromHistory = () => {
    setViewMode('assignments');
  };

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

  if (isLoading) {
    return <div className="p-4 text-center">Loading assignments...</div>;
  }

  if (viewMode === 'history') {
    return (
      <TesterLayout>
        <TestingLogHistory onBack={handleBackFromHistory} />
      </TesterLayout>
    );
  }

  return (
    <TesterLayout>
      <AssignmentList
        assignments={assignments}
        onSelectAssignment={handleSelectAssignment}
        onViewHistory={handleViewHistory}
      />
    </TesterLayout>
  );
};

export default TesterDashboard;