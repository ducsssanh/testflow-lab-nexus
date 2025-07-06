
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, FileText } from 'lucide-react';
import { Assignment } from '@/types/lims';

interface InspectionHeaderProps {
  assignment: Assignment;
  onBack: () => void;
  onUpdateCriteria: () => void;
  onSaveInspectionLog: () => void;
  onGenerateReport: () => void;
}

const InspectionHeader: React.FC<InspectionHeaderProps> = ({
  assignment,
  onBack,
  onUpdateCriteria,
  onSaveInspectionLog,
  onGenerateReport,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Assignments</span>
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Inspection - {assignment.sampleCode}</h2>
          <p className="text-gray-600">{assignment.testSample}</p>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button variant="outline" onClick={onUpdateCriteria}>
          <Plus className="h-4 w-4 mr-2" />
          Update Criteria
        </Button>
        <Button onClick={onSaveInspectionLog}>
          Save Progress
        </Button>
        {assignment.status === 'In Progress' && (
          <Button variant="default" onClick={onGenerateReport}>
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        )}
      </div>
    </div>
  );
};

export default InspectionHeader;
