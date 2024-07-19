'use client'
import { QueueTrack } from "@/types/soundcloud";
import apiRequest, { ResponseDataType } from "@/utils/apiRequest";
import { useCurrentTrack } from "@/utils/tracks";
import { socketEventHandler, useSockets } from "@/utils/sockets";
import { CSSProperties, useEffect } from "react";
import { IconType } from "react-icons";
import { IoIosSkipBackward } from "react-icons/io";
import { IoIosSkipForward } from "react-icons/io";
import { IoIosPause } from "react-icons/io";
import { IoIosShuffle } from "react-icons/io";
import { IoIosRepeat } from "react-icons/io";

const playPrev = async (guildId: string, setData: (arg: QueueTrack|null) => void) => {
    const { status, data } = await apiRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/player/${guildId}/tracks/prev`, {
        method: 'POST'
    }, ResponseDataType.JSON)
    if(data.player.queueTrack)
        return setData(data.player.queueTrack)
    // handle error
}
const playNext = async (guildId: string, setData: (arg: QueueTrack|null) => void) => {
    const { status, data } = await apiRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/player/${guildId}/tracks/next`, {
        method: 'POST'
    }, ResponseDataType.JSON)
    if(data.player.queueTrack)
        return setData(data.player.queueTrac)
    // handle error
}

export default function PlayerControlls({ className, guildId }: {
    className: string,
    guildId: string
}){
    const { loading, data, setData } = useCurrentTrack(guildId)
    const { socket, ready } = useSockets()
    useEffect(() => {
        if(!ready) return
        const handler = new socketEventHandler(socket, guildId)
        handler.subscribe('now-playing', (track) => setData(track))
        return () => handler.destroy()
    }, [ready, socket, guildId])
    if(data) 
        return <div className={`${className} flex bg-black-default z-10 shadow-md items-center px-4`}  style={{ height: "80px" }}>
            <div className="flex items-center gap-7">
                <TrackUser loading={loading} data={data}/>
                <div className="flex items-center gap-2">
                    <PlayerButton icon={IoIosSkipBackward} onClick={() => playPrev(guildId, setData)} style={{ fontSize: '22px' }}/>
                    <PlayerButton icon={IoIosPause} onClick={() => null} style={{ fontSize: '28px' }}/>
                    <PlayerButton icon={IoIosSkipForward} onClick={() => playNext(guildId, setData)} style={{ fontSize: '22px' }}/>
                    <PlayerButton icon={IoIosRepeat} onClick={() => null} style={{ fontSize: '28px' }}/>
                </div>
            </div>
        </div>
    return null
}

function TrackUser({ loading, data }: {
    loading: boolean,
    data: QueueTrack|null
}){
    if(loading) return <TrackSceleton/>
    if(data) return <div className="grid gap-3 w-64 overflow-hidden" style={{ gridTemplateColumns: "auto 1fr"}}>
        <div className="w-12 h-12 rounded overflow-hidden">
            { data.track.thumbnail ? <img alt="Track Thumbnail" src={data.track.thumbnail} width={48} height={48}/>
            : <div className="w-full h-full bg-black-light"></div> }
        </div>
        <div className="text-white-gray w-48 flex flex-col justify-around">
            <a href={data.track.permalink} title={data.track.title} target="_blank" className="font-bold text-ellipsis text-nowrap overflow-hidden hover:underline leading-3 text-base">{data.track.title}</a>
            <a href={data.track.user.permalink} title={data.track.user.username} target="_blank" className="text-ellipsis text-nowrap overflow-hidden hover:underline leading-3 text-sm">{data.track.user.username}</a>
        </div>
    </div>
    return null
}

function TrackSceleton(){
    return <div className="grid gap-3 w-64 overflow-hidden" style={{ gridTemplateColumns: "auto 1fr"}}>
        <div className="w-12 h-12 bg-black-light rounded overflow-hidden animate-pulse"></div>
        <div className="text-white-gray w-48 flex flex-col justify-evenly">
            <div className="w-full h-3 bg-black-light mb-1 rounded-sm animate-pulse"></div>
            <div className="w-full h-2.5 bg-black-light my-0.5 rounded-sm animate-pulse"></div>
        </div>
    </div>
}

function PlayerButton({ icon, onClick, style }: {
    icon: IconType,
    onClick: () => void,
    style: CSSProperties
}){
    const Icon = icon
    return <button onClick={() => onClick()} className="hover:bg-white-hover active:bg-white-active w-11 h-11 flex items-center justify-center rounded-full transition-all duration-150">
        <Icon className={"text-white-gray"} style={style} />
    </button>
}