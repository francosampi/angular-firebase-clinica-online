import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistroPacienteComponent } from './registro-paciente.component';
import { RegistroPacienteRoutingModule } from './registro-paciente-routing-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerModule } from 'src/app/util/spinner/spinner.module';
import { CapitalizacionDirective } from 'src/app/directives/capitalizacion.directive';



@NgModule({
  declarations: [
    RegistroPacienteComponent,
  ],
  imports: [
    CommonModule,
    RegistroPacienteRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerModule
  ],
  exports: [
    RegistroPacienteComponent
  ]
})
export class RegistroPacienteModule { }
