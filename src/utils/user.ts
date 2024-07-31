import { useEffect, useState } from "react";
import apiRequest, { ResponseDataType } from "./apiRequest";
import { DiscordGuild } from "../../types/discord";

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
            const { status, data } = await apiRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/me`, {
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