import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../../styles/contenedor-fondo.css']
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  spinner: boolean=false;

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService){}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: [''],
      password: ['']
    });
  }

  entrar(){
    this.spinner=true;

    this.authService.iniciarSesion(this.form.value.email, this.form.value.password).then(()=>{
      this.router.navigate(['']);
      Swal.fire('¡Bienvenido!', 'Has iniciado sesión correctamente', 'success');
    }).catch((err)=>{
      Swal.fire('¡Ups!', 'Ha ocurrido un error al iniciar sesión', 'error');
      console.log(err);
    }).finally(()=>{
      this.spinner=false;
    });
  }
}
