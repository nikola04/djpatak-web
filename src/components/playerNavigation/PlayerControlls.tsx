'use client'
import { QueueTrack, Track } from "../../../types/soundcloud";
import { dislikeTrack, likeTrack, useCurrentTrack } from "@/utils/tracks";
import { socketEventHandler, useSockets } from "@/utils/sockets";
import { CSSProperties, forwardRef, Reference, useCallback, useEffect, useRef, useState } from "react";
import { IconType } from "react-icons";
import { IoIosPlay, IoIosSkipBackward } from "react-icons/io";
import { IoIosSkipForward } from "react-icons/io";
import { IoIosPause } from "react-icons/io";
import { PiRepeatOnce, PiRepeat } from "react-icons/pi";
import { IoVolumeLowOutline, IoVolumeMediumOutline, IoVolumeMuteOutline } from "react-icons/io5";
import { Slider } from "@nextui-org/slider";

import { next, pause, prev, repeat, resume, volume as updatePlayerVolume, volume } from "@/utils/controlls";
import { useAlert } from "@/components/providers/Alert";
import { Repeat } from "../../../types/player";
import { capitilizeWord, isParentOf } from "@/utils/frontend";
import { SmallIconButton } from "../Buttons";
import { FaHeart, FaRegHeart } from "react-icons/fa";
export default function PlayerControlls({ className, guildId }: {
    className: string,
    guildId: string
}){
    const { loading, data, setData, status, setStatus, playerPreferences, setPlayerPreferences } = useCurrentTrack(guildId)
    const { socket, ready } = useSockets()
    const { pushAlert } = useAlert()
    useEffect(() => {
        if(!ready) return
        const handler = new socketEventHandler(socket, guildId)
        handler.subscribe('now-playing', (track: QueueTrack) => {
            setData(track); setStatus('playing');
        })
        handler.subscribe('repeat', (repeat: Repeat) => setPlayerPreferences((prev) => ({ ...prev, repeat })))
        handler.subscribe('queue-end', () => {
            setData(null); setStatus('paused');
        })
        handler.subscribe('pause', () => setStatus('paused'))
        handler.subscribe('resume', () => setStatus('playing'))
        return () => handler.destroy()
    }, [ready, socket, guildId, setData, setStatus])
    // On Clicks
    const playPrev = async () => {
        try{
            const { playerStatus, queueTrack } = await prev(guildId);
            setData(queueTrack); setStatus(playerStatus);
        }catch(err){
            console.error(err)
            pushAlert(String(err))
        }
    }
    const playNext = async () => {
        try{
            const { playerStatus, queueTrack } = await next(guildId);
            setData(queueTrack); setStatus(playerStatus);
        }catch(err){
            console.error(err)
            pushAlert(String(err))
        }
    }
    const pausePress = async () => {
        try{
            if(await pause(guildId)) setStatus('paused')
        }catch(err){
            console.error(err)
            pushAlert(String(err))
        }
    }
    const resumePress = async () => {
        try{
            if(await resume(guildId)) setStatus('playing');
        }catch(err){
            console.error(err)
            pushAlert(String(err))
        }
    }
    const repeatPress = async (rep: Repeat) => {
        try{
            if(await repeat(guildId, rep)) setPlayerPreferences((prev) => ({ ...prev, repeat: rep }))
        }catch(err){
            console.error(err)
            pushAlert(String(err))
        }
    }
    const updateVolume = async (volume: number) => {
        try{
            if(await updatePlayerVolume(guildId, volume)) setPlayerPreferences((prev) => ({ ...prev, volume }))
        }catch(err){
            console.error(err)
            pushAlert(String(err))
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
    const likeTrackClick = useCallback(async () => {
        if(!data?.track) return
        if(data.track.isLiked) {
            onTrackDislike(data.track)
            return data.track.isLiked = false
        }
        onTrackLike(data.track)
        data.track.isLiked = true
    }, [data])
    
    useEffect(() => console.log(playerPreferences.repeat), [playerPreferences])
    if(!data)
        return null

    return <div className={`${className} flex bg-black-default z-10 shadow-md items-center px-6`}  style={{ height: "80px" }}>
        <div className="flex items-center gap-7 w-full">
            <TrackUser loading={loading} data={data}/>
            <div className="flex items-center gap-2">
                <PlayerButton title="Play Previous" icon={IoIosSkipBackward} onClick={playPrev} style={{ fontSize: '22px' }}/>
                { status == 'playing' ? <PlayerButton title="Pause" icon={IoIosPause} onClick={pausePress} style={{ fontSize: '28px' }}/>
                : <PlayerButton title="Resume" icon={IoIosPlay} onClick={resumePress} style={{ fontSize: '28px' }}/>}
                <PlayerButton title="Play Next" icon={IoIosSkipForward} onClick={playNext} style={{ fontSize: '22px' }}/>
                <PlayerRepeatButton onClick={repeatPress} repeat={playerPreferences?.repeat} />
            </div>
            <div className="ml-auto flex items-center">
                <SmallIconButton title="Like Song" className="w-11 h-11" icon={<FaRegHeart className="text-xl"/>} activeIcon={<FaHeart className="text-xl text-blue-light"/>} onClick={likeTrackClick} isActive={data.track.isLiked}/>
                <PlayerVolumeSlider updateVolume={updateVolume} defaultVolume={playerPreferences.volume} />
            </div>
        </div>
    </div>
}

function PlayerVolumeSlider({ updateVolume, defaultVolume }: {
    updateVolume: (volume: number) => void,
    defaultVolume: number
}){
    const [volume, setVolume] = useState<number>(defaultVolume)
    const [showSlider, setShowSlider] = useState<boolean>(false)
    const sliding = useRef(false)
    const slider = useRef(null)
    const button = useRef(null)
    function getVolumeIcon(volume: number){
        if(volume >= 0.5) return IoVolumeMediumOutline
        else if(volume > 0) return IoVolumeLowOutline
        else return IoVolumeMuteOutline
    }
    useEffect(() => {
        if(!showSlider) return
        function handleClick(e: MouseEvent){
            if(sliding.current) return
            if(!e.target) return
            if(isParentOf(button.current, e.target as HTMLElement)) return
            if(isParentOf(slider.current, e.target as HTMLElement)) return
            setShowSlider((prev) => !prev)
        }
        window.addEventListener('click', handleClick)
        return () => window.removeEventListener('click', handleClick)
    }, [showSlider])
    return <div className="relative">
        { showSlider && <div className="absolute z-60 w-10 h-36 flex items-center justify-center py-5 bg-black-light rounded-md bottom-[105%] left-[50%]" style={{ transform: 'translateX(-50%)'}}>
            <Slider
                ref={slider}
                aria-label="Volume"
                size="sm"
                color="secondary"
                step={0.01} 
                maxValue={1} 
                minValue={0} 
                orientation="vertical"
                value={volume}
                onChange={(vol) => {
                    sliding.current = true
                    setVolume(vol as number)
                }}
                onChangeEnd={() => {
                    updateVolume(volume)
                    setTimeout(() => sliding.current = false, 25)
                }}
                classNames={{
                    thumb: "bg-blue-light border-s-black-light",
                    trackWrapper: "bg-black-light",
                    filler: "bg-blue-light",
                    track: "border-b-blue-light border-y-1.5"
                }}
                renderThumb={(props) => (
                    <div
                      {...props}
                      className="group p-0.5 top-1/2 left-1/2 bg-blue-light shadow-medium rounded-full cursor-grab data-[dragging=true]:cursor-grabbing"
                    >
                      <span className="transition-transform bg-black-default rounded-full w-3 h-3 block group-data-[dragging=true]:scale-80" />
                    </div>
                  )}
            />
        </div> }
        <PlayerButton ref={button} title="volume" icon={getVolumeIcon(volume)} onClick={() => setShowSlider((prev) => !prev)} style={{ fontSize: volume === 0 ? '24px' : '26px'}} active={false}/>
    </div>
}

function PlayerRepeatButton({ repeat, onClick }: {
    repeat?: Repeat,
    onClick: (repeat: Repeat) => void
}){
    function nextRepeat(): Repeat{
        if(repeat == 'off') return 'track'
        if(repeat == 'track') return 'queue'
        if(repeat == 'queue') return 'off'
        return 'off'
    }
    function onRepeatClick(){
        return onClick(nextRepeat())
    }
    if(repeat == null) return null
    return <div className="flex items-center justify-center relative">
        <PlayerButton title={`Repeat ${capitilizeWord(String(nextRepeat()))}`} icon={repeat === 'track' ? PiRepeatOnce : PiRepeat} active={repeat != 'off'} onClick={() => onRepeatClick()} style={{ fontSize: '24px' }}/>
        { repeat === 'queue' && <div className="absolute w-1 h-1 rounded-full bg-blue-light transition-all"></div> }
    </div>
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

const PlayerButton = forwardRef<HTMLButtonElement, {
    title: string,
    icon: IconType,
    onClick: () => void,
    style: CSSProperties,
    active?: boolean
}>(({ title, icon, onClick, style, active }, ref) => {
    const Icon = icon
    return <button ref={ref} title={title} onClick={() => onClick()} className="hover:bg-white-hover active:bg-white-active w-11 h-11 flex items-center justify-center rounded-full transition-all duration-150">
        <Icon className={active ? "text-blue-light transition-all" : "text-white-gray transition-all"} style={style} />
    </button>
})
PlayerButton.displayName = 'PlayerButton';