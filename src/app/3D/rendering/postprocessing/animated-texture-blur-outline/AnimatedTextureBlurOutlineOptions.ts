export interface AnimatedTextureBlurOutlineOptions {
  edgeThickness?: number,
  edgeGlow?: number,
  /**
   * If the texture should move over time so the outline moves.
   */
  animateOutline?: boolean,
  /**
   * How long for a full cycle where the texture is back to its start position.
   */
  animationInterval?: number,
  /**
   * The U texture position start.
   */
  startU?: number,
  /**
   * How many times the texture should tile or repeat itself.
   */
  tileCount?: number,
  /**
   * Animation interval in seconds.
   */
  interval?: number,
}
