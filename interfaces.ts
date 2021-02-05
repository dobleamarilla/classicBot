interface loginObject
{
    error: boolean,
    database?: string,
    telefono?: string,
    nombre?: string,
    tipoUsuario?: string,
    idTrabajador?: number
}

interface menuObject
{
    menus: any[][],
    necesario: string[],
    exclusion?: any[]
}

interface supervisoraObject
{
    idUsuarioHit: number,
    nombre: string
}