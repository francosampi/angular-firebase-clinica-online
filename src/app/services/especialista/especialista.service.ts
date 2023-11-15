import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Especialista } from 'src/app/interfaces/perfiles';

@Injectable({
  providedIn: 'root'
})
export class EspecialistaService {

  constructor(private auth: AngularFireAuth, private firestore: AngularFirestore, private storage: AngularFireStorage) { }

  addEspecialista(nuevoEspecialista: Especialista, password: string, foto: any[]): Promise<void> {
    return this.auth.createUserWithEmailAndPassword(nuevoEspecialista.mail, password).then(async (data) => {
      const uid = data.user?.uid;
      const especialistaDoc = this.firestore.doc('usuarios/' + uid);

      const filePath1 = uid + '/pfp1';

      await this.storage.upload(filePath1, foto);

      return especialistaDoc.set({
        ...nuevoEspecialista,
        perfil: 'especialista'
      }).then(() => {
        return data.user?.sendEmailVerification().then(()=>{
          return Promise.resolve();
        });
      }).catch((error) => {
        return Promise.reject(error);
      });
    });
  }

  getEspecialistas(){
    return this.firestore.collection('usuarios', ref => ref.where('perfil', '==', 'especialista')).valueChanges();
  }

  getEspecialistaById(id: string){
    return this.firestore.collection('usuarios').doc(id).valueChanges({idField: 'id'});
  }

  updateEspecialistaDisponibilidadHoraria(id: string, mins: number): Promise<void>{
    return new Promise((res, rej) => {
      this.firestore.collection('usuarios').doc(id).update({ disponibilidad: mins }).then(() => {
        res();
      }).catch(error => {
        rej(error);
      });
    });
  }
}
