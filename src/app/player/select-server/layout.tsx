import type { Metadata } from 'next';
import Nav, { NavLogo } from '@/components/playerNavigation/Nav';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'DjPatak | Web Player | Select Guild',
	description: 'Web-based player for DjPatak Discord music bot',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="relative w-screen h-screen grid gap-x-8" style={{ gridTemplateRows: 'auto 1fr', gridTemplateColumns: 'auto 1fr' }}>
			<NavLogo />
			<Suspense>
				<Nav guildId={null} />
			</Suspense>
			<div className="col-span-2">{children}</div>
		</div>
	);
}
