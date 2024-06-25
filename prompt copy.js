const mysql = require('mysql2/promise');

const createConnection = async () => {
    return await mysql.createConnection({
        host: process.env.MYSQLHOST,
        user: process.env.MYSQLUSER,
        database: process.env.MYSQL_DATABASE,
        password: process.env.MYSQLPASSWORD,
        port: parseInt(process.env.MYSQLPORT, 10),
        connectTimeout: 10000,
    });
};

const fetchPrompt = async (promptType) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('SELECT content FROM prompts WHERE prompt_type = ?', [promptType]);
    connection.end();

    if (rows.length > 0) {
        return rows[0].content;
    } else {
        throw new Error(`Prompt type ${promptType} not found`);
    }
};

const generatePrompt = async (name) => {
    const dateBase = await fetchPrompt('INFO_NEGOCIO');
    const prompt = await fetchPrompt('ENTRENAR_BOT');
    return prompt.replaceAll('{customer_name}', name).replaceAll('{context}', dateBase);
};

const checkActivePrompts = async () => {
    const connection = await createConnection();
    const [rows] = await connection.execute(`
        SELECT prompts.prompt_type 
        FROM prompts 
        JOIN chatias ON prompts.chatias_id = chatias.id 
        WHERE chatias.estado = 'activo'
    `);
    connection.end();
    return rows.length > 0;
};

module.exports = { generatePrompt, checkActivePrompts };
