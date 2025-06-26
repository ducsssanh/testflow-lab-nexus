
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Order, TestCriterion, TestTemplate, User } from '@/types/lims';
import OrderCard from './OrderCard';

interface OrderListProps {
  orders: Partial<Order>[];
  userRole: User['role'];
  testTemplates: TestTemplate[];
  onSelectOrder: (order: Order) => void;
}

const OrderList: React.FC<OrderListProps> = ({ orders, userRole, testTemplates, onSelectOrder }) => {
  const getTestDetails = (testId: string): TestCriterion | undefined => {
    for (const template of testTemplates) {
      const test = template.availableTests.find(t => t.id === testId);
      if (test) return test;
    }
    return undefined;
  };

  const getAssignedTests = (order: Partial<Order>) => {
    if (!order.assignedTests) return [];
    return order.assignedTests.map(testId => getTestDetails(testId)).filter(Boolean) as TestCriterion[];
  };

  const activeOrders = orders.filter(order => ['pending', 'in-progress'].includes(order.status || ''));

  if (activeOrders.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500 text-lg">Không có mẫu nào cần kiểm định</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {activeOrders.map((order) => (
        <OrderCard
          key={order.id}
          order={order as Order}
          userRole={userRole}
          assignedTests={getAssignedTests(order)}
          onSelect={onSelectOrder}
        />
      ))}
    </div>
  );
};

export default OrderList;
