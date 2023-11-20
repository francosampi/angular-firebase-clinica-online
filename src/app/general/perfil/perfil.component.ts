import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EspecialistaService } from 'src/app/services/especialista/especialista.service';
import { UserService } from 'src/app/services/user/user.service';
import Swal from 'sweetalert2';

@UntilDestroy()
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css', '../../styles/contenedor-fondo.css']
})
export class PerfilComponent implements OnInit {

  usuarioId: string = '';
  usuarioDatos: any;
  usuarioFoto: File | undefined;
  usuarioFotoSec: File | undefined;
  disponibilidadHoraria: string = '';
  spinner: boolean = false;

  constructor(private authService: AuthService, private userService: UserService, private especialistaService: EspecialistaService) { }

  ngOnInit(): void {
    this.authService.getCurrentUser().pipe(untilDestroyed(this)).subscribe((user) => {

      if (user) {
        this.usuarioId = user.uid;

        this.userService.getUserByUid(user.uid).pipe(untilDestroyed(this)).subscribe((cred) => {
          if (cred) {
            this.usuarioDatos = cred;

            this.authService.getUserImagebyUID(user.uid).pipe(untilDestroyed(this)).subscribe((foto) => {
              if (foto) {
                this.usuarioFoto = foto;
              }
            });

            if (this.usuarioDatos.perfil === 'paciente') {
              this.authService.getUserSecondImagebyUID(user.uid).pipe(untilDestroyed(this)).subscribe((foto2) => {
                if (foto2) {
                  this.usuarioFotoSec = foto2;
                }
              });
            }
          }
        });
      }
    });
  }

  asignarDisponibilidadHoraria(mins: string) {
    this.spinner = true;

    const minutos: number = parseInt(mins);

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
