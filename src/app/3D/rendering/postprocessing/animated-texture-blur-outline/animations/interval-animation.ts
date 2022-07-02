export interface IntervalAnimationOptions {
  /**
   * Duration in milliseconds.
   */
  duration: number;

  /**
   * @param deltaProgress Value scaled between 0 -> 1 based on duration.
   * @param currentProgress Value between 0 - 1 that basically is current += delta
   */
  onUpdate: (deltaProgress: number, currentProgress: number) => void;

  easing?: (value: number) => number;
}

export interface IntervalAnimationHandle {
  start: () => void;
  stop: () => void;
  /**
   * We include the options in the handle so they can be updated by reference directly.
   */
  options: IntervalAnimationOptions,
}

/**
 * Returns a startable & stoppable animation.
 * @param options
 */
export function intervalAnimation(options: IntervalAnimationOptions): IntervalAnimationHandle {
  let isRunning: boolean = false;
  let lastFrame: number;
  let currentProgress = 0;

  let requestAnimationFrameId: number = -1;

  const animateLoop = (): void => {
    const now = Date.now();
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

    options.onUpdate(deltaProgress, currentProgress);

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

      lastFrame = Date.now();
      isRunning = true;
      requestAnimationFrameId = requestAnimationFrame(animateLoop);
    },
    stop: (): void => {
      cancelAnimationFrame(requestAnimationFrameId);
      isRunning = false;
    },
  };
}
