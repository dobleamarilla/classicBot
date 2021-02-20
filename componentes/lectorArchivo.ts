import {botsendMessage, bot, mainBot} from '../bot';
import {downloadImage, getExtension} from './axios';
import {subirArchivo, analizarArchivo} from './opcionesArchivo'
import * as fs from "fs";
const textractScan = require("./textract");

bot.on('message', function(msg) {
    if(msg.photo != undefined || msg.document != undefined)
    {
        var idArchivo = null;
        if(msg.document != undefined)
        {
            idArchivo = msg.document.file_id;
        }
        else
        {
            if(msg.photo != undefined)
            {
                idArchivo = msg.photo[msg.photo.length-1].file_id;
            }
        }
        mainBot(msg, false).then(sesion=>{
            if(!sesion.error)
            {
                bot.getFile(idArchivo).then(res=>{
                    var timestamp = Date.now();
                    var nombreArchivo = `${sesion.idTrabajador}_${timestamp}.${getExtension(res.file_path)}`;
                    var nombreBucket = 'telegram-eze'
                    console.log("Nombre del archivo: ", nombreArchivo);
                    subirArchivo(`https://api.telegram.org/file/bot${bot.token}/${res.file_path}`, nombreBucket, nombreArchivo, function(err, res) {
                        if(err)
                        {
                            throw err;
                        }
                        
                        analizarArchivo(nombreArchivo, nombreBucket).then(solucion=>{
                            bot.sendMessage(msg.chat.id, solucion.toString().substr(0, 4096));
                        });
                    });
                });
            }
        });
    }
});