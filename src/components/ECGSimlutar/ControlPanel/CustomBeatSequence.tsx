import React from 'react';
import CustomBeatItem from './CustomBeatItem';
import type { CustomBeat } from '../../../types/types';
import InputField from './InputField';

interface CustomBeatSequenceProps {
  useCustomBeatParameters: boolean;
  setUseCustomBeatParameters: (enabled: boolean) => void;
  repeatInterval: number;
  setRepeatInterval: (interval: number) => void;
  customBeats: CustomBeat[];
  setCustomBeats: (beats: CustomBeat[]) => void;
}

const CustomBeatSequence: React.FC<CustomBeatSequenceProps> = ({ 
  useCustomBeatParameters, 
  setUseCustomBeatParameters, 
  repeatInterval, 
  setRepeatInterval, 
  customBeats, 
  setCustomBeats 
}) => {
  const addCustomBeat = () => {
    const newBeat: CustomBeat = {
      h_p: 0.15, b_p: 0.08, h_q: -0.1, b_q: 0.025, h_r: 1.2, b_r: 0.05,
      h_s: -0.25, b_s: 0.025, h_t: 0.2, b_t: 0.16,
      l_pq: 0.08, l_st: 0.12, l_tp: 0.3
    };
    setCustomBeats([...customBeats, newBeat]);
  };

  const removeCustomBeat = (index: number) => {
    setCustomBeats(customBeats.filter((_, i) => i !== index));
  };

  const updateCustomBeat = (index: number, field: keyof CustomBeat, value: number) => {
    const updated = [...customBeats];
    updated[index] = { ...updated[index], [field]: value };
    setCustomBeats(updated);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Custom Beat Sequence</h3>
      
      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          id="custom-beats-enabled"
          checked={useCustomBeatParameters}
          onChange={(e) => setUseCustomBeatParameters(e.target.checked)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="custom-beats-enabled" className="text-sm text-gray-700">
          Enable Custom Beat Sequence
        </label>
      </div>
      
      <InputField
        label="Normal Beats Before Repeat"
        value={repeatInterval}
        onChange={setRepeatInterval}
        step="1"
        min="0"
        type="int"
      />

      <div className="space-y-4">
        {customBeats.map((beat, index) => (
          <CustomBeatItem
            key={index}
            beat={beat}
            index={index}
            onUpdate={updateCustomBeat}
            onRemove={removeCustomBeat}
          />
        ))}
      </div>

      <button
        onClick={addCustomBeat}
        className="w-full mt-4 px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md transition-colors duration-200"
      >
        + Add Custom Beat
      </button>
    </div>
  );
};

export default CustomBeatSequence;