import {botsendMessage, bot, mainBot} from '../bot';

bot.on('message' , (msg: any)=> {
    if(msg.text === 'tester')
    {
        console.log("Entro en tester");
        bot.sendMessage(msg.chat.id, 'Envíame algún archivo, a ver...');
    }
})