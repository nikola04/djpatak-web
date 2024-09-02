import { GoDotFill } from "react-icons/go";
import { DbTrack } from "../../../types/tracks";
import { formatDuration, playSoundcloudTrack, useCurrentTrack } from "@/utils/tracks";
import { useCallback, useEffect, useRef } from "react";
import { AnimationItem } from "lottie-web";
import * as audioWaveData from '@/app/player/[playerId]/lottie-audiwave.json'
import { QueueTrack } from "../../../types/soundcloud";
import { FaPlay } from "react-icons/fa";
import { useAlert } from "@/components/providers/Alert";
import { socketEventHandler, useSockets } from "@/utils/sockets";

export function TracksList({ guildId, tracks, loading, Buttons }: {
    guildId: string
    tracks: DbTrack[],
    Buttons: ({ track } : { track : DbTrack }) => JSX.Element,
    loading: boolean
}){
    const { data: currentTrack, setData: setCurrentTrack, status, setStatus, loading: trackLoading } = useCurrentTrack(guildId)
    const { socket, ready } = useSockets()
    const { pushAlert } = useAlert()
    useEffect(() => {
        if(!ready) return
        const handler = new socketEventHandler(socket, guildId)
        handler.subscribe('now-playing', (track: QueueTrack) => {
            setCurrentTrack(track); setStatus('playing');
        })
        handler.subscribe('queue-end', () => {
            setCurrentTrack(null); setStatus('paused');
        })
        handler.subscribe('pause', () => setStatus('paused'))
        handler.subscribe('resume', () => setStatus('playing'))
        return () => handler.destroy()
    }, [ready, socket, guildId])
    const onPlayTrack = useCallback(async (track: DbTrack) => {
        try {
            await playSoundcloudTrack(guildId, track.providerTrackId)
        } catch (error) {
            pushAlert(String(error))
        }
    }, [guildId])
    if(loading) 
        return [...new Array(10)].map((_, ind) => <TrackSceleton key={ind} /> )
    return tracks.map((track, ind) => <Track onPlay={onPlayTrack} key={ind} track={track} isPlayingNow={currentTrack?.track.permalink === track.providerTrackId} isPaused={status === 'paused'} buttons={<Buttons track={track}/>} />)
}

function Track({ track, isPlayingNow, isPaused, onPlay, buttons }: {
    track: DbTrack,
    isPlayingNow: boolean,
    isPaused: boolean,
    onPlay: (track: DbTrack) => any
    buttons: JSX.Element
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
    return <div className={`group flex justify-between w-full p-2 my-0.5 rounded-lg transition-all ${ !isPlayingNow ? 'hover:bg-blue-grayish hover:shadow-lg' : 'bg-blue-light bg-opacity-15' }`}>
        <div className="flex w-full">
            <div onClick={() => !isPlayingNow && onPlay(track)} className="relative rounded overflow-hidden bg-black-light select-none cursor-pointer flex-shrink-0" style={{ width: "48px", height: "48px", flexBasis: "48px" }}>
                { track.trackData.thumbnail && <img width={48} height={48} src={track.trackData.thumbnail} className={`rounded transition-all duration-200" alt="Track Thumbnail ${ !isPlayingNow ? 'group-hover:opacity-65' : 'opacity-65' }`} /> }
                <div className={`absolute z-10 top-0 left-0 w-full h-full flex items-center justify-center transition-all duration-200 ${!isPlayingNow && "opacity-0 group-hover:opacity-90"}`}>
                    <div className="flex bg-blue-light rounded-full w-10/12 aspect-square items-center justify-center">
                        { (!isPlayingNow || isPaused) && <FaPlay className="text-white-default text-lg ml-1"/> }
                        <div className={`p-0.5 pl-1 hidden ${isPlayingNow && !isPaused && '!block'}`} ref={soundwaveBox}></div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col pl-2.5 justify-around w-[280] flex-grow flex-shrink" style={{ flexBasis: "280px" }}>
                <p title={track.trackData.title} className="text-white-gray text-base font-bold text-nowrap whitespace-nowrap text-ellipsis overflow-hidden">{ track.trackData.title }</p>
                <div className="flex text-sm items-center text-white-gray gap-1">
                    <a title={track.trackData.author}>{ track.trackData.author }</a>
                    <DotSeparator/>
                    <p>{ formatDuration(track.trackData.duration) }</p>
                </div>
            </div>
            <div className="flex items-center justify-center">
                { buttons }
            </div>
        </div>
    </div>
}

function TrackSceleton(){
    return <div className="flex w-full p-2 my-0.5">
        <div className="relative rounded overflow-hidden bg-blue-grayish animate-pulse" style={{ width: "48px", height: "48px" }}></div>
        <div className="flex flex-col pl-2.5 justify-around" style={{ height: "48px" }}>
            <div className="h-4 w-96 bg-blue-grayish animate-pulse"></div>
            <div className="flex text-sm text-white-gray gap-2">
                <div className="h-3 w-28 bg-blue-grayish animate-pulse"></div>
                <div className="h-3 w-10 bg-blue-grayish animate-pulse"></div>
            </div>
        </div>
    </div>
}

export const DotSeparator = () => <GoDotFill className="text-white-gray" style={{ fontSize: "8px"}}/>