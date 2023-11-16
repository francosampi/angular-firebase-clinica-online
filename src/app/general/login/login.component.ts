import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../../styles/contenedor-fondo.css']
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  spinner: boolean = false;
  usuariosAccesoRapido: any = {
    usuario: [],
    especialista: [],
    administrador: []
  };

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService, private userService: UserService) {

    this.usuariosAccesoRapido = {
      usuario: [],
      especialista: [],
      administrador: []
    };
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: [''],
      password: ['']
    });

    //1 ADMIN
    this.asignarUsuarioAAccesosRapidos('QnzBLjRioZPC58MAfDxedrwjoa32');

    //2 ESPECIALISTAS
    this.asignarUsuarioAAccesosRapidos('F3cZ5pvt63Sznt504wVKMDpvRNv1');
    this.asignarUsuarioAAccesosRapidos('5riZkYViVNaFvSVIZlDrJMKyzHE2');

    //3 PACIENTES
    this.asignarUsuarioAAccesosRapidos('Y9OLOSPmkbR9yrI66SHl6zBipK92');
    this.asignarUsuarioAAccesosRapidos('EnuBvFtTpPeDcIBV0QOvck9FfuN2');
    this.asignarUsuarioAAccesosRapidos('g3uzAl6X9kTE7NWCalmIPgbTRey2');
  }

  entrar() {
    this.spinner = true;

    this.authService.iniciarSesion(this.form.value.email, this.form.value.password).then(() => {
      this.router.navigate(['']);
      Swal.fire('¡Bienvenido!', 'Has iniciado sesión correctamente', 'success');
    }).catch((err) => {
      Swal.fire('¡Ups!', 'Ha ocurrido un error al iniciar sesión', 'error');
      console.log(err);
    }).finally(() => {
      this.spinner = false;
    });
  }

  rellenarFormUsuario(usuario: any) {
    this.form.value.email = usuario?.mail;
    this.form.value.password = "123456";

    console.log(usuario?.mail);

    this.entrar();
  }

  asignarUsuarioAAccesosRapidos(id: string) {
    this.userService.getUserByUid(id).pipe(untilDestroyed(this)).subscribe((usuario) => {

      let objetoUsuario: any = {};
      let usuarioNombre = usuario?.nombre;
      let usuarioMail = usuario?.mail;
      let usuarioPerfil = usuario?.perfil;

      this.authService.getUserImagebyUID(id).pipe(untilDestroyed(this)).subscribe((foto) => {
        objetoUsuario['nombre'] = usuarioNombre;
        objetoUsuario['mail'] = usuarioMail;
        objetoUsuario['perfil'] = usuarioPerfil;
        objetoUsuario['foto'] = foto;

        switch (usuarioPerfil) {
          case 'paciente':
            if (!this.usuariosAccesoRapido.usuario.some((u: { nombre: any; }) => u.nombre === usuarioNombre)) {
              this.usuariosAccesoRapido['usuario'].push(objetoUsuario);
            }
            break;
          case 'especialista':
            if (!this.usuariosAccesoRapido.especialista.some((u: { nombre: any; }) => u.nombre === usuarioNombre)) {
              this.usuariosAccesoRapido['especialista'].push(objetoUsuario);
            }
            break;
          case 'administrador':
            if (!this.usuariosAccesoRapido.administrador.some((u: { nombre: any; }) => u.nombre === usuarioNombre)) {
              this.usuariosAccesoRapido['administrador'].push(objetoUsuario);
            }
            break;
          default:
            break;
        }
      });
    });
  }
}