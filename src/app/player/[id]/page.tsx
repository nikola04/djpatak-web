'use client'

import { QueueTrack, Track } from "@/types/soundcloud";
import { formatDuration, useCurrentTrack, usePlayerQueue } from "@/utils/tracks";
import { socketEventHandler, useSockets } from "@/utils/sockets";
import { useEffect } from "react";
import { FaPlay } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import apiRequest from "@/utils/apiRequest";
import { GiSoundWaves } from "react-icons/gi";

export default function Home({ params: { id }}: {
    params: {
        id: string
    }
}) {
    const { data: track, setData: setTrack, loading: trackLoading } = useCurrentTrack(id)
    const { data: queue, setData: setQueue, loading: queueLoading } = usePlayerQueue(id)
    const { socket, ready } = useSockets()
    useEffect(() => {
        if(!ready) return
        const handler = new socketEventHandler(socket, id)
        handler.subscribe('now-playing', (track) => setTrack(track))
        return () => handler.destroy()
    }, [ready, socket, id])

    const playTrack = (track: QueueTrack) => {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_URL!}/api/v1/player/${id}/tracks/queue/${encodeURIComponent(track.queueId)}`)
        apiRequest(url.href, {
            method: "POST",
        })
    }
    return <div className="flex px-3 py-6 gap-10">
        <TrackHeader loading={trackLoading} track={track?.track}/>
        <div className="flex flex-col p-2">
            <PlayerQueue queue={queue} onPlay={playTrack} currentTrack={track} loading={queueLoading} />
        </div>
  </div>;
}

function PlayerQueue({ queue, onPlay, loading, currentTrack }: {
    queue: QueueTrack[],
    onPlay: (track: QueueTrack) => any,
    loading: boolean,
    currentTrack: QueueTrack|null
}){
    if(loading) 
        return [...new Array(10)].map((val, ind) => <PlayerQueueTrackSceleton key={ind} /> )
    return queue.map((track, ind) => <PlayerQueueTrack track={track} key={ind} onPlay={() => onPlay(track)} current={track.queueId == currentTrack?.queueId}/>)
}
function PlayerQueueTrackSceleton(){
    return <div className="flex w-full p-2 my-0.5">
        <div className="relative rounded overflow-hidden bg-black-light animate-pulse" style={{ width: "48px", height: "48px" }}></div>
        <div className="flex flex-col pl-2.5 justify-around" style={{ height: "48px" }}>
            <div className="h-4 w-96 bg-black-light animate-pulse"></div>
            <div className="flex text-sm text-white-gray gap-2">
                <div className="h-3 w-28 bg-black-light animate-pulse"></div>
                <div className="h-3 w-10 bg-black-light animate-pulse"></div>
            </div>
        </div>
    </div>
}

function PlayerQueueTrack({ track, onPlay, current }: {
    track: QueueTrack,
    onPlay: () => any,
    current: boolean
}){
    return <div className="group flex justify-between w-full p-2 my-0.5 rounded-lg transition-all hover:bg-white-hover hover:shadow-lg">
        <div className="flex">
            <div onClick={() => !current && onPlay()} className="relative rounded overflow-hidden bg-black-light cursor-pointer select-none" style={{ width: "48px", height: "48px" }}>
                { track.track.thumbnail && <img width={48} height={48} src={track.track.thumbnail} className="rounded group-hover:opacity-65 transition-all duration-200" alt="Track Thumbnail" /> }
                <div className={`absolute z-10 top-0 left-0 w-full h-full flex items-center justify-center transition-all duration-200 ${!current && "opacity-0 group-hover:opacity-90"}`}>
                    <div className="flex bg-black-default rounded-full w-11/12 aspect-square items-center justify-center">
                        { !current ? 
                            <FaPlay className="text-white-default text-lg"/>
                        :
                            <GiSoundWaves className="text-white-default text-lg"/>
                        }
                    </div>
                </div>
            </div>
            <div className="flex flex-col pl-2.5 justify-around">
                <p title={track.track.title} className="text-white-gray text-base font-bold text-nowrap text-ellipsis overflow-hidden max-w-md w-full">{ track.track.title }</p>
                <div className="flex text-sm items-center text-white-gray gap-1">
                    <a title={`SoundCloud: ${track.track.user.username}`} href={track.track.user.permalink} target="_blank" className="hover:underline">{ track.track.user.username }</a>
                    <DotSeparator/>
                    <p className="">{ formatDuration(Math.ceil(track.track.duration / 1000)) }</p>
                </div>
            </div>
        </div>
    </div>
}

const DotSeparator = () => <GoDotFill className="text-white-gray" style={{ fontSize: "8px"}}/>

function TrackHeader({ track, loading }: {
    track?: Track,
    loading: boolean
}){
    if(loading) return <TrackHeaderSceleton/>
    if(!track) return null
    track.thumbnail = track.thumbnail.replace('-large', '-t500x500')
    return <div className="p-2 w-80">
        <div className="w-full overflow-hidden rounded hover:scale-102 hover:shadow-lg transition-all duration-200">
            <img src={track.thumbnail} alt="Track Banner" className="min-w-full aspect-square"/>
        </div>
        <div className="px-1 py-4">
            <p title={track.title} className="text-white-default font-bold text-center text-nowrap text-ellipsis overflow-hidden text-lg">{track.title}</p>
            <p className="text-white-gray text-center text-sm py-1">{formatDuration(Math.floor(track.duration/1000))}</p>
        </div>
    </div>
}

function TrackHeaderSceleton(){
    return <div className="p-2 w-80">
    <div className="w-full overflow-hidden aspect-square bg-black-light animate-pulse"></div>
    <div className="px-1 py-5 flex flex-col items-center justify-center">
        <div className="bg-black-light animate-pulse w-64 h-4"></div>
        <div className="bg-black-light animate-pulse w-12 h-3 my-3.5"></div>
    </div>
</div>
}