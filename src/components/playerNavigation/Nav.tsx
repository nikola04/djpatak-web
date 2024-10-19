'use client';
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import NavProfileMenu from './ProfileMenu';
import DiscordButton from '../discord/DiscordSignIn';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../providers/Auth';
import { getUserSearchHistory, removeUserSearchHistory, userSignOut } from '@/utils/user';
import { useAlert } from '../providers/Alert';
import { UserSearchHistory } from '../../../types/user';
import { FaHistory } from 'react-icons/fa';
import { IoIosClose } from 'react-icons/io';
import { isParentOf } from '@/utils/frontend';
import { IconType } from 'react-icons';
import { LuLamp } from 'react-icons/lu';
import { PiGear } from 'react-icons/pi';
import { FiLogOut } from 'react-icons/fi';
import { HiOutlineServerStack } from 'react-icons/hi2';
import { useTheme } from '../providers/Theme';
import HelpMenu from './HelpMenu';

interface BaseLinkType {
	name: string;
	href?: string;
	icon: IconType;
}
interface MenuLinkType extends BaseLinkType {
	type: 'menu' | 'none';
	func: ((...args: any[]) => any) | null;
	switchState?: never;
}
interface SwitchLinkType extends BaseLinkType {
	type: 'switch';
	func: (...args: any[]) => any;
	switchState: boolean;
}
export type LinkType = MenuLinkType | SwitchLinkType;

const logoutLinks: LinkType[] = [
	{
		name: 'Logout',
		href: '/account/logout',
		func: () => {},
		icon: FiLogOut,
		type: 'none',
	},
];
const accountLinks: LinkType[] = [
	{
		name: 'Account Settings',
		href: '/account/settings',
		func: null,
		icon: PiGear,
		type: 'none',
	},
	{
		name: 'Select Server',
		href: '/player/select-server/',
		func: null,
		icon: HiOutlineServerStack,
		type: 'none',
	},
	{
		name: 'Dark Mode',
		func: (state: boolean) => {},
		icon: LuLamp,
		type: 'switch',
		switchState: false,
	},
];

export default function Nav({
	guildId,
}: Readonly<{
	guildId: string | null;
}>) {
	const { isDarkTheme, setDarkTheme } = useTheme();
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
	const switchTheme = () => {
		setDarkTheme((prev) => !prev); // Turned off for now
	};
	const logoutLink = logoutLinks.find((link) => link.name == 'Logout');
	const themeSwitcher = accountLinks.find((link) => link.name == 'Dark Mode');
	if (logoutLink) logoutLink.func = signOut;
	if (themeSwitcher) {
		themeSwitcher.func = switchTheme;
		themeSwitcher.switchState = isDarkTheme;
	}

	return (
		<nav className="pr-4 flex justify-between items-center" style={{ height: '64px' }}>
			{guildId ? <TrackSearch isDarkTheme={isDarkTheme} guildId={guildId} /> : <div></div>}
			<div className="flex items-center">
				<HelpMenu/>
				<ProfileMenu profileLinks={[accountLinks, logoutLinks]} />
			</div>
		</nav>
	);
}

function TrackSearch({ guildId, isDarkTheme }: { guildId: string; isDarkTheme: boolean }) {
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
		const filtered = searchHistory.filter((s) => !s.deleted && s.search.toLowerCase().includes(searchQuery));
		return filtered;
	}, [inputVal]);
	const filteredSortedSearchHistory = useMemo(() => {
		const searchQuery = inputVal.toLowerCase().trim();
		const sorted = filteredSearchHistory.sort((a, b) => {
			const aStarts = a.search.toLowerCase().startsWith(searchQuery);
			const bStarts = b.search.toLowerCase().startsWith(searchQuery);
			if (bStarts && !aStarts) return 1;
			if (aStarts && !bStarts) return -1;
			if (aStarts && a.search.toLowerCase() == searchQuery) return -1;
			if (bStarts && b.search.toLowerCase() == searchQuery) return 1;
			return new Date(b.searchedAt).getTime() - new Date(a.searchedAt).getTime();
		});
		return sorted.slice(0, 7);
	}, [filteredSearchHistory]);
	async function removeSearch(id: string) {
		try {
			await removeUserSearchHistory(id);
			setSearchHistory((prev) =>
				prev.map((sh) => {
					if (sh._id == id) sh.deleted = true;
					return sh;
				})
			);
		} catch (err) {
			pushAlert(String(err));
		}
	}
	return (
		<form onSubmit={(e) => searchSubmit(e)} className="relative w-80 my-2">
			<div className="relative w-full flex items-center">
				<input
					ref={searchInputRef}
					onFocus={() => filteredSortedSearchHistory.length > 0 && setAutocompleteVisibility(true)}
					onInput={(e) => setInputVal((e.target as HTMLInputElement).value)}
					value={inputVal}
					placeholder="Search..."
					type="text"
					name="query"
					style={{ height: '42px' }}
					autoComplete="off"
					className={`w-full px-3.5 pr-[38px] border border-transparent outline-0 items-center text-sm rounded-xl focus:border-blue-light hover:border-blue-light transition-all duration-200 ${isDarkTheme ? 'bg-blue-dark text-white-gray' : 'bg-white-dark text-black'}`}
				/>
				<button title="Search" type="submit" className="z-10 absolute right-[10px]">
					<svg
						stroke="currentColor"
						fill="currentColor"
						strokeWidth="0"
						viewBox="0 0 24 24"
						className="text-black-light dark:text-white-default text-[22px]"
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
					filteredSortedSearchHistory.map((search) => (
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
		<div className="flex h-full items-center justify-center px-4">
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

function ProfileMenu({ profileLinks }: { profileLinks: LinkType[][] }) {
	const { user, loading } = useAuth();
	if (loading) return <ProfileSceleton />;
	if (user) return <NavProfileMenu user={user} links={profileLinks} />;
	return <DiscordButton onClick={() => window.open(process.env.NEXT_PUBLIC_DISCORD_LOGIN_URL)} />;
}

function ProfileSceleton() {
	return (
		<div className="relative px-2 -mt-1.5">
			<div className="animate-pulse rounded-full w-9 h-9 bg-black-light"></div>
		</div>
	);
}
