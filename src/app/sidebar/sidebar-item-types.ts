import type { SidebarItem } from './sidebar-item';
import type { Type } from '@angular/core';
import { MaterialEditingSpecificColorComponent } from '../sidebar-items/material-editing/material-editing-specific-color/material-editing-specific-color.component';
import { MaterialEditingSpecificTextureComponent } from '../sidebar-items/material-editing/material-editing-specific-texture/material-editing-specific-texture.component';
import { MaterialEditingFreeColorComponent } from '../sidebar-items/material-editing/material-editing-free-color/material-editing-free-color.component';

export const sidebarItemTypes: Set<Type<SidebarItem>> = new Set([
  MaterialEditingSpecificColorComponent,
  MaterialEditingSpecificTextureComponent,
  MaterialEditingFreeColorComponent,
]);
