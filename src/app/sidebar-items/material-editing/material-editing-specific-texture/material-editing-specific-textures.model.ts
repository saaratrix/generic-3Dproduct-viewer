import type { MaterialAnimationType } from '../../../3D/material-animators/material-animation-type';
import type { SpecificTextureModel } from './specific-texture.model';

export interface MaterialEditingSpecificTexturesModel {
  animationType: MaterialAnimationType;
  textures?: SpecificTextureModel[];
}
