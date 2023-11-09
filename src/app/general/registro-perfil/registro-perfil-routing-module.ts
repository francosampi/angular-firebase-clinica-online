import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroPerfilComponent } from './registro-perfil.component';

const routes: Routes = [
  { path: '', component: RegistroPerfilComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistroPerfilRoutingModule {}