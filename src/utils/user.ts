import { useEffect, useState } from "react";
import apiRequest, { ResponseDataType } from "./apiRequest";
import { DiscordGuild } from "../../types/discord";
import { Playlist } from "../../types/user";

export function useUserGuilds(){
    const [data, setData] = useState<DiscordGuild[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        (async () => {
            const { status, data } = await apiRequest(`${process.env.NEXT_PUBLIC_API_URL!}/api/v1/users/me/guilds`, { method: "GET", cache: 'no-cache' }, ResponseDataType.JSON, true)
            if(status == 200 && data.status == 'ok') {
                const results = data.results as DiscordGuild[]
                setData(results)
            }
            setLoading(false)
        })()
    }, [])
    return ({ data, loading })
}

export function useUserPlaylists(){
    const [playlists, setPlaylists] = useState<Playlist[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        (async () => {
            const { status, data } = await apiRequest(`${process.env.NEXT_PUBLIC_API_URL!}/api/v1/users/me/playlists`, { method: "GET", cache: 'no-cache' }, ResponseDataType.JSON, true)
            setLoading(false)
            if(status == 200 && data.playlists)
                setPlaylists(data.playlists)
        })()
    }, [])
    return ({ playlists, setPlaylists, loading })
}

export function useUserData() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
            const { status, data } = await apiRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/me`, {
                method: 'GET',
                cache: 'no-cache'
            }, ResponseDataType.JSON, true)
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