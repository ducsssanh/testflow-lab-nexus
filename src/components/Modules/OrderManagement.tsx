import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit } from 'lucide-react';
import { Order, TestTemplate, TestCriterion, TechnicalDocument } from '@/types/lims';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import TechnicalDocuments from './TechnicalDocuments';

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [testTemplates, setTestTemplates] = useState<TestTemplate[]>([]);
  const [newOrder, setNewOrder] = useState({
    sampleName: '',
    sampleType: '',
    manufacturer: '',
    quantity: 1,
    notes: '',
    assignedTests: [] as string[],
    technicalDocuments: [] as TechnicalDocument[],
  });
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Mock data - replace with API calls
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
      technicalDocuments: [],
    },
  ];

  useEffect(() => {
    // API_INTEGRATION: Call GET /api/v1/orders to fetch all orders
    // API_INTEGRATION: Expects response: Order[]
    setOrders(mockOrders);
    
    // API_INTEGRATION: Call GET /api/v1/test-templates to fetch all test templates
    // API_INTEGRATION: Expects response: TestTemplate[]
    setTestTemplates(mockTestTemplates);
  }, []);

  const generateSampleId = () => {
    // Generate a unique coded sample ID for objectivity
    const prefix = newOrder.sampleType.substring(0, 2).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}-${timestamp}`;
  };

  const getAvailableTests = () => {
    const template = testTemplates.find(t => t.sampleType === newOrder.sampleType);
    return template?.availableTests || [];
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newOrder.sampleType || newOrder.assignedTests.length === 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn loại mẫu và ít nhất một test",
        variant: "destructive",
      });
      return;
    }

    const order: Order = {
      id: Date.now().toString(),
      sampleId: generateSampleId(),
      sampleName: newOrder.sampleName,
      sampleType: newOrder.sampleType,
      manufacturer: newOrder.manufacturer,
      dateReceived: new Date().toISOString().split('T')[0],
      quantity: newOrder.quantity,
      notes: newOrder.notes,
      status: 'pending',
      assignedTests: newOrder.assignedTests,
      createdBy: user?.id || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      technicalDocuments: newOrder.technicalDocuments,
    };

    // API_INTEGRATION: Call POST /api/v1/orders with body: Order
    // API_INTEGRATION: Expects response: { success: boolean, order: Order }
    
    setOrders(prev => [order, ...prev]);
    setIsCreating(false);
    setNewOrder({
      sampleName: '',
      sampleType: '',
      manufacturer: '',
      quantity: 1,
      notes: '',
      assignedTests: [],
      technicalDocuments: [],
    });

    toast({
      title: "Thành công",
      description: `Đã tạo đơn mẫu ${order.sampleId}`,
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'pending': { label: 'Chờ xử lý', variant: 'secondary' as const },
      'in-progress': { label: 'Đang thực hiện', variant: 'default' as const },
      'awaiting-approval': { label: 'Chờ duyệt', variant: 'outline' as const },
      'completed': { label: 'Hoàn thành', variant: 'default' as const },
    };
    const config = statusMap[status as keyof typeof statusMap];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredOrders = orders.filter(order => 
    order.sampleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.sampleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isCreating) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Tạo đơn mẫu mới</h2>
          <Button variant="outline" onClick={() => setIsCreating(false)}>
            Hủy
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin mẫu</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sampleName">Tên mẫu *</Label>
                  <Input
                    id="sampleName"
                    value={newOrder.sampleName}
                    onChange={(e) => setNewOrder(prev => ({ ...prev, sampleName: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sampleType">Loại mẫu *</Label>
                  <Select value={newOrder.sampleType} onValueChange={(value) => {
                    setNewOrder(prev => ({ ...prev, sampleType: value, assignedTests: [] }));
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại mẫu" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pin Lithium">Pin Lithium</SelectItem>
                      <SelectItem value="Desktop">Desktop</SelectItem>
                      <SelectItem value="Laptop">Laptop</SelectItem>
                      <SelectItem value="TV">TV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Nhà sản xuất</Label>
                  <Input
                    id="manufacturer"
                    value={newOrder.manufacturer}
                    onChange={(e) => setNewOrder(prev => ({ ...prev, manufacturer: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Số lượng mẫu</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={newOrder.quantity}
                    onChange={(e) => setNewOrder(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Ghi chú</Label>
                <Textarea
                  id="notes"
                  value={newOrder.notes}
                  onChange={(e) => setNewOrder(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              </div>

              {newOrder.sampleType && (
                <div className="space-y-2">
                  <Label>Chọn các test cần thực hiện *</Label>
                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto border rounded-md p-3">
                    {getAvailableTests().map((test) => (
                      <label key={test.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newOrder.assignedTests.includes(test.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewOrder(prev => ({
                                ...prev,
                                assignedTests: [...prev.assignedTests, test.id]
                              }));
                            } else {
                              setNewOrder(prev => ({
                                ...prev,
                                assignedTests: prev.assignedTests.filter(id => id !== test.id)
                              }));
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{test.name} - {test.category}</span>
                        <span className="text-xs text-gray-500 ml-auto">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(test.price)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Documents Upload Section */}
              <div className="space-y-4">
                <TechnicalDocuments
                  documents={newOrder.technicalDocuments}
                  onDocumentsChange={(documents) => 
                    setNewOrder(prev => ({ ...prev, technicalDocuments: documents }))
                  }
                  canUpload={true}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                  Hủy
                </Button>
                <Button type="submit">
                  Tạo đơn
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý mẫu</h2>
        {user?.role === 'reception' && (
          <Button onClick={() => setIsCreating(true)} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Tạo đơn mới</span>
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm mẫu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center space-x-4">
                    <h3 className="font-semibold text-lg">{order.sampleId}</h3>
                    {getStatusBadge(order.status)}
                  </div>
                  <p className="text-gray-600">{order.sampleName}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                    <div>
                      <span className="font-medium">Loại:</span> {order.sampleType}
                    </div>
                    <div>
                      <span className="font-medium">NSX:</span> {order.manufacturer}
                    </div>
                    <div>
                      <span className="font-medium">Ngày nhận:</span> {order.dateReceived}
                    </div>
                    <div>
                      <span className="font-medium">Số lượng:</span> {order.quantity}
                    </div>
                  </div>
                  {order.notes && (
                    <p className="text-sm text-gray-600 italic">Ghi chú: {order.notes}</p>
                  )}
                  {order.technicalDocuments && order.technicalDocuments.length > 0 && (
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Tài liệu:</span> {order.technicalDocuments.length} file
                    </p>
                  )}
                </div>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Chi tiết
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrderManagement;
