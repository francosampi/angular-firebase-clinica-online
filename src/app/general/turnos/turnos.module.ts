import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TurnosComponent } from './turnos.component';
import { TurnosRoutingModule } from './turnos-routing-module';
import { SpinnerModule } from 'src/app/util/spinner/spinner.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    TurnosComponent
  ],
  imports: [
    CommonModule,
    TurnosRoutingModule,
    FormsModule,
    SpinnerModule
  ],
  exports: [
    TurnosComponent
  ]
})
export class TurnosModule { }
