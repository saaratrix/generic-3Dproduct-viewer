export function throttle(interval: number): MethodDecorator {
  return function(target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor {
    let timerId: ReturnType<typeof setTimeout> | null = null;
    let nextAllowedCall: number = 0;
    let lastArgs: any[];
    const original = descriptor.value;

    descriptor.value = function(...args: any[]): any {
      lastArgs = args;
      if (timerId !== null) {
        return;
      }

      const now = Date.now();
      if (now >= nextAllowedCall) {
        original.apply(this, args);
      } else {
        timerId = setTimeout(() => {
          nextAllowedCall = Date.now() + interval;
          original.apply(this, args);
          timerId = null;
        }, nextAllowedCall - now);
      }

      nextAllowedCall = now + interval;
    };

    return descriptor;
  };
}
