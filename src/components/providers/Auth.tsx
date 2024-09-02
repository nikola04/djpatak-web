"use client"
import { createContext, ReactNode, useContext } from "react";
import { User } from "@/../types/user";
import { useUserData } from "@/utils/user";

type AuthContextType = {
    user: User|null,
    loading: boolean
}
const AuthContext = createContext<AuthContextType|null>(null)

export function useAuth(){
    const context = useContext(AuthContext)
    if(!context)
        throw new Error("useAuth must be used within AuthProvider")
    return context
}

export function AuthProvider({ children }: {
    children: ReactNode
}){
    const { data: user, loading } = useUserData()
    return <AuthContext.Provider value={{ user, loading }}>
        { children }
    </AuthContext.Provider>
}