interface loginObject
{
    error: boolean,
    idUsuarioHit: number,
    database: string,
    tipoUsuario: string,
    nombre: string,
    idUsuarioTelegram: number,
    email: string,
    telefono: string,
    chatId: number,
    idioma: string,
    empresa: string,
    mensaje?: string
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