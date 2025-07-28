import React from 'react';
import InputField from './InputField';
import type { WaveParams } from '../../../types/types';

interface WaveParametersProps {
  waveParams: WaveParams;
  setWaveParams: (params: WaveParams) => void;
}

const WaveParameters: React.FC<WaveParametersProps> = ({ waveParams, setWaveParams }) => {
  const parameters = {
    'h_p': 'P Wave Height',
    'b_p': 'P Wave Breadth',
    'h_q': 'Q Wave Height',
    'b_q': 'Q Wave Breadth',
    'h_r': 'R Wave Height',
    'b_r': 'R Wave Breadth',
    'h_s': 'S Wave Height',
    'b_s': 'S Wave Breadth',
    'h_t': 'T Wave Height',
    'b_t': 'T Wave Breadth',
    'l_pq': 'PQ Segment Length',
    'l_st': 'ST Segment Length',
    'l_tp': 'TP Segment Length',
    'n_p': 'Default P Waves per QRS'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Wave Parameters (mV, sec)</h3>
      
      {Object.entries(parameters).map(([key, label]) => (
        <InputField
          key={key}
          label={label}
          value={waveParams[key as keyof WaveParams]}
          onChange={(value) => setWaveParams({...waveParams, [key]: value})}
          step={key === 'n_p' ? '1' : '0.01'}
          type={key === 'n_p' ? 'int' : 'float'}
        />
      ))}
    </div>
  );
};

export default WaveParameters;