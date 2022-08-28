import type { SidebarPickingAction } from '../../sidebar/sidebar-picking-action';

export interface MaterialEditingAction<T = unknown> extends SidebarPickingAction<T> {
  type: 'material-editing';
}
