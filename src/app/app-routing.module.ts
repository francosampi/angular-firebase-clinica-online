import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { turnosGuard } from './guards/turnos.guard';

const routes: Routes = [
  { path: "", loadChildren: () => import('./general/home/home.module').then(m => m.HomeModule) },
  { path: "login", loadChildren: () => import('./general/login/login.module').then(m => m.LoginModule) },
  { path: "perfil", loadChildren: () => import('./general/perfil/perfil.module').then(m => m.PerfilModule)},
  { path: "registro-perfil", loadChildren: () => import('./general/registro-perfil/registro-perfil.module').then(m => m.RegistroPerfilModule) },
  { path: "registro-paciente", loadChildren: () => import('./general/registro-paciente/registro-paciente.module').then(m => m.RegistroPacienteModule) },
  { path: "registro-especialista", loadChildren: () => import('./general/registro-especialista/registro-especialista.module').then(m => m.RegistroEspecialistaModule) },

  //ACCESOS LIMITADOS
  { path: "usuarios", loadChildren: () => import('./general/usuarios/usuarios.module').then(m => m.UsuariosModule), canActivate: [adminGuard]},
  { path: "turnos", loadChildren: () => import('./general/turnos/turnos.module').then(m => m.TurnosModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
