// Source: https://embed.plnkr.co/plunk/bDvMqa
/**
 * Debounces a method so that it's called after the delay.
 * The delay is reset every time the methos is called.
 */
export function debounce(delay: number = 300): MethodDecorator {
  return function (target: unknown, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor {
    let timeout: ReturnType<typeof setTimeout>;

    const original = descriptor.value;

    descriptor.value = function (...args: unknown[]): void {
      clearTimeout(timeout);
      timeout = setTimeout(() => original.apply(this, args), delay);
    };

    return descriptor;
  };
}
