'use client';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FaChevronRight, FaMoon } from 'react-icons/fa6';
import { LinkType } from './Nav';
import { isParentOf } from '@/utils/frontend';
import { User } from '@/../types/user';
import SwitchWithRef from '../ui/Switch';
import { IoSunny } from 'react-icons/io5';

export default function NavProfileMenu({ links, user }: { links: LinkType[][]; user: User }) {
	const [showProfile, setShowProfile] = useState(false);
	const profileButtonRef = useRef(null);
	useEffect(() => {
		if (!showProfile) return;
		function handleClick(event: Event) {
			if (event.target instanceof HTMLElement && !isParentOf(profileButtonRef.current, event.target)) {
				setShowProfile(false);
			}
		}
		window.addEventListener('click', handleClick);
		return () => window.removeEventListener('click', handleClick);
	}, [showProfile]);
	return (
		<div ref={profileButtonRef} className="relative px-2">
			<button
				onClick={() => setShowProfile(!showProfile)}
				title="My Profile"
				className={`rounded-full w-9 h-9 bg-black-pure cursor-pointer overflow-hidden hover:opacity-85 active:opacity-70`}
			>
				<img src={user.image} width={36} height={36} alt={'Profile Image'} />
			</button>
			{showProfile && (
				<div className="absolute right-0 mt-2 w-64 rounded-lg z-20 overflow-hidden dark:bg-blue-grayish bg-white-default transition-colors duration-150 shadow-md">
					<div className="m-1 rounded-md hover:bg-white-hover dark:hover:bg-black-hover active:bg-white-active dark:active:bg-black-active group overflow-hidden transition-background duration-150">
						<Link href="/account/" className="text-black-light dark:text-white-gray" title="My Profile">
							<span>
								<div
									className="grid items-center px-3 py-2.5 border-b border-white-gray dark:border-gray transition-colors duration-150"
									style={{ gridTemplateColumns: '1fr auto' }}
								>
									<div className="grid items-center" style={{ gridTemplateColumns: 'auto 1fr' }}>
										<div className="rounded-full overflow-hidden" style={{ width: '34px', height: '34px' }}>
											<img src={user.image} alt={'Profile picture'} width={34} height={34} />
										</div>
										<p className="px-2 overflow-hidden text-nowrap text-ellipsis">{user.name}</p>
									</div>
									<FaChevronRight className="text-sm mr-1 group-hover:animate-shakeX ml-auto" />
								</div>
							</span>
						</Link>
					</div>
					<div className="px-1">
						{links.map((linksGroup, i) => (
							<div
								key={i}
								className={`${i != links.length - 1 ? 'border-b-1 border-white-gray dark:border-gray transition-colors duration-150' : ''} py-1`}
							>
								{linksGroup.map((link, ind) => (
									<NavProfileLink key={ind} link={link} />
								))}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

function NavProfileLink({ link }: { link: LinkType }) {
	const Icon = link.icon;
	const switchProps = useMemo(
		() =>
			link.name === 'Dark Mode' && {
				bgOnColor: 'bg-[#f0f0f00d]',
				onIcon: <FaMoon size={12} className="text-white-default" />,
				onColor: 'bg-yellow-400',
				offIcon: <IoSunny size={12} className="text-white-default" />,
			},
		[link]
	);
	const MemoizedSwitch = useMemo(
		() => link.type === 'switch' && <SwitchWithRef checked={link.switchState} onChange={(e) => link.func()} {...switchProps} />,
		[link.switchState, link.type, switchProps]
	);
	return (
		<div
			className={`${link.type != 'switch' && 'hover:bg-white-hover dark:hover:bg-black-hover active:bg-white-active dark:active:bg-black-active rounded-md my-0.5 transition-background duration-150'} group`}
		>
			<Button link={link}>
				<span className="block text-black-light dark:text-white-gray ">
					<div className="flex items-center justify-start px-3 py-2 gap-2.5">
						<Icon className="text-[18px]" />
						<p className="text-[15px]">{link.name}</p>
						<div className="ml-auto">
							{link.type === 'menu' && <FaChevronRight className="text-sm group-hover:animate-shakeX" />}
							{MemoizedSwitch}
						</div>
					</div>
				</span>
			</Button>
		</div>
	);
}

function Button({ children, link }: Readonly<{ children: React.ReactNode; link: LinkType }>) {
	if (link.func && link.type != 'switch')
		return (
			<button onClick={() => link.func && link.func()} className="w-full">
				{children}
			</button>
		);
	if (link.href)
		return (
			<Link href={link.href} title={link.name}>
				{children}
			</Link>
		);
	return <div className="w-full">{children}</div>;
}
