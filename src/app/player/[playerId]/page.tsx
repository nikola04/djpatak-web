'use client';
import { dislikeTrack, formatDuration, likeTrack, playTrackByQueueId, removeTrackByQueueId, useCurrentTrack, usePlayerQueue } from '@/utils/tracks';
import { socketEventHandler, useSockets } from '@/utils/sockets';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import * as audioWaveData from './lottie-audiwave.json';
import { TfiTrash } from 'react-icons/tfi';
import { FaPlay } from 'react-icons/fa';
import { useAlert } from '@/components/providers/Alert';
import { resume } from '@/utils/controlls';
import { AnimationItem } from 'lottie-web';
import { SmallIconButton } from '@/components/Buttons';
import { FaHeart, FaRegHeart } from 'react-icons/fa6';
import { DotSeparator } from '@/components/library/TracksList';
import AddToPlaylistMenu from '@/components/AddToPlaylistMenu';
import { useUserPlaylists } from '@/utils/user';
import { Playlist } from '../../../../types/user';
import { DbTrack, QueueTrack } from '../../../../types/tracks';

export default function Home({
	params: { playerId },
}: {
	params: {
		playerId: string;
	};
}) {
	const { data: track, setData: setTrack, status, setStatus, loading: trackLoading } = useCurrentTrack(playerId);
	const { data: queue, setData: setQueue, loading: queueLoading } = usePlayerQueue(playerId);
	const { sortedPlaylists, setPlaylists } = useUserPlaylists();
	const { socket, ready } = useSockets();
	const { pushAlert } = useAlert();
	useEffect(() => {
		if (!ready) return;
		const handler = new socketEventHandler(socket, playerId);
		handler.subscribe('now-playing', (track: QueueTrack) => {
			setTrack(track);
			setStatus('playing');
		});
		handler.subscribe('new-queue-songs', (tracks: QueueTrack[]) => setQueue((prev) => [...prev, ...tracks]));
		handler.subscribe('remove-queue-song', (queueId: string) => setQueue((prev) => prev.filter((t) => t.queueId != queueId)));
		handler.subscribe('clear-queue', () => setQueue([]));
		handler.subscribe('queue-end', () => {
			setTrack(null);
			setStatus('paused');
		});
		handler.subscribe('pause', () => setStatus('paused'));
		handler.subscribe('resume', () => setStatus('playing'));
		return () => handler.destroy();
	}, [ready, socket, playerId]);
	const playTrack = async (track: QueueTrack) => {
		try {
			await playTrackByQueueId(playerId, track.queueId);
			setTrack(track);
		} catch (err) {
			pushAlert(String(err));
			console.error(err);
		}
	};
	const resumeTrack = async () => {
		try {
			await resume(playerId);
			setStatus('playing');
		} catch (err) {
			pushAlert(String(err));
			console.error(err);
		}
	};
	const deleteTrack = async (track: QueueTrack) => {
		try {
			await removeTrackByQueueId(playerId, track.queueId);
			setQueue((queue) => queue.filter((queueTrack) => queueTrack.queueId !== track.queueId));
			pushAlert('Track is removed from Queue', false);
		} catch (err) {
			pushAlert(String(err));
			console.error(err);
		}
	};
	const onTrackLike = async (track: DbTrack) => {
		try {
			await likeTrack(track.providerTrackId, track.providerId);
			track.isLiked = true;
			return;
		} catch (err) {
			pushAlert(String(err));
			console.error(err);
		}
	};
	const onTrackDislike = async (track: DbTrack) => {
		try {
			await dislikeTrack(track.providerTrackId, track.providerId);
			track.isLiked = false;
			return;
		} catch (err) {
			pushAlert(String(err));
			console.error(err);
		}
	};
	return (
		<div
			className="flex w-full flex-col items-center lg:items-start lg:flex-row px-3 py-5 gap-5 xl:gap-10"
			style={{ gridTemplateColumns: 'auto 1fr' }}
		>
			<TrackHeader
				playlists={sortedPlaylists}
				setPlaylists={setPlaylists}
				loading={trackLoading}
				track={track}
				onTrackLike={onTrackLike}
				onTrackDislike={onTrackDislike}
			/>
			<div className="w-full lg:w-auto flex-col p-2 flex-grow">
				{!queueLoading && queue.length == 0 ? (
					<div>
						<p className="text-black-default dark:text-white-default">No tracks. You should start searching.</p>
					</div>
				) : (
					<PlayerQueue
						status={status}
						queue={queue}
						playlists={sortedPlaylists}
						onResume={resumeTrack}
						onPlay={playTrack}
						onDelete={deleteTrack}
						currentTrack={track}
						loading={queueLoading}
					/>
				)}
			</div>
		</div>
	);
}

function PlayerQueue({
	queue,
	playlists,
	status,
	onPlay,
	onResume,
	onDelete,
	loading,
	currentTrack,
}: {
	queue: QueueTrack[];
	playlists: Playlist[];
	status: 'playing' | 'paused';
	onPlay: (track: QueueTrack) => void;
	onResume: () => void;
	onDelete: (track: QueueTrack) => void;
	loading: boolean;
	currentTrack: QueueTrack | null;
}) {
	if (loading) return [...new Array(10)].map((val, ind) => <PlayerQueueTrackSceleton key={ind} />);
	return queue.map((track, ind) => (
		<PlayerQueueTrack
			playlists={playlists}
			isPaused={status === 'paused'}
			track={track}
			key={track.queueId}
			onResume={() => onResume()}
			onPlay={() => onPlay(track)}
			onDelete={() => onDelete(track)}
			current={track.queueId == currentTrack?.queueId}
		/>
	));
}
function PlayerQueueTrackSceleton() {
	return (
		<div className="flex w-full p-2 my-0.5">
			<div
				className="relative rounded overflow-hidden bg-white-dark dark:bg-blue-grayish animate-pulse"
				style={{ width: '48px', height: '48px' }}
			></div>
			<div className="flex flex-col pl-2.5 justify-around" style={{ height: '48px' }}>
				<div className="h-4 w-96 bg-white-dark dark:bg-blue-grayish animate-pulse"></div>
				<div className="flex text-sm gap-2">
					<div className="h-3 w-28 bg-white-dark dark:bg-blue-grayish animate-pulse"></div>
					<div className="h-3 w-10 bg-white-dark dark:bg-blue-grayish animate-pulse"></div>
				</div>
			</div>
		</div>
	);
}

function PlayerQueueTrack({
	track,
	playlists,
	isPaused,
	onPlay,
	onResume,
	onDelete,
	current,
}: {
	track: QueueTrack;
	playlists: Playlist[];
	isPaused: boolean;
	onPlay: () => void;
	onDelete: () => void;
	onResume: () => void;
	current: boolean;
}) {
	const soundwaveBox = useRef(null);
	const lottie = useRef<AnimationItem | null>(null);
	useEffect(() => {
		let stop = false;
		async function getLottie() {
			const importedLottie = await import('lottie-web');
			if (stop) return;
			lottie.current = importedLottie.default.loadAnimation({
				autoplay: true,
				loop: true,
				animationData: audioWaveData,
				container: soundwaveBox.current!,
			});
			lottie.current.setSpeed(0.85);
		}
		getLottie();
		return () => {
			if (lottie.current) lottie.current.destroy();
			else stop = true;
		};
	}, []);
	return (
		<div
			className={`group flex justify-between w-full p-2 my-0.5 rounded-lg transition-all ${!current ? 'hover:bg-white-hover dark:hover:bg-blue-grayish dark:hover:shadow-lg' : 'bg-blue-light bg-opacity-15'}`}
		>
			<div className="flex w-full">
				<div
					onClick={() => (isPaused && current ? onResume() : onPlay())}
					className="relative rounded overflow-hidden bg-black-light select-none cursor-pointer flex-shrink-0"
					style={{ width: '48px', height: '48px', flexBasis: '48px' }}
				>
					{track.data.thumbnail && (
						<img
							width={48}
							height={48}
							src={track.data.thumbnail}
							className={`rounded transition-all duration-200" alt="Track Thumbnail ${!current ? 'group-hover:opacity-65' : 'opacity-65'}`}
						/>
					)}
					<div
						className={`absolute z-10 top-0 left-0 w-full h-full flex items-center justify-center transition-all duration-200 ${!current && 'opacity-0 group-hover:opacity-90'}`}
					>
						<div className="flex bg-blue-light rounded-full w-10/12 aspect-square items-center justify-center">
							{(!current || isPaused) && <FaPlay className="text-white-default text-lg ml-1" />}
							<div className={`p-0.5 pl-1 hidden ${current && !isPaused && '!block'}`} ref={soundwaveBox}></div>
						</div>
					</div>
				</div>
				<div className="flex flex-col pl-2.5 justify-around w-[280] flex-grow flex-shrink" style={{ flexBasis: '280px' }}>
					<p
						title={track.data.title}
						className="text-black-light dark:text-white-gray text-base font-bold text-nowrap whitespace-nowrap text-ellipsis overflow-hidden"
					>
						{track.data.title}
					</p>
					<div className="flex text-sm items-center text-black-light dark:text-white-gray gap-1">
						{track.authors.map((author, ind) => (
							<span key={ind}>
								<a
									title={author.username}
									href={author.permalink}
									target="_blank"
									className="text-ellipsis text-nowrap overflow-hidden hover:underline leading-3 text-sm"
								>
									{author.username}
								</a>
								{ind != track.authors.length - 1 && ', '}
							</span>
						))}
						<DotSeparator />
						<p className="">{formatDuration(Math.ceil(track.data.durationInSec))}</p>
					</div>
				</div>
				<div className="flex items-center justify-center">
					<SmallIconButton title="Remove Song" onClick={onDelete} icon={<TfiTrash className="text-lg" />} />
				</div>
			</div>
		</div>
	);
}

function TrackHeader({
	track,
	playlists,
	setPlaylists,
	onTrackLike,
	onTrackDislike,
	loading,
}: {
	track: QueueTrack | null;
	playlists: Playlist[];
	setPlaylists: Dispatch<SetStateAction<Playlist[]>>;
	onTrackLike: (track: DbTrack) => any;
	onTrackDislike: (track: DbTrack) => any;
	loading: boolean;
}) {
	const likeTrackClick = async () => {
		if (!track) return;
		if (track.isLiked) {
			onTrackDislike(track);
			return (track.isLiked = false);
		}
		onTrackLike(track);
		track.isLiked = true;
	};
	if (loading) return <TrackHeaderSceleton />;
	if (!track) return null;
	if (track.data.thumbnail) track.data.thumbnail = track.data.thumbnail.replace('-large', '-t500x500');
	return (
		<div className="relative lg:sticky lg:top-0 p-2 w-full lg:max-w-64 xl:max-w-80 max-w-80 flex flex-col">
			<div className="relative flex-shrink-0 w-full overflow-hidden rounded-xl hover:shadow-xl transition-all duration-200 bg-black-light">
				{track.data.thumbnail ? (
					<img src={track.data.thumbnail} alt="Track Banner" className="min-w-full aspect-square" />
				) : (
					<div className="min-w-full aspect-square"></div>
				)}
				<div
					className="absolute bottom-0 w-full px-2 py-1 flex items-center justify-end min-h-[40px]"
					style={{
						WebkitBoxShadow: 'inset 0px -40px 40px -40px rgba(19,19,25,1)',
						MozBoxShadow: 'inset 0px -40px 40px -40px rgba(19,19,25,1)',
						boxShadow: 'inset 0px -40px 40px -40px rgba(19,19,25,1)',
					}}
				></div>
			</div>
			<div className="w-full flex gap-1 justify-center items-center pt-2 pb-1">
				<AddToPlaylistMenu playlists={playlists} setPlaylists={setPlaylists} track={track} />
				<SmallIconButton
					className="w-11 h-11"
					title={track.isLiked ? 'Dislike Song' : 'Like Song'}
					icon={<FaRegHeart className="text-black-default dark:text-white-default text-2xl" style={{ fontSize: '1.375rem' }} />}
					activeIcon={<FaHeart className="text-2xl text-blue-light" />}
					onClick={likeTrackClick}
					isActive={track.isLiked}
				/>
			</div>
			<div className="px-1">
				<p
					title={track.data.title}
					className="text-black-default dark:text-white-default font-bold text-center text-nowrap text-ellipsis overflow-hidden text-lg"
				>
					{track.data.title}
				</p>
				<p className="text-black-light dark:text-white-gray text-center text-sm py-1">
					{track.authors.map((author, ind) => (
						<span key={author.permalink}>
							<a title={author.username} href={author.permalink} target="_blank">
								{author.username}
							</a>
							{ind != track.authors.length - 1 && ', '}
						</span>
					))}
				</p>
			</div>
		</div>
	);
}

function TrackHeaderSceleton() {
	return (
		<div className="p-2 w-80">
			<div className="w-full overflow-hidden aspect-square bg-white-dark dark:bg-blue-grayish animate-pulse"></div>
			<div className="px-1 py-5 flex flex-col items-center justify-center">
				<div className="bg-white-dark dark:bg-blue-grayish animate-pulse w-64 h-4"></div>
				<div className="bg-white-dark dark:bg-blue-grayish animate-pulse w-32 h-3 my-3.5"></div>
			</div>
		</div>
	);
}
