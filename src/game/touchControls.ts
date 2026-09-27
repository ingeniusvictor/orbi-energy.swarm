export type TouchDirection = "UP" | "DOWN" | "LEFT" | "RIGHT";

export interface TouchDirectionState {
  UP: boolean;
  DOWN: boolean;
  LEFT: boolean;
  RIGHT: boolean;
}

export const createTouchDirectionState = (): TouchDirectionState => ({
  UP: false,
  DOWN: false,
  LEFT: false,
  RIGHT: false,
});

export const getTouchMovementVector = (state: TouchDirectionState) => ({
  x: (state.RIGHT ? 1 : 0) - (state.LEFT ? 1 : 0),
  y: (state.DOWN ? 1 : 0) - (state.UP ? 1 : 0),
});

export const hasActiveTouchDirection = (state: TouchDirectionState) => {
  const { x, y } = getTouchMovementVector(state);
  return x !== 0 || y !== 0;
};
