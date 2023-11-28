import { Component, OnInit } from '@angular/core';
import { delayedFadeAnimation } from 'src/app/animations/fade';
import { slideInAnimation } from 'src/app/animations/slideIn';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ExcelService } from 'src/app/services/excel/excel.service';
import { PdfService } from 'src/app/services/pdf/pdf.service';
import { TurnosService } from 'src/app/services/turnos/turnos.service';
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
  listaUsuarios: { id: string, userData: any, turnosUser: any }[] = [];
  verHistoria: boolean = false;
  spinner: boolean = false;

  constructor(private authService: AuthService, private userService: UserService, private turnosService: TurnosService,
    private excelService: ExcelService, private pdfService: PdfService) { }

  ngOnInit(): void {
    this.usuarioDatos = this.authService.usuarioCredenciales;

    /*
    this.userService.getAllUsers().subscribe((lista) => {
      this.listaUsuarios = lista;
    });
    */

    this.userService.getAllUsersWithId().subscribe((lista) => {
      lista.forEach((user: { payload: { doc: { id: any; data: () => any; }; }; }) => {
        const id = user.payload.doc.id;
        const userData = user.payload.doc.data();
        const turnosUser: any[] = [];

        this.turnosService.getTurnosByUsuarioId(id).subscribe(turnos => {
          turnos.forEach(turno => {

            let nombreEspecialista: string = '';
            const data: any = turno.payload.doc.data();
            const turnoInfo = {
              fecha: data.fecha,
              especialidad: data.especialidad,
              estado: data.estado
            };

            this.userService.getUserByUid(data.idEspecialista).subscribe((especialista) => {
              nombreEspecialista = especialista.nombre + ' ' + especialista.apellido;

              turnosUser.push({
                nombreEspecialista: nombreEspecialista,
                ...turnoInfo
              });
            });
          });

          this.listaUsuarios.push({ id, userData, turnosUser });
        });
      });
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

  descargarArchivoIndividual(usuario: any) {
    Swal.fire({
      title: "Archivo de usuario",
      html: "Descargar información de <b>" + usuario.userData.mail + "</b>",
      showCancelButton: true,
      showDenyButton: true,
      denyButtonColor: '#4ED280',
      confirmButtonText: "Descargar datos (.xsl)",
      denyButtonText: "Descargar turnos (.xsl)",
      cancelButtonText: "Cancelar",
    }).then((result) => {

      try {
        if (result.isConfirmed) {
          const usuarioOrdenado = {
            nombre: usuario.userData.nombre,
            apellido: usuario.userData.apellido,
            edad: usuario.userData.edad,
            mail: usuario.userData.mail,
            dni: usuario.userData.dni,
            obraSocial: usuario.userData.obraSocial,
            especialidad: usuario.userData.especialidad,
            habilitado: usuario.userData.habilitado
          };

          this.excelService.generateExcel([usuarioOrdenado], 'datos_' + usuario.userData.mail, 'Usuario');
          Swal.fire("Excel descargado", "", "success");
        }

        if (result.isDenied) {
          this.excelService.generateExcel(usuario.turnosUser, 'turnos_' + usuario.userData.mail, 'Turnos');
          Swal.fire("Excel descargado", "", "success");
        }
      } catch (error) {
        Swal.fire("¡Ups!", "Error al descargar archivos...", 'error');
      }
    });
  }

  descargarExcelListado() {
    //Corrección orden de datos para excel
    const usuariosOrdenados = this.listaUsuarios.map(usuario => {
      return {
        nombre: usuario.userData.nombre,
        apellido: usuario.userData.apellido,
        edad: usuario.userData.edad,
        mail: usuario.userData.mail,
        dni: usuario.userData.dni,
        obraSocial: usuario.userData.obraSocial,
        especialidad: usuario.userData.especialidad,
        habilitado: usuario.userData.habilitado
      };
    });

    this.excelService.generateExcel(usuariosOrdenados, 'usuarios', 'Usuarios');
  }
}
