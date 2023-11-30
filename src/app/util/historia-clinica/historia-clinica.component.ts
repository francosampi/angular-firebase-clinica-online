import { Component, Input, OnInit } from '@angular/core';
import { HistoriaClinicaService } from 'src/app/services/historia-clinica/historia-clinica.service';
import { PdfService } from 'src/app/services/pdf/pdf.service';
import { UserService } from 'src/app/services/user/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-historia-clinica',
  templateUrl: './historia-clinica.component.html',
  styleUrls: ['./historia-clinica.component.css']
})
export class HistoriaClinicaComponent implements OnInit {

  @Input() usuarioObj?: { usuarioId?: string; especialistaId?: string; };
  historiaClinica: { usuario?: any, registro?: any }[] = [];

  constructor(private historiaClinicaService: HistoriaClinicaService, private userService: UserService, private pdfService: PdfService) { }

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

  descargarPDFHistorial() {
    Swal.fire({
      title: "Archivo de usuario",
      html: "Descargar historia clínica",
      showCancelButton: true,
      confirmButtonText: "Descargar historia clínica (.pdf)",
      cancelButtonText: "Cancelar",
    }).then((result) => {

      try {
        if (result.isConfirmed) {
          this.pdfService.generateHistoriaClinicaPdf(this.historiaClinica, 'historia_clinica');
          Swal.fire("PDF descargado", "", "success");
        }
      } catch (error) {
        Swal.fire("¡Ups!", "Error al descargar archivos...", 'error');
        console.log(error);
      }
    });
  }
}