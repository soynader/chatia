const Groq = require("groq-sdk");
const { generatePrompt, checkActivePrompts } = require("./prompt");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const run = async (name, history) => {
    const activePrompts = await checkActivePrompts();
    if (!activePrompts) {
        return '';
    }

    const prompt = await generatePrompt(name);
    const response = await groq.chat.completions.create({
        model: "llama3-8b-8192",
        messages: [
            {
                role: "system",
                content: prompt
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

const runDetermine = async (history) => {
    const activePrompts = await checkActivePrompts();
    if (!activePrompts) {
        return '';
    }

    const prompt = await generatePrompt('client');
    const response = await groq.chat.completions.create({
        model: "llama3-8b-8192",
        messages: [
            {
                role: "system",
                content: prompt
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

module.exports = { run, runDetermine };
