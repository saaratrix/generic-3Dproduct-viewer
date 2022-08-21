import type { MaterialAnimationType } from '../../material-animators/material-animation-type';
import type { HexColor } from '../../../shared/models/hex-color';

export interface SelectedSpecificColorsValue {
  animationType: MaterialAnimationType;
  colors?: HexColor[];
}
