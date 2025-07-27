import React from 'react';
import BasicParameters from './BasicParameters';
import WaveParameters from './WaveParameters';
import DynamicPattern from './DynamicPattern';
import CustomBeatSequence from './CustomBeatSequence';
import { WaveParams, CustomBeat } from '../../../types/types';

interface ControlPanelProps {
  waveParams: WaveParams;
  setWaveParams: (params: WaveParams) => void;
  pixelsPerMv: number;
  setPixelsPerMv: (value: number) => void;
  rWaveEnabled: boolean;
  setRWaveEnabled: (enabled: boolean) => void;
  rWaveCount: number;
  setRWaveCount: (count: number) => void;
  rWaveInterval: number;
  setRWaveInterval: (interval: number) => void;
  pWaveEnabled: boolean;
  setPWaveEnabled: (enabled: boolean) => void;
  pWaveCount: number;
  setPWaveCount: (count: number) => void;
  pWaveInterval: number;
  setPWaveInterval: (interval: number) => void;
  useCustomBeatParameters: boolean;
  setUseCustomBeatParameters: (enabled: boolean) => void;
  repeatInterval: number;
  setRepeatInterval: (interval: number) => void;
  customBeats: CustomBeat[];
  setCustomBeats: (beats: CustomBeat[]) => void;
  onApplyChanges: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = (props) => {
  return (
    <div className="w-full lg:w-80 xl:w-96 bg-gray-50 p-6 overflow-y-auto max-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">ECG Simulator</h1>
      
      <BasicParameters
        waveParams={props.waveParams}
        setWaveParams={props.setWaveParams}
        pixelsPerMv={props.pixelsPerMv}
        setPixelsPerMv={props.setPixelsPerMv}
      />
      
      <WaveParameters
        waveParams={props.waveParams}
        setWaveParams={props.setWaveParams}
      />
      
      <DynamicPattern
        title="Dynamic R Wave Pattern"
        enabled={props.rWaveEnabled}
        setEnabled={props.setRWaveEnabled}
        waveCount={props.rWaveCount}
        setWaveCount={props.setRWaveCount}
        waveInterval={props.rWaveInterval}
        setWaveInterval={props.setRWaveInterval}
        waveType="R"
      />
      
      <DynamicPattern
        title="Dynamic P Wave Pattern"
        enabled={props.pWaveEnabled}
        setEnabled={props.setPWaveEnabled}
        waveCount={props.pWaveCount}
        setWaveCount={props.setPWaveCount}
        waveInterval={props.pWaveInterval}
        setWaveInterval={props.setPWaveInterval}
        waveType="P"
      />
      
      <CustomBeatSequence
        useCustomBeatParameters={props.useCustomBeatParameters}
        setUseCustomBeatParameters={props.setUseCustomBeatParameters}
        repeatInterval={props.repeatInterval}
        setRepeatInterval={props.setRepeatInterval}
        customBeats={props.customBeats}
        setCustomBeats={props.setCustomBeats}
      />

      <button
        onClick={props.onApplyChanges}
        className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition-colors duration-200 shadow-sm"
      >
        Apply Changes
      </button>
    </div>
  );
};

export default ControlPanel;