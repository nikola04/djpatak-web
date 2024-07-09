import { Client, GatewayIntentBits } from 'discord.js';

let client: Client|null = null

export default async function(){
    if(!client){
        client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates ] });
        client.once("ready", () => console.log("> Bot is ready!"))
        await client.login(process.env.DISCORD_CLIENT_TOKEN);
    }
    return client
}