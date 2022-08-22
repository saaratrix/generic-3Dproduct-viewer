import type { Type } from '@angular/core';
import type { SidebarItem } from '../../../sidebar/sidebar-item';

export interface SelectedOptions<Item = unknown> {
  type: Type<SidebarItem>;
  item?: Item;
}
