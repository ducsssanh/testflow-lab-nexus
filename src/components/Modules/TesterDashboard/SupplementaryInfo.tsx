
import React from 'react';
import { Input } from '@/components/ui/input';

interface SupplementaryInfoProps {
  standardId: string;
  criterionId: string;
}

const SupplementaryInfo: React.FC<SupplementaryInfoProps> = ({ standardId, criterionId }) => {
  return (
    <div className="p-4 bg-gray-50 border-t">
      <div className="space-y-3">
        <div>
          <strong>Supplementary information:</strong>
          <div className="ml-4 mt-1">
            - No fire, no explosion, no leakage
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>The testing time:</strong>
            <Input 
              className="mt-1 h-8" 
              placeholder="Enter testing time"
              onChange={(e) => {
                // TODO: REPLACE WITH REAL API CALL
                // API_INTEGRATION: Save testing time to database
                // PUT /api/v1/testing-standards/${standardId}/criteria/${criterionId}/metadata
                console.log('Testing time updated:', e.target.value);
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <strong>Tester:</strong>
              <Input 
                className="mt-1 h-8" 
                placeholder="Tester name"
                onChange={(e) => {
                  // TODO: REPLACE WITH REAL API CALL
                  // API_INTEGRATION: Save tester info to database
                  console.log('Tester updated:', e.target.value);
                }}
              />
            </div>
            <div>
              <strong>Equipment:</strong>
              <Input 
                className="mt-1 h-8" 
                placeholder="Equipment ID"
                defaultValue="PSI.TB-"
                onChange={(e) => {
                  // TODO: REPLACE WITH REAL API CALL
                  // API_INTEGRATION: Save equipment info to database
                  console.log('Equipment updated:', e.target.value);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplementaryInfo;
