import type { MaterialAnimationType } from "../../material-animators/material-animation-type";
import type { SelectedSpecificTexture } from "./selected-specific-texture";

export interface SelectedSpecificTexturesValue {
  animationType: MaterialAnimationType;
  textures?: SelectedSpecificTexture[];
}
