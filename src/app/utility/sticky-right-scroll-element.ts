export interface StickyScrollHandle {
  dispose: () => void;
}

/**
 * Adds a method that will keep the element visible to the right when scrolling horizontally.
 */
export function stickyRightScrollElement(element: HTMLElement, scroll: HTMLElement): StickyScrollHandle {
  const resizeObserver = new ResizeObserver((entries) => {
    scrollWidth = scroll.scrollWidth;
    scrollElementWidth = entries[0].contentRect.width;
    onScroll();
  });

  resizeObserver.observe(scroll);
  // Cache width so we don't potentially cause repaints.
  let scrollWidth = scroll.scrollWidth;
  let scrollElementWidth = scroll.offsetWidth;

  const onScroll = (): void => {
    const right = (scrollElementWidth + scroll.scrollLeft) - scrollWidth;
    const translate = `translateX(${right}px)`;
    element.style.transform = translate;
  };

  scroll.addEventListener('scroll', onScroll, {
    passive: true,
  });

  return {
    dispose: (): void => {
      scroll.removeEventListener('scroll', onScroll);
      resizeObserver.unobserve(scroll);
      resizeObserver.disconnect();
    },
  };
}
