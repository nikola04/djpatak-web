import { authOptions } from "@/utils/authOptions";
import SoundCloud from "@/utils/soundCloud";
import { getServerSession } from "next-auth";

export async function GET(req: Request){
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('query')
    const limitS = searchParams.get('limit')
    const limit = limitS != null ? Number(limitS) : undefined
    if(!query || query?.length <= 2) return new Response("Invalid query. Query must be at least 2 characters long.", {
        status: 400
    })
    if(limit && (limit < 1 || limit > 20)) return new Response("Invalid limit. Limit must be from 1 to 20.", {
        status: 400
    })
    const session = await getServerSession(authOptions);
    if(!session?.user) return new Response("Not signed in.", {
        status: 401
    })
    const soundcloudId = await SoundCloud.getSoundcloudId()
    if(!soundcloudId) return new Response("Invalid SoundCloud ID", {
        status: 500
    })
    const tracks = await SoundCloud.search(soundcloudId, query, { limit })
    return Response.json(tracks)
}