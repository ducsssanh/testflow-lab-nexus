import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, FileText, Clock } from 'lucide-react';
import { Order, TestLog, TestCriterion, TestTemplate } from '@/types/lims';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { filterOrdersByRole, canUserAccessField } from '@/utils/roleBasedAccess';
import TechnicalDocuments from './TechnicalDocuments';

const TesterDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [testLogs, setTestLogs] = useState<TestLog[]>([]);
  const [testTemplates, setTestTemplates] = useState<TestTemplate[]>([]);
  const [testResults, setTestResults] = useState<Record<string, string>>({});
  
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
      technicalDocuments: [],
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

        {/* Technical Documents Section */}
        {selectedOrder.technicalDocuments && selectedOrder.technicalDocuments.length > 0 && (
          <TechnicalDocuments
            documents={selectedOrder.technicalDocuments}
            onDocumentsChange={() => {}} // Read-only for testers
            canUpload={false}
          />
        )}

        <Card>
          <CardHeader>
            <CardTitle>Thực hiện kiểm định</CardTitle>
            <CardDescription>
              Nhập kết quả cho các test được yêu cầu. Mọi thay đổi sẽ được ghi lại với thông tin người thực hiện.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {assignedTests.map((test) => (
              <div key={test.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{test.name}</h4>
                    <p className="text-sm text-gray-500">{test.category}</p>
                  </div>
                  <Badge variant="outline">{test.unit || 'N/A'}</Badge>
                </div>
                
                {/* Show existing logs for this test */}
                {testLogs.filter(log => log.testId === test.id).map((log) => (
                  <div key={log.id} className="bg-gray-50 p-3 rounded text-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{log.testerName}</span>
                      <span className="text-gray-500">
                        {new Date(log.timestamp).toLocaleString('vi-VN')}
                      </span>
                    </div>
                    <p>Kết quả: {log.result}</p>
                    {log.notes && <p className="text-gray-600">Ghi chú: {log.notes}</p>}
                  </div>
                ))}

                {/* Input for new result */}
                <div className="space-y-2">
                  <Label htmlFor={`test-${test.id}`}>Kết quả mới</Label>
                  <Input
                    id={`test-${test.id}`}
                    value={testResults[test.id] || ''}
                    onChange={(e) => handleTestResultChange(test.id, e.target.value)}
                    placeholder={`Nhập kết quả${test.unit ? ` (${test.unit})` : ''}`}
                  />
                </div>
              </div>
            ))}

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                onClick={handleSaveTestResults}
                disabled={Object.keys(testResults).length === 0}
              >
                Lưu kết quả
              </Button>
              {selectedOrder.status === 'in-progress' && testLogs.length > 0 && (
                <Button variant="outline" onClick={generateDraftReport}>
                  <FileText className="h-4 w-4 mr-2" />
                  Tạo bản thảo báo cáo
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Bảng công việc</h2>
      
      <div className="grid gap-4">
        {filteredOrders.filter(order => ['pending', 'in-progress'].includes(order.status || '')).map((order) => (
          <Card key={order.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-4">
                    <h3 className="font-semibold text-lg">{order.sampleId}</h3>
                    <Badge variant={order.status === 'pending' ? 'secondary' : 'default'}>
                      {order.status === 'pending' ? 'Chờ xử lý' : 'Đang thực hiện'}
                    </Badge>
                  </div>
                  
                  {/* Only show fields that the user has access to */}
                  {canUserAccessField('sampleName', user?.role || 'tester') && order.sampleName && (
                    <p className="text-gray-600">{order.sampleName}</p>
                  )}
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-500">
                    <div>
                      <span className="font-medium">Loại:</span> {order.sampleType}
                    </div>
                    {canUserAccessField('dateReceived', user?.role || 'tester') && order.dateReceived && (
                      <div>
                        <span className="font-medium">Ngày nhận:</span> {order.dateReceived}
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Số test:</span> {order.assignedTests?.length || 0}
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-sm text-gray-600 mb-2">Các test cần thực hiện:</p>
                    <div className="flex flex-wrap gap-2">
                      {order.assignedTests && getAssignedTests(order as Order).map((test) => (
                        <Badge key={test.id} variant="outline" className="text-xs">
                          {test.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Show technical documents indicator */}
                  {order.technicalDocuments && order.technicalDocuments.length > 0 && (
                    <div className="pt-2">
                      <p className="text-sm text-blue-600">
                        📄 {order.technicalDocuments.length} tài liệu kỹ thuật có sẵn
                      </p>
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={() => setSelectedOrder(order as Order)}
                  className="ml-4"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Kiểm định
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.filter(order => ['pending', 'in-progress'].includes(order.status || '')).length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500 text-lg">Không có mẫu nào cần kiểm định</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TesterDashboard;
