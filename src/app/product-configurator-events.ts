/* eslint-disable @typescript-eslint/naming-convention */

// Having all the events in one place might not be good but I'm curious to see how it turns out.
export enum ProductConfigurationEvent {
  Loading_Started,
  Loading_Progress,
  Loading_Finished,
  Material_ColorSwap,
  Material_TextureSwap,
  Mesh_Selected,
  Mesh_Deselected,
  Mesh_PointerEnter,
  Mesh_PointerLeave,
  SelectedProduct_Changed,
  Toolbar_ChangeProduct,
}
