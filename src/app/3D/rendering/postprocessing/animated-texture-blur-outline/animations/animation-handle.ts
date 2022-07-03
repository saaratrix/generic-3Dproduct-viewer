export interface AnimationHandle<T> {
  start: () => void;
  stop: () => void;
  dispose: () => void;
  /**
   * We include the options in the handle so they can be updated by reference directly.
   */
  options: T,
}
