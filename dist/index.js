import"dotenv/config";import e from"@bot-whatsapp/bot";import t from"@bot-whatsapp/database/mock";import o from"@bot-whatsapp/provider/baileys";import a from"groq-sdk";import s from"mysql2/promise";import n from"express";import{createReadStream as r}from"fs";import{join as c}from"path";var p=new t,i=e.createProvider(o),d=e.addKeyword(["@5ñ4ñ🧨2%3&ñ5♠","Ñ5&6$#8💣?♦9○5Ñ"]).addAnswer("Un gusto tenerte de nuevo ¿Como puedo ayudarte el día de hoy 😀?");const m=async()=>await s.createConnection({host:process.env.MYSQLHOST,user:process.env.MYSQLUSER,database:process.env.MYSQL_DATABASE,password:process.env.MYSQLPASSWORD,port:parseInt(process.env.MYSQLPORT,10),connectTimeout:1e4}),l=async e=>{const t=await m(),[o]=await t.execute("SELECT content FROM prompts WHERE prompt_type = ?",[e]);if(t.end(),o.length>0)return o[0].content;throw new Error(`Prompt type ${e} not found`)},u=async e=>{const t=await l("INFO_NEGOCIO");return(await l("ENTRENAR_BOT")).replaceAll("{customer_name}",e).replaceAll("{context}",t)},y=async()=>{const e=await m(),[t]=await e.execute("\n        SELECT prompts.prompt_type \n        FROM prompts \n        JOIN chatias ON prompts.chatias_id = chatias.id \n        WHERE chatias.estado = 'activo'\n    ");return e.end(),t.length>0},w=new a({apiKey:process.env.GROQ_API_KEY});var h=e.addKeyword(e.EVENTS.WELCOME).addAction((async(e,{state:t,gotoFlow:o})=>{try{const e=t.getMyState()?.history??[],o=await(async e=>{if(!await y())return"Lo siento, en este momento no puedo procesar tu solicitud.";const t=await u("client");return(await w.chat.completions.create({model:"mixtral-8x7b-32768",messages:[{role:"system",content:t},...e],temperature:.7,max_tokens:200,top_p:1,frequency_penalty:.5,presence_penalty:.3})).choices[0].message.content})(e);if(o.toLowerCase().includes("unknown"))return}catch(e){return void console.log("[ERROR]:",e)}})).addAction((async(e,{flowDynamic:t,state:o})=>{try{const a=o.getMyState()?.history??[],s=e?.pushName??"";console.log("[HISTORY]:",a),a.push({role:"user",content:e.body});const n=await(async(e,t)=>{if(!await y())return"Lo siento, en este momento no puedo procesar tu solicitud.";const o=await u(e);return(await w.chat.completions.create({model:"mixtral-8x7b-32768",messages:[{role:"system",content:o},...t],temperature:.7,max_tokens:200,top_p:1,frequency_penalty:.5,presence_penalty:.3})).choices[0].message.content})(s,a),r=n.split(/(?<!\d)\.\s+/g);for(const e of r)await t(e);a.push({role:"assistant",content:n}),await o.update({history:a})}catch(e){console.log("[ERROR]:",e)}})),g=e.createFlow([d,h]);const f=n(),E=process.env?.PORT??3e3;(async()=>{const t=e.addKeyword("@5ñ4ñ🧨2%3&ñ5♠!").addAnswer("Un gusto tenerte de nuevo ¿Como puedo ayudarte el día de hoy 😀?");console.log(t.toJson()),console.log({botFLow:t}),await e.createBot({database:p,provider:i,flow:g}),f.get("/callback",((e,t)=>{const o=e.query;console.log("[QUERY]:",o),o&&"fail"===o?.status?t.redirect("https://app.codigoencasa.com"):t.send("Todo Ok")})),f.get("/qr",(async(e,t)=>{const o=c(process.cwd(),"bot.qr.png"),a=r(o);t.writeHead(200,{"Content-Type":"image/png"}),a.pipe(t)})),f.listen(E,(()=>{console.log(`https://chatia.up.railway.app:${E} listo!`)}))})();