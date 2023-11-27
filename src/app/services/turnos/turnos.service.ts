import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Diagnostico, Resenia, Turno } from 'src/app/interfaces/turno';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {

  constructor(private firestore: AngularFirestore) { }

  addTurno(turno: Turno): Promise<any> {
    return this.firestore.collection('turnos').add(turno);
  }

  getTurnos() {
    return this.firestore.collection('turnos', ref => ref
      .orderBy('fecha', 'desc')
    ).snapshotChanges();
  }

  getTurnosByUsuarioId(id: string) {
    return this.firestore.collection('turnos', ref => ref
      .where('idPaciente', '==', id)
      .orderBy('fecha', 'desc')
    ).snapshotChanges();
  }

  getTurnosByEspecialistaId(id: string) {
    return this.firestore.collection('turnos', ref => ref
      .where('idEspecialista', '==', id)
      .orderBy('fecha', 'desc')
    ).snapshotChanges();
  }

  getTurnosByEspecialistaPacienteIds(idPaciente: string, idEspecialista: string){
    return this.firestore.collection('turnos', ref => ref
      .where('idEspecialista', '==', idEspecialista)
      .where('idPaciente', '==', idPaciente)
      .orderBy('fecha', 'desc')
    ).snapshotChanges();
  }

  updateTurnoById(id: string, estado: string, motivoTxt: string, diagnosticoTxt: Diagnostico = {}): Promise<void> {
    return new Promise((res, rej) => {
      this.firestore.collection('turnos').doc(id).update({ estado: estado, motivo: motivoTxt, diagnostico: diagnosticoTxt }).then(() => {
        res();
      }).catch(error => {
        rej(error);
      });
    });
  }

  addReseniaTurnoById(id: string, reseniaObj: Resenia = {}): Promise<void> {
    return new Promise((res, rej) => {
      this.firestore.collection('turnos').doc(id).update({ resenia: reseniaObj }).then(() => {
        res();
      }).catch(error => {
        rej(error);
      });
    });
  }

  cancelTurnoById(id: string, motivoTxt: string): Promise<void> {
    return new Promise((res, rej) => {
      this.firestore.collection('turnos').doc(id).update({ estado: 'Cancelado', motivo: motivoTxt }).then(() => {
        res();
      }).catch(error => {
        rej(error);
      });
    });
  }
}
