import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Assignment } from '@/types/lims';

interface SampleInfo {
  manufacturer: string;
  model: string;
  voltage: string;
  capacity: string;
  temperature: string;
}

interface SampleInformationSectionProps {
  assignment: Assignment;
  sampleInfo: SampleInfo;
  onUpdate: (sampleInfo: SampleInfo) => void;
}

const SampleInformationSection: React.FC<SampleInformationSectionProps> = ({
  assignment,
  sampleInfo,
  onUpdate,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sample Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="sampleCode">Sample Code</Label>
            <Input
              id="sampleCode"
              value={assignment.sampleCode}
              readOnly
              className="bg-gray-50"
            />
          </div>
          <div>
            <Label htmlFor="sampleType">Sample Type</Label>
            <Input
              id="sampleType"
              value={assignment.sampleType}
              readOnly
              className="bg-gray-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="manufacturer">Manufacturer</Label>
            <Input
              id="manufacturer"
              value={sampleInfo.manufacturer}
              onChange={(e) => onUpdate({ ...sampleInfo, manufacturer: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              value={sampleInfo.model}
              onChange={(e) => onUpdate({ ...sampleInfo, model: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="voltage">Voltage</Label>
            <Input
              id="voltage"
              value={sampleInfo.voltage}
              onChange={(e) => onUpdate({ ...sampleInfo, voltage: e.target.value })}
              placeholder="e.g., 12V"
            />
          </div>
          <div>
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              value={sampleInfo.capacity}
              onChange={(e) => onUpdate({ ...sampleInfo, capacity: e.target.value })}
              placeholder="e.g., 100Ah"
            />
          </div>
          <div>
            <Label htmlFor="temperature">Temperature</Label>
            <Input
              id="temperature"
              value={sampleInfo.temperature}
              onChange={(e) => onUpdate({ ...sampleInfo, temperature: e.target.value })}
              placeholder="e.g., 25°C"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SampleInformationSection;