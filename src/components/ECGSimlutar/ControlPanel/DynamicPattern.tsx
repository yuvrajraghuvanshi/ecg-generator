import React from 'react';
import InputField from './InputField';

interface DynamicPatternProps {
  title: string;
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  waveCount: number;
  setWaveCount: (count: number) => void;
  waveInterval: number;
  setWaveInterval: (interval: number) => void;
  waveType: string;
}

const DynamicPattern: React.FC<DynamicPatternProps> = ({ 
  title, 
  enabled, 
  setEnabled, 
  waveCount, 
  setWaveCount, 
  waveInterval, 
  setWaveInterval, 
  waveType 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      
      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          id={`${waveType}-enabled`}
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor={`${waveType}-enabled`} className="text-sm text-gray-700">
          Enable {waveType} Wave Pattern
        </label>
      </div>
      
      <InputField
        label={`${waveType} Waves in Pattern`}
        value={waveCount}
        onChange={setWaveCount}
        step="1"
        min="0"
        type="int"
      />
      
      <InputField
        label="Apply After N QRS"
        value={waveInterval}
        onChange={setWaveInterval}
        step="1"
        min="0"
        type="int"
      />
    </div>
  );
};

export default DynamicPattern;