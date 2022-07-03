import type { AnimationHandle } from "./animation-handle";

export interface ProgressAnimationOptions {
  /**
   * Duration in milliseconds.
   */
  duration: number;

  /**
   * @param elapsed Elapsed time in seconds.
   * @param deltaProgress Value scaled between 0 -> 1 based on duration.
   * @param currentProgress Value between 0 - 1 that basically is current += delta
   */
  onUpdate: (elapsed: number, deltaProgress: number, currentProgress: number) => void;
  onDispose?: () => void;

  easing?: (value: number) => number;
}

/**
 * Loops over a duration returning the progress from 0 -> 1.
 * @param options
 */
export function loopingProgressAnimation(options: ProgressAnimationOptions): AnimationHandle<ProgressAnimationOptions> {
  let isRunning: boolean = false;
  let lastFrame: number;
  let currentProgress = 0;

  let requestAnimationFrameId: number = -1;

  const animateLoop = (): void => {
    const now = performance.now();
    const elapsed = now - lastFrame;
    lastFrame = now;

    const deltaProgress = elapsed / options.duration;
    currentProgress += deltaProgress;
    while (currentProgress > 1) {
      currentProgress--;
    }

    if (options.easing) {
      currentProgress = options.easing(currentProgress);
    }

    options.onUpdate(elapsed / 1000, deltaProgress, currentProgress);

    if (isRunning) {
      requestAnimationFrameId = requestAnimationFrame(animateLoop);
    }
  };

  return {
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
      if (options.onDispose) {
        options.onDispose();
      }
    },
  };
}
