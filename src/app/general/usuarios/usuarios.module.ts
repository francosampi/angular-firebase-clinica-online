import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosComponent } from './usuarios.component';
import { UsuariosRoutingModule } from './usuarios-routing-module';
import { SpinnerModule } from 'src/app/util/spinner/spinner.module';
import { HistoriaClinicaModule } from 'src/app/util/historia-clinica/historia-clinica.module';



@NgModule({
  declarations: [
    UsuariosComponent
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    HistoriaClinicaModule,
    SpinnerModule
  ],
  exports: [
    UsuariosComponent
  ]
})
export class UsuariosModule { }
