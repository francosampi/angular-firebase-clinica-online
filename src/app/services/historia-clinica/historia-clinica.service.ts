import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Historiaclinica } from 'src/app/interfaces/historia-clinica';

@Injectable({
  providedIn: 'root'
})
export class HistoriaClinicaService {

  constructor(private firestore: AngularFirestore) { }

  addHistoriaClinica(historiaClinica: Historiaclinica): Promise<any> {
    return this.firestore.collection('historia-clinica').add(historiaClinica);
  }

  getHistoriaClinica(idPaciente: string | undefined, idEspecialista: string | undefined): Observable<any> {
    let query = this.firestore.collection('historia-clinica', ref => {
      let baseQuery = ref.orderBy('fecha', 'desc');

      if (idPaciente) {
        baseQuery = baseQuery.where('idPaciente', '==', idPaciente);
      }

      if (idEspecialista) {
        baseQuery = baseQuery.where('idEspecialista', '==', idEspecialista);
      }

      return baseQuery;
    });

    return query.snapshotChanges();
  }
}
