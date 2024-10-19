'use client';

import { DangerButton } from '@/components/Buttons';
import { useAlert } from '@/components/providers/Alert';
import SwitchWithRef from '@/components/ui/Switch';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { IconType } from 'react-icons';
import { FaCheck } from 'react-icons/fa';
import { FaBell, FaDatabase, FaTrash } from 'react-icons/fa6';

const sleep = async (time: number) => new Promise((res, rej) => setTimeout(() => res(1), time));

export default function SettingsPage() {
	const [notifications, setNotifications] = useState<boolean>(false);
	const [notificationsLoading, setNotificationsLoading] = useState<boolean>(false);
	const [usageAnalythics, setUsageAnalythics] = useState<boolean>(false);
	const [usageAnalythicsLoading, setUsageAnalythicsLoading] = useState<boolean>(false);
	const { pushAlert } = useAlert();
	const updateNotification = useCallback(async () => {
		const newState = !notifications;
		setNotificationsLoading(true);
		setNotifications(newState);
		if (newState === true) {
			if (Notification.permission === 'denied') {
				setNotifications(false);
				setNotificationsLoading(false);
				return pushAlert('You have disabled notifications in browser.');
			}
			if (Notification.permission !== 'granted') {
				const newPermission = await Notification.requestPermission();
				if (newPermission !== 'granted') {
					setNotificationsLoading(false);
					return setNotifications(false);
				}
			}
		}
		// request
		await sleep(600);
		setNotificationsLoading(false);
		// pushAlert(`Notifications are now turned ${newState ? 'On' : 'Off'}.`, false);
	}, [notifications, pushAlert]);
	const updateUsageAnalythics = useCallback(async () => {
		const newState = !usageAnalythics;
		setUsageAnalythicsLoading(true);
		setUsageAnalythics(newState);
		// request
		await sleep(750);
		setUsageAnalythicsLoading(false);
		// pushAlert(`Usage Analythics are now turned ${newState ? 'On' : 'Off'}.`, false);
	}, [usageAnalythics]);
	return (
		<div className="py-5 text-black-light dark:text-white-default pr-4 w-full">
			<div className="text-center pt-2 pb-6">
				<h1 className="text-black-light dark:text-white-default text-2xl font-semibold">Account Settings</h1>
				<p className="text-black-light dark:text-white-default text-opacity-75 dark:text-opacity-75">Manage your account settings and data</p>
			</div>
			<div className="flex flex-col gap-5 my-2">
				<SectionHeader title="Server Settings" description="Modify settings that applies for every server you are in." />
				<SettingWithSwitch
					title="Enable Notifications"
					icon={FaBell}
					description="Enable notification for player in server you are in."
					value={notifications}
					onChange={updateNotification}
					loading={notificationsLoading}
					disabled={true}
				/>
				<SectionHeader title="Account Data" description="Delete or change how your data is being used." />
				<SettingWithSwitch
					title="Usage Analythics"
					icon={FaDatabase}
					description="Share your usage analythics with us, so we can provide better service."
					value={usageAnalythics}
					onChange={updateUsageAnalythics}
					loading={usageAnalythicsLoading}
					disabled={true}
				/>
				<Setting
					title="Delete Account Data"
					icon={FaTrash}
					description="Delete all account data including liked songs, playlists and others."
				>
					<DangerButton className="!py-1 !text-sm" title={'Delete Data'} value={'Delete'} disabled={true} />
				</Setting>
			</div>
		</div>
	);
}

interface SettingProps {
	title: string;
	description: string;
	icon: IconType;
	children: Readonly<ReactNode>;
}
const Setting = ({ title, description, icon, children }: SettingProps) => {
	const Icon = icon;
	return (
		<div className="flex flex-col bg-white-default dark:bg-blue-grayish transition-colors duration-150 rounded-lg shadow">
			<div className={`dark:text-white-default text-black-light px-4 pt-4 flex justify-between`}>
				<div className="flex items-center gap-2">
					<Icon className="text-sm" />
					<p className="text-inherit">{title}</p>
				</div>
				<div className="mx-2">{children}</div>
			</div>
			<p className={`text-black-light dark:text-white-default text-sm text-opacity-50 dark:text-opacity-50 px-4 pt-1 pb-5`}>{description}</p>
		</div>
	);
};

interface SettingWithSwitchProps extends Omit<SettingProps, 'children'> {
	value: boolean;
	onChange: () => any;
	loading: boolean;
	disabled?: boolean
}
const SettingWithSwitch = ({ value, onChange, disabled, loading, ...settingProps }: SettingWithSwitchProps) => {
	const MemoizedSwitch = useMemo(
		() => (
			<SwitchWithRef
				checked={value}
				bgColor="dark:bg-[#323241] bg-gray-200"
				bgOnColor="bg-blue-light"
				onColor="bg-white-default"
				onIcon={<FaCheck size={12} className="text-blue-light" />}
				onChange={onChange}
				disabled={disabled || loading}
			/>
		),
		[value, loading]
	);
	return <Setting {...settingProps}>{MemoizedSwitch}</Setting>;
};

const SectionHeader = ({ title, description }: { title: string; description: string }) => (
	<div className="mt-5">
		<h3 className="text-black-light dark:text-white-default text-lg py-0.5">{title}</h3>
		<p className="text-black-light dark:text-white-default text-opacity-50 dark:text-opacity-50 text-sm">{description}</p>
	</div>
);
