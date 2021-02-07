export enum SelectedSpecificColorAnimationType {
  None,
  Linear,
  // Draw new color/texture by starting in top left (xy = 0) and increase XY until it's the same as the texture width.
  FromTopToBottom,
}
