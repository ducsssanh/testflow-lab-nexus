
import React from 'react';
import InspectionChart from './InspectionChart';

const InspectionChartsView: React.FC = () => {
  // Mock data based on the image structure
  const inspectionData = [
    {
      testReference: '2.6.2.1/ 7.3.1',
      testTitle: 'TABLE: External short circuit (Cell)',
      resultStatus: 'P' as const,
      samples: [
        { id: 'C#06', ambient: '', ocvStart: '', resistance: '', maxTemp: '', results: '' },
        { id: 'C#07', ambient: '', ocvStart: '', resistance: '', maxTemp: '', results: '' },
        { id: 'C#08', ambient: '', ocvStart: '', resistance: '', maxTemp: '', results: '' },
        { id: 'C#09', ambient: '', ocvStart: '', resistance: '', maxTemp: '', results: '' },
        { id: 'C#10', ambient: '', ocvStart: '', resistance: '', maxTemp: '', results: '' },
        { id: 'C#11', ambient: '', ocvStart: '', resistance: '', maxTemp: '', results: '' },
        { id: 'C#12', ambient: '', ocvStart: '', resistance: '', maxTemp: '', results: '' },
        { id: 'C#13', ambient: '', ocvStart: '', resistance: '', maxTemp: '', results: '' },
        { id: 'C#14', ambient: '', ocvStart: '', resistance: '', maxTemp: '', results: '' },
        { id: 'C#15', ambient: '', ocvStart: '', resistance: '', maxTemp: '', results: '' },
      ],
      temperatureConditions: {
        upper: '45',
        lower: '0'
      },
      supplementaryInfo: ['No fire, no explosion'],
      testingTime: '',
      tester: '',
      equipment: 'PSI.TB-'
    },
    {
      testReference: '2.6.2.2/ 7.3.2',
      testTitle: 'TABLE: Overcharge (Cell)',
      resultStatus: 'N/A' as const,
      samples: [
        { id: 'C#16', ambient: '', ocvStart: '', resistance: '', maxTemp: '', results: '' },
        { id: 'C#17', ambient: '', ocvStart: '', resistance: '', maxTemp: '', results: '' },
        { id: 'C#18', ambient: '', ocvStart: '', resistance: '', maxTemp: '', results: '' },
        { id: 'C#19', ambient: '', ocvStart: '', resistance: '', maxTemp: '', results: '' },
        { id: 'C#20', ambient: '', ocvStart: '', resistance: '', maxTemp: '', results: '' },
      ],
      temperatureConditions: {
        upper: '45',
        lower: '0'
      },
      supplementaryInfo: ['No fire, no explosion', 'Temperature monitoring required'],
      testingTime: '24 hours',
      tester: 'John Doe',
      equipment: 'PSI.OC-'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Inspection Criteria Charts</h2>
      </div>
      
      <div className="space-y-8">
        {inspectionData.map((data, index) => (
          <InspectionChart key={index} data={data} />
        ))}
      </div>
    </div>
  );
};

export default InspectionChartsView;
