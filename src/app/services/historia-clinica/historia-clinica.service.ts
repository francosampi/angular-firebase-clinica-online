import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Historiaclinica } from 'src/app/interfaces/historia-clinica';

@Injectable({
  providedIn: 'root'
})
export class HistoriaClinicaService {

  constructor(private firestore: AngularFirestore) { }

  addHistoriaClinica(historiaClinica: Historiaclinica): Promise<any>{
    return this.firestore.collection('historia-clinica').add(historiaClinica);
  }

  getHistoriaClinicaByEspecialistaId(uid: string): Observable<any> {
    return this.firestore
      .collection('historia-clinica', ref => ref
      .where('idEspecialista', '==', uid)).snapshotChanges();
  }
}
