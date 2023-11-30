import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  generateAndDownloadPdf(data: any, filename: string): void {
    const doc = new jsPDF();

    const imageUrl = '../../../assets/iconos/logo-hospital.png';
    doc.addImage(imageUrl, 'JPEG', 15, 5, 40, 40);
    doc.text('Historia clínica', 60, 25);

    const getFormattedDate = () => {
      return new Date().toLocaleDateString('es-ES');
    };

    const formattedDate = getFormattedDate();
    doc.text(`Fecha de emisión: ${formattedDate}`, 60, 35);

    const tableData: any[][] = [];

    data.forEach((historiaClinica: any) => {

      const registroData = [
        historiaClinica.usuario.nombre + ' ' + historiaClinica.usuario.apellido,
        historiaClinica.registro.fecha,
        historiaClinica.usuario.obraSocial,
        historiaClinica.registro.ficha.altura +' m.',
        historiaClinica.registro.ficha.peso + ' kg.',
        historiaClinica.registro.ficha.temperatura + ' °C',
        historiaClinica.registro.ficha.presion + ' mmHg.',
      ];

      const adicionales = historiaClinica.registro.ficha.adicionales;

      if (adicionales) {
        const adicionalesKeys = Object.keys(adicionales);
        const adicionalesValues = Object.values(adicionales);
        const adicionalesArray = adicionalesKeys.map((key, index) => `${key}: ${adicionalesValues[index]}`);
        registroData.push(adicionalesArray.join(', '));
      }

      tableData.push(registroData);
    });

    autoTable(doc, {
      startY: 60,
      head: [['Paciente', 'Fecha', 'OS', 'Altura', 'Peso', 'Temp.', 'Presión', 'Adicionales']],
      body: tableData,
      theme: 'striped'
    });

    doc.save(filename);
  }
}
