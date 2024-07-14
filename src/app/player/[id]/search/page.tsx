'use client'
import { SoundcloudTrack } from "@/types/soundcloud";
import apiRequest, { ResponseDataType } from "@/utils/apiRequest";
import { FaPlay } from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { GoDotFill } from "react-icons/go";

function formatDuration(seconds: number): string{
    const twoDigits = (num: number): string => num < 10 ? `0${num}` : `${num}`
    if(seconds < 60) return `0:${twoDigits(seconds)}`
    // Minutes
    const minutes = Math.floor(seconds / 60)
    if(minutes < 60) return `${twoDigits(minutes)}:${twoDigits(seconds % 60)}`
    // Hours
    const hours = Math.floor(minutes / 60)
    return `${hours}:${twoDigits(minutes % 60)}:${twoDigits(seconds % 60)}`
}

const tracksLimit = 12

export default function SearchPage({ params: { id }}: {
    params: {
        id: string
    }
}) {
    const searchParams = useSearchParams()
    const query = searchParams.get('query')
    const [loaded, setLoaded] = useState(false)
    const [soundcloudTracks, setSoundcloudTracks] = useState<SoundcloudTrack[]|null>(null)
    const onTrackClick = (track: SoundcloudTrack) => {
        apiRequest(`http://localhost/api/v1/player/${id}/tracks/${encodeURIComponent(track.permalink_url)}`, {
            method: "POST",
        })
    }
    useEffect(() => {
        const loadData = async () => { 
            if(query == null) return
            setLoaded(false)
            const { status, data } = await apiRequest(`http://localhost/api/v1/tracks/search/${encodeURIComponent(query)}?limit=${tracksLimit}`, { 
                cache: 'no-cache'
            }, ResponseDataType.JSON)
            setLoaded(true)
            if(data == null){
                // Handle Error
                return
            }
            setSoundcloudTracks(data.results as SoundcloudTrack[])
        }
        loadData()
    }, [query])
    return <div className="p-4">
        <div className="">
            <div className="flex items-center py-4">
                <svg xmlns="http://www.w3.org/2000/svg" width={28} height={28} fill={"white"} viewBox="0 0 75 33.51"><g id="Layer_2" data-name="Layer 2"><g id="Orange"><path d="M75,23.6a10.5,10.5,0,0,1-10.63,9.91H38.82a2.14,2.14,0,0,1-2.12-2.13V3.87a2.34,2.34,0,0,1,1.41-2.24S40.46,0,45.41,0A16.74,16.74,0,0,1,54,2.36a17,17,0,0,1,8,11.08,9.8,9.8,0,0,1,2.71-.37A10.23,10.23,0,0,1,75,23.6Z"/><path d="M33.51,5.61a.83.83,0,1,0-1.65,0c-.7,9.25-1.24,17.92,0,27.14a.83.83,0,0,0,1.65,0C34.84,23.45,34.28,14.94,33.51,5.61Z"/><path d="M28.35,8.81a.87.87,0,0,0-1.73,0,103.7,103.7,0,0,0,0,23.95.87.87,0,0,0,1.72,0A93.2,93.2,0,0,0,28.35,8.81Z"/><path d="M23.16,8a.84.84,0,0,0-1.67,0c-.79,8.44-1.19,16.32,0,24.74a.83.83,0,0,0,1.66,0C24.38,24.21,24,16.55,23.16,8Z"/><path d="M18,10.41a.86.86,0,0,0-1.72,0,87.61,87.61,0,0,0,0,22.36.85.85,0,0,0,1.69,0A81.68,81.68,0,0,0,18,10.41Z"/><path d="M12.79,16a.85.85,0,0,0-1.7,0c-1.23,5.76-.65,11,.05,16.83a.81.81,0,0,0,1.6,0C13.51,26.92,14.1,21.8,12.79,16Z"/><path d="M7.62,15.12a.88.88,0,0,0-1.75,0C4.78,21,5.14,26.18,5.9,32.05c.08.89,1.59.88,1.69,0C8.43,26.09,8.82,21.06,7.62,15.12Z"/><path d="M2.4,18A.88.88,0,0,0,.65,18c-1,3.95-.69,7.22.07,11.18a.82.82,0,0,0,1.63,0C3.23,25.14,3.66,21.94,2.4,18Z"/></g></g></svg>
                <h1 className="px-2 text-white-default font-bold">SoundCloud</h1>
            </div>
            <SoundCloudTracks loaded={loaded} soundcloudTracks={soundcloudTracks} onTrackClick={onTrackClick}/>
        </div>
    </div>;
}

function SoundCloudTracks({ soundcloudTracks, loaded, onTrackClick }: Readonly<{
    soundcloudTracks: SoundcloudTrack[]|null,
    loaded: boolean,
    onTrackClick: (track: SoundcloudTrack) => any
}>){
    if(!loaded) return <div>
        { [...new Array(tracksLimit)].map((val, ind) => <SoundCloudTrackSceleton key={ind} /> ) }
    </div>
    if(Array.isArray(soundcloudTracks)) return <div>
        { soundcloudTracks.map((track, ind) => <SoundCloudTrack onClick={onTrackClick} key={ind} track={track}/>) }
    </div>
}

function SoundCloudTrackSceleton(){
    return <div className="flex w-full p-2">
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

function SoundCloudTrack({ track, onClick }: Readonly<{
    track: SoundcloudTrack,
    onClick: (track: SoundcloudTrack) => any
}>){
    return <div className="group flex w-full p-2 rounded-lg transition-all hover:bg-white-hover active:bg-white-active">
        <div onClick={() => onClick(track)} className="relative rounded overflow-hidden bg-black-light cursor-pointer select-none" style={{ width: "48px", height: "48px" }}>
            { track.artwork_url && <img width={48} height={48} src={track.artwork_url} className="rounded group-hover:opacity-65 transition-all duration-200" alt="Track Thumbnail" /> }
            <div className="absolute z-10 top-0 left-0 w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-90 transition-all duration-200">
                <div className="flex bg-black-default rounded-full w-11/12 aspect-square flex items-center justify-center">
                    <FaPlay className="text-white-default text-lg"/>
                </div>
            </div>
        </div>
        <div className="flex flex-col pl-2.5 justify-around">
            <p className="text-white-gray text-base font-bold text-nowrap text-ellipsis overflow-hidden max-w-md w-full">{ track.title }</p>
            <div className="flex text-sm items-center text-white-gray gap-1">
                <a title={`SoundCloud: ${track.user.username}`} href={track.user.permalink_url} target="_blank" className="hover:underline">{ track.user.username }</a>
                <DotSeparator/>
                <p className="">{ formatDuration(Math.ceil(track.duration / 1000)) }</p>
            </div>
        </div>
    </div>
}

const DotSeparator = () => <GoDotFill className="text-white-gray" style={{ fontSize: "8px"}}/>