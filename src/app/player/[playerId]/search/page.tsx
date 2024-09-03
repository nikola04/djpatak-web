"use client";
import { Track } from "@/../types/soundcloud";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { PiQueue } from "react-icons/pi";
import { playSoundcloudTrack, useSoundcloudTracksSearch } from "@/utils/tracks";
import { useAlert } from "@/components/providers/Alert";
import { SmallIconButton } from "@/components/Buttons";
import AddToPlaylistMenu from "@/components/AddToPlaylistMenu";
import { Playlist } from "@/../types/user";
import { DbTrack } from "@/../types/tracks";
import { TracksList } from "@/components/library/TracksList";
import { useUserPlaylists } from "@/utils/user";

export default function SearchPage({
  params: { playerId },
}: {
  params: {
    playerId: string;
  };
}) {
  const [tracksLimit, setTracksLimit] = useState<number>(12);
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const { soundcloudTracks, loading } = useSoundcloudTracksSearch(
    query,
    tracksLimit,
  );
  const { sortedPlaylists } = useUserPlaylists();
  const tracksFormated = useMemo<DbTrack[]>(() => {
    const formated: DbTrack[] = [];
    if (soundcloudTracks)
      soundcloudTracks.forEach((track: Track) =>
        formated.push({
          providerId: "soundcloud",
          providerTrackId: track.permalink,
          trackData: {
            title: track.title,
            thumbnail: track.thumbnail ?? "",
            duration: Math.floor(track.duration / 1000),
            author: track.user.username,
          },
        }),
      );
    return formated;
  }, [soundcloudTracks]);
  const memoizedButtons = useCallback(
    ({ track }: { track: DbTrack }) => (
      <SearchTrackButtons
        guildId={playerId}
        playlists={sortedPlaylists}
        track={track}
      />
    ),
    [playerId, sortedPlaylists],
  );
  return (
    <div className="p-4">
      <div className="">
        <div className="flex items-center py-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={28}
            height={28}
            fill={"white"}
            viewBox="0 0 75 33.51"
          >
            <g id="Layer_2" data-name="Layer 2">
              <g id="Orange">
                <path d="M75,23.6a10.5,10.5,0,0,1-10.63,9.91H38.82a2.14,2.14,0,0,1-2.12-2.13V3.87a2.34,2.34,0,0,1,1.41-2.24S40.46,0,45.41,0A16.74,16.74,0,0,1,54,2.36a17,17,0,0,1,8,11.08,9.8,9.8,0,0,1,2.71-.37A10.23,10.23,0,0,1,75,23.6Z" />
                <path d="M33.51,5.61a.83.83,0,1,0-1.65,0c-.7,9.25-1.24,17.92,0,27.14a.83.83,0,0,0,1.65,0C34.84,23.45,34.28,14.94,33.51,5.61Z" />
                <path d="M28.35,8.81a.87.87,0,0,0-1.73,0,103.7,103.7,0,0,0,0,23.95.87.87,0,0,0,1.72,0A93.2,93.2,0,0,0,28.35,8.81Z" />
                <path d="M23.16,8a.84.84,0,0,0-1.67,0c-.79,8.44-1.19,16.32,0,24.74a.83.83,0,0,0,1.66,0C24.38,24.21,24,16.55,23.16,8Z" />
                <path d="M18,10.41a.86.86,0,0,0-1.72,0,87.61,87.61,0,0,0,0,22.36.85.85,0,0,0,1.69,0A81.68,81.68,0,0,0,18,10.41Z" />
                <path d="M12.79,16a.85.85,0,0,0-1.7,0c-1.23,5.76-.65,11,.05,16.83a.81.81,0,0,0,1.6,0C13.51,26.92,14.1,21.8,12.79,16Z" />
                <path d="M7.62,15.12a.88.88,0,0,0-1.75,0C4.78,21,5.14,26.18,5.9,32.05c.08.89,1.59.88,1.69,0C8.43,26.09,8.82,21.06,7.62,15.12Z" />
                <path d="M2.4,18A.88.88,0,0,0,.65,18c-1,3.95-.69,7.22.07,11.18a.82.82,0,0,0,1.63,0C3.23,25.14,3.66,21.94,2.4,18Z" />
              </g>
            </g>
          </svg>
          <h1 className="px-2 text-white-default font-bold">SoundCloud</h1>
        </div>
        <TracksList
          guildId={playerId}
          tracks={tracksFormated}
          loading={loading}
          Buttons={memoizedButtons}
        />
      </div>
    </div>
  );
}

function SearchTrackButtons({
  guildId,
  track,
  playlists,
}: {
  guildId: string;
  track: DbTrack;
  playlists: Playlist[];
}) {
  const { pushAlert } = useAlert();
  const addToQueueClick = async () => {
    try {
      await playSoundcloudTrack(guildId, track.providerTrackId, false);
      pushAlert("Track is added to Queue", false);
    } catch (err) {
      pushAlert(String(err));
    }
  };
  return (
    <>
      <SmallIconButton
        title="Add to Queue"
        icon={<PiQueue className="text-xl" />}
        onClick={addToQueueClick}
      />
      <AddToPlaylistMenu playlists={playlists} track={track} />
    </>
  );
}
