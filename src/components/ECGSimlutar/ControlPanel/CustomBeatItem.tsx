import React from 'react';
import type { CustomBeat } from '../../../types/types';

interface CustomBeatItemProps {
  beat: CustomBeat;
  index: number;
  onUpdate: (index: number, field: keyof CustomBeat, value: number) => void;
  onRemove: (index: number) => void;
}

const CustomBeatItem: React.FC<CustomBeatItemProps> = ({ beat, index, onUpdate, onRemove }) => {
  const parameters = {
    'h_p': 'P Height',
    'b_p': 'P Breadth', 
    'h_q': 'Q Height',
    'b_q': 'Q Breadth',
    'h_r': 'R Height',
    'b_r': 'R Breadth',
    'h_s': 'S Height',
    'b_s': 'S Breadth',
    'h_t': 'T Height',
    'b_t': 'T Breadth',
    'l_pq': 'PQ Length',
    'l_st': 'ST Length',
    'l_tp': 'TP Length'
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
      <h4 className="text-sm font-medium text-gray-700 mb-3">Custom Beat {index + 1}</h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {Object.entries(parameters).map(([key, label]) => (
          <div key={key} className="flex items-center gap-2">
            <label className="flex-1 text-xs text-gray-600 min-w-[80px]">
              {label}:
            </label>
            <input
              type="number"
              value={beat[key as keyof CustomBeat]}
              onChange={(e) => onUpdate(index, key as keyof CustomBeat, parseFloat(e.target.value))}
              className="flex-1 min-w-[60px] px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              step="0.01"
            />
          </div>
        ))}
      </div>
      
      <button
        onClick={() => onRemove(index)}
        className="mt-3 w-full px-3 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors duration-200"
      >
        Remove Beat
      </button>
    </div>
  );
};

export default CustomBeatItem;