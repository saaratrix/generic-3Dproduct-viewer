import type { AnimationHandle } from "./animation-handle";

export interface IntervalAnimationOptions {
  /**
   * Maximum frame rate that request animation frame can be called.
   */
  maxFps?: number,
  /**
   * @param elapsed Elapsed in seconds.
   */
  onUpdate: (elapsed: number) => void;

  onDispose?: () => void;
}

/**
 * Returns an animation that happens as often as it can and calls onUpdate with elapsed time since last frame.
 * @param options
 */
export function intervalAnimation(options: IntervalAnimationOptions): AnimationHandle<IntervalAnimationOptions> {
  let isRunning: boolean = false;
  let lastFrame: number;
  let requestAnimationFrameId: number = -1;

  const animateLoop = (): void => {
    const now = performance.now();
    const elapsed = (now - lastFrame) / 1000;
    lastFrame = now;

    options.onUpdate(elapsed);

    if (isRunning) {
      requestAnimationFrameId = requestAnimationFrame(animateLoop);
    }
  };

  const handle: AnimationHandle<IntervalAnimationOptions> = {
    options,
    start: (): void => {
      if (isRunning) {
        return;
      }

      lastFrame = performance.now();
      isRunning = true;
      requestAnimationFrameId = requestAnimationFrame(animateLoop);
    },
    stop: (): void => {
      cancelAnimationFrame(requestAnimationFrameId);
      isRunning = false;
    },

    dispose: (): void => {
      handle.stop();
      if (options.onDispose) {
        options.onDispose();
      }
    },
  };

  return handle;
}
