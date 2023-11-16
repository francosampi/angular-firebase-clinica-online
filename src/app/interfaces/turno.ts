export interface Turno{
    id?: string;
    idPaciente: string;
    idEspecialista: string;
    especialidad: string;
    estado: string;
    fecha: string;
    motivo?: string;
    diagnostico?: Diagnostico;
    resenia?: Resenia;
}

export interface Diagnostico{
    observacion?: string;
    tratamiento?: string;
    fecha?: string;
}

export interface Resenia{
    comentario?: string;
    fecha?: string;
}