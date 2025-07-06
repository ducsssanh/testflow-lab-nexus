
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
              readOnly
              className="bg-gray-50"
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
            <Label htmlFor="testingRequirements">Testing Requirements</Label>
            <div className="flex flex-wrap gap-2 mt-2 p-3 border rounded-md bg-gray-50">
              {inspectionLog.testingRequirements.map((requirement, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {requirement}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Each requirement represents a separate testing section. Requirements are pre-assigned and cannot be modified.
            </p>
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="testSample">Test Sample (Model Name)</Label>
            <Input
              id="testSample"
              value={inspectionLog.testSample}
              readOnly
              className="bg-gray-50"
              placeholder="Enter model name"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderInformationSection;
