import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistroEspecialistaComponent } from './registro-especialista.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistroEspecialistaRoutingModule } from './registro-especialista-routing-module';
import { SpinnerModule } from 'src/app/util/spinner/spinner.module';
import { NgxCaptchaModule } from 'ngx-captcha';



@NgModule({
  declarations: [
    RegistroEspecialistaComponent,
  ],
  imports: [
    CommonModule,
    RegistroEspecialistaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerModule,
    NgxCaptchaModule,
  ],
  exports: [
    RegistroEspecialistaComponent
  ]
})
export class RegistroEspecialistaModule { }
