import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadesService {

  constructor(private firestore: AngularFirestore) {}

  getAllEspecialidades(): Observable<any> {
    return this.firestore.collection('especialidades').valueChanges();
  }
}
