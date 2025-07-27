import React, { useState, useEffect, useRef, useCallback } from 'react';
import ControlPanel from './ControlPanel';
import ECGDisplay from './ECGDisplay';
import { WaveParams, CustomBeat, Point } from '../../types/types';
import { 
  raisedCosinePulse, 
  generateWaveformPoints, 
  drawGrid, 
  initializeSVG, 
  pointsToPath 
} from '../../utils/waveFormUtils';

const ECGSimulator: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const animationFrameRef = useRef<number>();
  const lastTimestampRef = useRef<number>(0);
  const pointerXRef = useRef<number>(0);
  const firstSweepRef = useRef<boolean>(true);
  const pathPointsRef = useRef<Point[]>([]);
  const drawnPointsRef = useRef<(Point | null)[]>([]);
  
  // Global counters to persist beat state
  const globalBeatCounterRef = useRef<number>(0);
  const globalCustomIdxRef = useRef<number>(0);
  const globalWaitingNormalBeatsRef = useRef<number>(0);
  const globalRCycleCounterRef = useRef<number>(0);
  const globalPCycleCounterRef = useRef<number>(0);

  const [pixelsPerMv, setPixelsPerMv] = useState<number>(100);
  const [waveParams, setWaveParams] = useState<WaveParams>({
    heart_rate: 70,
    h_p: 0.15,
    b_p: 0.08,
    h_q: -0.1,
    b_q: 0.025,
    h_r: 1.2,
    b_r: 0.05,
    h_s: -0.25,
    b_s: 0.025,
    h_t: 0.2,
    b_t: 0.16,
    l_pq: 0.08,
    l_st: 0.12,
    l_tp: 0.3,
    n_p: 1
  });

  // Dynamic patterns
  const [rWaveEnabled, setRWaveEnabled] = useState<boolean>(false);
  const [rWaveCount, setRWaveCount] = useState<number>(2);
  const [rWaveInterval, setRWaveInterval] = useState<number>(5);
  const [pWaveEnabled, setPWaveEnabled] = useState<boolean>(false);
  const [pWaveCount, setPWaveCount] = useState<number>(0);
  const [pWaveInterval, setPWaveInterval] = useState<number>(3);

  // Custom beat sequence
  const [useCustomBeatParameters, setUseCustomBeatParameters] = useState<boolean>(false);
  const [repeatInterval, setRepeatInterval] = useState<number>(10);
  const [customBeats, setCustomBeats] = useState<CustomBeat[]>([]);

  const PIXELS_PER_SECOND = 150;
  const POINTER_RADIUS = 6;
  const ERASE_WIDTH = 12;
  const SVG_WIDTH = 1000;
  const SVG_HEIGHT = 400;

  const animationLoop = useCallback((timestamp: number) => {
    const dt = lastTimestampRef.current ? (timestamp - lastTimestampRef.current) / 1000 : 0;
    lastTimestampRef.current = timestamp;
    pointerXRef.current += PIXELS_PER_SECOND * dt;

    const pathPoints = pathPointsRef.current;
    const drawnPoints = drawnPointsRef.current;

    let idx = pathPoints.findIndex(pt => pt.x >= pointerXRef.current);
    if (idx < 0) idx = pathPoints.length - 1;

    const waveformPath = svgRef.current?.querySelector('.waveform-path') as SVGPathElement;
    const pointerHead = svgRef.current?.querySelector('.pointer-head') as SVGCircleElement;

    if (firstSweepRef.current) {
      drawnPointsRef.current = pathPoints.slice(0, idx + 1);
      if (waveformPath) {
        waveformPath.setAttribute("d", pointsToPath(drawnPointsRef.current));
      }
      if (pointerXRef.current > SVG_WIDTH) {
        firstSweepRef.current = false;
      }
    } else {
      if (pointerXRef.current > SVG_WIDTH) {
        pointerXRef.current = 0;
        pathPointsRef.current = generateWaveformPoints(
          waveParams,
          pixelsPerMv,
          rWaveEnabled,
          rWaveCount,
          rWaveInterval,
          pWaveEnabled,
          pWaveCount,
          pWaveInterval,
          useCustomBeatParameters,
          repeatInterval,
          customBeats,
          SVG_WIDTH,
          SVG_HEIGHT,
          PIXELS_PER_SECOND,
          {
            rCycleCounter: globalRCycleCounterRef,
            pCycleCounter: globalPCycleCounterRef,
            beatCounter: globalBeatCounterRef,
            customIdx: globalCustomIdxRef,
            waitingNormalBeats: globalWaitingNormalBeatsRef
          }
        );
      }

      const es = pointerXRef.current - ERASE_WIDTH / 2;
      const ee = pointerXRef.current + ERASE_WIDTH / 2;
      const si = drawnPoints.findIndex(pt => pt && pt.x >= es);
      const ei = drawnPoints.findIndex(pt => pt && pt.x > ee);

      for (let i = (si < 0 ? 0 : si); i < (ei < 0 ? drawnPoints.length : ei); i++) {
        drawnPoints[i] = pathPoints[i];
      }

      if (waveformPath) {
        waveformPath.setAttribute("d", pointsToPath(drawnPoints));
      }
    }

    const cur = pathPoints[idx];
    if (cur && pointerHead) {
      pointerHead.setAttribute("cx", cur.x.toString());
      pointerHead.setAttribute("cy", cur.y.toString());
    }

    animationFrameRef.current = requestAnimationFrame(animationLoop);
  }, [waveParams, pixelsPerMv, rWaveEnabled, rWaveCount, rWaveInterval, 
      pWaveEnabled, pWaveCount, pWaveInterval, useCustomBeatParameters, 
      repeatInterval, customBeats]);

  const applyChanges = () => {
    pathPointsRef.current = generateWaveformPoints(
      waveParams,
      pixelsPerMv,
      rWaveEnabled,
      rWaveCount,
      rWaveInterval,
      pWaveEnabled,
      pWaveCount,
      pWaveInterval,
      useCustomBeatParameters,
      repeatInterval,
      customBeats,
      SVG_WIDTH,
      SVG_HEIGHT,
      PIXELS_PER_SECOND,
      {
        rCycleCounter: globalRCycleCounterRef,
        pCycleCounter: globalPCycleCounterRef,
        beatCounter: globalBeatCounterRef,
        customIdx: globalCustomIdxRef,
        waitingNormalBeats: globalWaitingNormalBeatsRef
      }
    );
  };

  useEffect(() => {
    initializeSVG(svgRef, SVG_WIDTH, SVG_HEIGHT, POINTER_RADIUS);
    pathPointsRef.current = generateWaveformPoints(
      waveParams,
      pixelsPerMv,
      rWaveEnabled,
      rWaveCount,
      rWaveInterval,
      pWaveEnabled,
      pWaveCount,
      pWaveInterval,
      useCustomBeatParameters,
      repeatInterval,
      customBeats,
      SVG_WIDTH,
      SVG_HEIGHT,
      PIXELS_PER_SECOND,
      {
        rCycleCounter: globalRCycleCounterRef,
        pCycleCounter: globalPCycleCounterRef,
        beatCounter: globalBeatCounterRef,
        customIdx: globalCustomIdxRef,
        waitingNormalBeats: globalWaitingNormalBeatsRef
      }
    );
    drawnPointsRef.current = Array(pathPointsRef.current.length).fill(null);
    
    animationFrameRef.current = requestAnimationFrame(animationLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animationLoop]);

  useEffect(() => {
    pathPointsRef.current = generateWaveformPoints(
      waveParams,
      pixelsPerMv,
      rWaveEnabled,
      rWaveCount,
      rWaveInterval,
      pWaveEnabled,
      pWaveCount,
      pWaveInterval,
      useCustomBeatParameters,
      repeatInterval,
      customBeats,
      SVG_WIDTH,
      SVG_HEIGHT,
      PIXELS_PER_SECOND,
      {
        rCycleCounter: globalRCycleCounterRef,
        pCycleCounter: globalPCycleCounterRef,
        beatCounter: globalBeatCounterRef,
        customIdx: globalCustomIdxRef,
        waitingNormalBeats: globalWaitingNormalBeatsRef
      }
    );
  }, [pixelsPerMv]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      <ControlPanel
        waveParams={waveParams}
        setWaveParams={setWaveParams}
        pixelsPerMv={pixelsPerMv}
        setPixelsPerMv={setPixelsPerMv}
        rWaveEnabled={rWaveEnabled}
        setRWaveEnabled={setRWaveEnabled}
        rWaveCount={rWaveCount}
        setRWaveCount={setRWaveCount}
        rWaveInterval={rWaveInterval}
        setRWaveInterval={setRWaveInterval}
        pWaveEnabled={pWaveEnabled}
        setPWaveEnabled={setPWaveEnabled}
        pWaveCount={pWaveCount}
        setPWaveCount={setPWaveCount}
        pWaveInterval={pWaveInterval}
        setPWaveInterval={setPWaveInterval}
        useCustomBeatParameters={useCustomBeatParameters}
        setUseCustomBeatParameters={setUseCustomBeatParameters}
        repeatInterval={repeatInterval}
        setRepeatInterval={setRepeatInterval}
        customBeats={customBeats}
        setCustomBeats={setCustomBeats}
        onApplyChanges={applyChanges}
      />
      
      <ECGDisplay svgRef={svgRef} />
    </div>
  );
};

export default ECGSimulator;