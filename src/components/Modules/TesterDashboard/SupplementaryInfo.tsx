
import React from 'react';
import { Input } from '@/components/ui/input';
import { SupplementaryInfo as SupplementaryInfoType } from '@/types/lims';

interface SupplementaryInfoProps {
  standardId: string;
  criterionId: string;
  supplementaryInfo?: SupplementaryInfoType;
}

const SupplementaryInfo: React.FC<SupplementaryInfoProps> = ({ 
  standardId, 
  criterionId, 
  supplementaryInfo 
}) => {
  const handleUpdate = (field: keyof SupplementaryInfoType, value: string) => {
    // TODO: REPLACE WITH REAL API CALL
    // API_INTEGRATION: Save supplementary info to database
    // PUT /api/v1/testing-standards/${standardId}/criteria/${criterionId}/supplementary-info
    console.log(`Updating ${field}:`, value);
  };

  return (
    <div className="p-4 bg-gray-50 border-t">
      <div className="space-y-3">
        <div>
          <strong>Supplementary information:</strong>
          <div className="ml-4 mt-1">
            {supplementaryInfo?.notes?.map((note, index) => (
              <div key={index}>- {note}</div>
            )) || <div>- No fire, no explosion, no leakage</div>}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>The testing time:</strong>
            <Input 
              className="mt-1 h-8" 
              placeholder="Enter testing time"
              value={supplementaryInfo?.testingTime || ''}
              onChange={(e) => handleUpdate('testingTime', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <strong>Tester:</strong>
              <Input 
                className="mt-1 h-8" 
                placeholder="Tester name"
                value={supplementaryInfo?.tester || ''}
                onChange={(e) => handleUpdate('tester', e.target.value)}
              />
            </div>
            <div>
              <strong>Equipment:</strong>
              <Input 
                className="mt-1 h-8" 
                placeholder="Equipment ID"
                value={supplementaryInfo?.equipment || 'PSI.TB-'}
                onChange={(e) => handleUpdate('equipment', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplementaryInfo;
