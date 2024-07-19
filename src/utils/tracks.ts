import { QueueTrack } from "@/types/soundcloud";
import { useEffect, useState } from "react";
import apiRequest, { QueueTrackResponse, ResponseDataType } from "./apiRequest";

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

export function useCurrentTrack(playerId: string){
    const [data, setData] = useState<QueueTrack|null>(null);
    const [status, setStatus] = useState<'playing'|'paused'>('paused');
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        (async () => {
            try{
                const { data } = await apiRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/player/${playerId}/tracks/queue/current`, {
                    method: 'GET',
                    cache: 'no-cache'
                }, ResponseDataType.JSON)
                const { status, queueTrack, playerStatus } = data as QueueTrackResponse
                if(status != 'ok') return setData(null)
                setStatus(playerStatus)
                return setData(queueTrack)
            }catch(err){
                setData(null)
            }finally{
                setLoading(false)
            }
        })()
    }, [playerId])
    return ({ data, setData, status, setStatus, loading })
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