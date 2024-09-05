"use client";
import {
  createContext,
  FormEvent,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { IoClose } from "react-icons/io5";
import { DangerButton, PrimaryButton, SmallIconButton } from "../Buttons";
import { MdCreate } from "react-icons/md";
import { TfiTrash } from "react-icons/tfi";

interface PopupContextType {
  setPopup: (popupContainer: ReactNode) => any;
  setVisibility: (visibility: "visible" | "hidden") => any;
  hidePopup: () => any;
  showPopup: () => any;
}
const PopupContext = createContext<PopupContextType | null>(null);

export function usePopup() {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error("usePopup must be wrapped in Popup Provider");
  }
  return context;
}

export function PopupProvider({ children }: { children: ReactNode }) {
  const [PopupContent, setPopup] = useState<ReactNode | null>(null);
  const [visibility, setVisibility] = useState<"visible" | "hidden">("hidden");
  const popupRef = useRef<HTMLDivElement | null>(null);
  const hidePopup = useCallback(() => {
    popupRef.current?.classList.add("animate-hide");
  }, []);
  const showPopup = useCallback(() => {
    setVisibility("visible");
  }, []);
  return (
    <PopupContext.Provider
      value={{ setPopup, setVisibility, hidePopup, showPopup }}
    >
      {visibility === "visible" && (
        <div ref={popupRef} onAnimationEnd={() => setVisibility("hidden")}>
          <div
            onClick={() => hidePopup()}
            className="fixed z-40 w-screen h-screen left-0 top-0 bg-black-default bg-opacity-60"
          ></div>
          <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {PopupContent}
          </div>
        </div>
      )}
      {children}
    </PopupContext.Provider>
  );
}

export const DefaultPopupContainer = ({
  children,
}: {
  children?: ReactNode;
}) => (
  <div className="relative w-screen sm:min-w-[420px] sm:w-auto drop-shadow-md">
    <div className="relative flex flex-col p-4 px-6 w-full rounded-md bg-blue-grayish">
      {children}
    </div>
  </div>
);

export const DefaultPopupHeader = ({
  title,
  onClose,
}: {
  title?: string;
  onClose: () => any;
}) => (
  <div className="flex justify-between items-center">
    <h2 className="text-white-default font-normal text-lg">{title}</h2>
    <SmallIconButton
      title={"Close"}
      icon={<IoClose className="text-2xl" />}
      onClick={onClose}
    />
  </div>
);

export const PlaylistPopupContent = ({
  initialValues = { name: "", desc: "" },
  onClose,
  submit,
  onDletePlaylist,
  submitType,
}: {
  initialValues?: {
    name: string;
    desc: string;
  };
  onClose: () => any;
  submit: (
    playlistName: string,
    playlistDescription: string,
    callback: (err: boolean) => any,
  ) => any;
  onDletePlaylist?: (callback: (err: boolean) => any) => any;
  submitType: "create" | "edit";
}) => {
  const [newPlaylistName, setNewPlaylistName] = useState<string>(
    initialValues.name,
  );
  const [newPlaylistDescription, setNewPlaylistDescription] = useState<string>(
    initialValues.desc,
  );
  const [isLoading, setIsLoading] = useState<false | "submit" | "delete">(
    false,
  );
  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (newPlaylistName.length < 2 && newPlaylistName.length > 24) return;
      if (newPlaylistDescription.length > 100) return;
      setIsLoading("submit");
      submit(newPlaylistName, newPlaylistDescription, (err: boolean) => {
        if (err) {
          setNewPlaylistName("");
          setNewPlaylistDescription("");
        } else onClose();
        setIsLoading(false);
      });
    },
    [newPlaylistName, newPlaylistDescription],
  );
  const deletePlaylist = () => {
    setIsLoading("delete");
    if (onDletePlaylist)
      onDletePlaylist((err: boolean) => {
        onClose();
        setIsLoading(false);
      });
  };
  return (
    <DefaultPopupContainer>
      <DefaultPopupHeader
        onClose={onClose}
        title={submitType === "create" ? "Create Playlist" : "Edit Playlist"}
      />
      <div className="flex flex-col py-2">
        <form className="flex flex-col" onSubmit={onSubmit}>
          <input
            value={newPlaylistName}
            onInput={(e) =>
              setNewPlaylistName((e.target as HTMLInputElement).value)
            }
            className="bg-[#2b2b36] border-1 border-transparent focus:border-blue-light text-white-default text-base rounded !outline-none py-2 px-3 font-thin mb-2 mt-0.5"
            placeholder="Playlist name"
            type="text"
            id="playlistName"
            name="playlist-name"
          />
          <label
            htmlFor="playlistDesc"
            className="text-white-gray text-sm opacity-70"
          >
            Optional
          </label>
          <input
            value={newPlaylistDescription}
            onInput={(e) =>
              setNewPlaylistDescription((e.target as HTMLInputElement).value)
            }
            className="bg-[#2b2b36] border-1 border-transparent focus:border-blue-light text-white-default text-base rounded !outline-none py-2 px-3 font-thin mb-2 mt-0.5"
            placeholder="Playlist description"
            type="text"
            id="playlistDesc"
            name="playlist-description"
          />
          <div className="flex items-center justify-between mt-3.5">
            <PrimaryButton
              value={submitType === "create" ? "Create" : "Save"}
              type="submit"
              disabled={isLoading !== false}
              icon={isLoading === "submit" ? <Spinner /> : <MdCreate />}
            />
            {submitType === "edit" && (
              <DangerButton
                value={"Delete"}
                type="button"
                onClick={deletePlaylist}
                disabled={isLoading !== false}
                icon={isLoading === "delete" ? <Spinner /> : <TfiTrash />}
              />
            )}
          </div>
        </form>
      </div>
    </DefaultPopupContainer>
  );
};

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}
