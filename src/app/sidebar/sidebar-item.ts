import type { PolygonalObject3D } from '../3D/3rd-party/three/types/polygonal-object-3D';
import type { SelectedOptionsValue } from '../3D/models/selectable-object-3ds-options/selected-options';

export interface SidebarItem<T extends SelectedOptionsValue | unknown = unknown> {
  object3D: PolygonalObject3D;
  item?: T;
}
