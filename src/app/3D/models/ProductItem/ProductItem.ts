import { SubProductItem } from "./SubProductItem";
import { Mesh, Object3D } from "three";
import { Model3D } from "../Model3D";
import { SelectableMeshesOption } from "../SelectableMeshesOptions/SelectableMeshesOption";
import { ActiveProductItemEvent } from "./ActiveProductItemEvent";

export interface ProductItem {
  id: number;
  // A unique name used to identify the product item from routing.
  name: string;
  thumbnail: string;
  models: Model3D[];
  // If true, the camera can't look at the underside of the model.
  hasFloor: boolean;
  useGammaSpace: boolean;
  tooltip: string;
  subItems: SubProductItem[];
  selectedSubItem?: SubProductItem | number | null;
  selectableMeshesOptions?: SelectableMeshesOption[];

  // Variables generated at runtime:

  activeEvents: ActiveProductItemEvent[];
  // The root object3D
  object3D?: Object3D;
  // The cached intersections from parsing selectableMeshesOptions so we only have to do it once.
  selectableMeshIntersections?: Mesh[];
}
