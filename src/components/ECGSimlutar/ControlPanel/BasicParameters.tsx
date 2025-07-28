import React from 'react';
import InputField from './InputField';
import type { WaveParams } from '../../../types/types';

interface BasicParametersProps {
  waveParams: WaveParams;
  setWaveParams: (params: WaveParams) => void;
  pixelsPerMv: number;
  setPixelsPerMv: (value: number) => void;
}

const BasicParameters: React.FC<BasicParametersProps> = ({ 
  waveParams, 
  setWaveParams, 
  pixelsPerMv, 
  setPixelsPerMv 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Parameters</h3>
      
      <InputField
        label="Heart Rate (bpm)"
        value={waveParams.heart_rate}
        onChange={(value) => setWaveParams({...waveParams, heart_rate: value})}
        step="1"
        min="20"
        max="250"
        type="int"
      />
      
      <InputField
        label="Pixels per mV"
        value={pixelsPerMv}
        onChange={setPixelsPerMv}
        step="10"
        min="10"
        type="int"
      />
    </div>
  );
};

export default BasicParameters;