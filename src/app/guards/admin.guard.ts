import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import Swal from 'sweetalert2';

export const adminGuard: CanActivateFn = async (route, state) => {
  
  const authService = inject(AuthService);
  const router = inject(Router);
  const perfilUsuario = authService.usuarioPerfil;

  if(perfilUsuario==='administrador')
  {
    return true;
  }
  else
  {
    router.navigateByUrl('');    
    return false;
  }
};
