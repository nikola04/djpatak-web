import { IconType } from "react-icons"

const SmallIconButton = ({ title, icon, activeIcon, buttonClass, iconClass, onClick, isActive }: {
    title: string,
    icon: IconType,
    activeIcon?: IconType,
    buttonClass?: string,
    iconClass?: string,
    onClick: () => any,
    isActive?: boolean
}) => {
    const Icon = isActive && activeIcon ? activeIcon : icon
    return <button title={title} onClick={() => onClick()} className={`hover:bg-white-hover active:bg-white-active w-11 h-11 flex items-center justify-center rounded-full transition-all duration-150 ${buttonClass}`}>
        <Icon className={`${isActive ? "text-blue-light transition-all" : "text-white-gray transition-all"} ${iconClass}`} />
    </button>
}

export {
    SmallIconButton
}