/**
 * Throttles a method so it's only called once every interval.
 * @param callback Must be a lambda or a bound method for now so that "this" is correct.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function throttle(callback: (...args: any[]) => void, interval: number): (...args: unknown[]) => void {
  let isThrottling: boolean;
  let wasCalled: boolean = false;

  // We need to store the lastArgs so we always execute the last callback when throttling.
  let lastArgs: unknown[];
  return function (...args: unknown[]): void {
    lastArgs = args;
    if (isThrottling) {
      wasCalled = true;
      return;
    }

    callback(...args);
    isThrottling = true;
    internalThrottle();
  };

  function internalThrottle(): void {
    setTimeout(function () {
      if (!wasCalled) {
        isThrottling = false;
        return;
      }

      callback(...lastArgs);
      wasCalled = false;
      internalThrottle();
    }, interval);
  }
}
