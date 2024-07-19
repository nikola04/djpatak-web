'use client'

import { AlertProvider } from "./Alert"

export default function Providers({ children }: {
    children: Readonly<React.ReactNode>
}){
    return <AlertProvider>
        { children }
    </AlertProvider>
}