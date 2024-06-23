import "dotenv/config"
import BotWhatsapp from '@bot-whatsapp/bot'
import database from './database';
import provider from './provider';
import flow from './flow';
import { initServer } from "./services/http";

/**
 * Funcion principal del bot
 */
const main = async () => {


    const botFLow = BotWhatsapp.addKeyword('@5ñ4ñ🧨2%3&ñ5♠!').addAnswer('Un gusto tenerte de nuevo ¿Como puedo ayudarte el día de hoy 😀?') as any

    console.log(botFLow.toJson())
    console.log({ botFLow })

    const botInstance = await BotWhatsapp.createBot({
        database,
        provider,
        flow
    })

    initServer(botInstance)
}


main()