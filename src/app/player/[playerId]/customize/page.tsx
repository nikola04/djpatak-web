"use client"
import { useAuth } from "@/components/providers/Auth"

export default function CustomizePage({ params: { playerId }}: {
    params: {
        playerId: string
    }
}){
    const { user } = useAuth()
    console.log(user)
    return <div className="px-3 py-5">
        <div className="p-2">
            <h1 className="text-black-light dark:text-white-gray font-bold text-xl">Customize Permissions</h1>
        </div>
        <div className="flex flex-col p-2">
            {/* for each add allowed roles with vote */}
            <div>allowed roles to play music</div>
            <div>allowed roles to use commands</div>
            <div>allowed roles to stop song</div>
        </div>
    </div>
}