import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Especialista } from 'src/app/interfaces/perfiles';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EspecialistaService } from 'src/app/services/especialista/especialista.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-especialista',
  templateUrl: './registro-especialista.component.html',
  styleUrls: ['./registro-especialista.component.css', '../../styles/contenedor-fondo.css']
})
export class RegistroEspecialistaComponent {
  form!: FormGroup;
  perfilImagen1: any;
  imageSrc1: string = '';
  captchaGenerado: string = '';
  spinner: boolean = false;

  constructor(private router: Router, private fb: FormBuilder, private especialistaService: EspecialistaService, private authService: AuthService) { }

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
      especialidad: [
        '',
        [
          Validators.required,
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
        }
      };
    }
  }

  darAltaEspecialista() {
    if (this.captchaCorrecto()){
      this.spinner = true;

      const nuevoEspecialista: Especialista = {
        nombre: this.form.value.nombre,
        apellido: this.form.value.apellido,
        edad: this.form.value.edad,
        dni: this.form.value.dni,
        especialidad: this.form.value.especialidad,
        mail: this.form.value.mail,
        habilitado: false,
        disponibilidad: 30
      };

      const foto: any[] = this.perfilImagen1;

      this.especialistaService.addEspecialista(nuevoEspecialista, this.form.value.password, foto).then(() => {
        Swal.fire({
          icon: 'success',
          title: '¡Listo!',
          text: 'El especialista se ha subido con éxito',
        });
  
        this.authService.iniciarSesion(nuevoEspecialista.mail, this.form.value.password).then(() => {
          this.router.navigate(['']);
        });
      }).catch(() => {
        Swal.fire('¡Ups!', 'Ocurrió un error al dar de alta al especialista...', 'error');
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
