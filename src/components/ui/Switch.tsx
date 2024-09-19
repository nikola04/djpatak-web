import { ForwardedRef, forwardRef, HTMLAttributes, useEffect, useMemo } from 'react';
import { IconType } from 'react-icons';
import { FaCheck } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import { useTheme } from '../providers/Theme';

interface SwitchType extends HTMLAttributes<HTMLInputElement> {
	checked: boolean;
	disabled?: boolean;
	offIcon?: JSX.Element;
	onIcon?: JSX.Element;
	bgOnColor?: string;
	bgColor?: string;
	offColor?: string;
	onColor?: string;
}

const SwitchWithRef = forwardRef(function Switch(
	{ checked, disabled, offIcon, onIcon, bgOnColor, bgColor, offColor, onColor, ...restProps }: SwitchType,
	forwardRef: ForwardedRef<HTMLInputElement>
) {
	const OffIcon = offIcon || <IoClose size={12} />;
	const OnIcon = onIcon || <FaCheck size={12} />;
	const Icon = checked ? OnIcon : OffIcon;
	const defaultBgColor = 'bg-gray-200';
	const defaultOnColor = 'bg-blue-500';
	const defaultOffColor = 'bg-gray-400';
	return (
		<label className={!disabled ? 'cursor-pointer' : ''}>
			<input type="checkbox" disabled={disabled} className="hidden" checked={checked} ref={forwardRef} {...restProps} />
			<div
				className={`w-[50px] p-1 rounded-full transition-colors duration-150 ${(checked ? bgOnColor : null) ?? bgColor ?? defaultBgColor} ${disabled && 'opacity-50'}`}
			>
				<div
					className={`w-fit p-1 shadow-sm rounded-full transition-all duration-300 text-white-default ${checked ? 'translate-x-[22px] ' + (onColor ?? defaultOnColor) : '-rotate-180 ' + (offColor ?? defaultOffColor)}`}
				>
					{Icon}
				</div>
			</div>
		</label>
	);
});

export default SwitchWithRef;
