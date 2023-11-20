import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TurnosComponent } from './turnos.component';
import { TurnosRoutingModule } from './turnos-routing-module';
import { SpinnerModule } from 'src/app/util/spinner/spinner.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CapizalizarPipe } from '../../pipes/capitalizar/capizalizar.pipe';


@NgModule({
  declarations: [
    TurnosComponent,
    CapizalizarPipe,
  ],
  imports: [
    CommonModule,
    TurnosRoutingModule,
    FormsModule,
    SpinnerModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    TurnosComponent
  ]
})
export class TurnosModule { }
