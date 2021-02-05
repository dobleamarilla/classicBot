import {botsendMessage, bot, mainBot} from '../bot';
import {downloadImage, getExtension} from './axios';
import * as fs from "fs";
const textractScan = require("./textract");

bot.on('photo', function(msg) {
    mainBot(msg, false).then(sesion=>{
        if(!sesion.error)
        {
            bot.getFile(msg.photo[msg.photo.length-1].file_id).then(res=>{
                var timestamp = Date.now();
                downloadImage(`https://api.telegram.org/file/bot${bot.token}/${res.file_path}`, sesion.idTrabajador, res.file_path, timestamp).then(()=>{
                    var path = `${__dirname}\\upload\\${sesion.idTrabajador}_${timestamp}.${getExtension(res.file_path)}`;
                    console.log(path);

                    var data = fs.readFileSync(path);
                    textractScan(data).then(res=>{
                        console.log(res);
                    });
                });
            });
        }
    });
});