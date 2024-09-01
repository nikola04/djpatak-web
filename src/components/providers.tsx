'use client'

import { AlertProvider } from "./Alert"
import { NextUIProvider } from "@nextui-org/react";
import { PopupProvider } from "./Popup";

export default function Providers({ children }: {
    children: Readonly<React.ReactNode>
}){
    return <NextUIProvider>
        <PopupProvider>
            <AlertProvider>
                { children }
            </AlertProvider>
        </PopupProvider>
    </NextUIProvider>
}