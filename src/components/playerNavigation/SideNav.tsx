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
		<div className="py-4 flex flex-col">
			{allowedMenuGroups.includes(MenuGroup.GuildSelector) && (
				<div className="py-3">{loading ? <GuildSelectorSceleton /> : <GuildSelector userGuilds={userGuilds} selectedId={guildId} />}</div>
			)}
			{enabledLinkGroups.map((linkGroup, ind) => (
				<div key={ind} className="py-2 flex flex-col">
					<p className={`uppercase text-xs px-6 text-black-light text-opacity-60 dark:text-white-gray dark:text-opacity-60`}>
						{linkGroup.name}
					</p>
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
				className={`relative flex w-[208px] overflow-hidden border border-transparent items-center rounded-xl px-2 py-1.5 cursor-pointer hover:border-blue-light transition-all duration-200 active:ring-blue ring-[2px] ${open ? 'ring-blue' : 'ring-transparent'} dark:bg-blue-dark dark:text-white-gray bg-white-dark text-black-light`}
			>
				<div style={{ padding: '2px' }}>
					<GuildIcon guild={selectedGuild} className="bg-black-default dark:bg-transparent" size={24} />
				</div>
				<p className="px-2 text-base text-nowrap text-ellipsis overflow-hidden" title={selectedGuild.name}>
					{selectedGuild.name}
				</p>
			</div>
			{open && (
				<div className="absolute left-0 p-1.5 mt-2 w-52 rounded-xl z-20 overflow-hidden bg-white-default dark:bg-blue-dark shadow-md transition-colors duration-150">
					{userGuilds.map((guild: DiscordGuild, ind) => (
						<div
							onClick={() => router.push('/player/' + guild.id)}
							key={ind}
							className="flex w-full items-center top-0 p-1 hover:bg-white-hover dark:hover:bg-blue-light dark:hover:bg-opacity-5 active:bg-white-active dark:active:bg-opacity-10 rounded-lg cursor-pointer transition-colors duration-150"
						>
							<div style={{ padding: '2px' }}>
								<GuildIcon guild={guild} className="bg-black-default dark:bg-transparent" size={24} />
							</div>
							<p className="text-black-light dark:text-white-gray px-2 text-base text-nowrap text-ellipsis overflow-hidden dark:text-opacity-95">
								{guild.name}
							</p>
						</div>
					))}
					<div className="p-1 border-b border-white-gray dark:border-black-default"></div>
					<div className="mt-1 flex w-full items-center top-0 p-1 hover:bg-white-hover dark:hover:bg-blue-light dark:hover:bg-opacity-5 active:bg-white-active dark:active:bg-opacity-10 rounded-lg cursor-pointer transition-colors duration-150">
						<div className="p-1">
							<BsPlusCircle className="w-5 h-5 text-black-light dark:text-white-gray text-sm" />
						</div>
						<p className="text-black-light dark:text-white-gray px-2 text-base text-nowrap text-ellipsis overflow-hidden">Add server</p>
					</div>
				</div>
			)}
		</div>
	);
}

function GuildSelectorSceleton() {
	return (
		<div className="m-2 flex flex-col">
			<div className="flex items-center dark:bg-blue-dark bg-white-dark rounded-xl px-2 py-1.5 w-full border border-transparent">
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
			className={`my-0.5 py-[7px] rounded-r-2xl w-56 px-2 dark:text-white-gray text-black-light ${!isActive(url) && 'hover:bg-white-hover dark:hover:bg-blue-grayish active:bg-white-active dark:active:bg-black-hover'} active:bg-opacity-90 transition-all bg-opacity-100 ${isActive(url) && 'bg-blue-active !text-white-default dark:!text-black-light'}`}
		>
			<span>
				<div className="flex items-center px-4">
					<Icon className="text-lg" />
					<p className="px-2.5">{data.name}</p>
				</div>
			</span>
		</Link>
	);
}
