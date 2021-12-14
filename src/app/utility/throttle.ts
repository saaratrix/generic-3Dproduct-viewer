/**
 * Throttles a method so it's only called once every interval.
 * @param callback Must be a lambda or a bound method for now so that "this" is correct.
 */
export function throttle(callback: (...args: any[]) => void, interval: number): (...args: any[]) => void {
  let timerId: ReturnType<typeof setTimeout> | null = null;
  let nextAllowedCall: number = 0;

  // We need to store the lastArgs so we always execute the last callback when throttling.
  let lastArgs: any[];
  return function(...args: any[]): void {
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
        timerId = null;
      }, nextAllowedCall - now);
    }

    nextAllowedCall = now + interval;
  };
}
