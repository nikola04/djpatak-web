'use client'

import { GuildIcon } from "@/components/discord/GuildIcon";
import { DiscordGuild } from "../../../../types/discord";
import { useUserGuilds } from "@/utils/user";
import { useRouter } from "next/navigation";

export default function Home() {
    const { loading, data } = useUserGuilds()
    return <div className="flex flex-col items-center py-6">
        <h1 className="text-white-default font-bold text-2xl py-2">Select Server</h1>
        <UserGuilds loading={loading} guilds={data} />
    </div>;
}

function UserGuilds({ loading, guilds }: {
    loading: boolean,
    guilds: DiscordGuild[]
}){
    if(loading) return UserGuildsSceleton()
    if(!guilds) return null
    return <div className="flex flex-wrap py-4 gap-8">
        { guilds.map((guild, ind) => <Guild key={ind} data={guild}/>) }
    </div>
}

function Guild({ data }: {
    data: DiscordGuild
}){
    const isUserAdmin = data.permissions.toString(2)[3]
    const router = useRouter()
    return <div className="flex flex-col p-4 bg-black-light rounded-md w-72 h-40 shadow">
        <div className="flex">
            <GuildIcon guild={data} size={64} className="rounded-md" classNameNoImage="border-gray"/>
        </div>
        <div className="flex justify-between items-start w-full">
            <div className="flex flex-col py-2 overflow-hidden">
                <p className="font-bold text-white-default overflow-hidden text-ellipsis text-nowrap pr-2">{ data.name }</p>
                <p className="text-white-gray">{ isUserAdmin ? 'Administrator' : 'Member' }</p>
            </div>
            <button className="bg-blue-light text-white-default px-2 py-1 rounded" onClick={() => router.push(`/player/${data.id}`)}>Select</button>
        </div>
    </div>
}

function UserGuildsSceleton(){
    return <div className="flex flex-wrap py-4 gap-8">
        {[...Array(5)].map((_, ind) => <div key={ind} className="bg-black-light rounded-md w-72 h-40 shadow animate-pulse"></div>) }
    </div>
}
