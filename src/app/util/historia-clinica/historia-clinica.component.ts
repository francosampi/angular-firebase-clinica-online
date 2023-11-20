import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-historia-clinica',
  templateUrl: './historia-clinica.component.html',
  styleUrls: ['./historia-clinica.component.css']
})
export class HistoriaClinicaComponent implements OnInit {

  @Input() usuarioObj?: { usuarioId?: string; usuarioDatos: any; };

  ngOnInit(): void {
    console.log(this.usuarioObj);
  }
}
