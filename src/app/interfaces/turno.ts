export interface Turno{
    id?: string;
    idPaciente: string;
    idEspecialista: string;
    especialidad: string;
    estado: string;
    fecha: string;
    motivo?: string;
    diagnostico?: string;
    resenia?: {
        comentario: string;
        satisfecho: boolean;
    }
}