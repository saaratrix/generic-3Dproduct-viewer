/**
 * Throttles a method so it's only called once every interval.
 * @param callback Must be a lambda or a bound method for now so that "this" is correct.
 */
export function throttle(callback: (...args: any[]) => void, interval: number): (...args: any[]) => void {
  let timerId: number | null = null;
  let callCount = 0;

  return function(...args: any[]): void {
    if (timerId !== null) {
      return;
      callCount++;
    }

    timerId = setTimeout(() => {
      if (callCount !== 0) {
        callback(...args);
      }
      timerId = null;
      callCount = 0;
    }, interval) as any; // Because it wants to use the Node.js typing for setTimeout we just cast it to any.
    callback(...args);
  };
}
