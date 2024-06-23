import mysql from 'mysql2/promise';

const createConnection = async () => {
    return await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });
};

const fetchPrompt = async (promptType: string): Promise<string> => {
    const connection = await createConnection();
    const [rows]: any = await connection.execute('SELECT content FROM prompts WHERE prompt_type = ?', [promptType]);
    connection.end();

    if (rows.length > 0) {
        return rows[0].content;
    } else {
        throw new Error(`Prompt type ${promptType} not found`);
    }
};

const generatePrompt = async (name: string): Promise<string> => {
    const dateBase = await fetchPrompt('DATE_BASE');
    const prompt = await fetchPrompt('ENTRENAR_BOT');
    return prompt.replaceAll('{customer_name}', name).replaceAll('{context}', dateBase);
};

// Nueva función para verificar si hay prompts activos
const checkActivePrompts = async (): Promise<boolean> => {
    const connection = await createConnection();
    const [rows]: any = await connection.execute(`
        SELECT botias.prompt 
        FROM botias 
        JOIN chatias ON botias.chatias_id = chatias.id 
        WHERE chatias.estado = 'activo'
    `);
    connection.end();
    return rows.length > 0;
};

export { generatePrompt, checkActivePrompts };

