'use client'
import { FaPlus } from "react-icons/fa6";
import { useUserPlaylists } from "@/utils/user";
import { TracksList } from "@/components/library/tracksList";

export default function LikedPage({ params: { id }}: {
    params: {
        id: string
    }
}){
    const { playlists, setPlaylists, loading: playlistsLoading } = useUserPlaylists()
    return <div className="flex flex-col w-full px-3 pr-4 py-5">
        <div className="flex items-center justify-between w-full">
            <h2 className="text-white-default text-xl font-bold">My Playlists</h2>
            <button title="New Playlist" className="px-3 py-1 bg-blue-light rounded-md text-white-default">
                <span>
                    <div className="flex items-center gap-1">
                        <FaPlus/>    
                        <span>Create Playlist</span>
                    </div>
                </span>
            </button>
        </div>
        <div className="w-full">
            { !playlistsLoading && playlists.length == 0 ? <div className="py-4">
                <p className="text-white-gray">No playlists. You can create one now.</p>
            </div>
            : 
            <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fit, 18rem)" }}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div> }
        </div>
    </div>;
}