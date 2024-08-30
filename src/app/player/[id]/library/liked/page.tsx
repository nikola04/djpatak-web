'use client'
import { useAlert } from "@/components/Alert";
import { SmallIconButton } from "@/components/Buttons";
import { TracksList } from "@/components/library/tracksList";
import { dislikeTrack, likeTrack, playSoundcloudTrack, useCurrentTrack, useLikedTracks } from "@/utils/tracks";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { DbTrack } from "../../../../../../types/tracks";
import { useCallback, useState } from "react";
import { PiQueue } from "react-icons/pi";

export default function LikedPage({ params: { id }}: {
    params: {
        id: string
    }
}){
    const { data: tracks, setData: setTracks, loading: tracksloading } = useLikedTracks()
    return <div className="flex w-full flex-col px-3 py-5">
        <div className="flex w-full items-center justify-between">
            <h2 className="text-white-default text-xl font-bold">Liked Songs</h2>
        </div>
        <div className="w-full lg:w-auto flex-col p-2 flex-grow">
            { !tracksloading && tracks.length == 0 ? <div>
                <p className="text-white-default">No liked tracks. You should start searching!</p>
            </div>
            : <TracksList guildId={id} tracks={tracks} loading={tracksloading} Buttons={({ track }: { track: DbTrack}) => LikedTrackButtons({ track, guildId: id})}/> }
        </div>
    </div>;
}

function LikedTrackButtons({ guildId, track }: {
    guildId: string,
    track: DbTrack
}){
    const { pushAlert } = useAlert()
    const [isLiked, setIsLiked] = useState<boolean>(true)
    const onTrackLike = useCallback(async () => {
        try{
            await likeTrack(track.providerTrackId, 'soundcloud')
            return
        }catch(err){
            pushAlert(String(err))
        }
    }, [track])
    const onTrackDislike = useCallback(async () => {
        try{
            await dislikeTrack(track.providerTrackId, 'soundcloud')
            return
        }catch(err){
            pushAlert(String(err))
        }
    }, [track])
    const likeTrackClick = useCallback(async () => {
        if(!track) return
        if(isLiked) {
            onTrackDislike()
            return setIsLiked(false)
        }
        onTrackLike()
        setIsLiked(true)
    }, [track, isLiked])
    const addToQueueClick = useCallback(async () => {
        try {
            playSoundcloudTrack(guildId, track.providerTrackId, false)
        } catch (err) {
            pushAlert(String(err))
        }
    }, [guildId])
    return <>
        <SmallIconButton title="Like Song" iconClass="text-xl" icon={FaRegHeart} activeIcon={FaHeart} onClick={likeTrackClick} isActive={isLiked}/>
        <SmallIconButton title="Add to Queue" iconClass="text-xl" icon={PiQueue} onClick={addToQueueClick}/>
    </>
}