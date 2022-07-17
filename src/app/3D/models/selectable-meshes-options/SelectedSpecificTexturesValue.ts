import type { MaterialAnimationType } from "../../material-animators/MaterialAnimationType";
import type { SelectedSpecificTexture } from "./SelectedSpecificTexture";

export interface SelectedSpecificTexturesValue {
  animationType: MaterialAnimationType;
  textures?: SelectedSpecificTexture[];
}
