// Having all the events in one place might not be good but I'm curious to see how it turns out.
export enum ProductConfigurationEvent {
  CanvasResized,

  LoadingStarted,
  LoadingProgress,
  LoadingFinished,

  MaterialColorSwap,
  MaterialTextureSwap,

  Object3DSelected,
  Object3DDeselected,
  Object3DPointerEnter,
  Object3DPointerLeave,

  ProductLoadingFinished,

  SelectedProductChanged,

  ToolbarChangeProduct,
}
