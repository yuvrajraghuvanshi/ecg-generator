
export interface WaveParams {
  heart_rate: number;
  h_p: number;
  b_p: number;
  h_q: number;
  b_q: number;
  h_r: number;
  b_r: number;
  h_s: number;
  b_s: number;
  h_t: number;
  b_t: number;
  l_pq: number;
  l_st: number;
  l_tp: number;
  n_p: number;
}

export interface CustomBeat {
  h_p: number;
  b_p: number;
  h_q: number;
  b_q: number;
  h_r: number;
  b_r: number;
  h_s: number;
  b_s: number;
  h_t: number;
  b_t: number;
  l_pq: number;
  l_st: number;
  l_tp: number;
}

export interface Point {
  x: number;
  y: number;
}