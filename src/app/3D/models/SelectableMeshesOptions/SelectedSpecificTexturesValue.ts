import { MaterialAnimationType } from "../../MaterialAnimators/MaterialAnimationType";
import { SelectedSpecificTexture } from "./SelectedSpecificTexture";

export interface SelectedSpecificTexturesValue {
  animationType: MaterialAnimationType;
  textures?: SelectedSpecificTexture[];
}
