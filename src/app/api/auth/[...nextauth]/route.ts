import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

const providers = [
    DiscordProvider({
        clientId: process.env.DISCORD_CLIENT_ID!,
        clientSecret: process.env.DISCORD_CLIENT_SECRET!
    })
]

const handler = NextAuth({
    providers,
    pages: {
        signIn: undefined
    },
    secret: process.env.JWT_SECRET!
});

export { handler as GET, handler as POST }