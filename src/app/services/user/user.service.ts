import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit {

  usuarioCredenciales: any;

  constructor(private firestore: AngularFirestore) { }

  ngOnInit(): void {
  }

  getAllUsers(): Observable<any> {
    return this.firestore.collection('usuarios').valueChanges();
  }

  getUserByUid(uid: string): Observable<any> {
    return this.firestore.collection('usuarios').doc(uid).valueChanges();
  }

  updateUserHabilitado(mail: string, estado: boolean): Promise<void>{
    return new Promise((res, rej) => {
      this.firestore.collection('usuarios', ref => ref.where('mail', '==', mail)).get().subscribe(querySnapshot => {
        if (querySnapshot.size === 1) {
          const usuarioId = querySnapshot.docs[0].id;

          this.firestore.collection('usuarios').doc(usuarioId).update({ habilitado: estado }).then(() => {
            res();
          }).catch(error => {
            rej(error);
          });
        } else {
          rej(new Error('No se encontró un usuario con el correo proporcionado.'));
        }
      });
    })
  }
}
