import getClient from "@/lib/discord";
import { entersState, getVoiceConnection, joinVoiceChannel, VoiceConnectionStatus } from "@discordjs/voice";
import { ChannelType } from "discord.js";
import { createDiscordJSAdapter } from '@/utils/discordVoiceAdapter'

export async function forceGetVoiceConnection(guildId: string, channelId: string){
    const client = await getClient()
    let connection = getVoiceConnection(guildId)
    if(connection) {
        if(connection.state.status == VoiceConnectionStatus.Ready)
            return connection
    }
    const guild = await client.guilds.fetch(guildId);
    const channel = await guild.channels.fetch(channelId);

    if (!channel || channel.type != ChannelType.GuildVoice) {
        console.log('Invalid voice channel ID')
        return null
    }
    connection = joinVoiceChannel({
        guildId,
        channelId,
        adapterCreator: createDiscordJSAdapter(channel)
    })
    try {
		await entersState(connection, VoiceConnectionStatus.Ready, 15_000);
	} catch (error) {
		connection.destroy();
        return null
	}
    connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
        try {
            await Promise.race([
                entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
            ]);
            // Seems to be reconnecting to a new channel - ignore disconnect
        } catch (error) {
            connection.destroy();
        }
    });
    return connection
}