import type { Type } from '@angular/core';
import type { SidebarItem } from './sidebar-item';
import type { PickingAction } from '../3D/picking/picking-action';

export function isSidebarPickingAction(action: unknown): action is SidebarPickingAction {
  return !!(action as SidebarPickingAction).sidebarComponent;
}

export interface SidebarPickingAction<Item = unknown> extends PickingAction {
  sidebarComponent: Type<SidebarItem>;
  item?: Item;
}
