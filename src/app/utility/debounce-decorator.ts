// Source: https://embed.plnkr.co/plunk/bDvMqa
export function debounce(delay: number = 300): MethodDecorator {
  return function(target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor {
    let timeout: ReturnType<typeof setTimeout>;

    const original = descriptor.value;

    descriptor.value = function(...args: any[]): any {
      clearTimeout(timeout);
      timeout = setTimeout(() => original.apply(this, args), delay);
    };

    return descriptor;
  };
}
