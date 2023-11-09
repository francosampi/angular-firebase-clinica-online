export interface Usuario {
    nombre: string;
    apellido: string;
    edad: number;
    dni: number;
    mail: string;
}

export interface Paciente extends Usuario {
    obraSocial: string;
}

export interface Especialista extends Usuario {
    especialidad: string;
    habilitado: boolean;
}

export interface Administrador extends Usuario {
}