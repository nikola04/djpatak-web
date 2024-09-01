import { ButtonHTMLAttributes, isValidElement, ReactNode } from "react"
import { IconType } from "react-icons"

interface SmallIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    title: string,
    icon: ReactNode,
    isActive?: boolean,
    activeIcon?: ReactNode
}

const SmallIconButton = ({ className, icon, isActive, activeIcon, ...restProps }: SmallIconButtonProps) => {
    const _icon = isActive && activeIcon ? activeIcon : icon
    return <button className={`hover:bg-white-hover active:bg-white-active w-10 h-10 flex items-center justify-center rounded-full transition-all duration-150 ${className}`} {...restProps}>
        <span className="text-white-default">
            { _icon }
        </span>
    </button>
}

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    value: string
    icon?: ReactNode
}

const PrimaryButton = ({ title, value, icon, className, ...restProps }: PrimaryButtonProps) => {
    const Icon = icon
    return <button title={title ?? value} className={`bg-blue-light hover:bg-blue-sky active:bg-opacity-90 transition-all rounded outline-0 border-1 border-transparent py-1.5 px-2.5 text-white-default ${className}`} {...restProps}>
        <span>
            <div className="flex gap-1.5 items-center">
                { Icon }
                <p>{ value }</p>
            </div>
        </span>
    </button>
}

function isIconType(icon: any): icon is IconType {
    return typeof icon === 'function' && icon.prototype?.render != null;
}

export {
    SmallIconButton,
    PrimaryButton
}