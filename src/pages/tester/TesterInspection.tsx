import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Assignment, TechnicalDocument } from '@/types/lims';
import { useToast } from '@/hooks/use-toast';
import InspectionDashboard from '@/components/tester/InspectionDashboard';
import DocumentViewer from '@/components/shared/DocumentViewer';
import TesterLayout from '@/components/shared/Layout/TesterLayout';
import { updateAssignmentStatus } from '@/services/tester/assignmentService';

const TesterInspection: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  const assignment = location.state?.assignment as Assignment;
  const [selectedDocument, setSelectedDocument] = useState<TechnicalDocument | null>(null);

  if (!assignment || assignment.id !== id) {
    // Redirect back to dashboard if no assignment data
    navigate('/tester/dashboard');
    return null;
  }

  const handleUpdateAssignment = async (updatedAssignment: Assignment) => {
    try {
      await updateAssignmentStatus(updatedAssignment);
      
      if (updatedAssignment.status === 'Done') {
        toast({
          title: "Assignment Completed",
          description: `Assignment ${updatedAssignment.sampleCode} has been marked as Done`,
        });
      }
    } catch (error) {
      console.error('Failed to update assignment:', error);
      toast({ 
        title: "Error", 
        description: "Failed to update assignment. Changes saved locally.",
        variant: "destructive"
      });
    }
  };

  const handleBack = () => {
    navigate('/tester/dashboard');
  };

  if (selectedDocument) {
    return (
      <TesterLayout>
        <DocumentViewer
          document={selectedDocument}
          onBack={() => setSelectedDocument(null)}
        />
      </TesterLayout>
    );
  }

  return (
    <TesterLayout>
      <InspectionDashboard
        assignment={assignment}
        onBack={handleBack}
        onUpdateAssignment={handleUpdateAssignment}
        onViewDocument={setSelectedDocument}
      />
    </TesterLayout>
  );
};

export default TesterInspection;