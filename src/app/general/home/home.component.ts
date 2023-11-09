import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthService } from 'src/app/services/auth/auth.service';

@UntilDestroy()
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', '../../styles/contenedor-fondo.css']
})
export class HomeComponent implements OnInit{

  usuarioLogeado: any;
  activeSlideIndex: number = 0;

  constructor(private authService: AuthService){}

  ngOnInit(): void {
    this.authService.getCurrentUser().pipe(untilDestroyed(this)).subscribe((user)=>{
      this.usuarioLogeado=user;
    });
  }

  items: string[]=[
    "Crea tu cuenta o ingresa",
    "Reserva o consulta tu turno",
    "Escribe tu reseña",
  ]

  changeSlide(index: number) {
    this.activeSlideIndex = index;
  }
}
