import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfilComponent } from './perfil.component';
import { PerfilRoutingModule } from './perfi-routing-module';
import { SpinnerModule } from 'src/app/util/spinner/spinner.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    PerfilComponent
  ],
  imports: [
    CommonModule,
    PerfilRoutingModule,
    FormsModule,
    SpinnerModule
  ],
  exports: [
    PerfilComponent
  ]
})
export class PerfilModule { }
