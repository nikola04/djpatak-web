import { useEffect, useState } from "react";
import apiRequest, { ResponseDataType } from "./apiRequest";
import { SoundcloudTrack } from "@/types/soundcloud";

export function isParentOf(parent: HTMLElement|null, node: HTMLElement|ParentNode|null): boolean{
    if(!parent) return false;
    if(!node) return false;
    if(node == parent) return true;
    return isParentOf(parent, node.parentNode);
}

export type QueueTrackResponse = {
    status: string,
    queueTrack: {
        queueId: string,
        track: SoundcloudTrack
    }
}

export function getCurrentTrack(playerId: string){
    const [data, setData] = useState<QueueTrackResponse|null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        (async () => {
            try{
                const { status, data } = await apiRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/player/${playerId}/tracks/current`, {
                    method: 'GET',
                    cache: 'no-cache'
                }, ResponseDataType.JSON)
                if(data.status == 'ok')
                    return setData({
                        status: data.playerStatus,
                        queueTrack: data.queueTrack
                    })
                setData(null)
            }catch(err){
                setData(null)
            }finally{
                setLoading(false)
            }
        })()
    }, [])
    return ({ data, setData, loading })
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