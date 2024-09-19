import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import Providers from '@/components/providers/Providers';

const nunitoFont = Nunito({
	subsets: ['latin'],
	display: 'swap',
});

export const metadata: Metadata = {
	title: 'DjPatak | Discord Bot',
	description: 'Web-based player for DjPatak Discord music bot',
	icons: {
		apple: '/apple-touch-icon.png',
		icon: [
			{ url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
			{ url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
		],
		other: [
			{ url: '/favicon.ico', type: 'image/x-icon' }, // Optional: Fallback favicon
			{ url: '/site.webmanifest', type: 'application/manifest+json' },
		],
	},
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="dark">
			<body className={nunitoFont.className}>
				<Providers>
					<div className="w-screen h-screen bg-white-gray dark:bg-black-default transition-background duration-150">{children}</div>
				</Providers>
			</body>
		</html>
	);
}
