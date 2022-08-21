import type { PolygonalObject3D } from '../3D/3rd-party/three/types/polygonal-object-3D';

export interface SidebarItem<T = unknown> {
  object3D: PolygonalObject3D;
  item?: T;
}
