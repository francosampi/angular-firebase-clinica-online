import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistroPacienteComponent } from './registro-paciente.component';
import { RegistroPacienteRoutingModule } from './registro-paciente-routing-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerModule } from 'src/app/util/spinner/spinner.module';
import { NgxCaptchaModule } from 'ngx-captcha';



@NgModule({
  declarations: [
    RegistroPacienteComponent,
  ],
  imports: [
    CommonModule,
    RegistroPacienteRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxCaptchaModule,
    SpinnerModule
  ],
  exports: [
    RegistroPacienteComponent
  ]
})
export class RegistroPacienteModule { }
