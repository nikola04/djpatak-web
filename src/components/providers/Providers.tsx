'use client'

import { AlertProvider } from "./Alert"
import { NextUIProvider } from "@nextui-org/react";
import { PopupProvider } from "./Popup";
import { AuthProvider } from "./Auth";

export default function Providers({ children }: {
    children: Readonly<React.ReactNode>
}){
    return <NextUIProvider>
        <AuthProvider>
            <PopupProvider>
                <AlertProvider>
                    { children }
                </AlertProvider>
            </PopupProvider>
        </AuthProvider>
    </NextUIProvider>
}