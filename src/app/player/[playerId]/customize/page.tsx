"use client"
import { useAuth } from "@/components/providers/Auth"

export default function CustomizePage({ params: { playerId }}: {
    params: {
        playerId: string
    }
}){
    const { user } = useAuth()
    console.log(user)
    return null
}