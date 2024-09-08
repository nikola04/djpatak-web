'use client';
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import NavProfileMenu from './ProfileMenu';
import DiscordButton from '../discord/DiscordSignIn';
import { useRouter, useSearchParams } from 'next/navigation';
import apiRequest, { ResponseDataType } from '@/utils/apiRequest';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../providers/Auth';
import { getUserSearchHistory, userSignOut } from '@/utils/user';
import { useAlert } from '../providers/Alert';
import { UserSearchHistory } from '../../../types/user';
import { FaHistory } from 'react-icons/fa';
import { IoIosClose } from 'react-icons/io';
import { isParentOf } from '@/utils/frontend';

export type ProfileLink = {
	name: string;
	href: string;
	func: (() => void) | null;
	chevron: boolean;
};

export default function Nav({
	guildId,
}: Readonly<{
	guildId: string | null;
}>) {
	const router = useRouter();
	const { pushAlert } = useAlert();
	const { logout } = useAuth();

	const signOut = async () => {
		try {
			await userSignOut();
			logout();
			router.push('/?logout=1');
		} catch (err) {
			pushAlert(String(err));
		}
	};

	const profileLinks: ProfileLink[] = [
		{
			name: 'Settings',
			href: '/account/settings',
			func: null,
			chevron: true,
		},
		{
			name: 'Logout',
			href: '/account/logout',
			func: signOut,
			chevron: false,
		},
	];

	return (
		<nav className="px-4 flex justify-between items-center" style={{ height: '64px' }}>
			{guildId ? <TrackSearch guildId={guildId} /> : <div></div>}
			<div className="flex items-center">
				<ProfileMenu profileLinks={profileLinks} />
			</div>
		</nav>
	);
}

function TrackSearch({ guildId }: { guildId: string }) {
	const [isAutocompleteVisible, setAutocompleteVisibility] = useState<boolean>(false);
	const [searchHistory, setSearchHistory] = useState<UserSearchHistory[]>([]);
	const searchParams = useSearchParams();
	const { pushAlert } = useAlert();
	const router = useRouter();
	const query = searchParams.get('query');
	const [inputVal, setInputVal] = useState(query ?? '');
	const searchInputRef = useRef<HTMLInputElement>(null);
	const autocompleteRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (!isAutocompleteVisible) return;
		fetchHistory();
		function handleClick(event: Event) {
			if (
				event.target instanceof HTMLElement &&
				!isParentOf(searchInputRef.current, event.target) &&
				!isParentOf(autocompleteRef.current, event.target)
			) {
				setAutocompleteVisibility(false);
			}
		}
		function handleKeyPress(e: KeyboardEvent) {
			if (!isAutocompleteVisible) return;
			if (e.key === 'ArrowDown') {
				console.log('down');
			} else if (e.key === 'ArrowUp') {
				console.log('up');
			}
		}
		window.addEventListener('click', handleClick);
		window.addEventListener('keydown', handleKeyPress);
		return () => {
			window.removeEventListener('click', handleClick);
			window.removeEventListener('keydown', handleKeyPress);
		};
	}, [isAutocompleteVisible]);
	const fetchHistory = async () => {
		try {
			const history = await getUserSearchHistory();
			setSearchHistory(history);
		} catch (err) {
			console.error(err);
			pushAlert(String(err));
		}
	};
	useEffect(() => {
		fetchHistory();
	}, []);
	const searchSubmit = useCallback(
		async (e?: FormEvent) => {
			if (e) {
				e.preventDefault();
				e.stopPropagation();
			}
			const searchVal = inputVal.trim();
			if (searchVal.length < 2) return;
			router.push(`/player/${guildId}/search?query=${encodeURIComponent(searchVal)}`);
			setAutocompleteVisibility(false);
			searchInputRef.current?.blur();
		},
		[guildId, inputVal, router]
	);
	const searchFromHistory = useCallback(
		(val: string) => {
			router.push(`/player/${guildId}/search?query=${encodeURIComponent(val)}`);
			setInputVal(val);
			setAutocompleteVisibility(false);
			searchInputRef.current?.blur();
		},
		[guildId, router]
	);
	useEffect(() => {
		if (searchInputRef.current === document.activeElement && !isAutocompleteVisible) setAutocompleteVisibility(true);
	}, [inputVal.length, isAutocompleteVisible]);
	const filteredSearchHistory = useMemo(() => {
		const searchQuery = inputVal.toLowerCase().trim();
		const filtered = searchHistory.filter((s) => s.search.toLowerCase().includes(searchQuery));
		const sorted = filtered.sort((a, b) => {
			const aStarts = a.search.toLowerCase().startsWith(searchQuery);
			const bStarts = b.search.toLowerCase().startsWith(searchQuery);
			if (bStarts && !aStarts) return 1;
			if (aStarts && !bStarts) return -1;
			if (aStarts && a.search.toLowerCase() == searchQuery) return -1;
			if (bStarts && b.search.toLowerCase() == searchQuery) return 1;
			return new Date(b.searchedAt).getTime() - new Date(a.searchedAt).getTime();
		});
		return sorted.slice(0, 7);
	}, [inputVal, searchHistory]);
	function removeSearch(id: string) {
		console.log(id);
	}
	return (
		<form onSubmit={(e) => searchSubmit(e)} className="relative w-80 my-2">
			<div className="relative w-full flex items-center">
				<input
					ref={searchInputRef}
					onFocus={() => filteredSearchHistory.length > 0 && setAutocompleteVisibility(true)}
					onInput={(e) => setInputVal((e.target as HTMLInputElement).value)}
					value={inputVal}
					placeholder="Search..."
					type="text"
					name="query"
					style={{ height: '42px' }}
					autoComplete="off"
					className="w-full px-3 pr-[38px] border border-transparent outline-0 items-center text-white-gray text-sm bg-blue-dark rounded-md focus:border-blue-light hover:border-blue-light transition-all duration-200"
				/>
				<button title="Search" type="submit" className="z-10 absolute right-[8px]">
					<svg
						style={{ filter: 'drop-shadow(0 0 1px #111)' }}
						stroke="currentColor"
						fill="currentColor"
						strokeWidth="0"
						viewBox="0 0 24 24"
						className="text-white-gray text-2xl"
						height="1em"
						width="1em"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"></path>
					</svg>
				</button>
			</div>
			<div ref={autocompleteRef} className="absolute w-full bg-blue-dark z-30 rounded-md top-full mt-1 overflow-hidden">
				{isAutocompleteVisible &&
					filteredSearchHistory.map((search) => (
						<UserSearch key={search._id} data={search} onRemove={removeSearch} onClick={() => searchFromHistory(search.search)} />
					))}
			</div>
		</form>
	);
}

function UserSearch({ data, onClick, onRemove }: { data: UserSearchHistory; onClick: () => any; onRemove: (id: string) => any }) {
	const [isRemoved, setIsRemoved] = useState<boolean>(false);
	const removeSearch = () => {
		setIsRemoved(true);
		onRemove(data._id);
	};
	if (isRemoved)
		return (
			<div className="py-2.5 px-4">
				<p className="text-white-gray text-sm">Search is removed from history.</p>
			</div>
		);
	return (
		<div className="flex items-center cursor-pointer bg-white-default bg-opacity-0 hover:bg-opacity-5 transition-all">
			<div onClick={onClick} className="flex items-center flex-grow p-2 gap-2">
				<div className="flex items-center flex-shrink-0 flex-grow-0 px-1">
					<FaHistory className="text-white-default pt-0.5" />
				</div>
				<p className="text-white-default flex-grow">{data.search}</p>
			</div>
			<div onClick={removeSearch} className="flex items-center flex-shrink-0 flex-grow-0">
				<button className="p-2 pl-1" type="button">
					<IoIosClose className="text-white-default text-2xl" />
				</button>
			</div>
		</div>
	);
}

export function NavLogo() {
	return (
		<div className="flex w-full h-full items-center justify-center px-4">
			<Link href="/" title="Home">
				<span>
					<div className="flex items-center">
						<Image src={'/logo-text.png'} alt="DjPatak" width={144} height={36} />
					</div>
				</span>
			</Link>
		</div>
	);
}

function ProfileMenu({ profileLinks }: { profileLinks: ProfileLink[] }) {
	const { user, loading } = useAuth();
	if (loading) return <ProfileSceleton />;
	if (user) return <NavProfileMenu user={user} profileLinks={profileLinks} />;
	return <DiscordButton onClick={() => window.open(process.env.NEXT_PUBLIC_DISCORD_LOGIN_URL)} />;
}

function ProfileSceleton() {
	return (
		<div className="px-2">
			<div className="animate-pulse rounded-full w-9 h-9 bg-black-light"></div>
		</div>
	);
}
