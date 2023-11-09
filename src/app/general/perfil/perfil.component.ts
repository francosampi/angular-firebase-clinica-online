import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';

@UntilDestroy()
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css', '../../styles/contenedor-fondo.css']
})
export class PerfilComponent implements OnInit {

  usuarioDatos: any;
  usuarioFoto: File | undefined;

  constructor(private authService: AuthService, private userService: UserService){}

  ngOnInit(): void {
     this.authService.getCurrentUser().pipe(untilDestroyed(this)).subscribe((user)=>{

      this.userService.getUserByUid(user!.uid).pipe(untilDestroyed(this)).subscribe((user)=>{
        this.usuarioDatos=user;
      });

      this.authService.getUserImagebyUID(user!.uid).pipe(untilDestroyed(this)).subscribe((foto)=>{
        this.usuarioFoto=foto;
      });
    });
  }
}
