import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { IoClose } from "react-icons/io5";
import { v4 as uuid } from 'uuid'

type Alert = {
    message: string,
    timeRemaining: number
 }
interface AlertContextType {
    alerts: Alert[],
    pushAlert: (alert: string) => any;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

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
        return [...prev, { message: alert, timeRemaining: 7 }]
    })
    useEffect(()=>{
        const interval = setInterval(()=>{
            setAlerts(prev => prev.filter(i=>i.timeRemaining>0).map((item)=> ({
                ...item,
                timeRemaining: item.timeRemaining - 1
            })))
        }, 1000)
        return ()=> clearInterval(interval)
      },[])
    return (
        <AlertContext.Provider value={{ alerts, pushAlert }}>
            {children}
            <div className="fixed z-50 bottom-16 right-0 m-6 flex flex-col">
                { alerts.map(({ message }, ind) => <Alert key={ind} message={message}/>) }
            </div>
        </AlertContext.Provider>
    );
};


function Alert({ message }: {
    message: string
}){
    return <div className="flex items-center rounded-md bg-black-light px-4 py-3 my-2">
        <IoClose className='text-red-600 mr-1' style={{ fontSize: '23px' }}/>
        <p className='text-white-gray'>{ message }</p>
    </div>
}