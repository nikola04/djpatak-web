import { HTMLAttributes, ReactNode } from 'react';
import { SmallIconButton } from '../Buttons';
import { FaArrowLeft } from 'react-icons/fa';

interface PageHeaderProps extends HTMLAttributes<HTMLDivElement> {
	title: string;
	path: string[];
	folder?: boolean;
	goBack?: () => any;
	Buttons?: () => JSX.Element;
}
export const PageHeader = ({ title, path, folder = true, Buttons, goBack, ...restProps }: PageHeaderProps) => {
	return (
		<div {...restProps} className={`flex w-full items-center justify-between ${restProps.className} p-2`}>
			<div>
				<p className="text-black-light dark:text-white-gray opacity-40 text-sm py-0.5">
					{path.join(' / ')} {folder && '/'}
				</p>
				<div className="flex items-center">
					{path.length > 1 && (
						<SmallIconButton
							title="Playlists"
							className="my-1 mr-1"
							icon={<FaArrowLeft className="text-black-default dark:text-white-default" />}
							onClick={() => goBack && goBack()}
						/>
					)}
					<h2 className="text-black-default dark:text-white-default text-xl font-bold py-2">{title}</h2>
				</div>
			</div>
			<div className={`mr-2 place-self-start`}>{Buttons && <Buttons />}</div>
		</div>
	);
};
