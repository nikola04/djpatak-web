import React, { createContext, useContext, useState, ReactNode, useEffect, useRef, useCallback } from 'react';
import { IoClose } from "react-icons/io5";
import { FiAlertCircle } from "react-icons/fi";
import { v4 as uuid } from "uuid";

type Alert = {
    id: string
    message: string,
    timeRemaining: number
 }
interface AlertContextType {
    alerts: Alert[],
    pushAlert: (alert: string) => any;
}

const AlertContext = createContext<AlertContextType | null>(null);

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};

export function AlertProvider({ children }: { children: ReactNode }){
    const [alerts, setAlerts] = useState<Alert[]>([])
    const pushAlert = (alert: string) => setAlerts((prev) => {
        return [{ id: uuid(), message: alert, timeRemaining: 60 }, ...prev]
    })
    const dropAlert = useCallback((alertId: string) => {
        setAlerts(prev => prev.map(item => ({ ...item, timeRemaining: item.id === alertId ? 0 : item.timeRemaining })))
    }, [])
    useEffect(()=>{
        const interval = setInterval(()=>{
            setAlerts(prev => prev.filter(i => i.timeRemaining >= 0).map((item) => ({
                ...item,
                timeRemaining: item.timeRemaining - 1
            })))
        }, 1000)
        return ()=> clearInterval(interval)
      },[])
    return <AlertContext.Provider value={{ alerts, pushAlert }}>
        {children}
        <div className="fixed z-50 bottom-16 right-0">
            <div className='relative m-6 flex flex-col transition-all duration-[320] ease'>
                { alerts.map(({ id, message, timeRemaining }) => <Alert key={id} message={message} onCloseAlert={() => dropAlert(id)} shouldDrop={timeRemaining < 1}/>) }
            </div>
        </div>
    </AlertContext.Provider>
};


function Alert({ message, shouldDrop, onCloseAlert }: {
    onCloseAlert: () => any,
    message: string,
    shouldDrop: boolean
}){
    const [isDropped, setIsDropped] = useState<boolean>(false)
    const dropAlert = useCallback(() => {
        if(shouldDrop) setIsDropped(true)
        else setIsDropped(false)
    }, [shouldDrop])
    return !isDropped && <div onAnimationEnd={() => dropAlert()} className={`relative flex gap-1.5 items-center rounded-md bg-red-ansi px-3 py-3 my-2 ${shouldDrop && 'animate-dropError'}`}>
        <FiAlertCircle className='text-white-default' style={{ fontSize: '19px' }}/>
        <p className='text-white-default'>Error! { message }</p>
        <IoClose onClick={() => onCloseAlert()} className='text-white-default ml-auto cursor-pointer' style={{ fontSize: '23px' }}/>
    </div>
}