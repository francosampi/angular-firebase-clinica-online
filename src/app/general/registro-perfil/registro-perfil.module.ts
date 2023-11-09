import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistroPerfilComponent } from './registro-perfil.component';
import { RegistroPerfilRoutingModule } from './registro-perfil-routing-module';



@NgModule({
  declarations: [
    RegistroPerfilComponent
  ],
  imports: [
    CommonModule,
    RegistroPerfilRoutingModule
  ],
  exports: [
    RegistroPerfilComponent
  ]
})
export class RegistroPerfilModule { }
