import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, FileText, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { TechnicalDocument } from '@/types/lims';

interface Order {
  id: string;
  sampleName: string;
  sampleType: string;
  manufacturer: string;
  quantity: number;
  receivedDate: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  assignedTests: string[];
  notes: string;
  technicalDocuments: TechnicalDocument[];
}

interface NewOrderForm {
  sampleName: string;
  sampleType: string;
  manufacturer: string;
  quantity: number;
  notes: string;
  assignedTests: string[];
  technicalDocuments: TechnicalDocument[];
}

const availableTests = [
  'Battery Safety Test',
  'Performance Test',
  'Environmental Test',
  'EMC Test',
  'Vibration Test',
  'Temperature Test'
];

const sampleTypes = [
  'Battery Pack',
  'Charger',
  'Power Bank',
  'Cable',
  'Electronic Device'
];

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const [newOrder, setNewOrder] = useState<NewOrderForm>({
    sampleName: '',
    sampleType: '',
    manufacturer: '',
    quantity: 1,
    notes: '',
    assignedTests: [],
    technicalDocuments: []
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/v1/orders');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const apiResponse = await response.json();
      
      if (apiResponse.success) {
        setOrders(apiResponse.data);
      } else {
        throw new Error(apiResponse.error?.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive"
      });
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddOrder = async () => {
    try {
      const orderData = {
        ...newOrder,
        id: Date.now().toString(),
        receivedDate: new Date().toISOString().split('T')[0],
        status: 'Pending' as const
      };

      const response = await fetch('/api/v1/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();
      
      if (apiResponse.success) {
        setOrders(prev => [...prev, apiResponse.data]);
        setIsAddOrderOpen(false);
        setNewOrder({
          sampleName: '',
          sampleType: '',
          manufacturer: '',
          quantity: 1,
          notes: '',
          assignedTests: [],
          technicalDocuments: []
        });
        
        toast({
          title: "Success",
          description: "Order created successfully"
        });
      } else {
        throw new Error(apiResponse.error?.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Failed to create order:', error);
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive"
      });
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/v1/orders/${orderId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();
      
      if (apiResponse.success) {
        setOrders(prev => prev.filter(order => order.id !== orderId));
        toast({
          title: "Success",
          description: "Order deleted successfully"
        });
      } else {
        throw new Error(apiResponse.error?.message || 'Failed to delete order');
      }
    } catch (error) {
      console.error('Failed to delete order:', error);
      toast({
        title: "Error",
        description: "Failed to delete order",
        variant: "destructive"
      });
    }
  };

  const handleTestToggle = (testName: string) => {
    setNewOrder(prev => ({
      ...prev,
      assignedTests: prev.assignedTests.includes(testName)
        ? prev.assignedTests.filter(test => test !== testName)
        : [...prev.assignedTests, testName]
    }));
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.sampleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return 'secondary';
      case 'In Progress': return 'default';
      case 'Completed': return 'outline';
      default: return 'secondary';
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Order Management</h2>
        <Dialog open={isAddOrderOpen} onOpenChange={setIsAddOrderOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Order</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sampleName">Sample Name</Label>
                  <Input
                    id="sampleName"
                    value={newOrder.sampleName}
                    onChange={(e) => setNewOrder(prev => ({ ...prev, sampleName: e.target.value }))}
                    placeholder="Enter sample name"
                  />
                </div>
                <div>
                  <Label htmlFor="sampleType">Sample Type</Label>
                  <Select onValueChange={(value) => setNewOrder(prev => ({ ...prev, sampleType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sample type" />
                    </SelectTrigger>
                    <SelectContent>
                      {sampleTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input
                    id="manufacturer"
                    value={newOrder.manufacturer}
                    onChange={(e) => setNewOrder(prev => ({ ...prev, manufacturer: e.target.value }))}
                    placeholder="Enter manufacturer"
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newOrder.quantity}
                    onChange={(e) => setNewOrder(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                    min="1"
                  />
                </div>
              </div>

              <div>
                <Label>Assigned Tests</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availableTests.map(test => (
                    <div key={test} className="flex items-center space-x-2">
                      <Checkbox 
                        id={test}
                        checked={newOrder.assignedTests.includes(test)}
                        onCheckedChange={() => handleTestToggle(test)}
                      />
                      <Label htmlFor={test} className="text-sm">{test}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newOrder.notes}
                  onChange={(e) => setNewOrder(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Enter any additional notes"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddOrderOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddOrder}>
                  Create Order
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Status</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredOrders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-4">
                    <h3 className="font-semibold text-lg">{order.sampleName}</h3>
                    <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div><span className="font-medium">Type:</span> {order.sampleType}</div>
                    <div><span className="font-medium">Manufacturer:</span> {order.manufacturer}</div>
                    <div><span className="font-medium">Quantity:</span> {order.quantity}</div>
                    <div><span className="font-medium">Received:</span> {order.receivedDate}</div>
                  </div>

                  <div className="pt-2">
                    <p className="text-sm text-gray-600 mb-2">Assigned Tests:</p>
                    <div className="flex flex-wrap gap-2">
                      {order.assignedTests.map((test, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{test}</Badge>
                      ))
                      }
                    </div>
                  </div>

                  {order.technicalDocuments.length > 0 && (
                    <div className="pt-2">
                      <p className="text-sm text-blue-600">
                        <FileText className="inline h-4 w-4 mr-1" />
                        {order.technicalDocuments.length} technical documents
                      </p>
                    </div>
                  )}

                  {order.notes && (
                    <div className="pt-2">
                      <p className="text-sm text-gray-600"><span className="font-medium">Notes:</span> {order.notes}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <Button variant="outline" size="sm" onClick={() => setEditingOrder(order)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteOrder(order.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500 text-lg">No orders found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrderManagement;
