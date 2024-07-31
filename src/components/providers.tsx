'use client'

import { AlertProvider } from "./Alert"
import { NextUIProvider } from "@nextui-org/react";

export default function Providers({ children }: {
    children: Readonly<React.ReactNode>
}){
    return <NextUIProvider>
        <AlertProvider>
            { children }
        </AlertProvider>
    </NextUIProvider>
}