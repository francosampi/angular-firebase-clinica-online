import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosComponent } from './usuarios.component';
import { UsuariosRoutingModule } from './usuarios-routing-module';
import { SpinnerModule } from 'src/app/util/spinner/spinner.module';



@NgModule({
  declarations: [
    UsuariosComponent
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    SpinnerModule
  ],
  exports: [
    UsuariosComponent
  ]
})
export class UsuariosModule { }
