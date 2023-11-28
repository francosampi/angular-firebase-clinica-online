import { Component, OnInit } from '@angular/core';
import { delayedFadeAnimation } from 'src/app/animations/fade';
import { slideInAnimation } from 'src/app/animations/slideIn';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ExcelService } from 'src/app/services/excel/excel.service';
import { UserService } from 'src/app/services/user/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css', '../../styles/contenedor-fondo.css'],
  animations: [delayedFadeAnimation, slideInAnimation]
})
export class UsuariosComponent implements OnInit {

  usuarioDatos: any;
  listaUsuarios: any[] = [];
  verHistoria: boolean = false;
  spinner: boolean = false;

  constructor(private authService: AuthService, private userService: UserService, private excelService: ExcelService) { }

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

  descargarExcelIndividual(usuario: any) {
    Swal.fire({
      title: "¿Descargar archivo .xslx?",
      html: "Descargar datos de <b>" + usuario.mail + "</b>",
      showCancelButton: true,
      confirmButtonText: "Descargar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const usuarioOrdenado = {
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          edad: usuario.edad,
          mail: usuario.mail,
          dni: usuario.dni,
          obraSocial: usuario.obraSocial,
          especialidad: usuario.especialidad,
          habilitado: usuario.habilitado
        };

        this.excelService.generateExcel([usuarioOrdenado], 'usuario_' + usuario.mail, 'Usuarios');
        Swal.fire("Excel descargado", "", "success");
      }
    });
  }

  descargarExcelListado() {

    //Corrección orden de datos para excel
    const usuariosOrdenados = this.listaUsuarios.map(usuario => {
      return {
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        edad: usuario.edad,
        mail: usuario.mail,
        dni: usuario.dni,
        obraSocial: usuario.obraSocial,
        especialidad: usuario.especialidad,
        habilitado: usuario.habilitado
      };
    });

    this.excelService.generateExcel(usuariosOrdenados, 'usuarios', 'Usuarios');
  }
}
