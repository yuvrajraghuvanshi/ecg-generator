import React from 'react';

interface ECGDisplayProps {
  svgRef: React.RefObject<SVGSVGElement>;
}

const ECGDisplay: React.FC<ECGDisplayProps> = ({ svgRef }) => {
  const SVG_WIDTH = 1000;
  const SVG_HEIGHT = 400;

  return (
    <div className="flex-1 p-6 bg-white">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">ECG Waveform</h2>
        <svg
          ref={svgRef}
          width={SVG_WIDTH}
          height={SVG_HEIGHT}
          className="border border-gray-300 rounded-lg bg-white w-full h-auto"
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        />
      </div>
    </div>
  );
};

export default ECGDisplay;