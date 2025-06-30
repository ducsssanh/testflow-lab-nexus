
import React from 'react';
import { Assignment } from '@/types/lims';
import OrderInformationSection from './OrderInformationSection';
import SampleInformationSection from './SampleInformationSection';
import TestingCriteriaSection from './TestingCriteriaSection';
import TechnicalDocumentsSection from './TechnicalDocumentsSection';
import InspectionHeader from './InspectionHeader';
import { useStandardsData } from './StandardsDataManager';
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
  const { standardSections, setStandardSections } = useStandardsData(assignment);
  const { inspectionLog, setInspectionLog } = useInspectionLog(assignment);
  
  const {
    handleUpdateCriteria,
    handleSaveInspectionLog,
    handleGenerateReport,
  } = useInspectionActions({
    assignment,
    inspectionLog: inspectionLog!,
    standardSections,
    onUpdateAssignment,
    onUpdateInspectionLog: setInspectionLog,
  });

  if (!inspectionLog) {
    return <div>Loading...</div>;
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
          onViewDocument={(doc) => console.log('View document:', doc)}
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

      {/* Section 3: Testing Criteria by Standards */}
      <TestingCriteriaSection
        standardSections={standardSections}
        onUpdateStandardSections={setStandardSections}
      />
    </div>
  );
};

export default InspectionDashboard;
