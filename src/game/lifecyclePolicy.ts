export type LifecycleSignal =
  | "WINDOW_BLUR"
  | "DOCUMENT_HIDDEN"
  | "WINDOW_FOCUS"
  | "DOCUMENT_VISIBLE"
  | "ORIENTATION_CHANGE";

export interface LifecyclePauseContext {
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  isModalSuspended: boolean;
}

const PAUSE_SIGNALS = new Set<LifecycleSignal>([
  "WINDOW_BLUR",
  "DOCUMENT_HIDDEN",
]);

export const shouldPauseForLifecycle = (
  context: LifecyclePauseContext,
  signal: LifecycleSignal,
) => {
  if (!PAUSE_SIGNALS.has(signal)) return false;
  if (!context.isPlaying || context.isGameOver) return false;
  if (context.isPaused || context.isModalSuspended) return false;
  return true;
};

export const shouldResetFrameClock = (signal: LifecycleSignal) =>
  signal === "WINDOW_BLUR" ||
  signal === "DOCUMENT_HIDDEN" ||
  signal === "WINDOW_FOCUS" ||
  signal === "DOCUMENT_VISIBLE" ||
  signal === "ORIENTATION_CHANGE";
