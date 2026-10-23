export interface AnalogVector { x: number; y: number }
export const NEUTRAL_ANALOG_VECTOR: Readonly<AnalogVector> = Object.freeze({ x: 0, y: 0 });

/** Project pointer displacement onto a unit circle with an 11% deadzone.
 * Preserve proportional velocity from zero to full stick deflection.
 * No physical motion, camera, or game-state side effects. */
export const projectAnalogJoystick = (
  deltaX: number, deltaY: number, radius: number, deadzone = 0.11,
): AnalogVector => {
  if (![deltaX, deltaY, radius, deadzone].every(Number.isFinite) ||
      radius <= 0 || deadzone < 0 || deadzone >= 1) return { x: 0, y: 0 };
  const distance = Math.hypot(deltaX, deltaY);
  const raw = Math.min(1, distance / radius);
  if (raw <= deadzone) return { x: 0, y: 0 };
  const intensity = (raw - deadzone) / (1 - deadzone);
  return { x: (deltaX / distance) * intensity, y: (deltaY / distance) * intensity };
};

/** Keyboard keeps original 8-direction normalization; analog retains magnitude. */
export const projectAnalogMotion = (vector: AnalogVector): AnalogVector => {
  if (!Number.isFinite(vector.x) || !Number.isFinite(vector.y)) return { x: 0, y: 0 };
  const length = Math.hypot(vector.x, vector.y);
  const scale = length > 1 ? 1 / length : 1;
  return { x: vector.x * scale, y: vector.y * scale };
};
