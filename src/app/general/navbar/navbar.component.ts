import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import Swal from 'sweetalert2';

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
    this.authService.getCurrentUser().subscribe((user) => {
      this.usuarioLogeado = user;

      if (user) {
        this.userService.getUserByUid(user?.uid).subscribe((cred) => {
          if (cred) {
            this.usuarioCredenciales = cred;

            this.authService.getUserImagebyUID(user?.uid).subscribe((foto) => {
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
