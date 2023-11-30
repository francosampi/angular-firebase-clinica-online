import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { delayedFadeAnimation } from 'src/app/animations/fade';
import { slideInAnimation } from 'src/app/animations/slideIn';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EspecialistaService } from 'src/app/services/especialista/especialista.service';
import { ExcelService } from 'src/app/services/excel/excel.service';
import { PdfService } from 'src/app/services/pdf/pdf.service';
import { TurnosService } from 'src/app/services/turnos/turnos.service';
import { UserService } from 'src/app/services/user/user.service';
import Swal from 'sweetalert2';

@UntilDestroy()
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css', '../../styles/contenedor-fondo.css'],
  animations: [delayedFadeAnimation, slideInAnimation]
})
export class PerfilComponent implements OnInit {

  usuarioId?: string | undefined;
  usuarioDatos: any;
  usuarioFoto: File | undefined;
  usuarioFotoSec: File | undefined;
  verHistoria: boolean = false;
  disponibilidadHoraria: string = '';
  especialistas: any[] = [];
  especialistaElegido: any = undefined;
  turnos: any[] = [];
  spinner: boolean = false;

  constructor(private authService: AuthService, private userService: UserService, private especialistaService: EspecialistaService,
    private turnosService: TurnosService, private excelService: ExcelService, private pdfService: PdfService) { }

  ngOnInit(): void {
    this.authService.getCurrentUser()
      .pipe(untilDestroyed(this)).subscribe((user) => {

        if (user) {
          this.usuarioId = user.uid;

          this.userService.getUserByUid(user.uid)
            .pipe(untilDestroyed(this)).subscribe((cred) => {
              if (cred) {
                this.usuarioDatos = cred;

                this.authService.getUserImagebyUID(user.uid)
                  .pipe(untilDestroyed(this)).subscribe((foto) => {
                    if (foto) {
                      this.usuarioFoto = foto;
                    }
                  });

                if (this.usuarioDatos.perfil === 'paciente') {
                  this.authService.getUserSecondImagebyUID(user.uid)
                    .pipe(untilDestroyed(this)).subscribe((foto2) => {
                      if (foto2) {
                        this.usuarioFotoSec = foto2;
                      }
                    });

                  //Traer especialistas con los cuales se tiene al menos un turno y traer turnos realizados
                  this.turnosService.getTurnosByUsuarioId(user.uid).subscribe((turnos) => {
                    const especialistasSet = new Set<string>();

                    turnos.forEach((turno: any) => {
                      const datosTurno = turno.payload.doc.data();
                      const id = datosTurno.idEspecialista;

                      if (datosTurno.estado === 'Activo' || datosTurno.estado === 'Finalizado') {
                        especialistasSet.add(id);
                      }
                    });

                    Array.from(especialistasSet).forEach(id => {
                      const idEspecialista = id;
                      const turnosEspecialista: any[] = [];

                      const pacienteExistente = this.especialistas.find((esp) => esp.datos.id === idEspecialista);

                      if (!pacienteExistente) {
                        this.userService.getUserByUid(idEspecialista).subscribe((especialista) => {
                          const datosEsp = especialista;

                          if (datosEsp) {
                            turnos.forEach((elemento: { payload: { doc: { data: () => any; }; }; }) => {
                              const datosTurnoEspecialista = elemento.payload.doc.data();

                              if (datosTurnoEspecialista.estado === 'Activo' || datosTurnoEspecialista.estado === 'Finalizado') {
                                const turnosObj = {
                                  fecha: datosTurnoEspecialista.fecha,
                                  especialista: datosEsp.nombre + ' ' + datosEsp.apellido,
                                  especialidad: datosTurnoEspecialista.especialidad,
                                  observacion: datosTurnoEspecialista.diagnostico?.observacion ? datosTurnoEspecialista.diagnostico?.observacion : '-',
                                  tratamiento: datosTurnoEspecialista.diagnostico?.tratamiento ? datosTurnoEspecialista.diagnostico?.tratamiento : '-',
                                  estado: datosTurnoEspecialista.estado,
                                };

                                if (datosTurnoEspecialista.idEspecialista === idEspecialista) {
                                  turnosEspecialista.push(turnosObj);
                                };
                              }
                            });

                            const pacienteRegistro = { datosEsp, turnosEspecialista };
                            this.especialistas.push(pacienteRegistro);
                          };
                        });
                      };
                    });
                  });
                };

                if (this.usuarioDatos.perfil === 'especialista' && this.usuarioId) {
                  this.turnosService.getTurnosByEspecialistaId(this.usuarioId).subscribe((lista) => {
                    lista.forEach((turno) => {

                      const turnoData: any = turno.payload.doc.data();
                      const idPaciente = turnoData.idPaciente;

                      const turnoObj = {
                        fecha: turnoData.fecha,
                        especialista: this.usuarioDatos.nombre + ' ' + this.usuarioDatos.apellido,
                        paciente: '-',
                        especialidad: turnoData.especialidad,
                        observacion: turnoData.diagnostico?.observacion ? turnoData.diagnostico?.observacion : '-',
                        tratamiento: turnoData.diagnostico?.tratamiento ? turnoData.diagnostico?.tratamiento : '-',
                        estado: turnoData.estado,
                      };

                      this.userService.getUserByUid(idPaciente).subscribe((user) => {
                        turnoObj.paciente = user.nombre + ' ' + user.apellido;

                        this.turnos.push(turnoObj);
                      });
                    });
                  });
                };
              };
            });
        };
      });
  }

  asignarDisponibilidadHoraria(mins: string) {
    this.spinner = true;

    const minutos: number = parseInt(mins);

    if (this.usuarioId) {
      this.especialistaService.updateEspecialistaDisponibilidadHoraria(this.usuarioId, minutos).then(() => {
        Swal.fire('¡Listo!', 'Disponibilidad asignada a ' + this.disponibilidadHoraria + ' minutos por turno.', 'success');
      }).catch((error) => {
        Swal.fire('¡Ups!', 'Ocurrió un error asignando la disponibilidad horaria.', 'error');
        console.log(error);
      }).finally(() => {
        this.spinner = false;
      });
    }
  }

  descargarAtenciones() {
    Swal.fire({
      title: "Archivo de especialista",
      html: "Descargar turnos realizados",
      showCancelButton: true,
      denyButtonColor: '#4ED280',
      confirmButtonText: "Descargar datos (.xsl)",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          this.excelService.generateExcel(this.turnos, 'turnos_' + this.usuarioDatos.mail, 'Turnos');
          Swal.fire("Excel descargado", "", "success");
        } catch (error) {
          Swal.fire("¡Ups!", "Error al descargar archivos...", 'error');
        }
      }
    });
  }

  descargarAtencionesDeEspecialistaExcel() {
    Swal.fire({
      title: "Archivo de paciente",
      html: "Descargar turnos realizados con " + this.especialistaElegido.datosEsp.nombre + ' ' + this.especialistaElegido.datosEsp.apellido,
      showCancelButton: true,
      denyButtonColor: '#4ED280',
      confirmButtonText: "Descargar datos (.xsl)",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          this.excelService.generateExcel(this.especialistaElegido.turnosEspecialista, 'turnos_' + this.usuarioDatos.mail, 'Turnos');
          Swal.fire("Excel descargado", "", "success");
        } catch (error) {
          Swal.fire("¡Ups!", "Error al descargar archivos...", 'error');
        }
      }
    });
  }

  descargarAtencionesDeEspecialistaPDF() {
    Swal.fire({
      title: "Archivo de paciente",
      html: "Descargar turnos realizados con " + this.especialistaElegido.datosEsp.nombre + ' ' + this.especialistaElegido.datosEsp.apellido,
      showCancelButton: true,
      denyButtonColor: '#4ED280',
      confirmButtonText: "Descargar datos (.pdf)",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          this.pdfService.generateTurnosPdf(this.especialistaElegido.turnosEspecialista, 'turnos_' + this.usuarioDatos.mail+'.pdf');
          Swal.fire("PDF descargado", "", "success");
        } catch (error) {
          Swal.fire("¡Ups!", "Error al descargar archivos...", 'error');
        }
      }
    });
  }
}
