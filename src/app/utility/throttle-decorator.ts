/**
 * Throttles a method so that it's only at most called once per interval.
 */
export function throttle(interval: number): MethodDecorator {
  return function (target: unknown, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor {
    let timerId: number | null = null;
    let nextAllowedCall: number = 0;
    let lastArgs: unknown[];
    const original = descriptor.value;

    descriptor.value = function (...args: unknown[]): void {
      lastArgs = args;
      if (timerId !== null) {
        return;
      }

      const now = Date.now();
      if (now >= nextAllowedCall) {
        original.apply(this, lastArgs);
      } else {
        timerId = setTimeout(() => {
          nextAllowedCall = Date.now() + interval;
          original.apply(this, lastArgs);
          timerId = null;
        }, nextAllowedCall - now);
      }

      nextAllowedCall = now + interval;
    };

    return descriptor;
  };
}
