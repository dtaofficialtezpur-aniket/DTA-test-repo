/**
 * Where everything happens along the hero's scroll (0 = top, 1 = end).
 * Built from the number of stages, so adding a stage automatically re-times the whole story.
 * Every value stays inside 0–1 and never decreases, which the browser's scroll animations require.
 */
export type StageTimes = {
  moveStart: number;
  moveEnd: number;
  holdEnd: number;
  /** [fade in start, fully in, start fading out, gone] */
  caption: [number, number, number, number];
};

export type Timeline = {
  intro: number;
  stages: StageTimes[];
  pullStart: number;
  pullEnd: number;
  finale: [number, number, number];
  light: [number, number];
  canvasFade: [number, number];
  /** Boundaries of the progress-rail dots. */
  rail: number[];
};

export function makeTimeline(n: number): Timeline {
  const intro = 0.1;
  const span = 0.72 / Math.max(1, n);
  const stages: StageTimes[] = Array.from({ length: n }, (_, i) => {
    const moveStart = intro + i * span;
    const moveEnd = moveStart + span * 0.5;
    const holdEnd = moveStart + span;
    return { moveStart, moveEnd, holdEnd, caption: [moveStart + span * 0.35, moveStart + span * 0.6, holdEnd - 0.02, holdEnd + 0.04] };
  });
  const pullStart = intro + 0.72;
  return {
    intro,
    stages,
    pullStart,
    pullEnd: 0.9,
    finale: [0.86, 0.9, 0.95],
    light: [0.94, 1],
    canvasFade: [0.9, 0.97],
    rail: [0, ...stages.map((s) => s.moveStart + (s.moveEnd - s.moveStart) * 0.5), 0.84, 1],
  };
}
