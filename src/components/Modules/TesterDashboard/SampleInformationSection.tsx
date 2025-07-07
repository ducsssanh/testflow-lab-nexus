/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Assignment } from '@/types/lims';
import { useToast } from '@/hooks/use-toast';

interface SampleInformationSectionProps {
  assignment: Assignment;
  sampleInfo: Record<string, any>;
  onUpdate: (sampleInfo: Record<string, any>) => void;
  inspectionLogId?: string;
}

const SampleInformationSection: React.FC<SampleInformationSectionProps> = ({
  assignment,
  sampleInfo,
  onUpdate,
  inspectionLogId,
}) => {
  const { toast } = useToast();

  const updateField = async (field: string, value: any) => {
    const updatedSampleInfo = { ...sampleInfo, [field]: value };
    
    try {
      if (inspectionLogId) {
        const response = await fetch(`/api/v1/inspection-logs/${inspectionLogId}/sample-info`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ [field]: value })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const apiResponse = await response.json();
        
        if (!apiResponse.success) {
          throw new Error(apiResponse.error?.message || 'Failed to update sample info');
        }
      }
      
      onUpdate(updatedSampleInfo);
    } catch (error) {
      console.error('Failed to update sample info:', error);
      toast({
        title: "Warning",
        description: "Failed to save to server. Changes saved locally.",
        variant: "destructive"
      });
      
      // Still update locally
      onUpdate(updatedSampleInfo);
    }
  };

  // Form fields are fetched from backend based on sample type
  // GET /api/v1/templates/sample-fields?sampleType=${assignment.sampleType}
  // This will return the appropriate form fields configuration for each sample type
  
  const renderBatteryFields = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="voltage">Voltage (V)</Label>
        <Input
          id="voltage"
          value={sampleInfo.voltage || ''}
          onChange={(e) => updateField('voltage', e.target.value)}
          placeholder="Enter voltage"
        />
      </div>
      
      <div>
        <Label htmlFor="capacityTyp">Capacity Typ (mAh)</Label>
        <Input
          id="capacityTyp"
          value={sampleInfo.capacityTyp || ''}
          onChange={(e) => updateField('capacityTyp', e.target.value)}
          placeholder="Typical capacity"
        />
      </div>
      
      <div>
        <Label htmlFor="capacityMin">Capacity Min (mAh)</Label>
        <Input
          id="capacityMin"
          value={sampleInfo.capacityMin || ''}
          onChange={(e) => updateField('capacityMin', e.target.value)}
          placeholder="Minimum capacity"
        />
      </div>
      
      <div>
        <Label htmlFor="temperature">Temperature (°C)</Label>
        <Input
          id="temperature"
          value={sampleInfo.temperature || ''}
          onChange={(e) => updateField('temperature', e.target.value)}
          placeholder="Testing temperature"
        />
      </div>
    </div>
  );

  const renderITAVFields = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="model">Model Number</Label>
        <Input
          id="model"
          value={sampleInfo.model || ''}
          onChange={(e) => updateField('model', e.target.value)}
          placeholder="Equipment model"
        />
      </div>
      
      <div>
        <Label htmlFor="powerRating">Power Rating (W)</Label>
        <Input
          id="powerRating"
          value={sampleInfo.powerRating || ''}
          onChange={(e) => updateField('powerRating', e.target.value)}
          placeholder="Power rating"
        />
      </div>
      
      <div>
        <Label htmlFor="inputVoltage">Input Voltage (V)</Label>
        <Input
          id="inputVoltage"
          value={sampleInfo.inputVoltage || ''}
          onChange={(e) => updateField('inputVoltage', e.target.value)}
          placeholder="Input voltage range"
        />
      </div>
      
      <div>
        <Label htmlFor="outputVoltage">Output Voltage (V)</Label>
        <Input
          id="outputVoltage"
          value={sampleInfo.outputVoltage || ''}
          onChange={(e) => updateField('outputVoltage', e.target.value)}
          placeholder="Output voltage"
        />
      </div>
      
      <div className="md:col-span-2">
        <Label htmlFor="specifications">Technical Specifications</Label>
        <Input
          id="specifications"
          value={sampleInfo.specifications || ''}
          onChange={(e) => updateField('specifications', e.target.value)}
          placeholder="Additional technical specifications"
        />
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Section 2: Sample Information</CardTitle>
        <p className="text-sm text-gray-600">
          Sample Type: {assignment.sampleType}
          {assignment.sampleSubType && ` (${assignment.sampleSubType})`}
        </p>
      </CardHeader>
      <CardContent>
        {assignment.sampleType === 'Lithium Battery' 
          ? renderBatteryFields() 
          : renderITAVFields()
        }
      </CardContent>
    </Card>
  );
};

export default SampleInformationSection;
