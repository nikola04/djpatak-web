'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconType } from 'react-icons';
import { FaWrench } from 'react-icons/fa';
import { IoMdPerson } from 'react-icons/io';
import { IoPersonOutline, IoRadioSharp } from 'react-icons/io5';
import { useTheme } from '../providers/Theme';

type LinkType = {
	name: string;
	icon: IconType;
	href: string;
};

const linksGrouped: {
	name: string;
	links: LinkType[];
}[] = [
	{
		name: 'Account',
		links: [
			{
				name: 'Profile',
				icon: IoMdPerson,
				href: '/account',
			},
			{
				name: 'Settings',
				icon: FaWrench,
				href: '/account/settings',
			},
		],
	},
];

export function SideNav() {
	const pathname = usePathname();
	return (
		<div className="fixed left-0 top-[64px] pr-3 py-4 md:pr-4 flex flex-col z-[1]">
			{linksGrouped.map((linkGroup, ind) => (
				<div key={ind} className="py-2 flex flex-col">
					{/* <p className="text-white-gray uppercase font-bold text-sm py-2">{linkGroup.name}</p> */}
					<div className="flex flex-col py-2">
						{linkGroup.links.map((link, ind) => (
							<NavItem key={ind} pathname={pathname} data={link} />
						))}
					</div>
				</div>
			))}
		</div>
	);
}

function NavItem({ data, pathname }: { data: LinkType; pathname: string }) {
	const isActive = (href: string) => href == pathname;
	const Icon = data.icon;
	return (
		<Link
			title={data.name}
			href={data.href}
			className={`my-0.5 py-[7px] rounded-r-2xl w-56 px-2 dark:text-white-gray text-black-light ${!isActive(data.href) && 'hover:bg-white-hover dark:hover:bg-blue-grayish active:bg-white-active dark:active:bg-black-hover'} active:bg-opacity-90 transition-all bg-opacity-100 ${isActive(data.href) && 'bg-blue-active !text-white-default dark:!text-black-light'}`}
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
