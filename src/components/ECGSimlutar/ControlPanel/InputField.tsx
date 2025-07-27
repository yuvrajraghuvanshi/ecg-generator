import React from 'react';

interface InputFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: string;
  min?: string;
  max?: string;
  type?: 'int' | 'float';
}

const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  value, 
  onChange, 
  step = "0.01", 
  min, 
  max, 
  type = 'float' 
}) => {
  return (
    <div className="flex items-center gap-3 mb-3">
      <label className="flex-1 text-sm text-gray-600 min-w-[140px]">
        {label}:
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(type === 'int' ? parseInt(e.target.value, 10) : parseFloat(e.target.value))}
        className="flex-1 min-w-[70px] px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        step={step}
        min={min}
        max={max}
      />
    </div>
  );
};

export default InputField;