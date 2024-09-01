import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { SmallIconButton } from "./Buttons";

interface PopupContextType{
    setPopup: (popupContainer: ReactNode) => any,
    setVisibility: (visibility: 'visible'|'hidden') => any,
    hidePopup: () => any,
    showPopup: () => any
}
const PopupContext = createContext<PopupContextType|null>(null)

export function usePopup(){
    const context = useContext(PopupContext)
    if(!context){
        throw new Error('usePopup must be wrapped in Popup Provider')
    }
    return context
}

export function PopupProvider({ children }: {
    children: ReactNode
}){
    const [PopupContent, setPopup] = useState<ReactNode|null>(null)
    const [visibility, setVisibility] = useState<'visible'|'hidden'>('hidden')
    const popupRef = useRef<HTMLDivElement|null>(null)
    const hidePopup = useCallback(() => {
        popupRef.current?.classList.add('animate-hide')
    }, [])
    const showPopup = useCallback(() => {
        setVisibility('visible')
    }, [])
    return <PopupContext.Provider value={{ setPopup, setVisibility, hidePopup, showPopup }}>
        { visibility === 'visible' && <div ref={popupRef} onAnimationEnd={() => setVisibility('hidden')}>
            <div onClick={() => hidePopup()} className="fixed z-40 w-screen h-screen left-0 top-0 bg-black-default bg-opacity-60"></div>
            <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                { PopupContent }
            </div> 
        </div>}
        { children }
    </PopupContext.Provider>
}

export const DefaultPopupContainer = ({ children }: { children?: ReactNode }) => <div className="relative w-screen sm:min-w-[420px] sm:w-auto drop-shadow-md">
    <div className="relative flex flex-col p-4 px-6 w-full rounded-md bg-blue-grayish">
        { children }
    </div>
</div>

export const DefaultPopupHeader = ({ title, onClose }: {
    title?: string,
    onClose: () => any
}) => <div className="flex justify-between items-center">
    <h2 className="text-white-default font-normal text-lg">{ title }</h2>
    <SmallIconButton title={"Close"} icon={<IoClose className="text-2xl"/>} onClick={onClose}/>
</div>