interface Debouncer {
  timeout?: ReturnType<typeof setTimeout>;
}

// Modified from source: https://embed.plnkr.co/plunk/bDvMqa
/**
 * Debounces a method so that it's called after the delay.
 * The delay is reset every time the method is called.
 */
export function debounce(delay: number = 300): MethodDecorator {
  // For angular component this method happens only once per component declaration.
  // As it modifies the prototype method.
  // So for example if component A has 3 instances the timeout is shared between all of them.
  // Which means that if all 3 call their debounced method only the last call would happen.
  return function (target: unknown, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor {
    // Keep track of the individual instances that are trying to debounce.
    // The key is the thisArg reference.
    const debouncers: Map<unknown, Debouncer> = new Map<unknown, Debouncer>();
    // Original method reference.
    const original = descriptor.value;
    descriptor.value = function (...args: unknown[]): void {
      let debouncer: Debouncer | undefined = debouncers.get(this);
      if (debouncer) {
        clearTimeout(debouncer.timeout!);
      } else {
        debouncer = {};
        debouncers.set(this, debouncer);
      }

      debouncer.timeout = setTimeout(() => {
        debouncers.delete(this);
        original.apply(this, args);
      }, delay);
    };

    return descriptor;
  };
}
