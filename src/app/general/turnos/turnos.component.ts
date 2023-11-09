import { Component } from '@angular/core';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css', '../../styles/contenedor-fondo.css']
})
export class TurnosComponent {

  listaEspecialidades: any = [];
  especialidadElegida: string='';
  spinner: boolean=false;

  elegirEspecialidad() {
    console.log('Especialidad elegida:', this.especialidadElegida);
  }
}
