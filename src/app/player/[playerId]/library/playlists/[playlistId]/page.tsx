'use client';
import { PrimaryButton, SmallIconButton } from '@/components/Buttons';
import { FaArrowLeft, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { removePlaylistTrack, updatePlaylist, deletePlaylist as deleteUserPlaylist, useUserPlaylist, useUserPlaylistTracks } from '@/utils/user';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { MdCreate } from 'react-icons/md';
import { Playlist } from '@/../types/user';
import { PlaylistPopupContent, usePopup } from '@/components/providers/Popup';
import { TracksList } from '@/components/library/TracksList';
import { DbTrack } from '@/../types/tracks';
import { useAlert } from '@/components/providers/Alert';
import { dislikeTrack, likeTrack, playSoundcloudTrack } from '@/utils/tracks';
import { PiQueue } from 'react-icons/pi';
import { PageHeader } from '@/components/library/PageHeader';
import { TfiTrash } from 'react-icons/tfi';

export default function PlaylistPage({
	params: { playerId, playlistId },
}: {
	params: {
		playerId: string;
		playlistId: string;
	};
}) {
	const { data, setData: setPlaylist, loading: playlistsLoading } = useUserPlaylist(playlistId);
	const { data: playlistTracks, setData: setPlaylistTracks, loading: playlistTracksLoading } = useUserPlaylistTracks(playlistId);
	const { setPopup, showPopup, hidePopup } = usePopup();
	const { pushAlert } = useAlert();
	const router = useRouter();
	const goToPlaylists = useCallback(() => router.push(location.href.substring(0, location.href.lastIndexOf('/'))), [router]);
	const editPlaylist = async (playlistName: string, playlistDescription: string, onCreatedCallback: (err: boolean) => any) => {
		try {
			const playlist = await updatePlaylist(playlistId, playlistName, playlistDescription);
			if (!playlist) throw 'No Playlist Data. Try Reloading.';
			setPlaylist(playlist);
			onCreatedCallback(false);
			pushAlert('Playlist updated', false);
		} catch (err) {
			console.log(err);
			onCreatedCallback(true);
			pushAlert(String(err));
		}
	};
	const deletePlaylist = async (callback: (err: boolean) => any) => {
		if (!data) return;
		try {
			await deleteUserPlaylist(data._id);
			callback(false);
			goToPlaylists();
			pushAlert('Playlist is deleted', false);
		} catch (err) {
			callback(true);
			pushAlert(String(err));
		}
	};
	const openEditPlaylist = useCallback(() => {
		if (!data) return;
		setPopup(
			<PlaylistPopupContent
				initialValues={{ name: data.name, desc: data?.description ?? '' }}
				onClose={hidePopup}
				submit={editPlaylist}
				onDletePlaylist={deletePlaylist}
				submitType="edit"
			/>
		);
		showPopup();
	}, [data]);
	const onRemovePlaylistTrack = (track: DbTrack) =>
		setPlaylistTracks((prev) => prev.filter((t) => t.providerTrackId != track.providerTrackId || t.providerId != track.providerId));
	const memoizedButtons = useCallback(
		({ track }: { track: DbTrack }) => (
			<PlaylistTrackButtons guildId={playerId} playlist={data} track={track} onTrackDelete={() => onRemovePlaylistTrack(track)} />
		),
		[data, playerId]
	);
	const memoizedHeaderButtons = useCallback(() => <PageHeaderButtons openEditPlaylist={openEditPlaylist} />, [openEditPlaylist]);
	useEffect(() => {
		if (!playlistsLoading && !data) goToPlaylists();
	}, [data, goToPlaylists, playlistsLoading]);
	if (playlistsLoading) return <PlaylistPageSceleton />;
	return (
		<div className="flex flex-col w-full px-3 pr-4 py-5">
			{data && (
				<PageHeader path={['Playlists', data.name]} title={data.name} folder={false} Buttons={memoizedHeaderButtons} goBack={goToPlaylists} />
			)}
			<div className="w-full px-2 py-4">{data && <PlaylistHeader playlist={data} />}</div>
			<div className="w-full px-2">
				<TracksList guildId={playerId} tracks={playlistTracks} loading={playlistTracksLoading} Buttons={memoizedButtons} />
			</div>
		</div>
	);
}

function PageHeaderButtons({ openEditPlaylist }: { openEditPlaylist: () => any }) {
	return <PrimaryButton value="Edit" onClick={openEditPlaylist} icon={<MdCreate className="text-lg" />} />;
}

function PlaylistTrackButtons({
	guildId,
	playlist,
	track,
	onTrackDelete,
}: {
	guildId: string;
	playlist: Playlist | null;
	track: DbTrack;
	onTrackDelete: () => any;
}) {
	const { pushAlert } = useAlert();
	const [isLiked, setIsLiked] = useState<boolean>(false);
	const removeTrackClick = async () => {
		if (!playlist) return pushAlert('No Playlist data');
		try {
			await removePlaylistTrack(playlist._id, track.providerId, track.providerTrackId);
			onTrackDelete();
			pushAlert('Track is removed from Playlist', false);
		} catch (err) {
			pushAlert(String(err));
		}
	};
	const onTrackLike = async () => {
		try {
			await likeTrack(track.providerTrackId, 'soundcloud');
			return;
		} catch (err) {
			pushAlert(String(err));
		}
	};
	const onTrackDislike = async () => {
		try {
			await dislikeTrack(track.providerTrackId, 'soundcloud');
			return;
		} catch (err) {
			pushAlert(String(err));
		}
	};
	const likeTrackClick = async () => {
		if (!track) return;
		if (isLiked) {
			onTrackDislike();
			return setIsLiked(false);
		}
		onTrackLike();
		setIsLiked(true);
	};
	const addToQueueClick = async () => {
		try {
			await playSoundcloudTrack(guildId, track.providerTrackId, false);
			pushAlert('Track is added to Queue', false);
		} catch (err) {
			pushAlert(String(err));
		}
	};
	return (
		<>
			<SmallIconButton
				title="Like Song"
				icon={<FaRegHeart className="text-black-default dark:text-white-default text-xl" />}
				activeIcon={<FaHeart className="text-xl text-blue-light" />}
				onClick={likeTrackClick}
				isActive={isLiked}
			/>
			<SmallIconButton
				title="Add to Queue"
				icon={<PiQueue className="text-black-default dark:text-white-default text-xl" />}
				onClick={addToQueueClick}
			/>
			<SmallIconButton
				title="Remove Song"
				icon={<TfiTrash className="text-black-default dark:text-white-default text-xl" />}
				onClick={removeTrackClick}
			/>
		</>
	);
}

const PlaylistHeader = ({ playlist }: { playlist: Playlist }) => {
	return (
		<div>
			<p className="text-black-light dark:text-white-gray">{playlist.description?.length ? playlist.description : 'No description.'}</p>
		</div>
	);
};

const PlaylistPageSceleton = () => (
	<div className="flex flex-col w-full px-3 pr-4 py-5">
		<div className="flex items-center justify-between w-full">
			<div className='p-2'>
				<p className="text-black-default dark:text-white-default opacity-40 text-sm py-0.5">Playlists /</p>
				<div className="flex items-center my-3">
					<div className="px-2 mr-1">
						<div className="h-6 w-6 rounded bg-white-dark dark:bg-blue-grayish animate-pulse"></div>
					</div>
					<div className="h-6 w-64 rounded bg-white-dark dark:bg-blue-grayish animate-pulse"></div>
				</div>
			</div>
			<div className="mr-2 place-self-start">
				<div className="w-[74px] h-[38px] bg-white-dark dark:bg-blue-light rounded animate-pulse"></div>
			</div>
		</div>
		<div className="w-full"></div>
	</div>
);
