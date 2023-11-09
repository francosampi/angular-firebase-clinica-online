import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import { SpinnerModule } from 'src/app/util/spinner/spinner.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    NavbarComponent
  ],
  imports:[
    RouterModule,
    CommonModule,
    SpinnerModule
  ],
  exports: [
    NavbarComponent
  ]
})
export class NavbarModule { }
