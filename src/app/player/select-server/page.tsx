'use client'

import { GuildIcon } from "@/components/discord/GuildIcon";
import { DiscordGuild } from "../../../../types/discord";
import { useUserGuilds } from "@/utils/user";
import { useRouter } from "next/navigation";

export default function Home() {
    const { loading, data } = useUserGuilds()
    console.log(data)
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
    return <div className="grid p-4 gap-8 w-full justify-center" style={{ gridTemplateColumns: "repeat(auto-fit, 18rem)"}}>
        { guilds.map((guild, ind) => <Guild key={ind} data={guild}/>) }
    </div>
}

function Guild({ data }: {
    data: DiscordGuild
}){
    const isUserAdmin = data.permissions.toString(2)[3]
    const router = useRouter()
    return <div className="flex flex-col p-4 bg-blue-grayish rounded-lg w-72 shadow">
        <div className="flex items-center">
            <GuildIcon guild={data} size={64} className="rounded-md flex-grow-0 flex-shrink-0" classNameNoImageText="!text-base" classNameNoImage="border-blue-light border-1" style={{ flexBasis: "64px" }}/>
            <div className="flex flex-col pl-4 overflow-hidden">
                <p className="font-bold text-white-default overflow-hidden text-ellipsis text-nowrap pr-2">{ data.name }</p>
                <p className="text-white-default opacity-50">{ isUserAdmin ? 'Administrator' : 'Member' }</p>
            </div>
        </div>
        <div className="flex pt-4 justify-end items-center w-full">
            <button className="flex items-center gap-1 bg-blue-light text-white-default px-2 py-1 rounded" onClick={() => router.push(`/player/${data.id}`)}>
                <span className="px-4 py-0.5">Go</span>
            </button>
        </div>
    </div>
}

function UserGuildsSceleton(){
    return <div className="grid py-4 gap-8 px-4 w-full justify-center" style={{ gridTemplateColumns: "repeat(auto-fit, 18rem)"}}>
        {[...Array(7)].map((_, ind) => <div key={ind} className="bg-black-light rounded-md w-72 h-40 shadow animate-pulse"></div>) }
    </div>
}
