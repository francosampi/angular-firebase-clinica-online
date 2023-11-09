import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css', '../../styles/contenedor-fondo.css']
})
export class UsuariosComponent implements OnInit {

  listaUsuarios: any;
  spinner: boolean=false;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe((lista) => {
      this.listaUsuarios = lista;
    });
  }

  habilitarUsuario(mail: string, estado: boolean){
    this.spinner=true;

    this.userService.updateUserHabilitado(mail, estado).then(()=>{
      Swal.fire('¡Listo!', 'El usuario ha sido actualizado exitosamente.', 'success');
    }).catch(()=>{
      Swal.fire('Error', 'Ocurrió un problema actualizando al usuario.', 'error');
    }).finally(()=>{
      this.spinner=false;
    });
  }
}
