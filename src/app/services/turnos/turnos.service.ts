import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Turno } from 'src/app/interfaces/turno';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {

  constructor(private firestore: AngularFirestore) { }

  addTurno(turno: Turno): Promise<any>{
    return this.firestore.collection('turnos').add(turno);
  }
}
