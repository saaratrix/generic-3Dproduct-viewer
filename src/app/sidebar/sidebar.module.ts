import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SidebarFreeColorComponent } from './sidebar-free-color/sidebar-free-color.component';
import { SidebarSpecificColorComponent } from './sidebar-specific-color/sidebar-specific-color.component';
import { SidebarSpecificTextureComponent } from './sidebar-specific-texture/sidebar-specific-texture.component';

@NgModule({
  declarations: [
    SidebarComponent,
    SidebarFreeColorComponent,
    SidebarSpecificColorComponent,
    SidebarSpecificTextureComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    SidebarComponent,
  ],
})
export class SidebarModule { }
