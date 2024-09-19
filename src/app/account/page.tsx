'use client';

import { useAuth } from '@/components/providers/Auth';
import { useRouter } from 'next/navigation';
import { User } from '../../../types/user';
import { PrimaryButtonOutline } from '@/components/Buttons';
import { ReactNode } from 'react';
import { MdEdit, MdOutlineSync, MdSync } from 'react-icons/md';

export default function AccountPage() {
	const { user, loading } = useAuth();
	const router = useRouter();
	if (!loading && !user) router.push('/');
	return (
		<div className="py-5 text-black-light dark:text-white-gray pr-4 w-full">
			<div className="text-center pt-2 pb-6">
				<h1 className="text-black-light dark:text-white-default text-2xl font-semibold">My Profile</h1>
				<p className="text-black-light dark:text-white-default text-opacity-75 dark:text-opacity-75">
					Manage profile picture, info and others.
				</p>
			</div>
			<div className="flex flex-col gap-5 my-2">
				<SectionHeader title="Account Data" description="Preview your profile data. Data is synced with Discord Account." />
				<Profile user={user} loading={loading} />
			</div>
		</div>
	);
}

function DataBlock({ children }: Readonly<{ children?: ReactNode }>) {
	return (
		<div className="flex flex-col bg-white-default dark:bg-blue-grayish transition-colors duration-150 rounded-lg shadow">
			<div className={`flex px-4 py-5`}>{children}</div>
		</div>
	);
}

interface ProfileProps {
	user: User | null;
	loading: boolean;
}
function Profile({ user, loading }: ProfileProps) {
	if (loading) return <ProfileSceleton />;
	if (!user) return null;
	return (
		<DataBlock>
			<div className={`flex items-start w-full`}>
				<div className="flex flex-col flex-grow flex-shrink-0">
					<p className="dark:text-white-default text-black-light text-sm text-opacity-75 dark:text-opacity-75">Username</p>
					<p className="py-1">{user.name}</p>
				</div>
				<div className="flex flex-col flex-grow flex-shrink-0">
					<p className="dark:text-white-default text-black-light text-sm text-opacity-75 dark:text-opacity-75">Discord Email</p>
					<p className="py-1">{user.email}</p>
				</div>
				<div className="px-2">
					<PrimaryButtonOutline className="rounded-lg text-sm" title={'Sync Data with Discord Account'} value="Sync" icon={<MdSync />} />
				</div>
			</div>
		</DataBlock>
	);
}

function ProfileSceleton() {
	return <div></div>;
}

const SectionHeader = ({ title, description }: { title: string; description: string }) => (
	<div className="mt-5">
		<h3 className="text-black-light dark:text-white-default text-lg py-0.5">{title}</h3>
		<p className="text-black-light dark:text-white-default text-opacity-50 dark:text-opacity-50 text-sm">{description}</p>
	</div>
);
