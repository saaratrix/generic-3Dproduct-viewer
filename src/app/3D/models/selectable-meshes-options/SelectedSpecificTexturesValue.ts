import { MaterialAnimationType } from "../../material-animators/MaterialAnimationType";
import { SelectedSpecificTexture } from "./SelectedSpecificTexture";

export interface SelectedSpecificTexturesValue {
  animationType: MaterialAnimationType;
  textures?: SelectedSpecificTexture[];
}
