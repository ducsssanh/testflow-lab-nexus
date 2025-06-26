import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Order, TestLog, TestCriterion, TestTemplate, TechnicalDocument } from '@/types/lims';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { filterOrdersByRole, canUserAccessField } from '@/utils/roleBasedAccess';
import DocumentViewer from './DocumentViewer';
import OrderList from './TesterDashboard/OrderList';
import TestResultsForm from './TesterDashboard/TestResultsForm';
import TechnicalDocumentsSection from './TesterDashboard/TechnicalDocumentsSection';

const TesterDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [testLogs, setTestLogs] = useState<TestLog[]>([]);
  const [testTemplates, setTestTemplates] = useState<TestTemplate[]>([]);
  const [testResults, setTestResults] = useState<Record<string, string>>({});
  const [viewingDocument, setViewingDocument] = useState<TechnicalDocument | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Mock data
  const mockOrders: Order[] = [
    {
      id: '1',
      sampleId: 'LT-001',
      sampleName: 'Laptop Gaming XYZ',
      sampleType: 'Desktop',
      manufacturer: 'Tech Corp',
      dateReceived: '2024-01-15',
      quantity: 2,
      notes: 'Sample cần kiểm tra khẩn cấp',
      status: 'pending',
      assignedTests: ['t4', 't5'],
      createdBy: 'reception1',
      createdAt: '2024-01-15T09:00:00Z',
      updatedAt: '2024-01-15T09:00:00Z',
      technicalDocuments: [
        {
          id: '1',
          name: 'Technical_Specification.pdf',
          type: 'pdf',
          size: 1024000,
          uploadedAt: '2024-01-15T08:00:00Z',
          uploadedBy: 'reception1',
          url: 'uploads/tech-spec.pdf'
        },
        {
          id: '2',
          name: 'User_Manual.pdf',
          type: 'pdf',
          size: 2048000,
          uploadedAt: '2024-01-15T08:30:00Z',
          uploadedBy: 'reception1',
          url: 'uploads/user-manual.pdf'
        }
      ],
    },
    {
      id: '2',
      sampleId: 'PL-002',
      sampleName: 'Pin Lithium AAA',
      sampleType: 'Pin Lithium',
      manufacturer: 'Battery Inc',
      dateReceived: '2024-01-16',
      quantity: 5,
      notes: '',
      status: 'in-progress',
      assignedTests: ['t1', 't2'],
      createdBy: 'reception1',
      createdAt: '2024-01-16T10:00:00Z',
      updatedAt: '2024-01-16T10:00:00Z',
      technicalDocuments: [
        {
          id: '3',
          name: 'Battery_Datasheet.pdf',
          type: 'pdf',
          size: 512000,
          uploadedAt: '2024-01-16T09:00:00Z',
          uploadedBy: 'reception1',
          url: 'uploads/battery-datasheet.pdf'
        }
      ],
    },
  ];

  const mockTestTemplates: TestTemplate[] = [
    {
      id: '1',
      sampleType: 'Pin Lithium',
      availableTests: [
        { id: 't1', name: 'UN38.3 Test Summary', unit: '', category: 'Safety', price: 2500000 },
        { id: 't2', name: 'Altitude Simulation', unit: 'm', category: 'Environmental', price: 1500000 },
        { id: 't3', name: 'Thermal Test', unit: '°C', category: 'Environmental', price: 1200000 },
      ],
    },
    {
      id: '2',
      sampleType: 'Desktop',
      availableTests: [
        { id: 't4', name: 'EMC Conducted Emission', unit: 'dBμV', category: 'EMC', price: 3000000 },
        { id: 't5', name: 'Safety - Insulation', unit: 'MΩ', category: 'Safety', price: 800000 },
        { id: 't6', name: 'Energy Efficiency', unit: 'W', category: 'Performance', price: 1000000 },
      ],
    },
  ];

  useEffect(() => {
    // API_INTEGRATION: Call GET /api/v1/orders?status=pending,in-progress to fetch active orders
    // API_INTEGRATION: Expects response: Order[]
    setOrders(mockOrders);
    
    // API_INTEGRATION: Call GET /api/v1/test-templates
    // API_INTEGRATION: Expects response: TestTemplate[]
    setTestTemplates(mockTestTemplates);
  }, []);

  useEffect(() => {
    if (selectedOrder) {
      // API_INTEGRATION: Call GET /api/v1/test-logs?orderId=${selectedOrder.id}
      // API_INTEGRATION: Expects response: TestLog[]
      const mockLogs: TestLog[] = [];
      setTestLogs(mockLogs);
    }
  }, [selectedOrder]);

  const getTestDetails = (testId: string): TestCriterion | undefined => {
    for (const template of testTemplates) {
      const test = template.availableTests.find(t => t.id === testId);
      if (test) return test;
    }
    return undefined;
  };

  const getAssignedTests = (order: Order) => {
    return order.assignedTests.map(testId => getTestDetails(testId)).filter(Boolean) as TestCriterion[];
  };

  const handleTestResultChange = (testId: string, value: string) => {
    setTestResults(prev => ({
      ...prev,
      [testId]: value
    }));
  };

  const handleSaveTestResults = async () => {
    if (!selectedOrder) return;

    const newLogs: TestLog[] = Object.entries(testResults).map(([testId, result]) => ({
      id: Date.now().toString() + testId,
      orderId: selectedOrder.id,
      testId,
      result,
      testerId: user?.id || '',
      testerName: user?.fullName || '',
      timestamp: new Date().toISOString(),
    }));

    // API_INTEGRATION: Call POST /api/v1/test-logs with body: TestLog[]
    // API_INTEGRATION: Expects response: { success: boolean, logs: TestLog[] }

    setTestLogs(prev => [...prev, ...newLogs]);
    setTestResults({});

    // Update order status
    if (selectedOrder.status === 'pending') {
      // API_INTEGRATION: Call PATCH /api/v1/orders/${selectedOrder.id} with body: { status: 'in-progress' }
      setOrders(prev => prev.map(order => 
        order.id === selectedOrder.id 
          ? { ...order, status: 'in-progress' }
          : order
      ));
      setSelectedOrder(prev => prev ? { ...prev, status: 'in-progress' } : null);
    }

    toast({
      title: "Đã lưu",
      description: "Kết quả kiểm định đã được lưu thành công",
    });
  };

  const generateDraftReport = async () => {
    if (!selectedOrder) return;

    // API_INTEGRATION: Call POST /api/v1/reports/draft with body: { orderId: selectedOrder.id }
    // API_INTEGRATION: Expects response: { success: boolean, reportId: string }

    toast({
      title: "Đã tạo bản thảo",
      description: "Bản thảo báo cáo đã được tạo và gửi cho quản lý",
    });

    // Update order status
    setOrders(prev => prev.map(order => 
      order.id === selectedOrder.id 
        ? { ...order, status: 'awaiting-approval' }
        : order
    ));
    setSelectedOrder(prev => prev ? { ...prev, status: 'awaiting-approval' } : null);
  };

  // Filter orders based on user role for display
  const filteredOrders = user ? filterOrdersByRole(orders, user.role) : orders;

  // If viewing a document, show the DocumentViewer
  if (viewingDocument) {
    return (
      <DocumentViewer
        document={viewingDocument}
        onBack={() => setViewingDocument(null)}
      />
    );
  }

  if (selectedOrder) {
    const assignedTests = getAssignedTests(selectedOrder);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => setSelectedOrder(null)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại</span>
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Test Log - {selectedOrder.sampleId}</h2>
            {/* Only show sample name if user has access to it */}
            {canUserAccessField('sampleName', user?.role || 'tester') && (
              <p className="text-gray-600">{selectedOrder.sampleName}</p>
            )}
          </div>
        </div>

        {/* Technical Documents Section - Always show, even if empty */}
        <TechnicalDocumentsSection
          documents={selectedOrder.technicalDocuments || []}
          onViewDocument={(document) => {
            console.log('Viewing document:', document);
            setViewingDocument(document);
          }}
        />

        <Card>
          <CardHeader>
            <CardTitle>Thực hiện kiểm định</CardTitle>
            <CardDescription>
              Nhập kết quả cho các test được yêu cầu. Mọi thay đổi sẽ được ghi lại với thông tin người thực hiện.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TestResultsForm
              assignedTests={assignedTests}
              testLogs={testLogs}
              testResults={testResults}
              selectedOrder={selectedOrder}
              onTestResultChange={handleTestResultChange}
              onSaveTestResults={handleSaveTestResults}
              onGenerateDraftReport={generateDraftReport}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Bảng công việc</h2>
      
      <OrderList
        orders={filteredOrders}
        userRole={user?.role || 'tester'}
        testTemplates={testTemplates}
        onSelectOrder={setSelectedOrder}
      />
    </div>
  );
};

export default TesterDashboard;
