import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import Swal from 'sweetalert2';


export const turnosGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const perfilUsuario = authService.usuarioPerfil;

  if(perfilUsuario!=='especialista')
  {
    return true;
  }
  else
  {
    router.navigateByUrl('');
    Swal.fire('Acceso denegado', 'Usted debe ser paciente o administrador para ingresar.<br>Su perfil es: '+perfilUsuario, 'warning');
    return false;
  }
};
