import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import Swal from 'sweetalert2';

@UntilDestroy()
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  usuarioLogeado: any;
  usuarioFoto: any;
  usuarioCredenciales: any;
  usuarioPerfil: string = '';
  sidebarAbierta: boolean = false;
  spinner: boolean = false;

  constructor(private route: Router, private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void {
    this.authService.getCurrentUser().pipe(untilDestroyed(this)).subscribe((user) => {
      if (user) {
        this.usuarioLogeado = user;

        this.userService.getUserByUid(user.uid).pipe(untilDestroyed(this)).subscribe((cred) => {
          if (cred) {
            this.usuarioCredenciales = cred;

            this.authService.getUserImagebyUID(user.uid).pipe(untilDestroyed(this)).subscribe((foto) => {
              if (foto) {
                this.usuarioFoto = foto;
              }
            });
          }
        });
      }
    });
  }

  salir() {
    this.spinner = true;

    this.authService.cerrarSesion().then(() => {
      this.route.navigate(['login']);
      Swal.fire('¡Adios!', 'Has cerrado sesión exitosamente', 'success');
    }).catch(() => {
      Swal.fire('¡Ups!', 'Ha ocurrido un error al cerrar sesión', 'error');
    }).finally(() => {
      this.spinner = false;
    });
  }
}
