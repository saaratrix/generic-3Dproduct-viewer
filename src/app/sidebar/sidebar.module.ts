import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MaterialEditingModule } from '../sidebar-items/material-editing/material-editing.module';

@NgModule({
  declarations: [
    SidebarComponent,
  ],
  imports: [
    CommonModule,
    MaterialEditingModule,
  ],
  exports: [
    SidebarComponent,
  ],
})
export class SidebarModule { }
