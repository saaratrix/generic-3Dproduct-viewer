/**
 * Throttles a method so it's only called at most once every interval.
 * @param callback Must be a lambda or a bound method for now so that "this" is correct.
 * @param interval the interval in milliseconds that the throttle method can be called.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function throttle(callback: (...args: any[]) => void, interval: number): (...args: unknown[]) => void {
  let timerId: ReturnType<typeof setTimeout> | undefined = undefined;
  let nextAllowedCall: number = 0;

  // We need to store the lastArgs so we always execute the last callback when throttling.
  let lastArgs: unknown[];
  return function (...args: unknown[]): void {
    lastArgs = args;
    if (timerId !== null) {
      return;
    }

    const now = Date.now();
    if (now >= nextAllowedCall) {
      callback(...args);
    } else {
      timerId = setTimeout(() => {
        nextAllowedCall = Date.now() + interval;
        callback(...lastArgs);
        timerId = undefined;
      }, nextAllowedCall - now);
    }

    nextAllowedCall = now + interval;
  };
}
