
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { Order, TestCriterion } from '@/types/lims';
import { canUserAccessField } from '@/utils/roleBasedAccess';

interface OrderCardProps {
  order: Order;
  userRole: string;
  assignedTests: TestCriterion[];
  onSelect: (order: Order) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, userRole, assignedTests, onSelect }) => {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
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
            {canUserAccessField('sampleName', userRole) && order.sampleName && (
              <p className="text-gray-600">{order.sampleName}</p>
            )}
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-500">
              <div>
                <span className="font-medium">Loại:</span> {order.sampleType}
              </div>
              {canUserAccessField('dateReceived', userRole) && order.dateReceived && (
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
                {assignedTests.map((test) => (
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
            onClick={() => onSelect(order)}
            className="ml-4"
          >
            <Clock className="h-4 w-4 mr-2" />
            Kiểm định
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
