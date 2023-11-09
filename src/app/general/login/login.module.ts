import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing-module';
import { ReactiveFormsModule } from '@angular/forms';
import { SpinnerModule } from 'src/app/util/spinner/spinner.module';



@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    ReactiveFormsModule,
    SpinnerModule
  ],
  exports: [
    LoginComponent
  ]
})
export class LoginModule { }
