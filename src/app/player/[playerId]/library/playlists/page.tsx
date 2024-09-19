'use client';
import { FaPlay, FaPlus } from 'react-icons/fa6';
import { createNewPlaylist, playPlaylist, useUserPlaylists } from '@/utils/user';
import { PlaylistPopupContent, usePopup } from '@/components/providers/Popup';
import { PrimaryButton, SmallIconButton } from '@/components/Buttons';
import { useAlert } from '@/components/providers/Alert';
import { Playlist as PlaylistType } from '@/../types/user';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/library/PageHeader';
import { useCallback } from 'react';

export default function PlaylistsPage({
	params: { playerId },
}: {
	params: {
		playerId: string;
	};
}) {
	const { playlists, sortedPlaylists, setPlaylists, loading: playlistsLoading } = useUserPlaylists();
	const { setPopup, showPopup, hidePopup } = usePopup();
	const { pushAlert } = useAlert();
	const createPlaylist = async (playlistName: string, playlistDescription: string, onCreatedCallback: (err: boolean) => any) => {
		try {
			const playlist = await createNewPlaylist(playlistName, playlistDescription);
			if (!playlist) throw 'No Playlist Data. Try Reloading.';
			setPlaylists((prev) => [...prev, playlist]);
			onCreatedCallback(false);
			pushAlert('Playlist created', false);
		} catch (err) {
			console.log(err);
			onCreatedCallback(true);
			pushAlert(String(err));
		}
	};
	const openCreateNewPlaylists = () => {
		setPopup(<PlaylistPopupContent onClose={hidePopup} submit={createPlaylist} submitType="create" />);
		showPopup();
	};
	const memoizedHeaderButtons = useCallback(() => <PageHeaderButtons openCreateNewPlaylists={openCreateNewPlaylists} />, []);
	return (
		<div className="flex flex-col w-full px-3 pr-4 py-5">
			<PageHeader path={['Playlists']} title="My Playlists" Buttons={memoizedHeaderButtons} />
			<div className="w-full">
				{!playlistsLoading && playlists.length == 0 ? (
					<div className="py-4">
						<p className="text-black-light dark:text-white-gray">No playlists. You can create one now.</p>
					</div>
				) : (
					<div className="grid gap-4 py-4 mr-2" style={{ gridTemplateColumns: 'repeat(auto-fit, 12rem)' }}>
						{playlistsLoading
							? [...new Array(7)].map((_, ind) => <PlaylistSceleton key={ind} />)
							: sortedPlaylists.map((playlist) => <Playlist key={playlist._id} playerId={playerId} playlist={playlist} />)}
					</div>
				)}
			</div>
		</div>
	);
}

const PageHeaderButtons = ({ openCreateNewPlaylists }: { openCreateNewPlaylists: () => any }) => {
	return <PrimaryButton onClick={openCreateNewPlaylists} value="Create Playlist" icon={<FaPlus />} />;
};

const Playlist = ({ playerId, playlist }: { playerId: string; playlist: PlaylistType }) => {
	const router = useRouter();
	const { pushAlert } = useAlert();
	const onPlay = async () => {
		try {
			await playPlaylist(playerId, playlist._id);
			pushAlert('Playlist tracks are added to Queue', false);
		} catch (err) {
			pushAlert(String(err));
		}
	};
	const onClick = () => router.push(`playlists/${playlist._id}`);
	return (
		<div className="flex flex-col group">
			<div className="flex flex-col justify-end w-full aspect-square bg-white-default dark:bg-blue-grayish rounded transition-colors duration-150">
				<div className="flex flex-grow cursor-pointer" onClick={onClick}></div>
				<div className="flex flex-shrink-0 items-center w-full opacity-0 group-hover:opacity-100 transition-opacity duration-150">
					<SmallIconButton
						className="w-12 h-12 bg-white-hover flex-shrink-0 ml-1 mb-1"
						title={'Play All'}
						onClick={onPlay}
						icon={<FaPlay className="text-xl ml-0.5" />}
					/>
					<div onClick={onClick} className="cursor-pointer h-full w-full"></div>
				</div>
			</div>
			<p
				title={playlist.name}
				onClick={onClick}
				className="text-black-default dark:text-white-default py-1 w-full text-nowrap overflow-hidden whitespace-nowrap text-ellipsis font-light"
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
