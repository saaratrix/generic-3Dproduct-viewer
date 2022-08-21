import type { MaterialAnimationType } from '../../../3D/material-animators/material-animation-type';
import type { HexColor } from '../../../shared/models/hex-color';

export interface MaterialEditingSpecificColorsModel {
  animationType: MaterialAnimationType;
  colors?: HexColor[];
}
