import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Paciente } from 'src/app/interfaces/perfiles';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  constructor(private auth: AngularFireAuth, private firestore: AngularFirestore, private storage: AngularFireStorage) { }

  addPaciente(nuevoPaciente: Paciente, password: string, fotos: any[]): Promise<void> {
    return this.auth.createUserWithEmailAndPassword(nuevoPaciente.mail, password).then(async (data) => {
      const uid = data.user?.uid;
      const pacienteDoc = this.firestore.doc('usuarios/' + uid);

      const filePath1 = uid + '/pfp1';
      const filePath2 = uid + '/pfp2';

      await this.storage.upload(filePath1, fotos[0]);
      await this.storage.upload(filePath2, fotos[1]);

      return pacienteDoc.set({
        ...nuevoPaciente,
        perfil: 'paciente'
      }).then(() => {
        return data.user?.sendEmailVerification().then(()=>{
          return Promise.resolve();
        });
      }).catch((error) => {
        return Promise.reject(error);
      });
    });
  }
}
