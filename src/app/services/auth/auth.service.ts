import { Injectable, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, take } from 'rxjs';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  usuarioLogeado: any;
  usuarioCredenciales: any;
  usuarioPerfil?: string = '';
  usuarioFoto?: any;

  constructor(private auth: AngularFireAuth, private storage: AngularFireStorage, private userService: UserService) {
    this.getCurrentUser().subscribe((user) => {
      if (user) {
        this.usuarioLogeado = user;

        this.userService.getUserByUid(user.uid).subscribe((cred) => {

          if (cred) {
            this.usuarioCredenciales = cred;
            this.usuarioPerfil = cred.perfil;
          }
        });
      }
    });
  }

  async iniciarSesion(email: string, password: string): Promise<any> {
    return await this.auth.signInWithEmailAndPassword(email, password).then(async (res) => {
      return await this.userService.getUserByUid(res.user!.uid).pipe(take(1)).subscribe((user) => {

        if (user) {
          this.usuarioCredenciales = user;
          this.usuarioPerfil = user?.perfil;

          this.getUserImagebyUID(user.uid).pipe(take(1)).subscribe((foto) => {
            this.usuarioFoto = foto;
          });
        }
      });
    });
  }

  cerrarSesion(): Promise<void> {
    return this.auth.signOut();
  }

  getCurrentUser(): Observable<any> {
    return this.auth.authState;
  }

  getUserImagebyUID(uid: string): Observable<any> {
    const filePath1 = uid + '/pfp1';
    const pfpImageRef = this.storage.ref(filePath1);

    return pfpImageRef?.getDownloadURL();
  }

  getUserSecondImagebyUID(uid: string): Observable<any> {
    const filePath1 = uid + '/pfp2';
    const pfpImageRef = this.storage.ref(filePath1);

    return pfpImageRef?.getDownloadURL();
  }
}
