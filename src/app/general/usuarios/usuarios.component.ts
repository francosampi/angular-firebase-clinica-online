import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css', '../../styles/contenedor-fondo.css']
})
export class UsuariosComponent implements OnInit {

  usuarioDatos: any;
  listaUsuarios: any;
  verHistoria: boolean = false;
  spinner: boolean = false;

  constructor(private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void {

    this.usuarioDatos = this.authService.usuarioCredenciales;

    this.userService.getAllUsers().subscribe((lista) => {
      this.listaUsuarios = lista;
    });
  }

  habilitarUsuario(mail: string, estado: boolean) {
    this.spinner = true;

    this.userService.updateUserHabilitado(mail, estado).then(() => {
      Swal.fire('¡Listo!', 'El usuario ha sido actualizado exitosamente.', 'success');
    }).catch(() => {
      Swal.fire('Error', 'Ocurrió un problema actualizando al usuario.', 'error');
    }).finally(() => {
      this.spinner = false;
    });
  }
}
