import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { InspectionLog } from '@/types/lims';

interface OrderInformationSectionProps {
  inspectionLog: InspectionLog;
  onUpdate: (updates: Partial<InspectionLog>) => void;
}

const OrderInformationSection: React.FC<OrderInformationSectionProps> = ({
  inspectionLog,
  onUpdate,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="orderNumber">Order Number</Label>
            <Input
              id="orderNumber"
            value={inspectionLog.id}
            onChange={() => {}}
            />
          </div>
          <div>
            <Label htmlFor="orderDate">Order Date</Label>
            <Input
              id="orderDate"
              type="date"
              value={inspectionLog.orderDate}
              onChange={(e) => onUpdate({ orderDate: e.target.value })}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              value={inspectionLog.clientName}
              onChange={(e) => onUpdate({ clientName: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="clientAddress">Client Address</Label>
            <Input
              id="clientAddress"
              value={inspectionLog.clientAddress}
              onChange={(e) => onUpdate({ clientAddress: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={inspectionLog.notes}
            onChange={(e) => onUpdate({ notes: e.target.value })}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderInformationSection;