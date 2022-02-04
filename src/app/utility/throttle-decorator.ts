export interface Throttler {
  // The last encountered args.
  args: unknown[];
  // Store the thisArg for the internalThrottle() method so we can use apply(thisArg, args);
  thisArg: unknown;
  // If the method was called during a throttling.
  wasCalled: boolean;
}

/**
 * Throttles a method so it's only called at most once every interval.
 * @param interval the interval in milliseconds that the throttled method can be called.
 */
export function throttle(interval: number): MethodDecorator {
  // For angular component this method happens only once per component declaration.
  // As it modifies the prototype method.
  // So for example if component A has 3 instances the variables would be between all of them.
  // Which means that if all 3 call this method we'd only call it for the last caller.
  return function (target: unknown, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor {
    // Keep track of the individual instances that are trying to throttle.
    // The key is the thisArg reference.
    const throttlers: Map<unknown, Throttler> = new Map<unknown, Throttler>();
    // Original method reference.
    const original = descriptor.value;

    descriptor.value = function (...args: unknown[]): void {
      let throttler = throttlers.get(this);
      // If throttler already exist then we just update the args and says that it was called.
      if (throttler) {
        throttler.args = args;
        throttler.wasCalled = true;
        return;
      }

      throttler = createThrottler(args, this);
      original.apply(this, args);
      internalThrottle(throttler);
    };

    function createThrottler(args: unknown[], that: unknown): Throttler {
      const throttler: Throttler = {
        args,
        wasCalled: false,
        thisArg: that,
      };
      throttlers.set(that, throttler);
      return throttler;
    }

    function internalThrottle(throttler: Throttler): void {
      setTimeout(function (): void {
        if (!throttler.wasCalled) {
          throttlers.delete(throttler.thisArg);
          return;
        }

        original.apply(throttler.thisArg, throttler.args);
        throttler.wasCalled = false;
        internalThrottle(throttler);
      }, interval);
    }

    return descriptor;
  };
}
