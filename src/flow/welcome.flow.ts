import BotWhatsapp from '@bot-whatsapp/bot';
import { ChatCompletionMessageParam } from 'openai/resources';
import { run, runDetermine } from 'src/services/openai';

/**
 * Un flujo conversacion que es por defecto cunado no se contgiene palabras claves en otros flujos
 */
export default BotWhatsapp.addKeyword(BotWhatsapp.EVENTS.WELCOME)
    .addAction(async (ctx, {state, gotoFlow}) => {
        try{
            const history = (state.getMyState()?.history ?? []) as ChatCompletionMessageParam[]
            const ai = await runDetermine(history)

            if(ai.toLowerCase().includes('unknown')){
                return 
            }
            /**..... */

        }catch(err){
            console.log(`[ERROR]:`,err)
            return
        }
    })
    .addAction(async (ctx, { flowDynamic, state }) => {
        try{
            const newHistory = (state.getMyState()?.history ?? []) as ChatCompletionMessageParam[]
            const name = ctx?.pushName ?? ''
    
            console.log(`[HISTORY]:`,newHistory)
    
            newHistory.push({
                role: 'user',
                content: ctx.body
            })
    
            const largeResponse = await run(name, newHistory)

            const chunks = largeResponse.split(/(?<!\d)\.\s+/g);
            for (const chunk of chunks) {
                await flowDynamic(chunk)
            }

            newHistory.push({
                role: 'assistant',
                content: largeResponse
            })
        
            await state.update({history: newHistory})
    
        }catch(err){
            console.log(`[ERROR]:`,err)
        }
    })


