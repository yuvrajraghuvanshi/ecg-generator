import type { Point, WaveParams, CustomBeat } from '../types/types';

export const raisedCosinePulse = (t: number, h: number, b: number, t0: number): number => {
  if (b === 0 || t < t0 || t > t0 + b) return 0;
  return (h / 2) * (1 - Math.cos((2 * Math.PI * (t - t0)) / b));
};

export const generateWaveformPoints = (
  waveParams: WaveParams,
  pixelsPerMv: number,
  rWaveEnabled: boolean,
  rWaveCount: number,
  rWaveInterval: number,
  pWaveEnabled: boolean,
  pWaveCount: number,
  pWaveInterval: number,
  useCustomBeatParameters: boolean,
  repeatInterval: number,
  customBeats: CustomBeat[],
  SVG_WIDTH: number,
  SVG_HEIGHT: number,
  PIXELS_PER_SECOND: number,
  globalCounters: {
    rCycleCounter: React.MutableRefObject<number>;
    pCycleCounter: React.MutableRefObject<number>;
    beatCounter: React.MutableRefObject<number>;
    customIdx: React.MutableRefObject<number>;
    waitingNormalBeats: React.MutableRefObject<number>;
  }
): Point[] => {
  const totalTime = SVG_WIDTH / PIXELS_PER_SECOND;
  const y0 = SVG_HEIGHT / 2;
  const pts: Point[] = [];
  const dt = 1 / PIXELS_PER_SECOND;

  let rCycleCounterLocal = globalCounters.rCycleCounter.current;
  let pCycleCounterLocal = globalCounters.pCycleCounter.current;
  let beatCounter = globalCounters.beatCounter.current;
  let customIdx = globalCounters.customIdx.current;
  let waitingNormalBeats = globalCounters.waitingNormalBeats.current;

  let tElapsed = 0;

  while (tElapsed <= totalTime) {
    let pCurrent = { ...waveParams };

    if (useCustomBeatParameters && customBeats.length > 0) {
      if (waitingNormalBeats === 0) {
        pCurrent = { ...pCurrent, ...customBeats[customIdx] };
        customIdx++;
        if (customIdx >= customBeats.length) {
          customIdx = 0;
          waitingNormalBeats = repeatInterval;
        }
      } else if (waitingNormalBeats > 0) {
        waitingNormalBeats--;
      }
    }

    let curPCount = pCurrent.n_p;
    if (pWaveEnabled) {
      pCycleCounterLocal++;
      if (pWaveInterval > 0 && pCycleCounterLocal >= pWaveInterval) {
        curPCount = pWaveCount;
        pCycleCounterLocal = 0;
      }
    }

    let curRCount = 1;
    if (rWaveEnabled) {
      rCycleCounterLocal++;
      if (rWaveInterval > 0 && rCycleCounterLocal >= rWaveInterval) {
        curRCount = rWaveCount;
        rCycleCounterLocal = 0;
      }
    }

    const base = curPCount * (pCurrent.b_p + pCurrent.l_pq)
      + (pCurrent.b_q + pCurrent.b_r + pCurrent.b_s) * (curRCount > 0 ? 1 : 0)
      + pCurrent.l_st + pCurrent.b_t + pCurrent.l_tp;

    const heart_period = 60 / (pCurrent.heart_rate || 60);
    const sf = heart_period / base;

    const s = {
      b_p: pCurrent.b_p * sf,
      l_pq: pCurrent.l_pq * sf,
      b_q: pCurrent.b_q * sf,
      b_r: pCurrent.b_r * sf,
      b_s: pCurrent.b_s * sf,
      l_st: pCurrent.l_st * sf,
      b_t: pCurrent.b_t * sf,
      l_tp: pCurrent.l_tp * sf
    };

    const cycleDuration = curPCount * (s.b_p + s.l_pq)
      + (curRCount > 0 ? (s.b_q + s.b_r + s.b_s) : 0)
      + s.l_st + s.b_t + s.l_tp;

    // Calculate timing for different waves
    let off = tElapsed;
    const times = {
      P: [] as number[],
      Q: 0,
      R: [] as number[],
      S: [] as number[],
      T: 0
    };

    for (let i = 0; i < curPCount; i++) {
      times.P.push(off + i * (s.b_p + s.l_pq));
    }
    off += curPCount * (s.b_p + s.l_pq);

    if (curRCount > 0) {
      for (let i = 0; i < curRCount; i++) {
        times.Q = off;
        off += s.b_q;
        times.R.push(off);
        off += s.b_r;
        times.S.push(off);
        off += s.b_s;
        if (i < curRCount - 1) off += s.l_pq / 2;
      }
    }
    off += s.l_st;
    times.T = off;

    const tEnd = tElapsed + cycleDuration;

    for (let t = tElapsed; t < tEnd; t += dt) {
      let v = 0;

      // P waves
      for (let start of times.P) {
        if (t >= start && t < start + s.b_p) {
          v = raisedCosinePulse(t, pCurrent.h_p, s.b_p, start);
          break;
        }
      }

      // Q wave
      if (!v && curRCount > 0 && t >= times.Q && t < times.Q + s.b_q) {
        v = raisedCosinePulse(t, pCurrent.h_q, s.b_q, times.Q);
      }

      // R waves
      if (!v && curRCount > 0) {
        for (let r of times.R) {
          if (t >= r && t < r + s.b_r) {
            v = raisedCosinePulse(t, pCurrent.h_r, s.b_r, r);
            break;
          }
        }
      }

      // S waves
      if (!v && curRCount > 0) {
        for (let sWave of times.S) {
          if (t >= sWave && t < sWave + s.b_s) {
            v = raisedCosinePulse(t, pCurrent.h_s, s.b_s, sWave);
            break;
          }
        }
      }

      // T wave
      if (!v && t >= times.T && t < times.T + s.b_t) {
        v = raisedCosinePulse(t, pCurrent.h_t, s.b_t, times.T);
      }

      pts.push({
        x: t * PIXELS_PER_SECOND,
        y: y0 - v * pixelsPerMv
      });
    }

    tElapsed += cycleDuration;
    beatCounter++;
  }

  // Update counters
  globalCounters.rCycleCounter.current = rCycleCounterLocal;
  globalCounters.pCycleCounter.current = pCycleCounterLocal;
  globalCounters.beatCounter.current = beatCounter;
  globalCounters.customIdx.current = customIdx;
  globalCounters.waitingNormalBeats.current = waitingNormalBeats;

  return pts;
};

export const drawGrid = (svgRef: React.RefObject<SVGSVGElement | null>, SVG_WIDTH: number, SVG_HEIGHT: number) => {
  if (!svgRef.current) return;

  const existingGrid = svgRef.current.querySelector('.grid-group');
  if (existingGrid) {
    existingGrid.remove();
  }

  const gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  gridGroup.setAttribute('class', 'grid-group');

  const small = 8;
  
  // Vertical lines
  for (let x = 0; x <= SVG_WIDTH; x += small) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x.toString());
    line.setAttribute('y1', '0');
    line.setAttribute('x2', x.toString());
    line.setAttribute('y2', SVG_HEIGHT.toString());
    line.setAttribute('stroke', '#eee');
    gridGroup.appendChild(line);
  }

  // Horizontal lines
  for (let y = 0; y <= SVG_HEIGHT; y += small) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', '0');
    line.setAttribute('y1', y.toString());
    line.setAttribute('x2', SVG_WIDTH.toString());
    line.setAttribute('y2', y.toString());
    line.setAttribute('stroke', '#eee');
    gridGroup.appendChild(line);
  }

  svgRef.current.appendChild(gridGroup);
};

export const initializeSVG = (
  svgRef: React.RefObject<SVGSVGElement | null>,
  SVG_WIDTH: number,
  SVG_HEIGHT: number,
  POINTER_RADIUS: number
) => {
  if (!svgRef.current) return;

  // Clear existing elements
  svgRef.current.innerHTML = '';
  
  drawGrid(svgRef, SVG_WIDTH, SVG_HEIGHT);

  // Create waveform path
  const waveformPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  waveformPath.setAttribute('class', 'waveform-path');
  waveformPath.setAttribute('stroke', '#2563eb');
  waveformPath.setAttribute('fill', 'none');
  waveformPath.setAttribute('stroke-width', '2');
  svgRef.current.appendChild(waveformPath);

  // Create pointer
  const pointerHead = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  pointerHead.setAttribute('class', 'pointer-head');
  pointerHead.setAttribute('r', POINTER_RADIUS.toString());
  pointerHead.setAttribute('fill', '#ef4444');
  pointerHead.setAttribute('stroke', '#ef4444');
  pointerHead.setAttribute('stroke-width', '2');
  svgRef.current.appendChild(pointerHead);
};

export const pointsToPath = (pts: (Point | null)[]): string => {
  return pts.reduce((str, p, i) => {
    if (!p) return str;
    return str + (i === 0 || !pts[i-1] ? "M" : " L") + ` ${p.x} ${p.y}`;
  }, "");
};