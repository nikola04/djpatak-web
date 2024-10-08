'use client';

import { GuildIcon } from '@/components/discord/GuildIcon';
import { DiscordGuild } from '../../../../types/discord';
import { useUserGuilds } from '@/utils/user';
import { useRouter } from 'next/navigation';
import { PrimaryButton } from '@/components/Buttons';

export default function Page() {
	const { loading, data } = useUserGuilds();
	return (
		<div className="flex flex-col items-center py-6">
			<h1 className="text-black-default dark:text-white-default font-bold text-2xl pt-1 pb-4">Select Server</h1>
			<UserGuilds loading={loading} guilds={data} />
		</div>
	);
}

function UserGuilds({ loading, guilds }: { loading: boolean; guilds: DiscordGuild[] }) {
	if (loading) return UserGuildsSceleton();
	if (!guilds) return null;
	return (
		<div className="grid p-4 gap-8 w-full justify-center" style={{ gridTemplateColumns: 'repeat(auto-fit, 18rem)' }}>
			{guilds.map((guild, ind) => (
				<Guild key={ind} data={guild} />
			))}
		</div>
	);
}

function Guild({ data }: { data: DiscordGuild }) {
	const isUserAdmin = data.permissions.toString(2)[3];
	const router = useRouter();
	return (
		<div className="flex flex-col p-4 bg-white-default dark:bg-blue-grayish rounded-lg w-72 shadow">
			<div className="flex items-center">
				<GuildIcon
					guild={data}
					size={64}
					className="rounded-md flex-grow-0 flex-shrink-0 shadow"
					classNameNoImageText="!text-base"
					classNameNoImage="border-transparent dark:border-blue-light border-1 bg-black-default dark:bg-transparent"
					style={{ flexBasis: '64px' }}
				/>
				<div className="flex flex-col pl-4 overflow-hidden">
					<p className="font-bold text-black-default dark:text-white-default overflow-hidden text-ellipsis text-nowrap pr-2">{data.name}</p>
					<p className="text-black-default dark:text-white-default opacity-50">{isUserAdmin ? 'Administrator' : 'Member'}</p>
				</div>
			</div>
			<div className="flex pt-4 justify-end items-center w-full">
				<PrimaryButton value="Go" onClick={() => router.push(`/player/${data.id}`)} />
			</div>
		</div>
	);
}

function UserGuildsSceleton() {
	return (
		<div className="grid py-4 gap-8 px-4 w-full justify-center" style={{ gridTemplateColumns: 'repeat(auto-fit, 18rem)' }}>
			{[...Array(7)].map((_, ind) => (
				<div key={ind} className="bg-white-default dark:bg-blue-grayish rounded-md w-72 h-[150px] shadow animate-pulse"></div>
			))}
		</div>
	);
}
