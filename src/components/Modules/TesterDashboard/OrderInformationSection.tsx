
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
        <CardTitle>Section 1: Order Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="sampleSymbol">Sample Symbol (Coded Identifier)</Label>
            <Input
              id="sampleSymbol"
              value={inspectionLog.sampleSymbol}
              onChange={(e) => onUpdate({ sampleSymbol: e.target.value })}
              placeholder="Enter sample symbol"
            />
          </div>
          
          <div>
            <Label htmlFor="testingDate">Testing Date</Label>
            <Input
              id="testingDate"
              type="date"
              value={inspectionLog.testingDate}
              onChange={(e) => onUpdate({ testingDate: e.target.value })}
            />
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="testingStandards">Testing Standards</Label>
            <Input
              id="testingStandards"
              value={inspectionLog.testingStandards.join(', ')}
              onChange={(e) => onUpdate({ 
                testingStandards: e.target.value.split(', ').filter(s => s.trim()) 
              })}
              placeholder="e.g., QCVN 101:2020/BTTT, IEC 62133-2:2017"
            />
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="testSample">Test Sample (Model Name)</Label>
            <Input
              id="testSample"
              value={inspectionLog.testSample}
              onChange={(e) => onUpdate({ testSample: e.target.value })}
              placeholder="Enter model name"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderInformationSection;
