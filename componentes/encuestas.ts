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
async function enviarKeyboardTurnos(arrayTurnos: Array<any>, idTrabajador: number)
{
    var lineas = [];
    
        for(let i = 0; i < arrayTurnos.length; i++)
        {

            var nuevoId = await conexion.recHit('hit', `INSERT INTO bot_auxiliar (dato1, dato2, dato3) VALUES ('${nombreTablaPlanificacio(getLunes(arrayTurnos[i].fecha))}', '${arrayTurnos[i].idPlan}', ${idTrabajador}); SELECT SCOPE_IDENTITY() as id `);
                lineas.push([{text: `Turno: ${arrayTurnos[i].nombreTienda} - ${traductorTipoTurno(arrayTurnos[i].tipoTurno)} - ${arrayTurnos[i].fecha.toLocaleString()}`, callback_data: JSON.stringify({acc: 'updTurno', id: nuevoId.recordset[0].id})}]);
        }
        lineas.push([{text: `Crear turno nuevo`, callback_data: JSON.stringify({})}]);

        return {
            reply_markup: {
            inline_keyboard: lineas      
            }
        }
}
bot.on('message', function(msg) {
    if(msg.text.toLowerCase() == 'revisar')
    {
        mainBot(msg, false).then(sesion=>{
            if(!sesion.error)
            {
                let sqlCodisAccio = "select top 1 Param1 as idTienda, DAY(CONVERT(datetime, Param3, 105)) as dia, MONTH(CONVERT(datetime, Param3, 105)) as mes, YEAR(CONVERT(datetime, Param3, 105)) as year, Param3 as entrada, Param4 as salida, (select nom from Dependentes where codi = Param2) as nombreTrabajador, Param2 as idTrabajador from CodigosDeAccion where tipoCodigo = 'FICHAJE' order by TmStmp desc";

                conexion.recHit(sesion.database, sqlCodisAccio).then(res=>{
                    var sql = '';
                    for(let i = 0; i < res.recordset.length; i++)
                    {
                        let fecha = new Date(res.recordset[i].year, Number(res.recordset[i].mes)-1, res.recordset[i].dia);

                        if(i == res.recordset.length - 1) //Es el último
                        {
                            sql += `select botiga as idTienda, (select nom from clients where codi = botiga) as nombreTienda, periode as tipoTurno, fecha, idPlan, idTurno from ${nombreTablaPlanificacio(getLunes(fecha))} where day(fecha) = ${res.recordset[i].dia} AND month(fecha) = ${res.recordset[i].mes} AND year(fecha) = ${res.recordset[i].year} AND activo = 1 AND idEmpleado IS NULL AND idTurno IS NOT NULL AND BOTIGA = ${res.recordset[i].idTienda}`;
                        }
                        else
                        {
                            sql += `select botiga as idTienda, (select nom from clients where codi = botiga) as nombreTienda, periode as tipoTurno, fecha, idPlan, idTurno from ${nombreTablaPlanificacio(getLunes(fecha))} where day(fecha) = ${res.recordset[i].dia} AND month(fecha) = ${res.recordset[i].mes} AND year(fecha) = ${res.recordset[i].year} AND activo = 1 AND idEmpleado IS NULL AND idTurno IS NOT NULL AND BOTIGA = ${res.recordset[i].idTienda} UNION `;
                        }
                    }
                    conexion.recHit(sesion.database, sql).then(async resTurnos=>{

                        bot.sendMessage(msg.chat.id, `${res.recordset[0].nombreTrabajador}. \nEntrada: ${res.recordset[0].entrada}\nSalida: ${res.recordset[0].salida} `, await enviarKeyboardTurnos(resTurnos.recordset, res.recordset[0].idTrabajador));
                    });                   
                });              
            }
        });
    }
});

bot.on('callback_query', async (msg) => {
    var callbackData = JSON.parse(msg.data);
    if(callbackData.acc == 'updTurno') //UPDATE
    {
        mainBot(msg, false).then(sesion=>{
            if(!sesion.error)
            {
                let chatId = msg.message.chat.id;
                conexion.recHit('hit', 'select dato1 as nombreTabla, dato2 as idPlan, dato3 as idTrabajador from bot_auxiliar where id = ' + callbackData.id).then(res=>{
                    conexion.recHit(sesion.database, `UPDATE ${res.recordset[0].nombreTabla} SET idEmpleado = ${res.recordset[0].idTrabajador} WHERE idPlan = '${res.recordset[0].idPlan}'`).then(ok=>{
                        bot.sendMessage(chatId, 'Fichaje asignado correctamente');
                    });
                });
            }
            else
            {
                bot.sendMessage(msg.chat.id, 'Error en la sesión');
            }
        });
    }
});