'use client'
import { FaPlus } from "react-icons/fa6";
import { createNewPlaylist, useUserPlaylists } from "@/utils/user";
import { FormEvent, useCallback, useState } from "react";
import { DefaultPopupContainer, DefaultPopupHeader, usePopup } from "@/components/Popup";
import { PrimaryButton } from "@/components/Buttons";
import { useAlert } from "@/components/Alert";
import { Playlist as PlaylistType } from "@/../types/user";
import { MdCreate } from "react-icons/md";
import { useRouter } from "next/navigation";

export default function PlaylistsPage({ params: { playerId }}: {
    params: {
        playerId: string
    }
}){
    const { playlists, setPlaylists, loading: playlistsLoading } = useUserPlaylists()
    const { setPopup, showPopup, hidePopup } = usePopup()
    const { pushAlert } = useAlert()

    const createPlaylist = async (playlistName: string, onCreatedCallback: (err: boolean) => any) => {
        try{
            const playlist = await createNewPlaylist(playlistName)
            if(!playlist)
                throw ("No Playlist Data. Try Reloading.")
            setPlaylists(prev => [...prev, playlist])
            onCreatedCallback(false)
        }catch(err){
            console.log(err)
            onCreatedCallback(true)
            pushAlert(String(err))
        }
    }
    const openCreateNewPlaylists = useCallback(() => {
        setPopup(<NewPlaylistPopup onClose={hidePopup} createPlaylist={createPlaylist}/>)
        showPopup()
    }, [])
    return <div className="flex flex-col w-full px-3 pr-4 py-5">
        <div className="flex items-center justify-between w-full">
            <div>
                <p className="text-white-default opacity-40 text-sm py-0.5">Playlists /</p>
                <h2 className="text-white-default text-xl font-bold py-2">My Playlists</h2>
            </div>
            <PrimaryButton onClick={openCreateNewPlaylists} value="Create Playlist" icon={<FaPlus/>} className="mr-2"/>
        </div>
        <div className="w-full">
            { !playlistsLoading && playlists.length == 0 ? <div className="py-4">
                <p className="text-white-gray">No playlists. You can create one now.</p>
            </div>
            : 
            <div className="grid gap-4 py-4 mr-2" style={{ gridTemplateColumns: "repeat(auto-fit, 12rem)" }}>
                { playlistsLoading ?
                [...new Array(7)].map((_, ind) => <PlaylistSceleton key={ind}/>)
                : playlists.map((playlist) => <Playlist key={playlist._id} playlist={playlist}/>)}
            </div> }
        </div>
    </div>;
}

const Playlist = ({ playlist } : {
    playlist: PlaylistType
}) => {
    const Router = useRouter()
    return <div className="flex flex-col">
        <div onClick={() => Router.push(`playlists/${playlist._id}`)} className="w-full aspect-square bg-blue-grayish rounded cursor-pointer">
            <div className="w-full h-full"></div>
        </div>
        <p className="text-white-default py-1 w-full text-nowrap overflow-hidden whitespace-nowrap text-ellipsis font-thin">{ playlist.name }</p>
    </div>
}

const PlaylistSceleton = () => <div className="flex flex-col">
    <div className="w-full aspect-square bg-blue-grayish rounded cursor-pointer">
        <div className="w-full h-full"></div>
    </div>
    <div className="w-3/4 bg-blue-grayish my-3 h-3 rounded"></div>
</div>

const NewPlaylistPopup = ({ onClose, createPlaylist }: {
    onClose: () => any,
    createPlaylist: (playlistName: string, onCreateCallback: (err: boolean) => any) => any,
}) => {
    const [newPlaylistName, setNewPlaylistName] = useState<string>("") 
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const onSubmit = useCallback((e: FormEvent) => {
        e.preventDefault()
        if(newPlaylistName.length < 2 && newPlaylistName.length > 24) return
        setIsLoading(true)
        createPlaylist(newPlaylistName, (err: boolean) => {
            if(err)
                setNewPlaylistName("")
            else onClose()
            setIsLoading(false)
        })
    }, [newPlaylistName])
    return <DefaultPopupContainer>
        <DefaultPopupHeader onClose={onClose} title="Create Playlist"/>
        <div className="flex flex-col pt-5 pb-2">
            <form className="flex flex-col gap-4" onSubmit={onSubmit}>
                <input value={newPlaylistName} onInput={e => setNewPlaylistName((e.target as HTMLInputElement).value)} className="bg-[#2b2b36] border-1 border-transparent focus:border-blue-light text-white-default text-base rounded !outline-none py-2 px-3 font-thin" placeholder="Playlist name" type="text" id="playlistName" name="playlist-name"/>
                <PrimaryButton value={"Create"} type="submit" className="mr-auto" disabled={isLoading} icon={isLoading ? <Spinner/> : <MdCreate/>}/>
            </form>
        </div>
    </DefaultPopupContainer>
}

function Spinner(){
    return <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
}