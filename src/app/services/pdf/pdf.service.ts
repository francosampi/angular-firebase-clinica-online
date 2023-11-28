import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  generateAndDownloadTurnosPdf(usuario: any, filename: string): void {
    const doc = new jsPDF();
    doc.text('Listado de turnos', 60, 20);
    doc.text(usuario.userData.nombre + ' ' + usuario.userData.apellido, 60, 30);

    const imageUrl = '../../../assets/iconos/logo-hospital.png';
    doc.addImage(imageUrl, 'JPEG', 5, 5, 40, 40);

    usuario.turnosUser.forEach((element: { payload: { doc: { data: () => any; }; }; }) => {
      console.log(element.payload.doc.data());
    });

    const turnosUser: any[] = [];

    /*
      usuario.turnos.forEach(turno => {
        turnosUser.push(turno);
      });
    */

    autoTable(doc,
      {
        startY: 60,
        head: [['Fecha', 'Especialidad', 'Estado']],
        body: usuario.turnosUser,
      });

    doc.save(filename);
  }
}
