
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface InspectionData {
  testReference: string;
  testTitle: string;
  resultStatus: 'N/A' | 'P' | 'F';
  samples: {
    id: string;
    ambient: string;
    ocvStart: string;
    resistance: string;
    maxTemp: string;
    results: string;
  }[];
  temperatureConditions: {
    upper: string;
    lower: string;
  };
  supplementaryInfo: string[];
  testingTime: string;
  tester: string;
  equipment: string;
}

interface InspectionChartProps {
  data: InspectionData;
}

const InspectionChart: React.FC<InspectionChartProps> = ({ data }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'P': return 'bg-green-100 text-green-800';
      case 'F': return 'bg-red-100 text-red-800';
      case 'N/A': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const upperSamples = data.samples.filter(sample => 
    parseInt(sample.id.replace('C#', '')) <= 10
  );
  const lowerSamples = data.samples.filter(sample => 
    parseInt(sample.id.replace('C#', '')) > 10
  );

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold text-blue-600">
              {data.testReference}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">{data.testTitle}</p>
          </div>
          <Badge className={getStatusColor(data.resultStatus)}>
            {data.resultStatus}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Sample</TableHead>
                <TableHead className="font-semibold">Ambient (°C)</TableHead>
                <TableHead className="font-semibold">OCV at start of test (Vdc)</TableHead>
                <TableHead className="font-semibold">Resistance of circuit (mΩ)</TableHead>
                <TableHead className="font-semibold">Maximum case temperature (°C)</TableHead>
                <TableHead className="font-semibold">Results</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Upper temperature condition header */}
              <TableRow className="bg-blue-50">
                <TableCell colSpan={6} className="text-center font-medium text-blue-700">
                  Samples charged at charging temperature upper limit ({data.temperatureConditions.upper}°C)
                </TableCell>
              </TableRow>
              {upperSamples.map((sample) => (
                <TableRow key={sample.id}>
                  <TableCell className="font-medium">{sample.id}</TableCell>
                  <TableCell>{sample.ambient}</TableCell>
                  <TableCell>{sample.ocvStart}</TableCell>
                  <TableCell>{sample.resistance}</TableCell>
                  <TableCell>{sample.maxTemp}</TableCell>
                  <TableCell>{sample.results}</TableCell>
                </TableRow>
              ))}
              
              {/* Lower temperature condition header */}
              <TableRow className="bg-blue-50">
                <TableCell colSpan={6} className="text-center font-medium text-blue-700">
                  Samples charged at charging temperature lower limit ({data.temperatureConditions.lower}°C)
                </TableCell>
              </TableRow>
              {lowerSamples.map((sample) => (
                <TableRow key={sample.id}>
                  <TableCell className="font-medium">{sample.id}</TableCell>
                  <TableCell>{sample.ambient}</TableCell>
                  <TableCell>{sample.ocvStart}</TableCell>
                  <TableCell>{sample.resistance}</TableCell>
                  <TableCell>{sample.maxTemp}</TableCell>
                  <TableCell>{sample.results}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Supplementary Information */}
        <div className="space-y-2">
          <h4 className="font-semibold">Supplementary information:</h4>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {data.supplementaryInfo.map((info, index) => (
              <li key={index}>{info}</li>
            ))}
          </ul>
        </div>

        {/* Testing Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          <div>
            <span className="font-semibold">The testing time:</span>
            <p className="text-sm text-gray-700">{data.testingTime}</p>
          </div>
          <div>
            <span className="font-semibold">Tester:</span>
            <p className="text-sm text-gray-700">{data.tester}</p>
          </div>
          <div>
            <span className="font-semibold">Equipment:</span>
            <p className="text-sm text-gray-700">{data.equipment}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InspectionChart;
