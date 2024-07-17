import { useEffect, useState } from "react";
import apiRequest, { ResponseDataType } from "./apiRequest";
import { QueueTrack } from "@/types/soundcloud";
import { DiscordGuild } from "@/types/discord";

export function isParentOf(parent: HTMLElement|null, node: HTMLElement|ParentNode|null): boolean{
    if(!parent) return false;
    if(!node) return false;
    if(node == parent) return true;
    return isParentOf(parent, node.parentNode);
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

export function useUserGuilds(){
    const [data, setData] = useState<DiscordGuild[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        (async () => {
            const { status, data } = await apiRequest(`${process.env.NEXT_PUBLIC_API_URL!}/api/v1/users/guilds`, { method: "GET", cache: 'no-cache' }, ResponseDataType.JSON, true)
            setLoading(false)
            if(status == 200 && data.status == 'ok') {
                const results = data.results as DiscordGuild[]
                setData(results)
            }
        })()
    }, [])
    return ({ data, loading })
}

export function useUserData() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
            const { status, data, error } = await apiRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/me`, {
                method: 'GET',
                cache: 'no-cache'
            }, ResponseDataType.JSON)
            if(data.status == 'ok')
                return setData(data.data)
            setData(null)
        } catch (error) {
            console.error(error)
            setData(null)
        } finally {
            setLoading(false);
        }
      };
  
      fetchData();
    }, []);
  
    return { data, loading };
}