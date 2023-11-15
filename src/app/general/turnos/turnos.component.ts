import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Especialidad } from 'src/app/interfaces/especialidad';
import { Especialista } from 'src/app/interfaces/perfiles';
import { Turno } from 'src/app/interfaces/turno';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EspecialidadesService } from 'src/app/services/especialidades/especialidades.service';
import { TurnosService } from 'src/app/services/turnos/turnos.service';
import { UserService } from 'src/app/services/user/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css', '../../styles/contenedor-fondo.css']
})
export class TurnosComponent implements OnInit {

  usuarioId: string = '';
  tramite: string = '';
  turno: Turno | undefined;
  especialistaId: string = '';
  especialistas$: Observable<any>;
  especialistas: Especialista[] = [];
  especialistaElegido: Especialista | undefined;
  especialidades: Especialidad[] = [];
  especialidadElegida: string = '';
  horariosDisponiblesInfo: any;
  diasDisponibles: string[] = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  fechasDisponibles: any;
  fechaElegida: any;
  horaElegida: any;
  porcentajeProgreso = 0;
  spinner: boolean = false;

  constructor(private authService: AuthService, private userService: UserService, private especialidadesService: EspecialidadesService, private turnosService: TurnosService) {
    this.especialistas$ = this.userService.getAllEspecialistas();
  }

  ngOnInit(): void {

    this.authService.getCurrentUser().subscribe((user) => {
      this.usuarioId = user.uid;
    });

    this.especialidadesService.getAllEspecialidades().subscribe((lista) => {
      this.especialidades = lista;
    });
  }

  filtrarEspecialidad() {
    this.spinner = true;

    this.especialistas$.subscribe((lista: Especialista[]) => {
      this.especialistas = lista.filter(especialista => especialista.especialidad === this.especialidadElegida && especialista.habilitado===true);
      this.porcentajeProgreso = 20;
      this.spinner = false;
    });
  }

  elegirEspecialista(especialista: Especialista) {
    this.especialistaElegido = especialista;
    this.consultarHorariosDisponiblesEspecialista(this.especialistaElegido);

    this.userService.getDocumentIdByMail(this.especialistaElegido.mail).subscribe((id) => {
      if (id) {
        this.especialistaId = id;
      }
    });

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
    this.horaElegida = '';

    this.porcentajeProgreso = 60;
  }

  elegirHora(hora: any) {
    this.horaElegida = hora;
    this.porcentajeProgreso = 80;
  }

  esFinDeSemana(diaDeLaSemana: number): boolean {
    return diaDeLaSemana === 0 || diaDeLaSemana === 6;
  }

  confirmarTurno(fecha: any) {
    this.spinner = true;

    let fechaFormateada = this.formatearFecha(fecha);

    const turno: Turno = {
      idPaciente: this.usuarioId,
      idEspecialista: this.especialistaId,
      especialidad: this.especialidadElegida,
      estado: 'Inactivo',
      motivo: '',
      fecha: fechaFormateada
    }

    this.turnosService.addTurno(turno).then(() => {
      Swal.fire('¡Listo!', 'El turno fue solicitado correctamente.', 'success');
    }).catch(() => {
      Swal.fire('¡Ups!', 'Ocurrió un error solicitando el turno', 'error');
    }).finally(() => {
      this.spinner = false;
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
    const turnosPorDia: { horario: Date[], nombreDia: string, diaMes: string, mesAnio: string }[] = [];

    let fechaIterativa = new Date(fechaActual);

    while (fechaIterativa <= fechaFin) {
      const diaDeLaSemana = fechaIterativa.getDay();
      const nombreDia = this.diasDisponibles[diaDeLaSemana];
      const dia = fechaIterativa.getDate();
      const diaMes = `${nombreDia} ${dia}`;
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

      turnosPorDia.push({ horario, nombreDia, diaMes, mesAnio });

      fechaIterativa.setDate(fechaIterativa.getDate() + 1);
    }

    return turnosPorDia;
  }
}