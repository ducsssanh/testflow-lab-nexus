
import React, { useState } from 'react';
import { Assignment, TechnicalDocument } from '@/types/lims';
import OrderInformationSection from './OrderInformationSection';
import SampleInformationSection from './SampleInformationSection';
import TestingCriteriaSection from './TestingCriteriaSection';
import TechnicalDocumentsSection from './TechnicalDocumentsSection';
import InspectionHeader from './InspectionHeader';
import DocumentViewer from '../DocumentViewer';
import { useRequirementsData } from './StandardsDataManager';
import { useInspectionLog } from './InspectionLogManager';
import { useInspectionActions } from './InspectionActions';

interface InspectionDashboardProps {
  assignment: Assignment;
  onBack: () => void;
  onUpdateAssignment: (assignment: Assignment) => void;
}

const InspectionDashboard: React.FC<InspectionDashboardProps> = ({
  assignment,
  onBack,
  onUpdateAssignment,
}) => {
  const [selectedDocument, setSelectedDocument] = useState<TechnicalDocument | null>(null);
  const { requirementSections, setRequirementSections } = useRequirementsData(assignment);
  const { inspectionLog, setInspectionLog } = useInspectionLog(assignment);
  
  const {
    handleUpdateCriteria,
    handleSaveInspectionLog,
    handleGenerateReport,
  } = useInspectionActions({
    assignment,
    inspectionLog: inspectionLog!,
    requirementSections,
    onUpdateAssignment,
    onUpdateInspectionLog: setInspectionLog,
    onUpdateRequirementSections: setRequirementSections,
  });

  if (!inspectionLog) {
    return <div>Loading...</div>;
  }

  // If a document is selected, show the document viewer
  if (selectedDocument) {
    return (
      <DocumentViewer
        document={selectedDocument}
        onBack={() => setSelectedDocument(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <InspectionHeader
        assignment={assignment}
        onBack={onBack}
        onUpdateCriteria={handleUpdateCriteria}
        onSaveInspectionLog={handleSaveInspectionLog}
        onGenerateReport={handleGenerateReport}
      />

      {/* Technical Documents */}
      {assignment.technicalDocumentation && (
        <TechnicalDocumentsSection
          documents={assignment.technicalDocumentation}
          onViewDocument={setSelectedDocument}
        />
      )}

      {/* Section 1: Order Information */}
      <OrderInformationSection
        inspectionLog={inspectionLog}
        onUpdate={(updates) => setInspectionLog({ ...inspectionLog, ...updates })}
      />

      {/* Section 2: Sample Information */}
      <SampleInformationSection
        assignment={assignment}
        sampleInfo={inspectionLog.sampleInfo}
        onUpdate={(sampleInfo) => setInspectionLog({ ...inspectionLog, sampleInfo })}
      />

      {/* Section 3: Testing Criteria by Requirements */}
      <TestingCriteriaSection
        requirementSections={requirementSections}
        onUpdateRequirementSections={setRequirementSections}
      />
    </div>
  );
};

export default InspectionDashboard;
