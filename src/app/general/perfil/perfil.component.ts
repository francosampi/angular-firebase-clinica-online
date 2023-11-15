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

  usuarioId: string='';
  usuarioDatos: any;
  usuarioFoto: File | undefined;
  disponibilidadHoraria: string = '';
  spinner: boolean = false;

  constructor(private authService: AuthService, private userService: UserService, private especialistaService: EspecialistaService) { }

  ngOnInit(): void {
    this.authService.getCurrentUser().pipe(untilDestroyed(this)).subscribe((user) => {

      this.usuarioId = user.uid;
      console.log(this.usuarioId);

      this.userService.getUserByUid(user!.uid).pipe(untilDestroyed(this)).subscribe((user) => {
        this.usuarioDatos = user;
      });

      this.authService.getUserImagebyUID(user!.uid).pipe(untilDestroyed(this)).subscribe((foto) => {
        this.usuarioFoto = foto;
      });
    });
  }

  asignarDisponibilidadHoraria(mins: string) {
    this.spinner=true;

    const minutos: number = parseInt(mins);

    this.especialistaService.updateEspecialistaDisponibilidadHoraria(this.usuarioId, minutos).then(()=>{
      Swal.fire('¡Listo!', 'Disponibilidad asignada a '+this.disponibilidadHoraria+' minutos por turno.', 'success');
    }).catch((error)=>{
      Swal.fire('¡Ups!', 'Ocurrió un error asignando la disponibilidad horaria.', 'error');
      console.log(error);
    }).finally(()=>{
      this.spinner=false;
    });
  }
}
