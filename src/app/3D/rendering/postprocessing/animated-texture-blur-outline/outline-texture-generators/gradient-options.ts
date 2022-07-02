export interface GradientStop {
  offset: number,
  color: string,
}

export interface GradientOptions {
  width: number,
  height: number,

  steps: GradientStop[];
}

export interface LinearGradientOptions extends GradientOptions{
  /**
   * Angle in radians.
   */
  angle?: number;
}
