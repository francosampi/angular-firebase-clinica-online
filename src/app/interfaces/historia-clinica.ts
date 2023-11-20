export interface Historiaclinica {
    id?: string;
    idEspecialista: string;
    idPaciente: string;
    especialidad: string;
    fecha: string;
    ficha: {
        altura: number;
        peso: number;
        temperatura: number;
        presion: number;
    };
    adicionales?: {
    };
}