import { Component, OnInit } from '@angular/core';
import { Paciente } from 'src/app/interfaces/perfiles';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TurnosService } from 'src/app/services/turnos/turnos.service';
import { UserService } from 'src/app/services/user/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css', '../../styles/contenedor-fondo.css']
})
export class PacientesComponent implements OnInit {

  usuarioId: string = '';
  usuarioDatos: any;
  pacientes: { datos: Paciente, foto: any }[] = [];
  verPacientes: boolean = true;

  constructor(private authService: AuthService, private userService: UserService, private turnosService: TurnosService) { }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.usuarioId = user.uid;

        this.userService.getUserByUid(this.usuarioId).subscribe((cred) => {

          if (cred) {
            this.usuarioDatos = cred;
          }
        });

        //Traer pacientes con los cuales se tiene al menos un turno
        this.turnosService.getTurnosByEspecialistaId(this.usuarioId).subscribe((turnos) => {
          const pacientesSet = new Set<string>();

          turnos.forEach((turno: any) => {
            const idPaciente = turno.payload.doc.data().idPaciente;
            pacientesSet.add(idPaciente);
          });

          Array.from(pacientesSet).forEach((idPaciente) => {
            const pacienteExistente = this.pacientes.find((pac) => pac.datos.id === idPaciente);

            if (!pacienteExistente) {
              this.userService.getUserByUid(idPaciente).subscribe((datos) => {
                if (datos) {
                  this.authService.getUserImagebyUID(idPaciente).subscribe((foto) => {
                    this.pacientes.push({ datos, foto });
                  });
                };
              });
            }
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
      'info');
  }
}
