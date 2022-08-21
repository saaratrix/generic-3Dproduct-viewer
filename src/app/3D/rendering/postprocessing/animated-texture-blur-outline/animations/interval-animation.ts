import type { AnimationHandle } from './animation-handle';

export interface IntervalAnimationOptions {
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
  let isAnimating: boolean = false;
  let lastFrame: number;
  let requestAnimationFrameId: number = -1;

  const animateLoop = (): void => {
    const now = performance.now();
    const elapsed = (now - lastFrame) / 1000;
    lastFrame = now;

    options.onUpdate(elapsed);

    if (isAnimating) {
      requestAnimationFrameId = requestAnimationFrame(animateLoop);
    }
  };

  const handle: AnimationHandle<IntervalAnimationOptions> = {
    options,
    start: (): void => {
      if (isAnimating) {
        return;
      }

      lastFrame = performance.now();
      isAnimating = true;
      requestAnimationFrameId = requestAnimationFrame(animateLoop);
    },
    stop: (): void => {
      cancelAnimationFrame(requestAnimationFrameId);
      isAnimating = false;
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
