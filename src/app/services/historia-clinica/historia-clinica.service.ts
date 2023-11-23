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
    let observable = this.firestore
      .collection('historia-clinica').snapshotChanges();;

    if (idEspecialista) {
      if (idPaciente) {
        observable = this.firestore
          .collection('historia-clinica', ref => ref
            .where('idEspecialista', '==', idEspecialista)
            .where('idPaciente', '==', idPaciente)).snapshotChanges();
      }
      else {
        observable = this.firestore
          .collection('historia-clinica', ref => ref
            .where('idEspecialista', '==', idEspecialista)).snapshotChanges();
      }
    }
    return observable;
  }
}
