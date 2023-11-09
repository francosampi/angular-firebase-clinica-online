import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Paciente } from 'src/app/interfaces/perfiles';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PacienteService } from 'src/app/services/paciente/paciente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-paciente',
  templateUrl: './registro-paciente.component.html',
  styleUrls: ['./registro-paciente.component.css', '../../styles/contenedor-fondo.css']
})
export class RegistroPacienteComponent implements OnInit {
  form!: FormGroup;
  perfilImagen1: any;
  perfilImagen2: any;
  imageSrc1: string = '';
  imageSrc2: string = '';
  captchaGenerado: string = '';
  spinner: boolean = false;

  constructor(private router: Router, private fb: FormBuilder, private pacienteService: PacienteService, private authService: AuthService) { }

  ngOnInit(): void {
    //FORMULARIO
    this.form = this.fb.group({
      nombre: [
        '',
        [
          Validators.pattern('^[a-zA-Z ]+$'),
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
        ]
      ],
      apellido: [
        '',
        [
          Validators.pattern('^[a-zA-Z ]+$'),
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
        ]
      ],
      edad: [
        '',
        [
          Validators.required,
          Validators.min(0),
        ]
      ],
      mail: [
        '',
        [
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'),
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50),
        ]
      ],
      dni: [
        '',
        [
          Validators.pattern('^[0-9]+$'),
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(8),
        ]
      ],
      obraSocial: [
        '',
        [
          Validators.pattern('^[a-zA-Z ]+$'),
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
        ]
      ],
      password: [
        '',
        [
          Validators.pattern('^[a-zA-Z0-9]+$'),
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
        ]
      ],
      captcha: [
        '',
        [
          Validators.required,
          Validators.minLength(5)
        ]
      ],
      perfilImagen1: [
        null,
        [
          Validators.required,
          this.fileValidator
        ]
      ],
      perfilImagen2: [
        null,
        [
          Validators.required,
          this.fileValidator
        ]
      ]
    });

    this.generarCaptcha();
  }

  generarCaptcha() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let cadenaAleatoria = '';
    const longitud = 5;
  
    for (let i = 0; i < longitud; i++) {
      const caracterAleatorio = caracteres.charAt(Math.floor(Math.random() * caracteres.length));
      cadenaAleatoria += caracterAleatorio;
    }
  
    this.captchaGenerado=cadenaAleatoria;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];

    if (event.target.id === 'perfilImagen1') {
      this.perfilImagen1 = file;
      this.displayImage(file, 1);
    } else if (event.target.id === 'perfilImagen2') {
      this.perfilImagen2 = file;
      this.displayImage(file, 2);
    }
  }

  fileValidator(control: FormGroup) {
    const file = control.value;

    if (file === null) {
      return {
        fileRequired: true
      };
    }
    return null;
  }

  captchaValidator(control: AbstractControl): { [key: string]: any } | null {
    const captchaIngresado = control.value.toUpperCase();

    if (captchaIngresado !== this.captchaGenerado) {
      return { captchaNoCoincide: true };
    }

    return null;
  }

  captchaCorrecto(): boolean{
      return this.form.value.captcha.toUpperCase() === this.captchaGenerado;
  }

  displayImage(file: File, imageNumber: number) {
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (imageNumber === 1) {
          this.imageSrc1 = reader.result as string;
        } else if (imageNumber === 2) {
          this.imageSrc2 = reader.result as string;
        }
      };
    }
  }

  darAltaPaciente() {
    if (this.captchaCorrecto()){
      this.spinner = true;

      const nuevoPaciente: Paciente = {
        nombre: this.form.value.nombre,
        apellido: this.form.value.apellido,
        edad: this.form.value.edad,
        dni: this.form.value.dni,
        obraSocial: this.form.value.obraSocial,
        mail: this.form.value.mail,
      };

      const fotos: any[] = [this.perfilImagen1, this.perfilImagen2];  

      this.pacienteService.addPaciente(nuevoPaciente, this.form.value.password, fotos).then(() => {
        Swal.fire({
          icon: 'success',
          title: '¡Listo!',
          text: 'El paciente se ha subido con éxito',
        });
  
        this.authService.iniciarSesion(nuevoPaciente.mail, this.form.value.password).then(() => {
          this.router.navigate(['']);
        });
      }).catch(() => {
        Swal.fire('¡Ups!', 'Ocurrió un error al dar de alta al paciente...', 'error');
      }).finally(() => {
        this.spinner = false;
      });
    }
    else
    {
      this.generarCaptcha();
      Swal.fire('¡Captcha inválido!', 'El captcha no es correcto...', 'warning');
    }
  }
}
