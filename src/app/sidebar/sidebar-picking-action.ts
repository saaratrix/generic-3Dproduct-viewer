import type { Type } from '@angular/core';
import type { SidebarItem } from './sidebar-item';
import type { InteractionAction } from '../3D/interaction/interaction-action';

export interface SidebarPickingAction<Item = unknown> extends InteractionAction {
  sidebarComponent: Type<SidebarItem>;
  item?: Item;
}
