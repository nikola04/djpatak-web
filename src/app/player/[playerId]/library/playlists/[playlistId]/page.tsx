"use client"
import { SmallIconButton } from "@/components/Buttons"
import { FaArrowLeft } from "react-icons/fa"
import { useRouter } from "next/navigation"
import { useUserPlaylist } from "@/utils/user"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { useEffect } from "react"

export default function PlaylistPage({ params: { playerId, playlistId }}: {
    params: {
        playerId: string,
        playlistId: string
    }
}){
    const { data, loading } = useUserPlaylist(playlistId)
    useEffect(() => { console.log(data)}, [data])
    const router = useRouter()
    if(loading) 
        return <PlaylistPageSceleton/>
    return <div className="flex flex-col w-full px-3 pr-4 py-5">
        <div className="flex items-center justify-between w-full">
            <div>
                <p className="text-white-default opacity-40 text-sm py-0.5">Playlists / { data?.name }</p>
                <div className="flex items-center">
                    <SmallIconButton title="Playlists" className="my-1 mr-1" icon={<FaArrowLeft/>} onClick={() => router.push(location.href.substring(0, location.href.lastIndexOf('/')))}/>
                    <h2 className="text-white-default text-xl font-bold">{ data?.name }</h2>
                </div>
            </div>
        </div>
        <div className="w-full py-4">
        </div>
    </div>
}

const PlaylistPageSceleton = () => <div className="flex flex-col w-full px-3 pr-4 py-5">
    <div className="flex items-center justify-between w-full">
        <div>
        <p className="text-white-default opacity-40 text-sm py-0.5">Playlists /</p>
        <div className="flex items-center my-3">
            <div className="px-2 mr-1">
                <div className="h-6 w-6 rounded bg-blue-grayish animate-pulse"></div>
            </div>
            <div className="h-6 w-64 rounded bg-blue-grayish animate-pulse"></div>
        </div>
    </div>
    </div>
    <div className="w-full">
    </div>
</div>