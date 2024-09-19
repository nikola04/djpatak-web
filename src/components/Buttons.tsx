import { ButtonHTMLAttributes, isValidElement, ReactNode } from 'react';
import { IconType } from 'react-icons';

interface SmallIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	title: string;
	icon: ReactNode;
	isActive?: boolean;
	activeIcon?: ReactNode;
}

const SmallIconButton = ({ title, className, icon, isActive, activeIcon, ...restProps }: SmallIconButtonProps) => {
	const _icon = isActive && activeIcon ? activeIcon : icon;
	return (
		<button
			title={title}
			className={`bg-white-hover bg-opacity-0 hover:bg-opacity-15 active:bg-opacity-25 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-150 ${className}`}
			{...restProps}
		>
			<span className="text-white-default">{_icon}</span>
		</button>
	);
};

interface DefaultButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	value: string;
	icon?: ReactNode;
}

const DefaultButton = ({ title, value, icon, className, ...restProps }: DefaultButtonProps) => {
	const Icon = icon;
	return (
		<button
			title={title ?? value}
			className={`transition-all rounded outline-0 border-1 border-transparent py-1.5 px-2.5 ${className}`}
			{...restProps}
		>
			<span>
				<div className="flex gap-1.5 items-center">
					{Icon}
					<p>{value}</p>
				</div>
			</span>
		</button>
	);
};

const PrimaryButton = ({ className, ...restProps }: DefaultButtonProps) => (
	<DefaultButton className={`bg-blue-light hover:bg-blue-sky active:bg-opacity-90 text-white-default ${className}`} {...restProps} />
);
const PrimaryButtonOutline = ({ className, ...restProps }: DefaultButtonProps) => (
	<DefaultButton className={`bg-transparent border border-blue-light active:bg-opacity-90 text-blue-light ${className}`} {...restProps} />
);
const DangerButton = ({ className, ...restProps }: DefaultButtonProps) => (
	<DefaultButton className={`bg-red-ansi hover:bg-red-ansi-light active:bg-opacity-90 text-white-default ${className}`} {...restProps} />
);

function isIconType(icon: any): icon is IconType {
	return typeof icon === 'function' && icon.prototype?.render != null;
}

export { SmallIconButton, PrimaryButton, PrimaryButtonOutline, DangerButton };
