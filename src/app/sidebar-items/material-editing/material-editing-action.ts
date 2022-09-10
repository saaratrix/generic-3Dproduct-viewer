import type { SidebarPickingAction } from '../../sidebar/sidebar-picking-action';
import type { MaterialEditingActionTypes } from '../../3D/interaction/interaction-action-types';

export interface MaterialEditingAction<Item = unknown> extends SidebarPickingAction<Item> {
  type: MaterialEditingActionTypes;
}
