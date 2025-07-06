
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Order } from '@/types/lims';

interface ManualParameterEntryProps {
  selectedOrder: Order;
  onSaveParameters: (parameters: ManualParameters) => void;
}

interface ManualParameters {
  sampleNumber: string;
  date: string;
  voltage: string;
  capacityTyp: string;
  capacityMin: string;
  xaStd: string;
  xaCutOff: string;
  xaMax: string;
  sacP1Measurements: Array<{ voltage: string; current: string; cutOff: string }>;
  sacP2Measurements: Array<{ voltage: string; current: string; cutOff: string }>;
  temperature: string;
  notes: string;
}

const ManualParameterEntry: React.FC<ManualParameterEntryProps> = ({
  selectedOrder,
  onSaveParameters,
}) => {
  const [parameters, setParameters] = useState<ManualParameters>({
    sampleNumber: '',
    date: new Date().toISOString().split('T')[0],
    voltage: '',
    capacityTyp: '',
    capacityMin: '',
    xaStd: '',
    xaCutOff: '',
    xaMax: '',
    sacP1Measurements: [
      { voltage: '', current: '', cutOff: '' },
      { voltage: '', current: '', cutOff: '' },
      { voltage: '', current: '', cutOff: '' }
    ],
    sacP2Measurements: [
      { voltage: '', current: '', cutOff: '' },
      { voltage: '', current: '', cutOff: '' },
      { voltage: '', current: '', cutOff: '' }
    ],
    temperature: '',
    notes: ''
  });

  const handleInputChange = (field: keyof ManualParameters, value: string) => {
    setParameters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMeasurementChange = (
    section: 'sacP1Measurements' | 'sacP2Measurements',
    index: number,
    field: 'voltage' | 'current' | 'cutOff',
    value: string
  ) => {
    setParameters(prev => ({
      ...prev,
      [section]: prev[section].map((measurement, i) =>
        i === index ? { ...measurement, [field]: value } : measurement
      )
    }));
  };

  const handleSave = () => {
    console.log('Saving manual parameters:', parameters);
    onSaveParameters(parameters);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nhập thông số kiểm định thủ công</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Basic Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sampleNumber">Mẫu thử:</Label>
                <Input
                  id="sampleNumber"
                  value={parameters.sampleNumber}
                  onChange={(e) => handleInputChange('sampleNumber', e.target.value)}
                  placeholder="Nhập mẫu thử"
                />
              </div>
              <div>
                <Label htmlFor="date">Ngày:</Label>
                <Input
                  id="date"
                  type="date"
                  value={parameters.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                />
              </div>
            </div>

            {/* Sample Specifications */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">Thông số mẫu thử</h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="voltage">Điện áp (voltage): __(V)</Label>
                  <Input
                    id="voltage"
                    value={parameters.voltage}
                    onChange={(e) => handleInputChange('voltage', e.target.value)}
                    placeholder="Nhập điện áp"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Dung lượng (capacity):</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="capacityTyp" className="text-sm">Typ: __(mAh)</Label>
                      <Input
                        id="capacityTyp"
                        value={parameters.capacityTyp}
                        onChange={(e) => handleInputChange('capacityTyp', e.target.value)}
                        placeholder="Typ"
                      />
                    </div>
                    <div>
                      <Label htmlFor="capacityMin" className="text-sm">Min: __(mAh)</Label>
                      <Input
                        id="capacityMin"
                        value={parameters.capacityMin}
                        onChange={(e) => handleInputChange('capacityMin', e.target.value)}
                        placeholder="Min"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Measurements */}
          <div className="space-y-4">
            {/* Xa measurements */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">Xa:</h4>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="xaStd" className="text-sm">Std: __(mA)</Label>
                  <Input
                    id="xaStd"
                    value={parameters.xaStd}
                    onChange={(e) => handleInputChange('xaStd', e.target.value)}
                    placeholder="Std"
                  />
                </div>
                <div>
                  <Label htmlFor="xaCutOff" className="text-sm">Cut off: __(V)</Label>
                  <Input
                    id="xaCutOff"
                    value={parameters.xaCutOff}
                    onChange={(e) => handleInputChange('xaCutOff', e.target.value)}
                    placeholder="Cut off"
                  />
                </div>
                <div>
                  <Label htmlFor="xaMax" className="text-sm">Max: __(mA)</Label>
                  <Input
                    id="xaMax"
                    value={parameters.xaMax}
                    onChange={(e) => handleInputChange('xaMax', e.target.value)}
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>

            {/* Sac P1 measurements */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">Sạc P1:</h4>
              <div className="space-y-2">
                {parameters.sacP1Measurements.map((measurement, index) => (
                  <div key={`p1-${index}`} className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder={`(V):__`}
                      value={measurement.voltage}
                      onChange={(e) => handleMeasurementChange('sacP1Measurements', index, 'voltage', e.target.value)}
                    />
                    <Input
                      placeholder="mA"
                      value={measurement.current}
                      onChange={(e) => handleMeasurementChange('sacP1Measurements', index, 'current', e.target.value)}
                    />
                    <Input
                      placeholder="Cut off:"
                      value={measurement.cutOff}
                      onChange={(e) => handleMeasurementChange('sacP1Measurements', index, 'cutOff', e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Sac P2 measurements */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">Sạc P2:</h4>
              <div className="space-y-2">
                {parameters.sacP2Measurements.map((measurement, index) => (
                  <div key={`p2-${index}`} className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder={`(V):__`}
                      value={measurement.voltage}
                      onChange={(e) => handleMeasurementChange('sacP2Measurements', index, 'voltage', e.target.value)}
                    />
                    <Input
                      placeholder="mA"
                      value={measurement.current}
                      onChange={(e) => handleMeasurementChange('sacP2Measurements', index, 'current', e.target.value)}
                    />
                    <Input
                      placeholder="Cut off:"
                      value={measurement.cutOff}
                      onChange={(e) => handleMeasurementChange('sacP2Measurements', index, 'cutOff', e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Temperature */}
            <div>
              <Label htmlFor="temperature">t°: __</Label>
              <Input
                id="temperature"
                value={parameters.temperature}
                onChange={(e) => handleInputChange('temperature', e.target.value)}
                placeholder="Nhập nhiệt độ"
              />
            </div>
          </div>
        </div>

        {/* Notes section */}
        <div className="mt-6">
          <Label htmlFor="notes">Ghi chú:</Label>
          <Textarea
            id="notes"
            value={parameters.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Nhập ghi chú..."
            className="mt-2"
          />
        </div>

        {/* Save button */}
        <div className="flex justify-end mt-6">
          <Button onClick={handleSave}>
            Lưu thông số
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManualParameterEntry;
