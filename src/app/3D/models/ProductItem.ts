import { MaterialInfo } from "./MaterialInfo";

export interface ProductItem {
  id: number;
  thumbnail: string;
  filename: string;
  materialInfo: MaterialInfo;
  // If true, the camera can't look at the underside of the model.
  hasFloor: boolean;
  useGammaSpace: boolean;
}
