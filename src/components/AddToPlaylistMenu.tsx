import {
  HTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { SmallIconButton } from "./Buttons";
import { addTrackToPlaylist, useUserPlaylists } from "@/utils/user";
import { Playlist } from "@/../types/user";
import { PiPlus } from "react-icons/pi";
import { DbTrack } from "@/../types/tracks";
import { useAlert } from "./providers/Alert";
import { RiPlayListAddLine } from "react-icons/ri";
import useWindowDimensions from "./hooks/windowSize";
import { isParentOf } from "@/utils/frontend";

interface AddToPlaylistMenuProps extends HTMLAttributes<HTMLDivElement> {
  track: DbTrack;
  playlists: Playlist[];
}
export default function AddToPlaylistMenu({
  track,
  playlists,
  className,
  ...restProps
}: AddToPlaylistMenuProps) {
  const [searchInput, setSearchInput] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(false);
  const { windowDimensions } = useWindowDimensions();
  const { pushAlert } = useAlert();
  const [position, setPosition] = useState<{
    horizontal: "left" | "right";
    vertical: "top" | "bottom";
  }>({ horizontal: "right", vertical: "top" });
  const menuWithButtonRef = useRef<HTMLDivElement>(null);
  const filteredPlaylists = useMemo(() => {
    if (searchInput.length == 0) return playlists;
    const value = searchInput.toLocaleLowerCase();
    return playlists.filter((playlist) => {
      const name = playlist.name.toLocaleLowerCase();
      return name.startsWith(value) || name.includes(value);
    });
  }, [searchInput, playlists]);
  const addToPlaylist = async (playlist: Playlist) => {
    try {
      await addTrackToPlaylist(
        playlist._id,
        track.providerId,
        track.providerTrackId,
      );
      pushAlert("Track has been added to Playlists", false);
      setIsActive(false);
    } catch (error) {
      pushAlert(String(error));
    }
  };
  useEffect(() => {
    if (!isActive) return;
    function handleClick(event: Event) {
      if (
        event.target instanceof HTMLElement &&
        !isParentOf(menuWithButtonRef.current, event.target)
      ) {
        setIsActive(false);
      }
    }
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [isActive]);
  useEffect(() => {
    if (
      !menuWithButtonRef.current ||
      !windowDimensions.width ||
      !windowDimensions.height
    )
      return;
    const rect = menuWithButtonRef.current.getBoundingClientRect();
    if (rect.left + 240 > windowDimensions.width)
      setPosition((prev) => ({ ...prev, horizontal: "left" }));
    else setPosition((prev) => ({ ...prev, horizontal: "right" }));
    if (rect.top - 350 <= 0)
      setPosition((prev) => ({ ...prev, vertical: "bottom" }));
    else setPosition((prev) => ({ ...prev, vertical: "top" }));
  }, [windowDimensions]);
  return (
    <div
      ref={menuWithButtonRef}
      className={`relative ${className}`}
      {...restProps}
    >
      <SmallIconButton
        onClick={() => setIsActive((prev) => !prev)}
        className="w-11 h-11"
        title="Add to Playlist"
        icon={<RiPlayListAddLine className="text-lg" />}
      />
      {isActive && (
        <div
          className={`absolute flex flex-col flex-grow rounded-md bg-blue-grayish z-50 w-56 px-2 shadow-lg ${position.horizontal === "right" ? "left-1/2 -translate-x-1/4" : "right-0"} ${position.vertical == "top" ? "-top-1 -translate-y-full" : "-bottom-1 translate-y-full"}`}
        >
          <h3 className="text-white-default px-3 pt-3 pb-0.5 text-sm">
            My Playlists
          </h3>
          <div className="p-2 pb-0 w-full">
            <input
              value={searchInput}
              onInput={(e) =>
                setSearchInput((e.target as HTMLInputElement).value)
              }
              type="text"
              className="outline-0 text-white-default text-sm px-2 py-1 border-1 border-transparent focus:border-blue-sky rounded bg-[#2b2b36] w-full"
              placeholder="Search..."
            />
          </div>
          <div className="h-[200px] pb-1 overflow-hidden w-full">
            <div className="flex flex-col px-2 py-1 h-full overflow-y-scroll">
              <div className="flex items-center py-1.5 my-1 px-1.5 cursor-pointer rounded-md bg-white-gray bg-opacity-0 hover:bg-opacity-5">
                <PiPlus className="text-blue-light text-md" />
                <p className="text-blue-light text-sm font-thin flex-grow overflow-hidden text-nowrap whitespace-nowrap text-ellipsis px-2 ">
                  Create new
                </p>
              </div>
              {filteredPlaylists.map((playlist) => (
                <PlaylistMenuItem
                  onClick={() => addToPlaylist(playlist)}
                  key={playlist._id}
                  playlist={playlist}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PlaylistMenuItem({
  playlist,
  onClick,
}: {
  playlist: Playlist;
  onClick: () => any;
}) {
  return (
    <div
      onClick={onClick}
      className="flex items-center py-1.5 px-0 cursor-pointer rounded bg-white-gray transition-all bg-opacity-0 hover:bg-opacity-5 active:bg-opacity-10"
    >
      <p className="text-white-gray flex-grow overflow-hidden text-nowrap whitespace-nowrap text-ellipsis px-2 text-sm">
        {playlist.name}
      </p>
    </div>
  );
}
