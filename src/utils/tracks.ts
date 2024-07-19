import { QueueTrack } from "@/types/soundcloud";
import { useEffect, useState } from "react";
import apiRequest, { ResponseDataType } from "./apiRequest";

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

export type QueueTrackResponse = {
    status: string,
    queueTrack: QueueTrack
}

export function useCurrentTrack(playerId: string){
    const [data, setData] = useState<QueueTrack|null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        (async () => {
            try{
                const { status, data } = await apiRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/player/${playerId}/tracks/current`, {
                    method: 'GET',
                    cache: 'no-cache'
                }, ResponseDataType.JSON)
                if(data.status != 'ok') return setData(null)
                const queueTrackResp = data as QueueTrackResponse
                return setData(queueTrackResp.queueTrack)
            }catch(err){
                setData(null)
            }finally{
                setLoading(false)
            }
        })()
    }, [])
    return ({ data, setData, loading })
}

export function usePlayerQueue(playerId: string){
    const [data, setData] = useState<QueueTrack[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        (async () => {
            try{
                const { status, data } = await apiRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/player/${playerId}/tracks/`, {
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
    }, [])
    return ({ data, setData, loading })
}