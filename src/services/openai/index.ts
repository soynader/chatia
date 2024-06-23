import Groq from "groq-sdk";
import { generatePrompt, checkActivePrompts } from "./prompt"; // Importar la nueva función
import mysql from 'mysql2/promise';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const run = async (name: string, history: any[]): Promise<string> => {
    // Verificar si hay prompts activos
    const activePrompts = await checkActivePrompts();
    if (!activePrompts) {
        return 'Lo siento, en este momento no puedo procesar tu solicitud.';
    }

    const prompt = await generatePrompt(name);
    const response = await groq.chat.completions.create({
        model: "mixtral-8x7b-32768",
        messages: [
            {
                "role": "system",
                "content": prompt
            },
            ...history
        ],
        temperature: 0.7,
        max_tokens: 200,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0.3,
    });
    return response.choices[0].message.content;
};

const runDetermine = async (history: any[]): Promise<string> => {
    // Verificar si hay prompts activos
    const activePrompts = await checkActivePrompts();
    if (!activePrompts) {
        return 'Lo siento, en este momento no puedo procesar tu solicitud.';
    }

    const prompt = await generatePrompt('client');  // Assuming 'client' is a generic name for determination
    const response = await groq.chat.completions.create({
        model: "mixtral-8x7b-32768",
        messages: [
            {
                "role": "system",
                "content": prompt
            },
            ...history
        ],
        temperature: 0.7,
        max_tokens: 200,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0.3,
    });
    return response.choices[0].message.content;
};

export { run, runDetermine };
