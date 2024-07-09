import { AuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from "@/lib/mongodb";
import { Provider } from "next-auth/providers/index";

const scope: string = ['identify', 'guilds', 'email'].join(' ')

const providers: Provider[] = [
    DiscordProvider({
        clientId: process.env.DISCORD_CLIENT_ID!,
        clientSecret: process.env.DISCORD_CLIENT_SECRET!,
        authorization: { params: { scope }},
    })
]

export const authOptions: AuthOptions = {
    providers,
    adapter: MongoDBAdapter(clientPromise),
    secret: process.env.JWT_SECRET!,
    callbacks: {
        session: async ({ session, user, token }) => ({
            ...session,
            user: {
                ...session.user,
                id: user.id,
            }
        }),
    }
}