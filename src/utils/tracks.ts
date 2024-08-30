import { QueueTrack } from "../../types/soundcloud";
import { useEffect, useState } from "react";
import apiRequest, { QueueTrackResponse, ResponseDataType } from "./apiRequest";
import { playerPreferences } from "../../types/player";
import { isValidPlayerPreferences } from "../../validators/player";
import { DbTrack } from "../../types/tracks";

export function formatDuration(seconds: number): string{
    const twoDigits = (num: number): string => num < 10 ? `0${num}` : `${num}`
    if(seconds < 60) return `0:${twoDigits(seconds)}`
    // Minutes
    const minutes = Math.floor(seconds / 60)
    if(minutes < 60) return `${twoDigits(minutes)}:${twoDigits(seconds % 60)}`
    // Hours
    const hours = Math.floor(minutes / 60)
    return `${hours}:${twoDigits(minutes % 60)}:${twoDigits(seconds % 60)}`
}

export async function playTrackByQueueId(playerId: string, queueId: string){
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL!}/api/v1/player/${playerId}/tracks/queue/${encodeURIComponent(queueId)}`)
    const { data } = await apiRequest(url.href, {
        method: 'POST',
    }, ResponseDataType.JSON)
    if(data.status == 'ok') return true
    throw data.error
}
export async function removeTrackByQueueId(playerId: string, queueId: string){
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL!}/api/v1/player/${playerId}/tracks/queue/${encodeURIComponent(queueId)}`)
    const { data } = await apiRequest(url.href, {
        method: 'DELETE',
    }, ResponseDataType.JSON)
    if(data.status == 'ok') return true
    throw data.error
}

export async function playSoundcloudTrack(playerId: string, trackUrl: string, force: boolean = true){
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL!}/api/v1/player/${playerId}/tracks/soundcloud/${encodeURIComponent(trackUrl)}`)
    if(force) url.searchParams.set('force', '1')
    const { status, data } = await apiRequest(url.href, {
        method: "POST",
    }, ResponseDataType.JSON)
    if(data == null || data.status == 'error'){
        if(data.error) throw data.error
        throw "An error has occured while playing track"
    }
}

export async function likeTrack(trackId: string, trackProvider: string){
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL!}/api/v1/users/me/likes/${encodeURIComponent(trackId)}`)
    const { data } = await apiRequest(url.href, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            providerId: trackProvider
        })
    }, ResponseDataType.JSON)
    if(data.status == 'ok') return true
    throw data.error
}
export async function dislikeTrack(trackId: string, trackProvider: string){
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL!}/api/v1/users/me/likes/${encodeURIComponent(trackId)}`)
    const { data } = await apiRequest(url.href, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            providerId: trackProvider
        })
    }, ResponseDataType.JSON)
    if(data.status == 'ok') return true
    throw data.error
}

function initDefaultPlayerPreferences(): playerPreferences{
    return ({
        repeat: 'off',
        volume: 1
    })
}
export function useCurrentTrack(playerId: string){
    const [data, setData] = useState<QueueTrack|null>(null);
    const [playerPreferences, setPlayerPreferences] = useState<playerPreferences>(initDefaultPlayerPreferences());
    const [status, setStatus] = useState<'playing'|'paused'>('paused');
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        (async () => {
            try{
                const { data } = await apiRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/player/${playerId}/tracks/queue/current`, {
                    method: 'GET',
                    cache: 'no-cache'
                }, ResponseDataType.JSON)
                const { status, queueTrack, playerStatus, playerPreferences } = data as QueueTrackResponse
                if(status != 'ok') throw 'No Data'
                setStatus(playerStatus)
                if(isValidPlayerPreferences(playerPreferences))
                    setPlayerPreferences((prev) => ({ ...prev, ...playerPreferences }))
                return setData(queueTrack)
            }catch(err){
                setData(null)
            }finally{
                setLoading(false)
            }
        })()
    }, [playerId])
    return ({ data, setData, status, setStatus, playerPreferences, setPlayerPreferences, loading })
}

export function usePlayerQueue(playerId: string){
    const [data, setData] = useState<QueueTrack[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        (async () => {
            try{
                const { status, data } = await apiRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/player/${playerId}/tracks/queue/`, {
                    method: 'GET',
                    cache: 'no-cache'
                }, ResponseDataType.JSON)
                if(data.status != 'ok') return setData([])
                const results = data.results as QueueTrack[]
                return setData(results)
            }catch(err){
                setData([])
            }finally{
                setLoading(false)
            }
        })()
    }, [playerId])
    return ({ data, setData, loading })
}

export function useLikedTracks(){
    const [data, setData] = useState<DbTrack[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        (async () => {
            try{
                const { status, data } = await apiRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/me/likes`, {
                    method: 'GET',
                    cache: 'no-cache'
                }, ResponseDataType.JSON)
                if(data.status != 'ok' || !data.tracks) return setData([])
                const results = data.tracks as DbTrack[]
                return setData(results)
            }catch(err){
                setData([])
            }finally{
                setLoading(false)
            }
        })()
    }, [])
    return ({ data, setData, loading })
}