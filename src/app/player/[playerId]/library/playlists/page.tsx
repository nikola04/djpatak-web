"use client";
import { FaPlus } from "react-icons/fa6";
import { createNewPlaylist, useUserPlaylists } from "@/utils/user";
import { PlaylistPopupContent, usePopup } from "@/components/providers/Popup";
import { PrimaryButton } from "@/components/Buttons";
import { useAlert } from "@/components/providers/Alert";
import { Playlist as PlaylistType } from "@/../types/user";
import { useRouter } from "next/navigation";

export default function PlaylistsPage({
  params: { playerId },
}: {
  params: {
    playerId: string;
  };
}) {
  const {
    playlists,
    sortedPlaylists,
    setPlaylists,
    loading: playlistsLoading,
  } = useUserPlaylists();
  const { setPopup, showPopup, hidePopup } = usePopup();
  const { pushAlert } = useAlert();
  const createPlaylist = async (
    playlistName: string,
    playlistDescription: string,
    onCreatedCallback: (err: boolean) => any,
  ) => {
    try {
      const playlist = await createNewPlaylist(
        playlistName,
        playlistDescription,
      );
      if (!playlist) throw "No Playlist Data. Try Reloading.";
      setPlaylists((prev) => [...prev, playlist]);
      onCreatedCallback(false);
      pushAlert("Playlist created", false);
    } catch (err) {
      console.log(err);
      onCreatedCallback(true);
      pushAlert(String(err));
    }
  };
  const openCreateNewPlaylists = () => {
    setPopup(
      <PlaylistPopupContent
        onClose={hidePopup}
        submit={createPlaylist}
        submitType="create"
      />,
    );
    showPopup();
  };
  return (
    <div className="flex flex-col w-full px-3 pr-4 py-5">
      <div className="flex items-center justify-between w-full">
        <div>
          <p className="text-white-default opacity-40 text-sm py-0.5">
            Playlists /
          </p>
          <h2 className="text-white-default text-xl font-bold py-2">
            My Playlists
          </h2>
        </div>
        <PrimaryButton
          onClick={openCreateNewPlaylists}
          value="Create Playlist"
          icon={<FaPlus />}
          className="mr-2"
        />
      </div>
      <div className="w-full">
        {!playlistsLoading && playlists.length == 0 ? (
          <div className="py-4">
            <p className="text-white-gray">
              No playlists. You can create one now.
            </p>
          </div>
        ) : (
          <div
            className="grid gap-4 py-4 mr-2"
            style={{ gridTemplateColumns: "repeat(auto-fit, 12rem)" }}
          >
            {playlistsLoading
              ? [...new Array(7)].map((_, ind) => (
                  <PlaylistSceleton key={ind} />
                ))
              : sortedPlaylists.map((playlist) => (
                  <Playlist key={playlist._id} playlist={playlist} />
                ))}
          </div>
        )}
      </div>
    </div>
  );
}

const Playlist = ({ playlist }: { playlist: PlaylistType }) => {
  const Router = useRouter();
  return (
    <div className="flex flex-col">
      <div
        onClick={() => Router.push(`playlists/${playlist._id}`)}
        className="w-full aspect-square bg-blue-grayish rounded cursor-pointer"
      >
        <div className="w-full h-full"></div>
      </div>
      <p
        title={playlist.name}
        className="text-white-default py-1 w-full text-nowrap overflow-hidden whitespace-nowrap text-ellipsis font-thin"
      >
        {playlist.name}
      </p>
    </div>
  );
};

const PlaylistSceleton = () => (
  <div className="flex flex-col">
    <div className="w-full aspect-square bg-blue-grayish rounded">
      <div className="w-full h-full"></div>
    </div>
    <div className="w-3/4 bg-blue-grayish my-3 h-3 rounded"></div>
  </div>
);
