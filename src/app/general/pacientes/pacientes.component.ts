import { Component, OnInit } from '@angular/core';
import { delayedFadeAnimation } from 'src/app/animations/fade';
import { slideInAnimation } from 'src/app/animations/slideIn';
import { Paciente } from 'src/app/interfaces/perfiles';
import { Turno } from 'src/app/interfaces/turno';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TurnosService } from 'src/app/services/turnos/turnos.service';
import { UserService } from 'src/app/services/user/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css', '../../styles/contenedor-fondo.css'],
  animations: [delayedFadeAnimation, slideInAnimation]
})
export class PacientesComponent implements OnInit {

  especialistaId: string = ''; //Especialista logeado (actualmente)
  usuarioDatos: any;
  pacientes: { idPaciente: string, datos: Paciente, turnosPaciente: any, foto: any }[] = [];
  verPacientes: boolean = true;
  verHistoriaPaciente: any = undefined;
  verTurnosPaciente: any = undefined;

  constructor(private authService: AuthService, private userService: UserService, private turnosService: TurnosService) { }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.especialistaId = user.uid;

        this.userService.getUserByUid(this.especialistaId).subscribe((cred) => {

          if (cred) {
            this.usuarioDatos = cred;
          }
        });

        //Traer pacientes con los cuales se tiene al menos un turno
        this.turnosService.getTurnosByEspecialistaId(this.especialistaId).subscribe((turnos) => {
          const pacientesSet = new Set<string>();

          turnos.forEach((turno: any) => {
            const datosTurno = turno.payload.doc.data();
            const id = datosTurno.idPaciente;

            if (datosTurno.estado === 'Activo' || datosTurno.estado === 'Finalizado') {
              pacientesSet.add(id);
            }
          });

          Array.from(pacientesSet).forEach(id => {
            const idPaciente = id;
            const turnosPaciente: any[] = [];

            const pacienteExistente = this.pacientes.find((pac) => pac.datos.id === idPaciente);

            if (!pacienteExistente) {
              this.userService.getUserByUid(idPaciente).subscribe((datos) => {
                if (datos) {
                  this.authService.getUserImagebyUID(idPaciente).subscribe((foto) => {
                    if (foto) {
                      turnos.forEach((elemento: { payload: { doc: { data: () => any; }; }; }) => {
                        const datosTurnoPaciente = elemento.payload.doc.data();
                        if (datosTurnoPaciente.idPaciente === idPaciente) {
                          turnosPaciente.push(datosTurnoPaciente);
                        };
                      });

                      const pacienteRegistro = { idPaciente, datos, turnosPaciente, foto };
                      this.pacientes.push(pacienteRegistro);
                    };
                  });
                };
              });
            };
          });
        });
      }
    });
  }

  verInfoPaciente(paciente: Paciente) {
    Swal.fire('Información de paciente',
      '<p>Nombre: <b>' + paciente.nombre + '</b></p>' +
      '<hr><p>Apellido: <b>' + paciente.apellido + '</b></p>' +
      '<hr><p>Mail: <b>' + paciente.mail + '</b></p>' +
      '<hr><p>DNI: <b>' + paciente.dni + '</b></p>' +
      '<hr><p>Obra social: <b>' + paciente.obraSocial + '</b></p>',
      'info'
    );
  }

  verReseniaPaciente(turno: Turno) {
    Swal.fire({
      title: 'Reseña del paciente (consulta del ' + turno.fecha + ')',
      html: '<div class="text-left">' +
        '<b>Reseña: </b>' + turno.resenia?.comentario + '<br><br>' +
        '<b>Fecha de la reseña: </b>' + turno.resenia?.fecha + '</div>',
    });
  }
}
