import { Component, Input, OnInit } from '@angular/core';
import { HistoriaClinicaService } from 'src/app/services/historia-clinica/historia-clinica.service';

@Component({
  selector: 'app-historia-clinica',
  templateUrl: './historia-clinica.component.html',
  styleUrls: ['./historia-clinica.component.css']
})
export class HistoriaClinicaComponent implements OnInit {

  @Input() usuarioObj?: { usuarioId?: string; especialistaId?: string; };
  historiaClinica: any[]=[];

  constructor(private historiaClinicaService: HistoriaClinicaService){}

  ngOnInit(): void {
    console.log(this.usuarioObj);

    if(this.usuarioObj?.especialistaId)
    {
      this.historiaClinicaService.getHistoriaClinica(this.usuarioObj?.usuarioId, this.usuarioObj?.especialistaId).subscribe((lista)=>{
        lista.map((registro: any)=>{
          this.historiaClinica.push(registro.payload.doc.data());
        });
      });
    }
  }
}