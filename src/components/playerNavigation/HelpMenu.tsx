import { isParentOf } from "@/utils/frontend";
import { useEffect, useRef, useState } from "react";
import { IconType } from "react-icons";
import { FaRegKeyboard } from "react-icons/fa";
import { IoBugOutline, IoBugSharp, IoFlagOutline, IoHelp } from "react-icons/io5";
import { MdAssistantPhoto, MdOutlineFlag } from "react-icons/md";


interface MenuItemData{
    icon: IconType
    name: string
    click?: () => any
    soon?: boolean
}

const menuItems: MenuItemData[] = [{
    name: 'Keyboard Shortcuts',
    icon: FaRegKeyboard,
    soon: true
}, {
    name: 'Report Bug',
    icon: IoBugOutline,
    click: () => window.open('mailto:nikolanedeljkovic.official@gmail.com?subject=Report%20a%20bug')
},{
    name: 'Help',
    icon: IoFlagOutline,
    click: () => window.open('mailto:nikolanedeljkovic.official@gmail.com?subject=Help')
}]

export default function HelpMenu() {
    const [showMenu, setShowMenu] = useState(false)
    const menuRef = useRef(null)
    useEffect(() => {
		if (!showMenu) return;
		function handleClick(event: Event) {
			if (event.target instanceof HTMLElement && !isParentOf(menuRef.current, event.target)) {
				setShowMenu(false);
			}
		}
		window.addEventListener('click', handleClick);
		return () => window.removeEventListener('click', handleClick);
	}, [showMenu]);
	return (
		<div ref={menuRef} className="relative px-2">
			<button
				onClick={() => setShowMenu(prev => !prev)}
				title="Help Menu"
				className={`flex items-center justify-center w-9 h-9 rounded-full cursor-pointer overflow-hidden hover:bg-white-dark dark:hover:bg-black-light active:opacity-85 transition-all duration-150`}
			>
                <div className="border border-black-default dark:border-white-default border-opacity-90 rounded-full p-0.5">
                    <IoHelp className="text-black-default dark:text-white-default text-opacity-90"/>
                </div>
			</button>
            { showMenu && <div className="absolute right-0 mt-2 w-60 rounded-xl z-20 overflow-hidden dark:bg-blue-grayish bg-white-default transition-colors duration-150 shadow-md">
                <div className="px-3 pt-3 pb-0.5">
                    <h3 className="text-lg text-center dark:text-white-default text-black-default font-semibold">Help</h3>
                </div>
                <div className="flex flex-col gap-0.5 py-1">
                    { menuItems.map((item, ind) => <MenuItem key={ind} data={item}/>)}
                </div>
            </div> }
		</div>
	);
}

function MenuItem({ data }: {
    data: MenuItemData
}){
    const Icon = data.icon
    return <button title={data.name} onClick={data.click} className="mx-1 rounded-lg hover:bg-white-hover dark:hover:bg-black-hover active:bg-white-active dark:active:bg-black-active group overflow-hidden transition-background duration-150">
        <div className="relative flex items-center gap-3 px-3 py-1.5">
            <Icon className="text-[18px] dark:text-white-gray text-black-default"/>
            <p className="text-[15px] dark:text-white-gray text-black-default">{ data.name }</p>
            { data.soon && <div className="absolute right-1 top-1 bg-blue-light rounded-lg">
                <p className="text-[10px] text-white-default px-[5px] py-[1px]">Soon</p>
            </div> }
        </div>
    </button>
}