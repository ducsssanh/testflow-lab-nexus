
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Plus } from 'lucide-react';
import { Assignment, InspectionLog, TestingCriterion, ReportTemplate } from '@/types/lims';
import { useToast } from '@/hooks/use-toast';
import OrderInformationSection from './OrderInformationSection';
import SampleInformationSection from './SampleInformationSection';
import TestingCriteriaSection from './TestingCriteriaSection';
import TechnicalDocumentsSection from './TechnicalDocumentsSection';

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
  const [inspectionLog, setInspectionLog] = useState<InspectionLog | null>(null);
  const [testingCriteria, setTestingCriteria] = useState<TestingCriterion[]>([]);
  const [reportTemplate, setReportTemplate] = useState<ReportTemplate | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // API_INTEGRATION: GET /api/v1/templates?sampleType=${assignment.sampleType}&requirements=${assignment.testingRequirements.join(',')}
    loadTemplateData();
    
    // API_INTEGRATION: GET /api/v1/inspection-logs?assignmentId=${assignment.id}
    loadExistingLog();
  }, [assignment]);

  const loadTemplateData = async () => {
    // Mock template data based on sample type and requirements
    const mockTemplate: ReportTemplate = {
      id: '1',
      sampleType: assignment.sampleType,
      testingRequirements: assignment.testingRequirements,
      sections: [
        {
          id: 'section1',
          name: 'Basic Testing',
          criteria: [
            {
              id: 'c1',
              name: 'Voltage Test',
              unit: 'V',
              attempts: [],
              result: null,
              children: [
                {
                  id: 'c1.1',
                  name: 'Open Circuit Voltage',
                  unit: 'V',
                  attempts: [],
                  result: null,
                  parentId: 'c1',
                },
                {
                  id: 'c1.2',
                  name: 'Load Voltage',
                  unit: 'V',
                  attempts: [],
                  result: null,
                  parentId: 'c1',
                },
              ],
            },
            {
              id: 'c2',
              name: 'Capacity Test',
              unit: 'mAh',
              attempts: [],
              result: null,
            },
          ],
        },
      ],
    };

    setReportTemplate(mockTemplate);
    setTestingCriteria(mockTemplate.sections.flatMap(s => s.criteria));
  };

  const loadExistingLog = async () => {
    // API_INTEGRATION: Check for existing inspection log
    // For now, create a new one if none exists
    if (!inspectionLog) {
      const newLog: InspectionLog = {
        id: Date.now().toString(),
        assignmentId: assignment.id,
        sampleSymbol: assignment.sampleCode,
        testingStandards: assignment.testingRequirements,
        testSample: assignment.testSample,
        testingDate: new Date().toISOString().split('T')[0],
        sampleInfo: {},
        testingCriteria: [],
        status: 'Draft',
        createdBy: 'current-user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setInspectionLog(newLog);
    }
  };

  const handleUpdateCriteria = async () => {
    // API_INTEGRATION: GET /api/v1/templates/additional-criteria
    toast({
      title: "Update Function",
      description: "Additional testing criteria can be added per customer requests",
    });
  };

  const handleSaveInspectionLog = async () => {
    if (!inspectionLog) return;

    const updatedLog: InspectionLog = {
      ...inspectionLog,
      testingCriteria,
      updatedAt: new Date().toISOString(),
    };

    // API_INTEGRATION: POST/PUT /api/v1/inspection-logs
    setInspectionLog(updatedLog);

    // Update assignment status if not already in progress
    if (assignment.status === 'Pending') {
      const updatedAssignment: Assignment = {
        ...assignment,
        status: 'In Progress',
        updatedAt: new Date().toISOString(),
      };
      onUpdateAssignment(updatedAssignment);
    }

    toast({
      title: "Saved",
      description: "Inspection data has been saved successfully",
    });
  };

  const handleGenerateReport = async () => {
    if (!inspectionLog) return;

    // API_INTEGRATION: POST /api/v1/reports/generate
    const updatedAssignment: Assignment = {
      ...assignment,
      status: 'Done',
      updatedAt: new Date().toISOString(),
    };

    onUpdateAssignment(updatedAssignment);

    toast({
      title: "Report Generated",
      description: "Draft report has been created and assignment marked as Done",
    });
  };

  if (!inspectionLog) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
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
          <Button variant="outline" onClick={handleUpdateCriteria}>
            <Plus className="h-4 w-4 mr-2" />
            Update Criteria
          </Button>
          <Button onClick={handleSaveInspectionLog}>
            Save Progress
          </Button>
          {assignment.status === 'In Progress' && (
            <Button variant="default" onClick={handleGenerateReport}>
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          )}
        </div>
      </div>

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

      {/* Section 3: Testing Criteria */}
      <TestingCriteriaSection
        criteria={testingCriteria}
        onUpdateCriteria={setTestingCriteria}
      />
    </div>
  );
};

export default InspectionDashboard;
