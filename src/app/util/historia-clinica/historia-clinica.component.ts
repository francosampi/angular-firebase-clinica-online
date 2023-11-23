import { Component, Input, OnInit } from '@angular/core';
import { HistoriaClinicaService } from 'src/app/services/historia-clinica/historia-clinica.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-historia-clinica',
  templateUrl: './historia-clinica.component.html',
  styleUrls: ['./historia-clinica.component.css']
})
export class HistoriaClinicaComponent implements OnInit {

  @Input() usuarioObj?: { usuarioId?: string; especialistaId?: string; };
  historiaClinica: { usuario?: any, registro?: any }[] = [];

  constructor(private historiaClinicaService: HistoriaClinicaService, private userService: UserService) { }

  ngOnInit(): void {

    const usuarioId = this.usuarioObj?.usuarioId ? this.usuarioObj.usuarioId : undefined;
    const especialistaId = this.usuarioObj?.especialistaId ? this.usuarioObj.especialistaId : undefined;

    this.historiaClinicaService.getHistoriaClinica(usuarioId, especialistaId).subscribe((lista) => {
      lista.map((registro: any) => {
        this.userService.getUserByUid(registro.payload.doc.data().idPaciente).subscribe((user) => {
          this.historiaClinica.push({ usuario: user, registro: registro.payload.doc.data() });
        });
      });
    });
  }
}