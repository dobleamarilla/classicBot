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
function enviarKeyboardTurnos(arrayTurnos: Array<any>)
{
    var lineas = [];

        for(let i = 0; i < arrayTurnos.length; i++)
        {
            lineas.push([{text: `Tienda: ${arrayTurnos[i].nombreTienda} - ${traductorTipoTurno(arrayTurnos[i].tipoTurno)} - ${arrayTurnos[i].fecha.toLocaleString()}`, callback_data: JSON.stringify({})}]);
        }
      
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
                let sqlCodisAccio = "select top 3 Param1 as idTienda, DAY(CONVERT(datetime, Param3, 105)) as dia, MONTH(CONVERT(datetime, Param3, 105)) as mes, YEAR(CONVERT(datetime, Param3, 105)) as year from CodigosDeAccion where tipoCodigo = 'FICHAJE' order by TmStmp desc";

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
                    conexion.recHit(sesion.database, sql).then(resTurnos=>{
                        bot.sendMessage(msg.chat.id, `Estos son los ${resTurnos.recordset.length} turnos por revisar `, enviarKeyboardTurnos(resTurnos.recordset));
                    });                   
                });              
            }
        });
    }
});