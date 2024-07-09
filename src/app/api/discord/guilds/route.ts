import { DiscordGuild } from "@/types/discord";
import { authOptions } from "@/utils/authOptions"
import DiscordAPI, { DiscordResponse, UserType } from "@/utils/discordAPI";
import { fetchUserAccount } from "@/utils/fetchUserAccount";
import { getServerSession } from "next-auth";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if(!session?.user) return new Response("Not signed in.", { status: 401 })
    const data = await fetchUserAccount(session.user.id, 'discord')
    if(data == null) return new Response("Invalid account", { status: 500 })
    const [userResponse, botResponse] = await Promise.all([
        new Promise(async (res) => res(await DiscordAPI(`/users/@me/guilds`, UserType.User, data.access_token!))),
        new Promise(async (res) => res(await DiscordAPI(`/users/@me/guilds`, UserType.Bot, process.env.DISCORD_CLIENT_TOKEN!)))
    ]) as [DiscordResponse, DiscordResponse]
    if(!userResponse.data) {
        if(userResponse.retry_after){
            return Response.json({
                retry_after: userResponse.retry_after * 1000
            }, { status: 429 })
        }
        return new Response("Bad User guilds response", {
            status: userResponse.status
        })
    }
    if(!botResponse.data){
        if(botResponse.retry_after){
            return Response.json({
                retry_after: botResponse.retry_after * 1000
            }, { status: 429 })
        }
        return new Response("Bad Bot guilds response", { status: botResponse.status })
    }

    const userGuilds = userResponse.data as DiscordGuild[]
    const botGuilds = botResponse.data as DiscordGuild[]
    if(!Array.isArray(userGuilds) || !Array.isArray(botGuilds)) return Response.json([]);
    const userGuildsWithBot = userGuilds.filter((userGuild: any) => botGuilds.some((botGuild) => botGuild.id == userGuild.id))
    return Response.json(userGuildsWithBot, { status: 200 })
}