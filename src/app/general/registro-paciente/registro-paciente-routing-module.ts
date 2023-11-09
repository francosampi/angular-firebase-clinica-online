import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroPacienteComponent } from './registro-paciente.component';

const routes: Routes = [
  { path: '', component: RegistroPacienteComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistroPacienteRoutingModule {}