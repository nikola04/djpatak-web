import { Dispatch, HTMLAttributes, HTMLInputTypeAttribute, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SmallIconButton } from './Buttons';
import { addTrackToPlaylist, createNewPlaylist, useUserPlaylists } from '@/utils/user';
import { Playlist } from '@/../types/user';
import { PiPlus } from 'react-icons/pi';
import { DbTrack } from '@/../types/tracks';
import { useAlert } from './providers/Alert';
import { RiPlayListAddLine } from 'react-icons/ri';
import useWindowDimensions from './hooks/windowSize';
import { isParentOf } from '@/utils/frontend';
import { Spinner } from './ui/spinner';
import { IoCheckmark, IoClose } from 'react-icons/io5';
import { FaChevronLeft } from 'react-icons/fa6';

interface PlaylistWithAddedTrack extends Playlist {
	isAdded: boolean;
}
interface AddToPlaylistMenuProps extends HTMLAttributes<HTMLDivElement> {
	track: DbTrack;
	playlists: Playlist[];
	setPlaylists: Dispatch<SetStateAction<Playlist[]>>;
}
export default function AddToPlaylistMenu({ track, playlists, setPlaylists, className, ...restProps }: AddToPlaylistMenuProps) {
	const [position, setPosition] = useState<{ horizontal: 'left' | 'right'; vertical: 'top' | 'bottom' }>({ horizontal: 'right', vertical: 'top' });
	const [openWindow, setOpenWindow] = useState<'list' | 'create'>('list');
	const [isActive, setIsActive] = useState<boolean>(false);
	const { windowDimensions } = useWindowDimensions();
	const { pushAlert } = useAlert();
	const menuWithButtonRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (!isActive) return;
		function handleClick(event: Event) {
			if (event.target instanceof HTMLElement && !isParentOf(menuWithButtonRef.current, event.target)) {
				setIsActive(false);
			}
		}
		window.addEventListener('click', handleClick);
		return () => window.removeEventListener('click', handleClick);
	}, [isActive]);
	useEffect(() => {
		if (!menuWithButtonRef.current || !windowDimensions.width || !windowDimensions.height) return;
		const rect = menuWithButtonRef.current.getBoundingClientRect();
		setPosition({
			horizontal: rect.left + 240 > windowDimensions.width ? 'left' : 'right',
			vertical: rect.top - 350 <= 0 ? 'bottom' : 'top',
		});
	}, [windowDimensions]);
	const playlistList: PlaylistWithAddedTrack[] = useMemo(() => {
		return playlists.map((playlist) => ({ isAdded: false, ...playlist }));
	}, [playlists]);
	const addToPlaylist = async (playlist: Playlist, callback: (err: boolean) => any) => {
		try {
			await addTrackToPlaylist(playlist._id, track.providerId, track.providerTrackId);
			callback(false);
			pushAlert('Track has been added to Playlist', false);
		} catch (error) {
			pushAlert(String(error));
			callback(true);
		}
	};
	const onCreateNewPlaylist = async (name: string, callback: (err: boolean) => any) => {
		try {
			const playlist = await createNewPlaylist(name, '');
			setPlaylists((prev) => [playlist, ...prev]);
			setIsActive(true);
			callback(false);
			setOpenWindow('list');
			pushAlert('Playlist created', false);
		} catch (err) {
			callback(true);
			pushAlert(String(err));
		}
	};
	return (
		<div ref={menuWithButtonRef} className={`relative ${className}`} {...restProps}>
			<SmallIconButton
				onClick={() => setIsActive((prev) => !prev)}
				className="w-11 h-11"
				title="Add to Playlist"
				icon={<RiPlayListAddLine className="text-lg" />}
			/>
			{isActive && (
				<div
					className={`absolute overflow-hidden rounded-lg bg-blue-grayish z-50 w-56 shadow-lg ${position.horizontal === 'right' ? 'left-1/2 -translate-x-1/4' : 'right-0'} ${position.vertical == 'top' ? '-top-1 -translate-y-full' : '-bottom-1 translate-y-full'}`}
				>
					<div className={`relative w-full h-full flex flex-nowrap transition-transform ${openWindow === 'create' && '-translate-x-full'}`}>
						<PlaylistList
							playlists={playlistList}
							onClose={() => setIsActive(false)}
							createNewPlaylist={() => setOpenWindow('create')}
							addToPlaylist={addToPlaylist}
						/>
						<NewPlaylist createNewPlaylist={onCreateNewPlaylist} onClose={() => setOpenWindow('list')} />
					</div>
				</div>
			)}
		</div>
	);
}

function NewPlaylist({
	onClose,
	createNewPlaylist,
}: {
	onClose: () => any;
	createNewPlaylist: (name: string, callback: (err: boolean) => any) => any;
}) {
	const [nameInput, setNameInput] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [message, setMessage] = useState<string>('');
	const onCreate = () => {
		setMessage('');
		if (nameInput.length <= 2) return setMessage('Playlist name is too short.');
		setIsLoading(true);
		createNewPlaylist(nameInput, (err: boolean) => setIsLoading(false));
	};
	return (
		<div className="relative w-full flex flex-col flex-shrink-0 px-2">
			<div className="flex items-center px-2 pt-3 pb-1 gap-2">
				<button onClick={onClose} className="p-1" title="Back">
					<FaChevronLeft className="text-white-default hover:text-white-gray transition-all active:opacity-80 text-sm" />
				</button>
				<h3 className="text-white-default text-sm">Create Playlist</h3>
			</div>
			<div className="flex flex-col">
				<PlaylistInput input={nameInput} setInput={setNameInput} placeholder="Playlist name" />
				<div className="p-2">
					<button
						onClick={onCreate}
						className="w-full my-1 py-1 rounded-sm bg-blue-light text-center text-sm text-white-default flex justify-center"
						title="Create Playlist"
					>
						{!isLoading ? 'Create' : <Spinner className="text-white-default my-0.5" />}
					</button>
					<p className="text-white-default text-center text-sm my-2">{message}</p>
				</div>
			</div>
		</div>
	);
}

function PlaylistList({
	playlists,
	onClose,
	createNewPlaylist,
	addToPlaylist,
}: {
	playlists: PlaylistWithAddedTrack[];
	onClose: () => any;
	createNewPlaylist: () => any;
	addToPlaylist: (playlist: PlaylistWithAddedTrack, callback: (err: boolean) => any) => any;
}) {
	const [searchInput, setSearchInput] = useState<string>('');
	const filteredPlaylists = useMemo(() => {
		if (searchInput.length == 0) return playlists;
		const value = searchInput.toLocaleLowerCase();
		return playlists.filter((playlist) => {
			const name = playlist.name.toLocaleLowerCase();
			return name.startsWith(value) || name.includes(value);
		});
	}, [searchInput, playlists]);
	return (
		<div className="relative w-full flex flex-col flex-shrink-0 px-2">
			<div className="flex items-center px-2 pt-3 pb-1 gap-2">
				<button onClick={onClose} className="p-1" title="Close">
					<IoClose className="text-white-default hover:text-white-gray transition-all active:opacity-80 text-lg" />
				</button>
				<h3 className="text-white-default text-sm">My Playlist</h3>
			</div>
			<PlaylistInput input={searchInput} setInput={setSearchInput} placeholder="Search..." />
			<div className="h-[200px] pb-1 overflow-hidden w-full">
				<div className="flex flex-col px-2 py-1 h-full overflow-y-auto">
					<div
						onClick={createNewPlaylist}
						className="flex items-center py-1.5 my-1 px-1.5 cursor-pointer rounded-md bg-white-gray bg-opacity-0 hover:bg-opacity-5 active:bg-opacity-[0.07] transition-all"
					>
						<PiPlus className="text-blue-light text-md" />
						<p className="text-blue-light text-sm font-thin flex-grow overflow-hidden text-nowrap whitespace-nowrap text-ellipsis px-2 ">
							Create new
						</p>
					</div>
					{filteredPlaylists.length == 0 ? (
						<div className="w-full">
							<p className="text-white-gray text-sm text-center py-2">No Matches.</p>
						</div>
					) : (
						filteredPlaylists.map((playlist) => <PlaylistMenuItem playlist={playlist} onAddPlaylist={addToPlaylist} key={playlist._id} />)
					)}
				</div>
			</div>
		</div>
	);
}

interface PlaylistInputProps {
	input: Readonly<string>;
	setInput: Dispatch<SetStateAction<string>>;
	placeholder?: string;
}
function PlaylistInput({ input, setInput, placeholder }: PlaylistInputProps) {
	return (
		<div className="p-2 pb-0 w-full">
			<input
				value={input}
				onInput={(e) => setInput((e.target as HTMLInputElement).value)}
				type="text"
				className="outline-0 text-white-default text-sm px-2 py-1 border-1 border-transparent focus:border-blue-sky rounded bg-[#2b2b36] w-full"
				placeholder={placeholder}
			/>
		</div>
	);
}

function PlaylistMenuItem({
	playlist,
	onAddPlaylist,
}: {
	playlist: PlaylistWithAddedTrack;
	onAddPlaylist: (playlist: PlaylistWithAddedTrack, callback: (err: boolean) => any) => any;
}) {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const onClick = () => {
		setIsLoading(true);
		onAddPlaylist(playlist, (err: boolean) => {
			setIsLoading(false);
			if (err) return;
			playlist.isAdded = true;
		});
	};
	const Icon = useCallback(() => {
		if (isLoading) return <Spinner className="text-white-default" />;
		if (playlist.isAdded) return <IoCheckmark className="text-blue-light text-lg " />;
	}, [playlist.isAdded, isLoading]);
	return (
		<button title={`Add Song to "${playlist.name}"`} onClick={onClick} disabled={isLoading || playlist.isAdded}>
			<span>
				<div className="flex justify-between items-center py-1.5 px-2 cursor-pointer rounded bg-white-gray transition-all bg-opacity-0 hover:bg-opacity-5 active:bg-opacity-10">
					<p className="text-white-gray overflow-hidden text-nowrap whitespace-nowrap text-ellipsis text-sm">{playlist.name}</p>
					<Icon />
				</div>
			</span>
		</button>
	);
}
