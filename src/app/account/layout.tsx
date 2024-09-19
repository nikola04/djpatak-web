import type { Metadata } from 'next';
import Nav, { NavLogo } from '@/components/playerNavigation/Nav';
import { Suspense } from 'react';
import { SideNav } from '@/components/playerNavigation/AccountSideNav';

export const metadata: Metadata = {
	title: 'DjPatak | Web Player',
	description: 'Web-based player for DjPatak Discord music bot',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<div className="relative w-screen h-screen flex flex-col">
			<div className="relative w-full flex justify-between">
				<div className="px-5">
					<NavLogo />
				</div>
				<Suspense>
					<Nav guildId={null} />
				</Suspense>
			</div>
			<SideNav />
			<div className="w-full mb-1 pl-[240px]">
				<div className="relative px-4 box-border max-w-[1080px] mx-auto h-48">
					<div className="max-w-[900px] px-4">{children}</div>
				</div>
			</div>
		</div>
	);
}
