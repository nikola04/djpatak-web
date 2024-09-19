'use client';
import Link from 'next/link';
import { PiPlaylistFill } from 'react-icons/pi';
import { IconType } from 'react-icons';
import { BsPlusCircle } from 'react-icons/bs';
import { IoRadioSharp } from 'react-icons/io5';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { DiscordGuild } from '../../../types/discord';
import { useUserGuilds } from '@/utils/user';
import { isParentOf } from '@/utils/frontend';
import { useRouter } from 'next/navigation';
import { FaHeart } from 'react-icons/fa6';
import { GuildIcon } from '../discord/GuildIcon';
import { FaWrench } from 'react-icons/fa';
import { useAlert } from '../providers/Alert';

type LinkType = {
	name: string;
	icon: IconType;
	href: string;
};
export enum MenuGroup {
	GuildSelector = 'guildSelector',
	Library = 'library',
	Player = 'player',
}
const linksGrouped: {
	id: MenuGroup;
	name: string;
	links: LinkType[];
}[] = [
	{
		id: MenuGroup.Player,
		name: 'Server',
		links: [
			{
				name: 'Player',
				icon: IoRadioSharp,
				href: '/player/:id',
			},
			{
				name: 'Customize',
				icon: FaWrench,
				href: '/player/:id/customize',
			},
		],
	},
	{
		id: MenuGroup.Library,
		name: 'My Library',
		links: [
			{
				name: 'Liked',
				icon: FaHeart,
				href: '/player/:id/library/liked',
			},
			{
				name: 'Playlists',
				icon: PiPlaylistFill,
				href: '/player/:id/library/playlists',
			},
		],
	},
];

export default function SideNav({
	guildId,
	allowedMenuGroups,
}: Readonly<{
	guildId: string;
	allowedMenuGroups: string[];
}>) {
	const { data: userGuilds, error: userGuildsError, loading } = useUserGuilds();
	const { pushAlert } = useAlert();
	const router = useRouter();
	useEffect(() => {
		if (!loading) {
			if (userGuildsError) return pushAlert(String(userGuildsError));
			if (!userGuilds.some(({ id }) => id == guildId)) return router.push('/player/select-server');
		}
	}, [loading, userGuilds, userGuildsError]);
	const pathname = usePathname();
	const enabledLinkGroups = linksGrouped.filter((group) => allowedMenuGroups.includes(group.id));
	return (
		<div className="px-3 py-4 md:px-4 flex flex-col">
			{allowedMenuGroups.includes(MenuGroup.GuildSelector) &&
				(loading ? <GuildSelectorSceleton /> : <GuildSelector userGuilds={userGuilds} selectedId={guildId} />)}
			{enabledLinkGroups.map((linkGroup, ind) => (
				<div key={ind} className="p-2 flex flex-col">
					<p className={`uppercase font-bold text-sm py-2 text-black-light dark:text-white-gray`}>{linkGroup.name}</p>
					<div className="flex flex-col py-2">
						{linkGroup.links.map((link, ind) => (
							<NavItem key={ind} guildId={guildId} pathname={pathname} data={link} />
						))}
					</div>
				</div>
			))}
		</div>
	);
}

function GuildSelector({
	userGuilds,
	selectedId,
}: Readonly<{
	userGuilds: DiscordGuild[];
	selectedId: string;
}>) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const profileMenuRef = useRef(null);
	useEffect(() => {
		if (!open) return;
		function handleClick(event: Event) {
			if (event.target instanceof HTMLElement && !isParentOf(profileMenuRef.current, event.target)) {
				setOpen(false);
			}
		}
		window.addEventListener('click', handleClick);
		return () => window.removeEventListener('click', handleClick);
	}, [open]);
	const selectedGuild = userGuilds.find((guild) => guild.id == selectedId);
	userGuilds = userGuilds.filter((guild) => guild.id != selectedId);
	if (selectedGuild == null) return null;

	return (
		<div ref={profileMenuRef} className="m-2 relative">
			<div
				onClick={() => setOpen(!open)}
				className={`relative flex md:w-52 w-48 overflow-hidden border border-transparent items-center rounded-md px-2 py-1.5 cursor-pointer hover:border-blue-light transition-all duration-200 active:ring-blue ring-[2px] ${open ? 'ring-blue' : 'ring-transparent'} dark:bg-blue-dark dark:text-white-gray bg-white-dark text-black-light`}
			>
				<div style={{ padding: '2px' }}>
					<GuildIcon guild={selectedGuild} size={24} />
				</div>
				<p className="px-2 text-base text-nowrap text-ellipsis overflow-hidden" title={selectedGuild.name}>
					{selectedGuild.name}
				</p>
			</div>
			{open && (
				<div className="absolute left-0 p-1.5 mt-2 w-52 rounded-lg z-20 overflow-hidden bg-white-default dark:bg-blue-grayish shadow-md transition-colors duration-150">
					{userGuilds.map((guild: DiscordGuild, ind) => (
						<div
							onClick={() => router.push('/player/' + guild.id)}
							key={ind}
							className="flex w-full items-center top-0 p-1 hover:bg-white-hover active:bg-white-active rounded-md cursor-pointer transition-colors duration-150"
						>
							<div style={{ padding: '2px' }}>
								<GuildIcon guild={guild} className="bg-black-default dark:bg-transparent" size={24} />
							</div>
							<p className="text-black-light dark:text-white-gray px-2 text-base text-nowrap text-ellipsis overflow-hidden">
								{guild.name}
							</p>
						</div>
					))}
					<div className="p-1 border-b border-white-gray dark:border-gray"></div>
					<div className="mt-2 flex w-full items-center top-0 p-1 hover:bg-white-hover active:bg-white-active rounded-md cursor-pointer transition-all">
						<div className="p-1">
							<BsPlusCircle className="w-5 h-5 text-black-light dark:text-white-gray text-sm" />
						</div>
						<p className="text-black-light dark:text-white-gray px-2 text-base text-nowrap text-ellipsis overflow-hidden">Add Server</p>
					</div>
				</div>
			)}
		</div>
	);
}

function GuildSelectorSceleton() {
	return (
		<div className="m-2 flex flex-col">
			<div className="flex items-center dark:bg-blue-dark bg-white-dark rounded-md px-2 py-1.5 w-48 md:w-52 border border-transparent">
				<div style={{ padding: '2px' }}>
					<div
						className="rounded-full dark:bg-black-default bg-white-default animate-pulse"
						style={{ width: '24px', height: '24px' }}
					></div>
				</div>
				<div className="w-full dark:bg-black-default bg-white-default animate-pulse rounded-md h-2 ml-2"></div>
			</div>
		</div>
	);
}

function NavItem({ data, guildId, pathname }: { data: LinkType; guildId: string; pathname: string }) {
	const isActive = (href: string) => href == pathname;
	let url: string | null = data.href;
	if (data.href.includes('/player/:id')) {
		if (!guildId) url = null;
		url = data.href.replace('/player/:id', `/player/${guildId}`);
	}
	const Icon = data.icon;
	return (
		<Link
			title={data.name}
			href={url}
			className={`my-0.5 py-1.5 rounded-md min-w-40 px-2 text-black-light dark:text-white-default ${!isActive(url) && 'hover:bg-white-hover dark:hover:bg-blue-grayish active:bg-white-active dark:active:bg-black-hover'} transition-all ${isActive(url) && '!bg-blue-light !text-white-default'}`}
		>
			<span>
				<div className="flex items-center">
					<Icon className="text-lg" />
					<p className="px-2.5">{data.name}</p>
				</div>
			</span>
		</Link>
	);
}
