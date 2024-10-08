'use client';
import { useAlert } from '@/components/providers/Alert';
import { SmallIconButton } from '@/components/Buttons';
import { TracksList } from '@/components/library/TracksList';
import { dislikeTrack, likeTrack, playSoundcloudTrack, useLikedTracks } from '@/utils/tracks';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { DbTrack } from '../../../../../../types/tracks';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { PiQueue } from 'react-icons/pi';
import AddToPlaylistMenu from '@/components/AddToPlaylistMenu';
import { useUserPlaylists } from '@/utils/user';
import { Playlist } from '../../../../../../types/user';
import { PageHeader } from '@/components/library/PageHeader';

export default function LikedPage({
	params: { playerId },
}: {
	params: {
		playerId: string;
	};
}) {
	const { data: tracks, setData: setTracks, loading: tracksloading } = useLikedTracks();
	const { sortedPlaylists, setPlaylists, loading: playlistsLoading } = useUserPlaylists();
	const memoizedButtons = useCallback(
		({ track }: { track: DbTrack }) => (
			<LikedTrackButtons guildId={playerId} playlists={sortedPlaylists} setPlaylists={setPlaylists} track={track} />
		),
		[playerId, setPlaylists, sortedPlaylists]
	);
	return (
		<div className="flex w-full flex-col px-3 py-5">
			<PageHeader title="Liked Tracks" path={['Liked']} />
			<div className="w-full lg:w-auto flex-col p-2 flex-grow">
				{!tracksloading && tracks.length == 0 ? (
					<div>
						<p className="text-white-default">No liked tracks. You should start searching!</p>
					</div>
				) : (
					<TracksList guildId={playerId} tracks={tracks} loading={tracksloading} Buttons={memoizedButtons} />
				)}
			</div>
		</div>
	);
}

function LikedTrackButtons({
	guildId,
	track,
	playlists,
	setPlaylists,
}: {
	guildId: string;
	track: DbTrack;
	playlists: Playlist[];
	setPlaylists: Dispatch<SetStateAction<Playlist[]>>;
}) {
	const { pushAlert } = useAlert();
	const [isLiked, setIsLiked] = useState<boolean>(true);
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
			<AddToPlaylistMenu playlists={playlists} setPlaylists={setPlaylists} track={track} />
		</>
	);
}
