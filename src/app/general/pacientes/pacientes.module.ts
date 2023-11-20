import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PacientesComponent } from './pacientes.component';
import { PacientesRoutingModule } from './pacientes-routing-module';
import { SpinnerModule } from 'src/app/util/spinner/spinner.module';
import { HistoriaClinicaModule } from 'src/app/util/historia-clinica/historia-clinica.module';



@NgModule({
  declarations: [
    PacientesComponent
  ],
  imports: [
    CommonModule,
    PacientesRoutingModule,
    HistoriaClinicaModule,
    SpinnerModule
  ],
  exports: [
    PacientesComponent
  ]
})
export class PacientesModule { }
