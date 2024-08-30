'use client'

import { QueueTrack, Track } from "../../../../types/soundcloud";
import { dislikeTrack, formatDuration, likeTrack, playTrackByQueueId, removeTrackByQueueId, useCurrentTrack, usePlayerQueue } from "@/utils/tracks";
import { socketEventHandler, useSockets } from "@/utils/sockets";
import { useCallback, useEffect, useRef } from "react";
import * as audioWaveData from './lottie-audiwave.json'
import { TfiTrash } from "react-icons/tfi";
import { FaPlay } from "react-icons/fa";
import { useAlert } from "@/components/Alert";
import { resume } from "@/utils/controlls";
import { AnimationItem } from "lottie-web";
import { SmallIconButton } from "@/components/Buttons";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { DotSeparator } from "@/components/library/tracksList";

export default function Home({ params: { id }}: {
    params: {
        id: string
    }
}) {
    const { data: track, setData: setTrack, status, setStatus, loading: trackLoading } = useCurrentTrack(id)
    const { data: queue, setData: setQueue, loading: queueLoading } = usePlayerQueue(id)
    const { socket, ready } = useSockets()
    const { pushAlert } = useAlert()
    useEffect(() => {
        if(!ready) return
        const handler = new socketEventHandler(socket, id)
        handler.subscribe('now-playing', (track: QueueTrack) => {
            setTrack(track); setStatus('playing');
        })
        handler.subscribe('new-queue-song', (track: QueueTrack) => setQueue(prev => [...prev, track]))
        handler.subscribe('queue-end', () => {
            setTrack(null); setStatus('paused');
        })
        handler.subscribe('pause', () => setStatus('paused'))
        handler.subscribe('resume', () => setStatus('playing'))
        return () => handler.destroy()
    }, [ready, socket, id])
    const playTrack = async (track: QueueTrack) => {
        try{
            await playTrackByQueueId(id, track.queueId)
            setTrack(track)
        }catch(err){
            pushAlert(String(err))
            console.error(err)
        }
    }
    const resumeTrack = async () => {
        try{
            await resume(id)
            setStatus('playing')
        }catch(err){
            pushAlert(String(err))
            console.error(err)
        }
    }
    const deleteTrack = async (track: QueueTrack) => {
        try{
            await removeTrackByQueueId(id, track.queueId)
            setQueue((queue) => queue.filter((queueTrack) => queueTrack.queueId !== track.queueId))
        }catch(err){
            pushAlert(String(err))
            console.error(err)
        }
    }
    const onTrackLike = async (track: Track) => {
        try{
            await likeTrack(track.permalink, 'soundcloud')
            return
        }catch(err){
            pushAlert(String(err))
            console.error(err)
        }
    }
    const onTrackDislike = async (track: Track) => {
        try{
            await dislikeTrack(track.permalink, 'soundcloud')
            return
        }catch(err){
            pushAlert(String(err))
            console.error(err)
        }
    }
    return <div className="flex w-full flex-col items-center lg:items-start lg:flex-row px-3 py-5 gap-5 xl:gap-10" style={{ gridTemplateColumns: 'auto 1fr' }}>
        <TrackHeader loading={trackLoading} track={track?.track} onTrackLike={onTrackLike} onTrackDislike={onTrackDislike}/>
        <div className="w-full lg:w-auto flex-col p-2 flex-grow">
            { !queueLoading && queue.length == 0 ? <div>
                <p className="text-white-default">No tracks. You should start searching.</p>
            </div>
            : <PlayerQueue status={status} queue={queue} onResume={resumeTrack} onPlay={playTrack} onDelete={deleteTrack} currentTrack={track} loading={queueLoading} /> }
        </div>
  </div>;
}

function PlayerQueue({ queue, status, onPlay, onResume, onDelete, loading, currentTrack }: {
    queue: QueueTrack[],
    status: 'playing'|'paused'
    onPlay: (track: QueueTrack) => void,
    onResume: () => void,
    onDelete: (track: QueueTrack) => void,
    loading: boolean,
    currentTrack: QueueTrack|null
}){
    if(loading) 
        return [...new Array(10)].map((val, ind) => <PlayerQueueTrackSceleton key={ind} /> )
    return queue.map((track, ind) => <PlayerQueueTrack isPaused={status === 'paused'} track={track} key={ind} onResume={() => onResume()} onPlay={() => onPlay(track)} onDelete={() => onDelete(track)} current={track.queueId == currentTrack?.queueId}/>)
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

function PlayerQueueTrack({ track, isPaused, onPlay, onResume, onDelete, current }: {
    track: QueueTrack,
    isPaused: boolean,
    onPlay: () => void,
    onDelete: () => void,
    onResume: () => void,
    current: boolean
}){
    const soundwaveBox = useRef(null)
    const lottie = useRef<AnimationItem|null>(null);
    useEffect(() => {
        let stop = false
        async function getLottie() {
            const importedLottie = await import("lottie-web");
            if(stop) return;
            lottie.current = importedLottie.default.loadAnimation({
                autoplay: true,
                loop: true,
                animationData: audioWaveData,
                container: soundwaveBox.current!
            })
            lottie.current.setSpeed(0.85)
        }
        getLottie()
        return () => {
            if(lottie.current)
                lottie.current.destroy();
            else stop = true
        }
    }, [])
    return <div className={`group flex justify-between w-full p-2 my-0.5 rounded-lg transition-all ${ !current ? 'hover:bg-blue-grayish hover:shadow-lg' : 'bg-blue-light bg-opacity-15' }`}>
        <div className="flex w-full">
            <div onClick={() => isPaused && current ? onResume() : onPlay()} className="relative rounded overflow-hidden bg-black-light select-none cursor-pointer flex-shrink-0" style={{ width: "48px", height: "48px", flexBasis: "48px" }}>
                { track.track.thumbnail && <img width={48} height={48} src={track.track.thumbnail} className={`rounded transition-all duration-200" alt="Track Thumbnail ${ !current ? 'group-hover:opacity-65' : 'opacity-65' }`} /> }
                <div className={`absolute z-10 top-0 left-0 w-full h-full flex items-center justify-center transition-all duration-200 ${!current && "opacity-0 group-hover:opacity-90"}`}>
                    <div className="flex bg-blue-light rounded-full w-10/12 aspect-square items-center justify-center">
                        { (!current || isPaused) && <FaPlay className="text-white-default text-lg ml-1"/> }
                        <div className={`p-0.5 pl-1 hidden ${current && !isPaused && '!block'}`} ref={soundwaveBox}></div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col pl-2.5 justify-around w-[280] flex-grow flex-shrink" style={{ flexBasis: "280px" }}>
                <p title={track.track.title} className="text-white-gray text-base font-bold text-nowrap whitespace-nowrap text-ellipsis overflow-hidden">{ track.track.title }</p>
                <div className="flex text-sm items-center text-white-gray gap-1">
                    <a title={`SoundCloud: ${track.track.user.username}`} href={track.track.user.permalink} target="_blank" className="hover:underline">{ track.track.user.username }</a>
                    <DotSeparator/>
                    <p className="">{ formatDuration(Math.ceil(track.track.duration / 1000)) }</p>
                </div>
            </div>
            <div className="flex items-center justify-center">
                <button title={"Remove Song"} onClick={() => onDelete()} className="hover:bg-white-hover active:bg-white-active w-10 h-10 flex items-center justify-center rounded-full transition-all duration-150">
                    <TfiTrash className="text-white-gray text-lg"/>
                </button>
            </div>
        </div>
    </div>
}

function TrackHeader({ track, onTrackLike, onTrackDislike, loading }: {
    track?: Track,
    onTrackLike: (track: Track) => any
    onTrackDislike: (track: Track) => any
    loading: boolean
}){
    const likeTrackClick = useCallback(async () => {
        if(!track) return
        if(track.isLiked) {
            onTrackDislike(track)
            return track.isLiked = false
        }
        onTrackLike(track)
        track.isLiked = true
    }, [track])
    if(loading) return <TrackHeaderSceleton/>
    if(!track) return null
    if(track.thumbnail) track.thumbnail = track.thumbnail.replace('-large', '-t500x500')
    return <div className="relative p-2 w-full lg:max-w-64 xl:max-w-80 max-w-80">
        <div className="relative w-full overflow-hidden rounded hover:shadow-lg transition-all duration-200 bg-black-light">
            { track.thumbnail ? <img src={track.thumbnail} alt="Track Banner" className="min-w-full aspect-square"/> 
            : <div className="min-w-full aspect-square"></div> }
            <div className="absolute bottom-0 w-full px-2 py-1 flex items-center justify-end">
                <SmallIconButton title="Like Song" iconClass="text-2xl" icon={FaRegHeart} activeIcon={FaHeart} onClick={() => likeTrackClick()} isActive={track.isLiked}/>
            </div>
        </div>
        <div className="px-1 py-4">
            <p title={track.title} className="text-white-default font-bold text-center text-nowrap text-ellipsis overflow-hidden text-lg">{track.title}</p>
            <p className="text-white-gray text-center text-sm py-1">{ track.user.username }</p>
        </div>
    </div>
}

function TrackHeaderSceleton(){
    return <div className="p-2 w-80">
    <div className="w-full overflow-hidden aspect-square bg-black-light animate-pulse"></div>
    <div className="px-1 py-5 flex flex-col items-center justify-center">
        <div className="bg-black-light animate-pulse w-64 h-4"></div>
        <div className="bg-black-light animate-pulse w-32 h-3 my-3.5"></div>
    </div>
</div>
}