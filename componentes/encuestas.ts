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
async function getHorasPlan(idChat: number, idPlan: string, database: string, tabla: string, idAuxiliar: number, opts, algoParaSumar = {cantidad: 0, operacion: ''})
{
    var sql = `SELECT idPlan, idTurno FROM ${tabla} WHERE (idTurno like '%Aprendiz%' OR idTurno like '%Coordinacion%' OR idTurno like '%Extra%') AND idPlan = '${idPlan}'`;
    
    var resultado = await conexion.recHit(database, sql);

    var horas = 0;
    var tipo = '';
    if(resultado.recordset.length > 0)
    {
        //Ya tiene horas de algún tipo añadidas
        var infoUgly = resultado.recordset[0].idTurno.split("_");

        if(algoParaSumar.cantidad > 0)
        {
            switch(algoParaSumar.operacion[2])
            {
                case 'A': tipo = 'Aprendiz'; break; 
                case 'E': tipo = 'Extra'; break;
                case 'C': tipo = 'Coordinacion'; break;
            }

            //Hay que sumar las horas que vienen por parámetro
            if(infoUgly[1] == tipo) //Si es el mismo tipo se añaden
            {
                horas = (algoParaSumar.operacion[0] == 'S') ? Number(infoUgly[0]) + algoParaSumar.cantidad : Number(infoUgly[0]) - algoParaSumar.cantidad;
            }
            else
            { //Sino, se restablece el contador con el nuevo tipo
                horas = (algoParaSumar.operacion[0] == 'S') ? algoParaSumar.cantidad : algoParaSumar.cantidad*-1;
            }
            await conexion.recHit(database, `UPDATE ${tabla} SET idTurno = '${horas}_${tipo}' WHERE idPlan = '${idPlan}'`);
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
            switch(algoParaSumar.operacion[2])
            {
                case 'A': tipo = 'Aprendiz'; break; 
                case 'E': tipo = 'Extra'; break;
                case 'C': tipo = 'Coordinacion'; break;
            }
            //Hay que sumar las horas que vienen por parámetro
            horas = (algoParaSumar.operacion[0] == 'S') ? algoParaSumar.cantidad : algoParaSumar.cantidad*-1;
            await conexion.recHit(database, `UPDATE ${tabla} SET idTurno = '${horas}_${tipo}' WHERE idPlan = '${idPlan}'`);
        }
    }
    
    if(resultado.recordset.length > 0)
    {
        var tipoFinal = (algoParaSumar.cantidad > 0) ? tipo : infoUgly[1];
        generarTeclasHoras(idPlan, tipoFinal, horas, idChat, idAuxiliar, opts);
    }
    else
    {
        if(horas > 0)
        {
            generarTeclasHoras(idPlan, tipo, horas, idChat, idAuxiliar, opts);
        }
        else
        {
            generarTeclasHoras(idPlan, '', 0, idChat, idAuxiliar, opts);
        }
    }
    
}

function generarTeclasHoras(idPlan: string, tipoHoras: string, horas, idChat: number, idAuxiliar: number, opts: {chat_id: any;message_id: any;})
{
    var lineas = [];

    var horasAprendiz = 0, horasCoordinacion = 0 , horasExtra = 0;
    switch(tipoHoras)
    {
        case 'Aprendiz': horasAprendiz = horas; break;
        case 'Coordinacion': horasCoordinacion = horas; break;
        case 'Extra': horasExtra = horas; break;
        default: break;
    }

    lineas.push([{text: `+ 0,5h extra (Ahora hay ${horasExtra})`, callback_data: JSON.stringify({acc: 'SHE', idAuxiliar: `${idAuxiliar}`})}]);
    lineas.push([{text: `- 0,5h extra (Ahora hay ${horasExtra})`, callback_data: JSON.stringify({acc: 'RHE', idAuxiliar: `${idAuxiliar}`})}]);
    lineas.push([{text: `+ 0,5h coordinación (Ahora hay ${horasCoordinacion})`, callback_data: JSON.stringify({acc: 'SHC', idAuxiliar: `${idAuxiliar}`})}]);
    lineas.push([{text: `- 0,5h coordinación (Ahora hay ${horasCoordinacion})`, callback_data: JSON.stringify({acc: 'RHC', idAuxiliar: `${idAuxiliar}`})}]);
    lineas.push([{text: `+ 0,5h aprendiz (Ahora hay ${horasAprendiz})`, callback_data: JSON.stringify({acc: 'SHA', idAuxiliar: `${idAuxiliar}`})}]);
    lineas.push([{text: `- 0,5h aprendiz (Ahora hay ${horasAprendiz})`, callback_data: JSON.stringify({acc: 'RHA', idAuxiliar: `${idAuxiliar}`})}]);

    bot.editMessageReplyMarkup({inline_keyboard: lineas, hide_keyboard: false, resize_keyboard: true, one_time_keyboard: true}, opts);

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
    var opts = {chat_id: chatId, message_id: msg.message.message_id}

    switch(callbackData.acc)
    {
        case 'updTurno': 
            mainBot(msg, false).then(sesion=>{
                if(!sesion.error)
                {
                    conexion.recHit('hit', 'select id, dato1 as nombreTabla, dato2 as idPlan, dato3 as idTrabajador, dato4 as idCodigoAccion, dato5 as idTurno from bot_auxiliar where id = ' + callbackData.id).then(res=>{
                        conexion.recHit(sesion.database, `UPDATE ${res.recordset[0].nombreTabla} SET idEmpleado = ${res.recordset[0].idTrabajador} WHERE idPlan = '${res.recordset[0].idPlan}'
                                                        UPDATE CodigosDeAccion SET Param9 = 'REVISADO' WHERE IdCodigo = '${res.recordset[0].idCodigoAccion}';
                                                            `).then(ok=>{
                            getHorasPlan(chatId, res.recordset[0].idPlan, sesion.database, res.recordset[0].nombreTabla, res.recordset[0].id, opts);
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
        case 'SHE':
        case 'RHE':
        case 'SHC':
        case 'RHC':
        case 'SHA':
        case 'RHA': 
            mainBot(msg, false).then(sesion=>{
                if(!sesion.error)
                {
                    conexion.recHit('hit', `SELECT dato1 as nombreTabla, dato2 as idPlan FROM bot_auxiliar WHERE id = ${callbackData.idAuxiliar}`).then(res=>{
                        getHorasPlan(chatId, res.recordset[0].idPlan, sesion.database, res.recordset[0].nombreTabla, callbackData.idAuxiliar, opts, {cantidad: 0.5, operacion: callbackData.acc});
                    });
                }
                else
                {
                    bot.sendMessage(chatId, 'Error en la sesión');
                }
            });
            break;
    }
});