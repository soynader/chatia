require("dotenv/config");
const { createBot, createFlow, createProvider, addKeyword } = require('@bot-whatsapp/bot');
const MySQLAdapter = require('@bot-whatsapp/database/mysql');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const QRPortalWeb = require('@bot-whatsapp/portal');
const welcomeFlow = require("./welcomeFlow");

// Configuración de la conexión a la base de datos MySQL usando variables de entorno
const adapterDB = new MySQLAdapter({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    database: process.env.MYSQL_DATABASE,
    password: process.env.MYSQLPASSWORD,
    port: parseInt(process.env.MYSQLPORT, 10),
});

const main = async () => {
    // Definición del flujo principal del chatbot
    const flowPrincipal = addKeyword(['@5ñ4ñ🧨2%3&ñ5♠'])
        .addAnswer('🙌 Hola bienvenido*. ¿Como puedo ayudarte el día de hoy 😀?');

    // Creación de los adaptadores de flujo y proveedor
    const adapterFlow = createFlow([flowPrincipal, welcomeFlow]);
    const adapterProvider = createProvider(BaileysProvider);

    // Creación de la instancia del bot
    await createBot({
        database: adapterDB,
        provider: adapterProvider,
        flow: adapterFlow,
    });

    // Generación del portal web con el código QR para el bot
    QRPortalWeb();
};

main();
