import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { combineLatest, forkJoin, map, of, switchMap } from 'rxjs';
import { delayedFadeAnimation } from 'src/app/animations/fade';
import { slideInAnimation } from 'src/app/animations/slideIn';
import { Especialidad } from 'src/app/interfaces/especialidad';
import { Historiaclinica } from 'src/app/interfaces/historia-clinica';
import { Especialista } from 'src/app/interfaces/perfiles';
import { Diagnostico, Resenia, Turno } from 'src/app/interfaces/turno';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EspecialidadesService } from 'src/app/services/especialidades/especialidades.service';
import { HistoriaClinicaService } from 'src/app/services/historia-clinica/historia-clinica.service';
import { TurnosService } from 'src/app/services/turnos/turnos.service';
import { UserService } from 'src/app/services/user/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css', '../../styles/contenedor-fondo.css'],
  animations: [delayedFadeAnimation, slideInAnimation]
})
export class TurnosComponent implements OnInit {

  usuarioId: string = '';
  usuarioPerfil: string | undefined = '';
  tramite: string = '';
  turno: Turno | undefined;
  turnoAFinalizar: Turno | undefined;
  turnos: any[] = [];
  turnosFiltrados: any[] = [];
  filtroForm: FormGroup;
  historiaClinicaForm: FormGroup;
  especialistaId: string = '';
  especialistas: Especialista[] = [];
  especialistasFiltrados: any[] = [];
  especialistaElegido: Especialista | undefined;
  especialidades: Especialidad[] = [];
  especialidadesImg: string[] = [
    '../../assets/iconos/especialidades/cardiologia.png',
    '../../assets/iconos/especialidades/psiquiatria.png',
    '../../assets/iconos/especialidades/pediatria.png',
    '../../assets/iconos/especialidades/dermatologia.png',
  ];
  especialidadElegida: string = '';
  horariosDisponiblesInfo: any;
  diasDisponibles: string[] = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  fechasDisponibles: any;
  fechaElegida: any;
  horaElegida: any;
  tituloProgreso = '';
  porcentajeProgreso = 0;
  spinner: boolean = false;

  constructor(private authService: AuthService, private userService: UserService,
    private especialidadesService: EspecialidadesService, private turnosService: TurnosService,
    private historiaClinicaService: HistoriaClinicaService, private fb: FormBuilder) {

    this.filtroForm = this.fb.group({
      paciente: [''],
      especialista: [''],
      especialidad: [''],
      fecha: [''],
      estado: [''],
    });

    this.historiaClinicaForm = this.fb.group({
      observacion: [
        '',
        [
          Validators.pattern('^[a-zA-Z ]+$'),
          Validators.required,
        ]
      ],
      tratamiento: [
        '',
        [
          Validators.pattern('^[a-zA-Z ]+$'),
          Validators.required,
        ]
      ],
      altura: [
        '',
        [
          Validators.pattern('^[0-9]+$'),
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(3),
        ]
      ],
      peso: [
        '',
        [
          Validators.pattern('^[0-9]+$'),
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(3),
        ]
      ],
      temperatura: [
        '',
        [
          Validators.pattern('^[0-9]+$'),
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(3),
        ]
      ],
      presion: [
        '',
        [
          Validators.pattern('^[0-9]+$'),
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(3),
        ]
      ],
    });
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.usuarioId = user.uid;

        this.userService.getUserByUid(user.uid).subscribe((cred) => {
          this.usuarioPerfil = cred.perfil;

          let turnosObservable;

          switch (this.usuarioPerfil) {
            case 'paciente':
              turnosObservable = this.turnosService.getTurnosByUsuarioId(this.usuarioId);
              break;

            case 'especialista':
              turnosObservable = this.turnosService.getTurnosByEspecialistaId(this.usuarioId);
              break;

            default:
              turnosObservable = this.turnosService.getTurnos();
              break;
          }

          turnosObservable.pipe(
            switchMap((listaTurnos) => {
              const turnosDetalleObservable = listaTurnos.map(turno => {
                const id = turno.payload.doc.id;
                const datos: any = turno.payload.doc.data();

                return this.userService.getUserByUid(datos.idPaciente).pipe(
                  switchMap(pac => {
                    if (pac) {
                      const nombrePaciente = pac.nombre + ' ' + pac.apellido;

                      return this.userService.getUserByUid(datos.idEspecialista).pipe(
                        switchMap(esp => {
                          if (esp) {
                            const nombreEspecialista = esp.nombre + ' ' + esp.apellido;
                            return [{ id, nombrePaciente, nombreEspecialista, ...datos } as Turno];
                          }

                          return [];
                        })
                      );
                    }
                    return [];
                  })
                );
              });

              return combineLatest(turnosDetalleObservable);
            })
          ).subscribe(turnos => {
            this.turnos = turnos;
            this.turnosFiltrados = this.turnos;
            this.filtrarTurnos();
          });
        });
      }
    });

    this.userService.getAllEspecialistasWithId().pipe(
      switchMap((lista) => {
        if (lista) {
          const observables = lista.map((element: any) => {
            const id = element.payload.doc.id;
            const data = element.payload.doc.data();

            return this.authService.getUserImagebyUID(id).pipe(
              map(foto => ({ id, ...data, foto }))
            );
          });

          return forkJoin(observables);
        }

        return of([]);
      })
    ).subscribe((especialistas) => {
      this.especialistas = especialistas as any;
    });

    this.especialidadesService.getAllEspecialidades().subscribe((listaEspecialidades) => {
      if (listaEspecialidades) {

        this.especialidades = listaEspecialidades.map((especialidad: Especialidad, index: any) => {
          const imgIndex = index % this.especialidadesImg.length;

          return { ...especialidad, imagen: this.especialidadesImg[imgIndex] };
        });
      }
    });

    this.tituloProgreso = '1- Selecciona una especialidad';
  }

  filtrarEspecialidad() {
    this.spinner = true;

    this.especialistasFiltrados = this.especialistas.filter(especialista => especialista.especialidad === this.especialidadElegida && especialista.habilitado === true);

    this.tituloProgreso = '2- Selecciona un profesional';
    this.porcentajeProgreso = 20;
    this.spinner = false;
  }

  filtrarTurnos() {
    const pacienteFiltro = this.filtroForm.value.paciente.toLowerCase();
    const especialistaFiltro = this.filtroForm.value.especialista.toLowerCase();
    const estadoFiltro = this.filtroForm.value.estado.toLowerCase();
    const fechaFiltro = this.filtroForm.value.fecha;
    const especialidadFiltro = this.filtroForm.value.especialidad.toLowerCase();

    this.turnosFiltrados = this.turnos.filter(turno =>
      turno.nombrePaciente.toLowerCase().includes(pacienteFiltro) &&
      turno.nombreEspecialista.toLowerCase().includes(especialistaFiltro) &&
      turno.especialidad.toLowerCase().includes(especialidadFiltro) &&
      turno.fecha.includes(fechaFiltro) &&
      turno.estado.toLowerCase().includes(estadoFiltro)
    );
  }

  elegirEspecialidad(especialidadNombre: string) {
    this.especialidadElegida = especialidadNombre;

    this.especialistaElegido = undefined;
    this.fechaElegida = undefined;
    this.horaElegida = undefined;
  }

  elegirEspecialista(especialista: Especialista) {
    this.especialistaElegido = especialista;
    this.consultarHorariosDisponiblesEspecialista(this.especialistaElegido);

    this.userService.getDocumentIdByMail(this.especialistaElegido.mail).subscribe((id) => {
      if (id) {
        this.especialistaId = id;
      }
    });

    this.fechaElegida = undefined;
    this.horaElegida = undefined;

    this.tituloProgreso = '3- Selecciona una fecha disponible';
    this.porcentajeProgreso = 40;
  }

  consultarHorariosDisponiblesEspecialista(especialista: Especialista) {
    const disponibilidad: number = especialista?.disponibilidad;

    if (especialista?.disponibilidad) {
      this.horariosDisponiblesInfo = this.generarTurnosDisponibles(disponibilidad);
    }
  }

  elegirFecha(fecha: any) {
    this.fechaElegida = fecha;
    this.horaElegida = undefined;

    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

    this.tituloProgreso = '4- Selecciona un horario disponible';
    this.porcentajeProgreso = 60;
  }

  elegirHora(hora: any) {
    this.horaElegida = hora;

    this.tituloProgreso = '5- Corrobora la información antes de continuar';
    this.porcentajeProgreso = 80;
  }

  esFinDeSemana(diaDeLaSemana: number): boolean {
    return diaDeLaSemana === 0 || diaDeLaSemana === 6;
  }

  crearTurno(fecha: any) {
    let fechaFormateada = this.formatearFecha(fecha);

    const turnoNuevo: Turno = {
      idPaciente: this.usuarioId,
      idEspecialista: this.especialistaId,
      especialidad: this.especialidadElegida,
      estado: 'Inactivo',
      fecha: fechaFormateada
    }

    this.turno = turnoNuevo;
    this.porcentajeProgreso = 100;
  }

  confirmarTurno(turnoASubir: Turno) {
    this.spinner = true;

    this.turnosService.addTurno(turnoASubir).then(() => {
      this.turno = turnoASubir;
      this.limpiarGestionTurnos();
      this.tramite = 'gestionar-turno';

      Swal.fire('¡Listo!', 'El turno fue solicitado correctamente.', 'success');
    }).catch(() => {
      Swal.fire('¡Ups!', 'Ocurrió un error solicitando el turno', 'error');
    }).finally(() => {
      this.spinner = false;
    });
  }

  aceptarTurno(turno: Turno) {
    this.spinner = true;

    if (turno.id) {
      this.turnosService.updateTurnoById(turno.id, 'Aceptado', '').then(() => {
        Swal.fire('¡Listo!', 'El turno ha sido aceptado.', 'success');
      }).catch(() => {
        Swal.fire('¡Ups!', 'Ocurrió un error al aceptar el turno.', 'error');
      }).finally(() => {
        this.spinner = false;
      });
    }
  }

  irAFinalizarTurno(turno: Turno) {
    this.turnoAFinalizar = turno;

    /*
    let observacion = '';
    let tratamiento = '';

    Swal.fire({
      title: 'Finalizar turno del paciente (1/2)',
      html: 'Detalle el <b>observamiento</b> abajo:',
      input: 'textarea',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Atrás',
      confirmButtonColor: 'green',
    }).then((obsResult) => {

      if (obsResult.isConfirmed) {

        observacion = obsResult.value;

        Swal.fire({
          title: 'Finalizar turno del paciente (2/2)',
          html: 'Detalle el <b>tratamiento</b> abajo:',
          input: 'textarea',
          inputAttributes: {
            autocapitalize: 'off',
          },
          showCancelButton: true,
          confirmButtonText: 'Confirmar',
          cancelButtonText: 'Atrás',
          confirmButtonColor: 'green',
        }).then((tratResult) => {

          if (tratResult.isConfirmed) {

            this.spinner = true;
            tratamiento = tratResult.value;

            const diagnostico: Diagnostico = {
              observacion: observacion,
              tratamiento: tratamiento,
              fecha: this.formatearFecha(new Date())
            };

            if (turno.id) {
              this.turnosService.updateTurnoById(turno.id, 'Finalizado', '', diagnostico).then(() => {

                Swal.fire('¡Listo!', 'El turno ha sido finalizado.', 'success');
              }).catch(() => {
                Swal.fire('¡Ups!', 'Ocurrió un error al finalizar el turno.', 'error');
              }).finally(() => {
                this.spinner = false;
              });
            };
          }
        });
      };
    });
    */
  }

  finalizarTurno(turno: Turno) {
    this.spinner = true;

    const fechaDeHoy = this.formatearFecha(new Date());

    const diagnostico: Diagnostico = {
      observacion: this.historiaClinicaForm.value.observacion,
      tratamiento: this.historiaClinicaForm.value.tratamiento,
      fecha: fechaDeHoy
    };

    const historiaClinica: Historiaclinica = {
      idEspecialista: turno.idEspecialista,
      idPaciente: turno.idPaciente,
      especialidad: turno.especialidad,
      fecha: fechaDeHoy,
      ficha: {
        altura: this.historiaClinicaForm.value.altura,
        peso: this.historiaClinicaForm.value.peso,
        temperatura: this.historiaClinicaForm.value.temperatura,
        presion: this.historiaClinicaForm.value.presion
      }
    };

    if (turno.id) {
      this.turnosService.updateTurnoById(turno.id, 'Finalizado', '', diagnostico).then(() => {

        this.historiaClinicaService.addHistoriaClinica(historiaClinica).then(() => {
          this.turnoAFinalizar = undefined;
          Swal.fire('¡Listo!', 'El turno ha sido finalizado.', 'success');
        }).catch(() => {
          Swal.fire('¡Ups!', 'Ocurrió un error al finalizar el turno.', 'error');
        }).finally(() => {
          this.spinner = false;
        });
      });
    };
  };

  verDiagnostico(turno: Turno) {
        Swal.fire({
          title: "Consulta del profesional (consulta del " + turno.fecha + ")",
          html: '<div class="text-left">' +
            '<b>Diagnóstico: </b>' + turno.diagnostico?.observacion + '<br><br>' +
            '<b>Tratamiento: </b>' + turno.diagnostico?.tratamiento + '<br><br>' +
            '<b>Fecha del diagnóstico: </b>' + turno.diagnostico?.fecha + '</div>',
        });
      }

  rechazarTurno(turno: Turno) {
        Swal.fire({
          title: '<b>¡Cuidado!</b> esta acción es irreversible',
          html: 'Escriba el motivo del rechazo',
          input: 'text',
          inputAttributes: {
            autocapitalize: 'off',
          },
          showCancelButton: true,
          confirmButtonText: 'Confirmar',
          cancelButtonText: 'Atrás',
          confirmButtonColor: 'red',
          icon: 'warning'
        }).then((result) => {
          if (result.isConfirmed) {
            this.spinner = true;

            const motivo = result.value;

            if (turno.id) {
              this.turnosService.updateTurnoById(turno.id, 'Rechazado', motivo).then(() => {
                Swal.fire('¡Listo!', 'El turno ha sido rechazado.<br>Motivo: <b>' + motivo + '</b>', 'success');
              }).catch(() => {
                Swal.fire('¡Ups!', 'Ocurrió un error al rechazar el turno.', 'error');
              }).finally(() => {
                this.spinner = false;
              });
            }
          }
        });
      }

  cancelarTurno(turno: Turno) {
        Swal.fire({
          title: '<b>¡Cuidado!</b> esta acción es irreversible',
          html: 'Escriba el motivo de la cancelación',
          input: 'text',
          inputAttributes: {
            autocapitalize: 'off',
          },
          showCancelButton: true,
          confirmButtonText: 'Confirmar',
          cancelButtonText: 'Atrás',
          confirmButtonColor: 'red',
          icon: 'warning'
        }).then((result) => {
          if (result.isConfirmed) {
            this.spinner = true;

            const motivo = result.value;

            if (turno.id) {
              this.turnosService.cancelTurnoById(turno.id, motivo).then(() => {
                Swal.fire('¡Listo!', 'El turno ha sido cancelado.<br>Motivo: <b>' + motivo + '</b>', 'success');
              }).catch(() => {
                Swal.fire('¡Ups!', 'Ocurrió un error al cancelar el turno.', 'error');
              }).finally(() => {
                this.spinner = false;
              });
            }
          }
        });
      }

  subirResenia(turno: Turno) {
        let comentario = '';

        Swal.fire({
          title: 'Reseña sobre la consulta del ' + turno.fecha,
          html: 'Detalle su <b>reseña</b> abajo:',
          input: 'textarea',
          inputAttributes: {
            autocapitalize: 'off',
          },
          showCancelButton: true,
          confirmButtonText: 'Confirmar',
          cancelButtonText: 'Atrás',
          confirmButtonColor: 'green',
        }).then((result) => {

          if (result.isConfirmed) {

            this.spinner = true;
            comentario = result.value

            const resenia: Resenia = {
              comentario: comentario,
              fecha: this.formatearFecha(new Date())
            };

            if (turno.id) {
              this.turnosService.addReseniaTurnoById(turno.id, resenia).then(() => {
                Swal.fire('¡Listo!', 'La reseña ha sido subida.', 'success');
              }).catch(() => {
                Swal.fire('¡Ups!', 'Ocurrió un error al subir la reseña', 'error');
              }).finally(() => {
                this.spinner = false;
              });
            };
          };
        });
      }

  verResenia(turno: Turno) {
        Swal.fire({
          title: 'Reseña del paciente (consulta del ' + turno.fecha + ')',
          html: '<div class="text-left">' +
            '<b>Reseña: </b>' + turno.resenia?.comentario + '<br><br>' +
            '<b>Fecha de la reseña: </b>' + turno.resenia?.fecha + '</div>',
        });
      }

  formatearFecha(fecha: Date) {
        const dia = ('0' + fecha.getDate()).slice(-2);
        const mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
        const año = fecha.getFullYear();
        const horas = ('0' + fecha.getHours()).slice(-2);
        const minutos = ('0' + fecha.getMinutes()).slice(-2);

        return `${dia}/${mes}/${año} ${horas}:${minutos}`;
      }

  generarTurnosDisponibles(disponibilidad: number) {
        const fechaActual = new Date();
        fechaActual.setDate(fechaActual.getDate() + 1);

        const fechaFin = new Date(fechaActual.getTime() + 15 * 24 * 60 * 60 * 1000);
        const turnosPorDia: { horario: Date[], nombreDia: string, dia: string, mes: string, mesAnio: string }[] = [];

      let fechaIterativa = new Date(fechaActual);

      while (fechaIterativa <= fechaFin) {
        const diaDeLaSemana = fechaIterativa.getDay();
        const nombreDia = this.diasDisponibles[diaDeLaSemana];
        const dia = fechaIterativa.getDate().toString();
        const mes = fechaIterativa.getMonth().toString();
        const mesAnio = fechaIterativa.toLocaleString('es-AR', { month: 'long', year: 'numeric', timeZone: 'America/Argentina/Buenos_Aires' });

        const horaInicio = 8;
        const horaFin = this.esFinDeSemana(diaDeLaSemana) ? 14 : 19;

        const horario: Date[] = [];

        for (let i = horaInicio * 60; i < horaFin * 60; i += disponibilidad) {
          const hora = Math.floor(i / 60);
          const minuto = i % 60;

          const turno = new Date(fechaIterativa);
          turno.setHours(hora, minuto, 0, 0);

          horario.push(turno);
        }

        turnosPorDia.push({ horario, nombreDia, dia, mes, mesAnio });

        fechaIterativa.setDate(fechaIterativa.getDate() + 1);
      }

      return turnosPorDia;
    }

    limpiarGestionTurnos() {
      this.turno = undefined;
      this.fechaElegida = undefined;
      this.horaElegida = undefined;
      this.especialistaElegido = undefined;
      this.especialidadElegida = '';
      this.tituloProgreso = '1- Selecciona un profesional';
      this.porcentajeProgreso = 0;
    }
  }