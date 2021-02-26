import {botsendMessage, bot, mainBot} from '../bot';
const conexion = require('../conexion');

function getLunes(d: Date) 
{
    var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6:1);
    return new Date(d.setDate(diff));
}

function nombreTablaPlanificacio(d: Date)
{
    var nombre = 'cdpPlanificacion_' + d.getFullYear();
    var mes = (d.getMonth() + 1 >= 10) ? String(d.getMonth() + 1) : '0' + String(d.getMonth() + 1);
    var dia = (d.getDate() >= 10) ? String(d.getDate()) : '0' + String(d.getDate());

    return nombre + '_' + mes + '_' + dia;
}
function traductorTipoTurno(tipo: string)
{
    switch(tipo)
    {
        case 'M': return 'Mañana';
        case 'T': return 'Tarde';
        case 'N': return 'Noche';
    }
}
async function enviarKeyboardTurnos(arrayTurnos: Array<any>, idTrabajador: number, idCodigoAccion: string, idTurno: string)
{
    var lineas = [];
        for(let i = 0; i < arrayTurnos.length; i++)
        {
            var nuevoId = await conexion.recHit('hit', `INSERT INTO bot_auxiliar (dato1, dato2, dato3, dato4, dato5) VALUES ('${nombreTablaPlanificacio(getLunes(arrayTurnos[i].fecha))}', '${arrayTurnos[i].idPlan}', ${idTrabajador}, '${idCodigoAccion}', '${idTurno}'); SELECT SCOPE_IDENTITY() as id `);
            lineas.push([{text: `Turno: ${arrayTurnos[i].nombreTienda} - ${traductorTipoTurno(arrayTurnos[i].tipoTurno)} - ${arrayTurnos[i].nombreTurno}`, callback_data: JSON.stringify({acc: 'updTurno', id: nuevoId.recordset[0].id})}]);
        }
        //var nuevoId = await conexion.recHit('hit', `INSERT INTO bot_auxiliar (dato1, dato2, dato3, dato4, dato5) VALUES ('${nombreTablaPlanificacio(getLunes(arrayTurnos[i].fecha))}', '${arrayTurnos[i].idPlan}', ${idTrabajador}, '${idCodigoAccion}', '${idTurno}'); SELECT SCOPE_IDENTITY() as id `);
        //Aquí falta saber qué datos necesito guardar para establecer las horas.


        //'CEB32FAD-64D4-431B-9379-90CBEC044BA9'})}]);

        return {
            reply_markup: {
            inline_keyboard: lineas      
            }
        }
}
async function getHorasPlan(idChat: number, idPlan: string, database: string, tabla: string, algoParaSumar = {cantidad: 0, tipo: '', operacion: ''})
{
    var resultado = await conexion.recHit(database, `SELECT idPlan, idTurno FROM ${tabla} WHERE (idTurno like '%Aprendiz%' OR idTurno like '%Coordinacion%' OR idTurno like '%Extra%') AND idPlan = '${idPlan}'`);
    var horas = 0;
    if(resultado.recordset.lenght > 0)
    {
        //Ya tiene horas de algún tipo añadidas
        var infoUgly = resultado.recordset[0].idTurno.split("_");
        if(algoParaSumar.cantidad > 0)
        {
            //Hay que sumar las horas que vienen por parámetro
            if(infoUgly[1] == algoParaSumar.tipo) //Si es el mismo tipo se añaden
            {
                horas = (algoParaSumar.operacion[0] == 'S') ? Number(infoUgly[0]) + algoParaSumar.cantidad : Number(infoUgly[0]) - algoParaSumar.cantidad;
            }
            else
            { //Sino, se restablece el contador con el nuevo tipo
                horas = (algoParaSumar.operacion[0] == 'S') ? algoParaSumar.cantidad : algoParaSumar.cantidad*-1;
            }
            await conexion.recHit(database, `UPDATE ${tabla} SET idTurno = '${horas}_${algoParaSumar.tipo}' WHERE idPlan = '${idPlan}'`);
        }
        else
        {
            horas = Number(infoUgly[0]);
        }
        
    }
    else
    {
        if(algoParaSumar.cantidad > 0)
        {
            //Hay que sumar las horas que vienen por parámetro
            horas = (algoParaSumar.operacion[0] == 'S') ? algoParaSumar.cantidad : algoParaSumar.cantidad*-1;
            await conexion.recHit(database, `UPDATE ${tabla} SET idTurno = '${horas}_${algoParaSumar.tipo}' WHERE idPlan = '${idPlan}'`);
        }
    }
    
    if(resultado.recordset.lenght > 0)
    {
        var tipoFinal = (algoParaSumar.cantidad > 0) ? algoParaSumar.tipo : infoUgly[1];
        generarTeclasHoras(idPlan, tipoFinal, horas, idChat);
    }
    else
    {
        //Es la primera vez que se accede a este menú, no hay ningún tipo ni cantidad.
        generarTeclasHoras(idPlan, '', 0, idChat);
    }
    
}

function generarTeclasHoras(idPlan: string, tipoHoras: string, horas, idChat: number)
{
    var texto = '';
    if(horas == 0 && tipoHoras == '')
    {
        texto = 'No hay horas de ningún tipo asignadas por el momento';
    }
    else
    {
        texto = `Hay ${horas} h acumuladas de tipo ${tipoHoras}`;
    }
    var lineas = [];

    lineas.push([{text: `Sumar 0,5h extra`, callback_data: JSON.stringify({acc: 'SHE', id: `${idPlan}`})}]);
    lineas.push([{text: `Restar 0,5h extra`, callback_data: JSON.stringify({acc: 'RHE', id: `${idPlan}`})}]);
    lineas.push([{text: `Sumar 0,5h coordinación`, callback_data: JSON.stringify({acc: 'SHC', id: `${idPlan}`})}]);
    lineas.push([{text: `Restar 0,5h coordinación`, callback_data: JSON.stringify({acc: 'RHC', id: `${idPlan}`})}]);
    lineas.push([{text: `Sumar 0,5h aprendiz`, callback_data: JSON.stringify({acc: 'SHA', id: `${idPlan}`})}]);
    lineas.push([{text: `Restar 0,5h aprendiz`, callback_data: JSON.stringify({acc: 'RHA', id: `${idPlan}`})}]);
    bot.sendMessage(idChat, texto, {
        reply_markup: {
        inline_keyboard: lineas      
        }
    });
}

bot.on('message', function(msg) {
    if(msg.text.toLowerCase() == 'revisar')
    {
        mainBot(msg, false).then(sesion=>{
            if(!sesion.error)
            {
                let sqlCodisAccio = "select top 1 IdCodigo as idCodigoAccion, Param1 as idTienda, DAY(CONVERT(datetime, Param3, 105)) as dia, MONTH(CONVERT(datetime, Param3, 105)) as mes, YEAR(CONVERT(datetime, Param3, 105)) as year, Param3 as entrada, Param4 as salida, (select nom from Dependentes where codi = Param2) as nombreTrabajador, Param2 as idTrabajador from CodigosDeAccion where tipoCodigo = 'FICHAJE' AND Param9 IS NULL order by TmStmp desc";

                conexion.recHit(sesion.database, sqlCodisAccio).then(async res=>{
                    
                    await conexion.recHit(sesion.database, "UPDATE CodigosDeAccion SET Param9 = 'NO CONTESTAR' WHERE IdCodigo = '" + res.recordset[0].idCodigoAccion + "'");
                    if(res.recordset.length > 0)
                    {
                        var sql = '';
                        for(let i = 0; i < res.recordset.length; i++)
                        {
                            let fecha = new Date(res.recordset[i].year, Number(res.recordset[i].mes)-1, res.recordset[i].dia);
    
                            if(i == res.recordset.length - 1) //Es el último
                            {
                                sql += `select botiga as idTienda, (select nom from clients where codi = botiga) as nombreTienda, periode as tipoTurno, fecha, idPlan, idTurno, (select top 1 nombre from cdpTurnos where idTurno = idTurno) as nombreTurno from ${nombreTablaPlanificacio(getLunes(fecha))} where day(fecha) = ${res.recordset[i].dia} AND month(fecha) = ${res.recordset[i].mes} AND year(fecha) = ${res.recordset[i].year} AND activo = 1 AND idEmpleado IS NULL AND idTurno IS NOT NULL AND BOTIGA = ${res.recordset[i].idTienda}`;
                            }
                            else
                            {
                                sql += `select botiga as idTienda, (select nom from clients where codi = botiga) as nombreTienda, periode as tipoTurno, fecha, idPlan, idTurno, (select top 1 nombre from cdpTurnos where idTurno = idTurno) as nombreTurno from ${nombreTablaPlanificacio(getLunes(fecha))} where day(fecha) = ${res.recordset[i].dia} AND month(fecha) = ${res.recordset[i].mes} AND year(fecha) = ${res.recordset[i].year} AND activo = 1 AND idEmpleado IS NULL AND idTurno IS NOT NULL AND BOTIGA = ${res.recordset[i].idTienda} UNION `;
                            }
                        }
                        conexion.recHit(sesion.database, sql).then(async resTurnos=>{
    
                            bot.sendMessage(msg.chat.id, `${res.recordset[0].nombreTrabajador}. \nEntrada: ${res.recordset[0].entrada}\nSalida: ${res.recordset[0].salida} `, await enviarKeyboardTurnos(resTurnos.recordset, res.recordset[0].idTrabajador, res.recordset[0].idCodigoAccion, res.recordset[0].idTurno));
                        });  
                    }
                    else
                    {
                        bot.sendMessage(msg.chat.id, 'No hay fichajes pendientes de revisión');
                    }
                });              
            }
        });
    }
});

function generarTecladoHoras(sesion: loginObject, idPlan, tipoHora)
{
    conexion.recHit(sesion.database, `select * from cdpPlanificacion_2021_02_22 where idPlan ="CEB32FAD-64D4-431B-9379-90CBEC044BA9"`);
}

bot.on('callback_query', async (msg) => {
    var callbackData = JSON.parse(msg.data);
    let chatId = msg.message.chat.id;
    switch(callbackData.acc)
    {
        case 'updTurno': 
            mainBot(msg, false).then(sesion=>{
                if(!sesion.error)
                {
                    conexion.recHit('hit', 'select dato1 as nombreTabla, dato2 as idPlan, dato3 as idTrabajador, dato4 as idCodigoAccion, dato5 as idTurno from bot_auxiliar where id = ' + callbackData.id).then(res=>{
                        conexion.recHit(sesion.database, `UPDATE ${res.recordset[0].nombreTabla} SET idEmpleado = ${res.recordset[0].idTrabajador} WHERE idPlan = '${res.recordset[0].idPlan}'
                                                        UPDATE CodigosDeAccion SET Param9 = 'REVISADO' WHERE IdCodigo = '${res.recordset[0].idCodigoAccion}';
                                                            `).then(ok=>{
                            getHorasPlan(chatId, res.recordset[0].idPlan, sesion.database, res.recordset[0].nombreTabla);
                        });
                    });
                }
                else
                {
                    bot.sendMessage(chatId, 'Error en la sesión');
                }
            });
            break;
        case 'cnfHE': //EXTRA
            mainBot(msg, false).then(sesion=>{
                if(!sesion.error)
                {
                    bot.sendMessage(chatId, 'Introduce las horas extra a sumar')
                }
                else
                {
                    bot.sendMessage(chatId, 'Error en la sesión');
                }
            });
            break;
        case 'cnfHA': //APRENDIZ
            mainBot(msg, false).then(sesion=>{
                if(!sesion.error)
                {
                    bot.sendMessage(chatId, 'Introduce las horas de aprendiz a sumar')
                }
                else
                {
                    bot.sendMessage(chatId, 'Error en la sesión');
                }
            });
            break;
        case 'cnfHC': //COORDINACIÓN
            mainBot(msg, false).then(sesion=>{
                if(!sesion.error)
                {
                    bot.sendMessage(chatId, 'Introduce las horas de coordinación a sumar')
                }
                else
                {
                    bot.sendMessage(chatId, 'Error en la sesión');
                }
            });
            break;
    }
});